import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { drizzle, NeonHttpDatabase} from 'drizzle-orm/neon-http'
import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import {  campaigns, paymentTable, campaignerStreaks, leaderboard} from './db/schema'
import { and, desc, eq, gte, ilike } from 'drizzle-orm/expressions'
import { count,   sql,   sum } from 'drizzle-orm'
import { bearerAuth } from 'hono/bearer-auth'
import { cors } from 'hono/cors'
import Razorpay from 'razorpay'
import { basicAuth } from 'hono/basic-auth'
import crypto from 'crypto'
import { scheduledHandler, runLeaderboardLogic } from './scheduler';
declare module "hono"{
    interface ContextVariableMap{
        db:NeonHttpDatabase<Record<string, never>> & {
            $client: NeonQueryFunction<false, false>;
        },
        razor:Razorpay
    }

}


const app = new Hono();


const authMiddleware = async (c, next) => {
    const { AUTH_TOKEN } = env(c)
    return bearerAuth({ token: AUTH_TOKEN })(c, next)
}

async function updateCampaignerStreak(db, campaignid) {
    try {
        console.log(`[Streak] Starting update for Campaign ID: ${campaignid}`);

        // 1. Get Current Date (UTC) as YYYY-MM-DD
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];

        // 2. Fetch existing streak record
        const streakRecord = await db
            .select()
            .from(campaignerStreaks)
            .where(eq(campaignerStreaks.campaignerId, campaignid));

        // 3. CASE: First time donation (No record exists)
        if (streakRecord.length === 0) {
            console.log(`[Streak] No existing record. Creating new streak for ${campaignid}`);
            await db.insert(campaignerStreaks).values({
                campaignerId: campaignid,
                currentStreak: 1,
                longestStreak: 1,
                lastDonationDate: todayStr,
            });
            return;
        }

        const s = streakRecord[0];
        // Ensure we handle the date format correctly (Drizzle/Neon usually returns string YYYY-MM-DD)
        const lastDonationStr = String(s.lastDonationDate);

        console.log(`[Streak] Found record. Last Donation: ${lastDonationStr} | Today: ${todayStr}`);

        // 4. CASE: Already donated today?
        if (lastDonationStr === todayStr) {
            console.log(`[Streak] Donation already recorded today. Skipping update.`);
            return;
        }

        // 5. Calculate "Yesterday" string to check for consecutive days
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let newStreak = 1;

        // 6. Check Logic
        if (lastDonationStr === yesterdayStr) {
            // It was yesterday -> Increment Streak
            newStreak = (s.currentStreak || 0) + 1;
            console.log(`[Streak] Consecutive day detected! New Streak: ${newStreak}`);
        } else {
            // Gap detected -> Reset to 1
            console.log(`[Streak] Streak broken (Last: ${lastDonationStr}, Yest: ${yesterdayStr}). Resetting to 1.`);
            newStreak = 1;
        }

        const newLongest = Math.max(s.longestStreak || 0, newStreak);

        // 7. Update Database
        await db
            .update(campaignerStreaks)
            .set({
                currentStreak: newStreak,
                longestStreak: newLongest,
                lastDonationDate: todayStr,
                updatedAt: new Date(),
            })
            .where(eq(campaignerStreaks.campaignerId, campaignid));

        console.log(`[Streak] Update successful.`);

    } catch (error) {
        console.error(`[Streak Error] Failed to update streak for ${campaignid}:`, error);
    }
}

app.post("/webhook/razorpay", async (c) => {

    const { DATABASE_URL, WEBHOOK_SECRET } = env<{
        DATABASE_URL: string;
        WEBHOOK_SECRET: string;
    }>(c);

    //const DATABASE_URL = "postgresql://neondb_owner:npg_e0L7DGPyxSlQ@ep-late-frost-adbr6e14-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    const sqlneon = neon(DATABASE_URL);
    const db = drizzle( sqlneon );
    // const WEBHOOK_SECRET = "hkmc_chennai_webhook_2025"; // Your Razorpay Webhook Secret
    //const db = c.get("db"); // Use the db connection from middleware
    // console.log(`inside webhook call logging hare krishna`)
    try {
        const signature = c.req.header("x-razorpay-signature");
        const body = await c.req.text(); // Get the raw body as text for verification

        // 1. Verify the signature to ensure the request is from Razorpay
        const expectedSignature = crypto
            .createHmac("sha256", WEBHOOK_SECRET)
            .update(body)
            .digest("hex");

        if (signature !== expectedSignature) {
            console.error("Webhook signature validation failed.");
            return c.json({ error: "Invalid signature" }, 400);
        }

        const event = JSON.parse(body);

        // Validate event structure
        if (!event.event || !event.payload) {
            console.error("Invalid webhook event structure");
            return c.json({ error: "Invalid event structure" }, 400);
        }

        // 2. Use a switch statement on the event type
        console.log('Webhook Full event:', JSON.stringify(event, null, 2));
        switch (event.event) {
            // --- CASE 1: PAYMENT WAS CAPTURED (SUCCESS) ---
            case "payment.captured": {
                try {
                    // Validate webhook payload structure
                    if (!event.payload || !event.payload.payment || !event.payload.payment.entity) {
                        console.error('Invalid webhook payload structure:', JSON.stringify(event, null, 2));
                        return c.json({ error: "Invalid webhook payload structure" }, 400);
                    }

                    const paymentEntity = event.payload.payment.entity;

                    // Validate required fields
                    if (!paymentEntity || !paymentEntity.order_id || !paymentEntity.amount) {
                        console.error('Invalid payment entity structure:', paymentEntity);
                        return c.json({ error: "Invalid payment entity" }, 400);
                    }

                    const orderId = paymentEntity.order_id;
                    const amountInRupees = Number(paymentEntity.amount) / 100;

                    // Validate amount
                    if (isNaN(amountInRupees) || amountInRupees <= 0) {
                        console.error('Invalid amount:', paymentEntity.amount);
                        return c.json({ error: "Invalid payment amount" }, 400);
                    }

                    // Extract campaignid from notes, handling both string and number types
                    let campaignid = null;
                    if (paymentEntity.notes && paymentEntity.notes.campaignsid) {
                        //const rawCampaignId = paymentEntity.notes.campaignsid;
                        campaignid = String(paymentEntity.notes.campaignsid);

                        // Validate campaign ID
                        if (!campaignid || campaignid.trim() === "") {
                            console.error('Invalid campaign ID from notes:', campaignid);
                            campaignid = null; // Reset to null if invalid
                        } else {
                            console.log(`Campaign ID from notes: ${campaignid}`);
                        }
                    }

                    console.log(`Webhook received: Payment captured for Order ID ${orderId}, Amount: ${amountInRupees} INR`);

                    // 3. Check if payment exists and get current status
                    const payment = await db.select({
                        status: paymentTable.paymentstatus,
                        campaignsid: paymentTable.campaignsid
                    })
                        .from(paymentTable)
                        .where(eq(paymentTable.orderid, orderId));

                    // 4. Check if the payment is already processed
                    if (payment.length > 0 && payment[0].status === false) {
                        console.log(`Processing Order ID ${orderId} for the first time (via webhook).`);

                        // Update payment status to true
                        await db.update(paymentTable)
                            .set({
                                paymentstatus: true,
                                finalpaymentstatus: "captured" // Update final status
                            })
                            .where(eq(paymentTable.orderid, orderId));

                        // If campaignid wasn't in notes, get it from the payment table
                        if (!campaignid && payment[0].campaignsid) {
                            campaignid = payment[0].campaignsid;
                            console.log(`Campaign ID from payment table: ${campaignid}`);
                        }

                        // Update campaign totals
                        if (campaignid) {
                            console.log(`Updating campaign ${campaignid} with amount ${amountInRupees}`);
                            try {
                                const updateResult = await db.update(campaigns).set({
                                    raisedtotal: sql`${campaigns.raisedtotal} + ${amountInRupees}`,
                                    funderstotal: sql`${campaigns.funderstotal} + 1`
                                }).where(eq(campaigns.id, campaignid));

                                console.log(`Campaign ${campaignid} totals updated successfully`);
                                await updateCampaignerStreak(db, campaignid);
                            } catch (campaignError) {
                                console.error(`Error updating campaign ${campaignid}:`, campaignError);
                                // Don't throw here, just log the error and continue
                            }
                        } else {
                            console.log(`Warning: No campaign ID found for order ${orderId}. Payment will be marked as captured but campaign totals won't be updated.`);
                        }
                    } else {
                        console.log(`Order ID ${orderId} was already processed. Skipping update.`);
                    }
                } catch (error) {
                    console.error(`Error processing payment.captured for order ${event.payload.payment?.entity?.order_id}:`, error);
                    console.error('Error details:', {
                        message: error.message,
                        stack: error.stack,
                        orderId: event.payload.payment?.entity?.order_id
                    });
                    // Don't throw here, just log and continue
                }
                break;
            }

            // // --- CASE 2: PAYMENT FAILED ---
            case "payment.failed": {
                try {
                    const paymentEntity = event.payload.payment.entity;
                    const orderId = paymentEntity.order_id;

                    console.log(`Webhook received: Payment failed for Order ID ${orderId}`);

                    // Update the finalpaymentstatus field as requested
                    await db.update(paymentTable)
                        .set({
                            finalpaymentstatus: "failed" // Set the final status to "failed"
                        })
                        .where(eq(paymentTable.orderid, orderId));
                } catch (error) {
                    console.error(`Error processing payment.failed for order ${event.payload.payment?.entity?.order_id}:`, error);
                    // Don't throw here, just log and continue
                }
                break;
            }

            // Default case for any other events you don't handle
            default: {
                console.log(`Webhook received: Unhandled event type: ${event.event}`);
            }
        }

        // 5. Send a 200 OK response to Razorpay to acknowledge the webhook
        return c.json({ status: "ok" });

    } catch (error) {
        console.error("Error processing Razorpay webhook:", error);
        return c.json({ error: "Webhook processing failed", message: error.message }, 500);
    }
});

app.post("/checkpayment", cors({
    origin: ["https://hkm-chennai-crowd-funding.vercel.app","https://hkmchennaicrowdfunding-dev.vercel.app", "https://campaigns.hkmchennai.org", "http://localhost:3000"],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
    credentials:false
}),async (c) => {
    try {
        const { DATABASE_URL, RAZ_ID, RAZ_SECRET } = env<{
            DATABASE_URL: string;
            RAZ_ID: string;
            RAZ_SECRET: string;
        }>(c);
        //const RAZ_ID = "rzp id";
//const RAZ_SECRET = "secret";
//const DATABASE_URL = "postgresql://neondb_owner:npg_e0L7DGPyxSlQ@ep-late-frost-adbr6e14-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
        const sqlneon = neon(DATABASE_URL);


        const razorpay = new Razorpay({
            key_id:RAZ_ID,
            key_secret:RAZ_SECRET
        })
        const { paymentId, orderid } = await c.req.json();
        let { campaignid } = await c.req.json();
        const db = drizzle( sqlneon );


        const payment = await razorpay.payments.fetch(paymentId)
        if(payment.status == "captured") {
            console.log("hare krishna", orderid, paymentId, );
            try{
                const payment_table = await db.select().from(paymentTable).where(eq(paymentTable.orderid,orderid))
                console.log("payment",payment_table)
                const paymentstatus = await db.update(paymentTable).set({
                    paymentstatus:true
                }).where(eq(paymentTable.orderid,orderid))
                console.log("payment_amount",payment.amount)
            }
            catch(e){
                return c.json({
                    status:400,
                    message:"Failed to Update the payment status in db: " + e
                })
            }
            const amountInRupees = Number(payment.amount) / 100;
            try {
                if(!campaignid){
                    const getpayment = await db.select({id:paymentTable.campaignsid}).from(paymentTable).where(eq(paymentTable.orderid,orderid))
                    campaignid = getpayment[0].id;
                }
            }
            catch(e){
                return c.json({
                    status:400,
                    message:"Failed to campaignid from db: " + e
                })
            }
            try {
                const updatecampaign = await db.update(campaigns).set({
                    raisedtotal:sql`${campaigns.raisedtotal} + ${amountInRupees}`,
                    funderstotal:sql`${campaigns.funderstotal} + 1`
                }).where(eq(campaigns.id,campaignid))
            }
            catch(e){
                return c.json({
                    status:400,
                    message:"Failed to update payment in db: " + e
                })
            }
        }
        return c.json({ success: true, payment });
    } catch (error) {
        console.error(error);
        return c.json({ success: false, message: error});
    }
});

app.use("*", cors({
    origin: ["https://hkm-chennai-crowd-funding.vercel.app","https://hkmchennaicrowdfunding-dev.vercel.app", "https://campaigns.hkmchennai.org", "http://localhost:3000"],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
    credentials:false

}))
//const token = "iskonhublicampaign";


app.use('*', async (c, next) => {
    try {
        const { DATABASE_URL, RAZ_ID, RAZ_SECRET } = env<{
            DATABASE_URL: string;
            RAZ_ID: string;
            RAZ_SECRET: string;
        }>(c);
//const RAZ_ID = "rzp_test_h80a9qdKzKl9pm";
//const RAZ_SECRET = "G8oBD7K4CUECcc7GNc0q0vH5";

//const DATABASE_URL = "postgresql://neondb_owner:npg_e0L7DGPyxSlQ@ep-late-frost-adbr6e14-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
        const { AUTH_TOKEN } = env<{
            AUTH_TOKEN: string;
        }>(c);

        const razorpay = new Razorpay({
            key_id:RAZ_ID,
            key_secret:RAZ_SECRET
        })

        const sql = neon(DATABASE_URL);
        c.set('db', drizzle(sql));
        c.set('razor',razorpay);
        await next();
    }catch(err){
        console.error("An error occurred while connecting to the database:", err);
    }

});




app.get(
    '/campaign/:id',
    cors({
        origin: ["https://hkm-chennai-crowd-funding.vercel.app","https://hkmchennaicrowdfunding-dev.vercel.app", "https://campaigns.hkmchennai.org", "http://localhost:3000"],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
        credentials: true,
    }),
    async (c) => {
        const db = c.get("db");
        //const campaignId = Number(c.req.param("id"));
        const campaignId = c.req.param("id");

        if (!campaignId) {
            return c.json({
                error: "Invalid campaign ID",
                status: 400,
            });
        }

        try {
            // Fetch campaign details
            const campaignDetails = await db
                .select()
                .from(campaigns)
                .where(eq(campaigns.id, campaignId));
            console.log(campaignDetails[0]);
            if (campaignDetails.length === 0) {
                return c.json({
                    error: "Campaign not found",
                    status: 404,
                });
            }

            const top10paymentDetails = await db
                .select({
                    username: paymentTable.username,
                    amount: paymentTable.amount,
                    date: paymentTable.createdate,
                    isanonymous: paymentTable.isanonymous,
                })
                .from(paymentTable)
                .where(and(eq(paymentTable.paymentstatus,true),gte(paymentTable.amount,5000)))
                .orderBy(desc(paymentTable.createdate))
                .limit(10);

            console.log("hare krishna hare krishna ");
            const userList = await db
                .select()
                .from(paymentTable)
                .where(and(eq(paymentTable.campaignsid, campaignId),eq(paymentTable.paymentstatus,true)))
                .orderBy(desc(paymentTable.amount));

            return c.json({
                campaignDetails: campaignDetails[0],
                userList,
                top10paymentDetails,
                totalFunders:campaignDetails[0].funderstotal,

                raisedFund:campaignDetails[0].raisedtotal,
            });
        } catch (error) {
            console.error("Error:", error);
            return c.json({
                error: "An error occurred while fetching campaign data: " + error,
                status: 500,
            });
        }
    });

app.post(
    '/create-payment',
    cors({
        origin: ["https://hkm-chennai-crowd-funding.vercel.app","https://hkmchennaicrowdfunding-dev.vercel.app", "https://campaigns.hkmchennai.org", "http://localhost:3000"],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
        credentials: true,
    }),
    authMiddleware,
    async (c) => {
        const db = c.get('db');
        const razor = c.get('razor');
        let body;

        try {
            body = await c.req.json();
        } catch (err) {
            console.error("Error parsing JSON body:", err);
            return c.json({ error: "Invalid JSON body: " + err, status: 400 }, 400);
        }

        const {
            email,
            mobileno,
            country,
            pincode,
            panno,
            address,
            amount,
            username,
            campaignsid,
            isanonymous,
            taxPincode,
            taxCity,
            taxState,
            taxHouseNumber,
            taxStreet,
            houseNumber,
            city,
            state,
            street,
            dob,
            prasadRequired
        } = body;

        const requiredFields = { mobileno, amount, username };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || value.toString().trim() === "") {
                return c.json({ error: `${key} is required.`, status: 400 }, 400);
            }
        }

        if (isNaN(Number(amount))) {
            return c.json({ error: "Amount must be a valid number.", status: 400 }, 400);
        }

        const roundedAmount = Math.round(Number(amount));

        if (campaignsid && typeof campaignsid !== 'string' && typeof campaignsid !== 'number') {
            return c.json({ error: "Campaign ID must be a valid one.", status: 400 }, 400);
        }

        if (campaignsid) {
            try {
                const campaignExists = await db
                    .select()
                    .from(campaigns)
                    .where(eq(campaigns.id, campaignsid))
                    .limit(1);

                if (!campaignExists.length) {
                    return c.json({ error: "Invalid 'campaignsid'.", status: 400 }, 400);
                }
            } catch (err) {
                console.error("Error checking campaign existence:", err);
                return c.json({ error: "Failed to validate campaign ID: " + err, status: 500 }, 500);
            }
        }

        try {
            const options = {
                amount: roundedAmount * 100, // Amount for Razorpay (in paise)
                currency: 'INR',
                receipt: 'receipt_' + Math.random().toString(36).substring(2),
            };
            const order = await razor.orders.create(options);

            const result = await db.insert(paymentTable).values({
                email: email ? String(email) : null,
                mobileno: String(mobileno),
                country: country ? String(country) : null,
                pincode: String(pincode),
                panno: panno ? String(panno) : null,
                address: address ? String(address) : null,
                amount: roundedAmount,
                username: String(username),
                campaignsid: campaignsid ? String(campaignsid) : null,
                orderid: String(order.id),
                paymentstatus: false,
                createdate: new Date(),
                isanonymous: isanonymous ? isanonymous : false,
                taxPincode: taxPincode ? String(taxPincode) : null,
                prasadRequired: prasadRequired,
                houseNumber: houseNumber ? String(houseNumber) : null,
                street: street ? String(street) : null,
                city: city ? String(city) : null,
                state: state ? String(state) : null,
                taxHouseNumber: taxHouseNumber ? String(taxHouseNumber) : null,
                taxStreet: taxStreet ?  String(taxStreet ) : null,
                taxCity: taxCity ? String(taxCity) : null,
                taxState: taxState ? String(taxState) : null,
                dob: dob ? String(dob) : null
            });

            return c.json(
                {
                    message: "Payment created successfully",
                    order,
                    status: 201,
                },
                201
            );
        } catch (error) {
            console.error("Error creating payment:", error);
            return c.json({ error: "Failed to create payment: " + error, status: 500 }, 500);
        }
    }
);




app.get("/campaignName", async (c) => {
    try {
        const db = c.get("db");
        const name = c.req.query("name");

        if (!name) {
            return c.json({ error: "Campaign name is required" }, 400);
        }

        console.log(`%${name}%`);


        const campaign = await db
            .select()
            .from(campaigns)
            .where(ilike(campaigns.campaignName, `%${name}%`));
        console.log(campaign)

        if (campaign.length === 0) {
            return c.json({ message: "No campaigns found" }, 404);
        }

        return c.json(campaign);
    } catch (error) {
        console.error("Error fetching campaign:", error);
        return c.json({ error: "Internal server error: " + error }, 500);
    }
});

app.get("/debug-tables", async (c) => {
    const db = c.get("db");
    const tables = await db.execute(
//     sql`SELECT current_schema() AS current_schema;`
        sql `SELECT * FROM userpayment;`
    );
    return c.json(tables);
});

app.get("/showcampaigns", async (c) => {
    try {
        const db = c.get("db");
        const limits = Number(c.req.query("limit"));
        const page = Number(c.req.query("page")) || 1;
        const offsets = (page - 1) * limits;
        const campaignsData = await db.select().from(campaigns).orderBy(desc(campaigns.raisedtotal)).limit(limits).offset(offsets);
        const campaignersJoined = await db.select({count:count(campaigns.id)}).from(campaigns)
        const totalraised = await db.select({sum:sum(paymentTable.amount)}).from(paymentTable).where(eq(paymentTable.paymentstatus,true))
        const totalgoalamts = await db.select({sum:sum(campaigns.targetAmount)}).from(campaigns)
        const campaignDetails = campaignsData.map(campaign => ({
            campaignId: campaign.id,
            campaignName: campaign.campaignName,
            imgurl: campaign.imgurl,
            targetamt: campaign.targetAmount,
            enddate: campaign.enddate,
            startdate: campaign.startdate,
            campaignphno: campaign.phoneno,
            preacherName: campaign.preacherName,
            totalFunderCount:campaign.funderstotal,
            totalRaisedAmount:campaign.raisedtotal
        }))
        console.log("0", totalgoalamts[0].sum || 0)
        console.log("1",totalgoalamts)
        return c.json({
            totalcampaigncount: campaignersJoined[0].count || 0,
            totalraisedamt:totalraised[0].sum || 0,
            totalgoalamt:totalgoalamts[0].sum || 0,
            campaignDetails: campaignDetails,


        });

    } catch (e) {
        return c.json({
            error: "Failed to fetch the details: " + e,
            status: 404
        });
    }
});

app.get("/get_overall_progress", async (c) => {
    try {
        const db = c.get("db");
        const totalraised = await db.select({sum:sum(paymentTable.amount)}).from(paymentTable).where(eq(paymentTable.paymentstatus,true));
        const totalgoalamts = await db.select({sum:sum(campaigns.targetAmount)}).from(campaigns);
        return c.json({
            totalraisedamt:totalraised[0].sum || 0,
            totalgoalamt:totalgoalamts[0].sum || 0,
        });

    } catch (e) {
        return c.json({
            error: "Failed to fetch the details: " + e,
            status: 404
        });
    }
});

app.delete('/delete-campaign/:id',cors({
    origin: ["https://hkm-chennai-crowd-funding.vercel.app","https://hkmchennaicrowdfunding-dev.vercel.app", "https://campaigns.hkmchennai.org", "http://localhost:3000"],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
    credentials:true
}),basicAuth({
    username: 'admin',
    password: 'admin',
}), async (c) => {
    const db = c.get('db');
    const campaignId = c.req.param('id');

    if (!campaignId) {
        return c.json({
            error: "Invalid campaign ID",
            status: 400,
        });
    }

    try {
        const existingCampaign = await db
            .select()
            .from(campaigns)
            .where(eq(campaigns.id, campaignId))
            .limit(1);

        if (existingCampaign.length === 0) {
            return c.json({
                error: "Unable to delete. Campaign does not exist.",
                status: 404,
            });
        }

        const result = await db.delete(campaigns).where(eq(campaigns.id, campaignId));

        if (!result) {
            return c.json({
                error: "Failed to delete the campaign. No rows were affected.",
                status: 400,
            });
        }

        return c.json({
            message: "Campaign deleted successfully",
            status: 200,
        });
    } catch (error) {
        console.error("Error:", error);
        return c.json({
            error: "Failed to process the request: " + error,
            status: 500,
        });
    }
});



app.put('/update-campaign/:id',cors({
        origin: ["https://hkm-chennai-crowd-funding.vercel.app","https://hkmchennaicrowdfunding-dev.vercel.app", "https://campaigns.hkmchennai.org", "http://localhost:3000"],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
        credentials:true
    }),authMiddleware
    , async (c) => {
        const db = c.get('db');
        const body = await c.req.json();
        const campaignId = c.req.param('id');

        // Validate campaignId
        if (!campaignId) {
            return c.json({
                error: "Invalid campaign ID",
                status: 400,
            });
        }

        // Validate body fields
        if (!body.campaignname  || isNaN(Number(body.targetamount)) ) {
            return c.json({
                error: "All fields are required and must be valid",
                status: 400,
            });
        }

        const campaignData = {
            campaignName: String(body.campaignname),
            targetAmount: Number(body.targetamount),
        };
        console.log(campaignData)

        try {
            // Check if the campaign exists before updating
            const existingCampaign = await db
                .select()
                .from(campaigns)
                .where(eq(campaigns.id, campaignId))
                .limit(1);

            if (existingCampaign.length === 0) {
                return c.json({
                    error: "Campaign not found",
                    status: 404,
                });
            }

            // Update the campaign
            const result = await db
                .update(campaigns)
                .set(campaignData)
                .where(eq(campaigns.id, campaignId));

            if (!result) {
                return c.json({
                    error: "No changes applied to the campaign",
                    status: 400,
                });
            }

            return c.json({
                message: "Campaign updated successfully",
                status: 200,
            });
        } catch (error) {
            console.error("Error:", error);
            return c.json({
                error: "Failed to process the request: " + error,
                status: 500,
            });
        }
    });




app.post('/create-campaign',cors({
    origin: ["https://hkm-chennai-crowd-funding.vercel.app","https://hkmchennaicrowdfunding-dev.vercel.app", "https://campaigns.hkmchennai.org", "http://localhost:3000"],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
    credentials:true
}), async (c) => {

    const db = c.get('db');
    const body = await c.req.json();
    try{
        const campaignData = {
            campaignName: String(body.campaignname),
            targetAmount: Number(body.targetamount),
            imgurl: String(body.imgurl),
            phoneno:String(body.phoneno),
            enddate:new Date(body.enddate),
            preacherName:String(body.preachername)
        };
        if(!campaignData.campaignName  || !campaignData.targetAmount || !campaignData.phoneno ||!campaignData.enddate){
            return c.json({
                error:"All fields are required",
                status:400
            })
        }

        const existingCampaign = await db.select().from(campaigns).where(eq(campaigns.campaignName, campaignData.campaignName)).limit(1);

        if (existingCampaign.length > 0) {
            return c.json({
                error: "Campaign already exists",
                status: 400
            });
        }

        try{
            const result = await db.insert(campaigns).values(campaignData).returning({ id: campaigns.id });
            return c.json({
                message: "Campaign created successfully",
                status: 201,
            });
        }
        catch(e){
            return c.json({
                error:"Failed to Update in the Database: " + e,
                status:502
            })
        }
    }
    catch(e){
        return c.json({
            error:"Failed to parse the statement: " + e,
            status:400
        })
    }

});



app.get('/', (c) => {
    return c.text('Hello! Enter the Valid Api Endpoint')
})



app.get("/show", async (c)=> {
    const db = c.get('db');
    const res = await db.select().from(paymentTable).then((res)=>res);
    return c.json(res)
})

app.get("/api/campaigner/:id/streak", async (c) => {
    const db = c.get("db");
    const id = c.req.param("id");
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Get campaigner and streak info
    const [campaigner] = await db
        .select({ name: campaigns.campaignName, img: campaigns.imgurl, target: campaigns.targetAmount, raised: campaigns.raisedtotal })
        .from(campaigns)
        .where(eq(campaigns.id, id));

    const [streak] = await db
        .select()
        .from(campaignerStreaks)
        .where(eq(campaignerStreaks.campaignerId, id));

    // Get this week's donations
    const donations = await db
        .select({ createdate: paymentTable.createdate, status: paymentTable.finalpaymentstatus, amount: paymentTable.amount })
        .from(paymentTable)
        .where(and(eq(paymentTable.campaignsid, id), eq(paymentTable.finalpaymentstatus, "captured")))
        .orderBy(desc(paymentTable.createdate));

    // Calculate this week’s blossom pattern
    const weekDays = Array(7).fill(false);
    donations.forEach((don) => {
        const d = new Date(don.createdate);
        if (d >= startOfWeek && d <= today) {
            const dayIndex = d.getDay();
            weekDays[dayIndex] = true;
        }
    });

    const todayAchieved = weekDays[today.getDay()] || false;

    return c.json({
        campaignerName: campaigner?.name || "Campaigner",
        campaignerImage: campaigner?.img || null,
        targetAmount: campaigner?.target,
        raisedAmount: campaigner?.raised,
        todayAchieved,
        weekDays,
        currentStreak: streak?.currentStreak || 0,
        longestStreak: streak?.longestStreak || 0,
    });
});

app.get("/api/leaderboard", async (c) => {
    const db = c.get("db");

    try {
        // Fetch all leaderboard entries
        const leaders = await db.select().from(leaderboard);

        // Transform into a cleaner object for the frontend
        // Example output: { top_overall: { ... }, top_today: { ... } }
        const formattedLeaderboard = leaders.reduce((acc, entry) => {
            acc[entry.category] = {
                name: entry.campaignerName,
                image: entry.campaignerImage,
                value: entry.value,
                campaignerId: entry.campaignerId
            };
            return acc;
        }, {});

        return c.json(formattedLeaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return c.json({ error: "Failed to fetch leaderboard" }, 500);
    }
});

// Add this to your src/index.ts file

app.get("/api/campaigner/:id/donors", async (c) => {
    const db = c.get("db");
    const id = c.req.param("id");

    if (!id) {
        return c.json({ error: "Invalid Campaigner ID" }, 400);
    }

    try {
        const donors = await db
            .select({
                username: paymentTable.username,
                amount: paymentTable.amount,
                mobileno: paymentTable.mobileno,
                date: paymentTable.createdate
            })
            .from(paymentTable)
            .where(
                and(
                    eq(paymentTable.campaignsid, id),
                    eq(paymentTable.paymentstatus, true)
                )
            )
            .orderBy(desc(paymentTable.createdate)) // Latest first
            .limit(20);

        return c.json(donors);
    } catch (error) {
        console.error("Error fetching donors:", error);
        return c.json({ error: "Failed to fetch donors" }, 500);
    }
});

app.get('/test-cron', async (c) => {
    // This allows you to run the leaderboard logic ON DEMAND via browser/Postman
    // URL: https://your-worker.workers.dev/test-cron

    console.log("⚠️ Manual Trigger: Starting Leaderboard Update...");

    try {
        // We pass the Cloudflare environment variables (DATABASE_URL) to the logic
        await runLeaderboardLogic(c.env);
        return c.json({
            success: true,
            message: "Leaderboard logic executed successfully. Check logs for details."
        });
    } catch (error) {
        return c.json({
            success: false,
            error: "Manual trigger failed: " + error
        }, 500);
    }
});

// ... existing imports ...

// ✅ NEW AUTH ROUTE
app.post('/auth/google', cors({
    origin: ["https://hkm-chennai-crowd-funding.vercel.app","https://hkmchennaicrowdfunding-dev.vercel.app", "https://campaigns.hkmchennai.org", "http://localhost:3000", "http://localhost:3000"],
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    credentials: true
}), async (c) => {
    const db = c.get('db');

    try {
        const body = await c.req.json();
        const { token } = body;

        if (!token) return c.json({ success: false, message: "No token provided" }, 400);

        // 1. VERIFY TOKEN (Using Google's public endpoint - Works perfectly in Cloudflare Workers)
        const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);

        if (!googleResponse.ok) {
            return c.json({ success: false, message: "Invalid Google Token" }, 401);
        }

        const payload = await googleResponse.json();
        const email = payload.email;

        // 2. CHECK DATABASE
        // We look for a campaigner who has this email address
        const campaigner = await db
            .select()
            .from(campaigns)
            .where(eq(campaigns.email, email)) // ⚠️ MAKE SURE 'email' COLUMN EXISTS IN YOUR DB
            .limit(1);

        if (campaigner.length === 0) {
            return c.json({
                success: false,
                message: "Access Denied: No campaigner found with this email."
            }, 404);
        }

        // 3. SUCCESS
        return c.json({
            success: true,
            message: "Login successful",
            campaignerId: campaigner[0].id,
            name: campaigner[0].campaignName,
            image: payload.picture
        });

    } catch (error) {
        console.error("Auth Error:", error);
        return c.json({ success: false, message: "Server Error: " + error.message }, 500);
    }
});

// ... existing routes ...

export default {
    // A. Handle API Requests (Hono)
    fetch: app.fetch,

    // B. Handle Scheduled Events (Cron Triggers)
    scheduled: scheduledHandler
}