### Update the following files with your RazorPay and the database details.

#### Under wanglor.toml and index.ts of razorpay-cloudflare-worker-main
	RAZ_ID = "<place_your_razorpay_id>";
	RAZ_SECRET = "<place_your_razorpay_secret>";
	DATABSE_URL = "postgresql://username:password@host:port/db_name?sslmode=require"
	
#### Under .env file of iskcon-hubli-master
	REACT_APP_API_URL = "<place_your_api_url_here>"
    REACT_APP_RZP_KEY = "<place_your_razorpay_key_here>"