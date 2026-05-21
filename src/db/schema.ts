import { relations } from "drizzle-orm";
import { boolean, date, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// 1. PAYMENT TABLE
export const paymentTable = pgTable("userpayment",
    {
        id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
        email: text("email"),
        mobileno: text("MobileNumber").notNull(),
        country: text("Country"),
        pincode: text("Pincode").notNull().default("000000"),
        panno: text("PANNO"),
        address: varchar("address", { length: 255 }),
        amount: integer("amount").notNull(),
        username: text("username").notNull(),

        // ✅ UPDATED: Changed to text to reference campaigns.id (which is now text)
        campaignsid: text("campaign_id").references(() => campaigns.id),

        createdate: timestamp("created_at").notNull().defaultNow(),
        paymentstatus: boolean("payment_status").notNull().default(false),
        finalpaymentstatus: varchar("final_payment_status", { length: 255 }).notNull().default("created"),
        orderid: varchar('order_id', { length: 255 }).notNull(),
        isanonymous: boolean("isanonymous").notNull().default(false),
        taxPincode: varchar("tax_pincode", { length: 20 }),
        dob: varchar("dob", { length: 20 }),
        prasadRequired: boolean("prasad_required").notNull().default(false),
        taxCity: text("tax_city"),
        taxState: text("tax_state"),
        taxHouseNumber: text("tax_house_number"),
        taxStreet: text("tax_street"),
        houseNumber: text("house_number"),
        city: text("city"),
        state: text("state"),
        street: text("street"),
    }
);

// 2. CAMPAIGNS TABLE
export const campaigns = pgTable('campaigns', {
    // ✅ UPDATED: Changed from serial('id') to text('id').
    // It is now a manual or trigger-based string ID (e.g., "aneesh-campaign").
    id: text('id').primaryKey(),

    campaignName: varchar('campaign_name', { length: 255 }).notNull(),
    targetAmount: integer('target_amount').notNull(),
    imgurl: varchar('image_url', { length: 255 }),
    phoneno: text("phoneno"),
    startdate: timestamp('startdate').notNull().defaultNow(),
    enddate: date("end_date").notNull(),
    preacherName: varchar('preacher_name', { length: 255 }).notNull(),
    raisedtotal: integer("raised_total").notNull().default(0),
    funderstotal: integer("funders_totaltotal").notNull().default(0),
    email: text("email"),
});

// 3. STREAKS TABLE
export const campaignerStreaks = pgTable("campaigner_streaks", {
    id: serial("id").primaryKey(),

    // ✅ UPDATED: Changed to text to match campaigns.id
    campaignerId: text("campaigner_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),

    currentStreak: integer("current_streak").default(0),
    longestStreak: integer("longest_streak").default(0),
    lastDonationDate: date("last_donation_date"),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// 4. LEADERBOARD TABLE
export const leaderboard = pgTable("leaderboard", {
    id: serial("id").primaryKey(),
    category: varchar("category", { length: 50 }).notNull().unique(),

    // ✅ UPDATED: Changed to text to match campaigns.id
    campaignerId: text("campaigner_id").references(() => campaigns.id),

    campaignerName: varchar("campaigner_name", { length: 255 }),
    campaignerImage: varchar("campaigner_image", { length: 255 }),
    value: integer("value").notNull(),
    lastUpdated: timestamp("last_updated").defaultNow(),
});

// 5. RELATIONS
export const campaignRelation = relations(campaigns, ({ many }) => ({
    payment: many(paymentTable),
}));

export const paymentRelation = relations(paymentTable, ({ one }) => ({
    campaign: one(campaigns, {
        fields: [paymentTable.campaignsid],
        references: [campaigns.id],
    }),
}));