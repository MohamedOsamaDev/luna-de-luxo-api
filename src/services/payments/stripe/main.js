import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config(); //config env
const stripe = new Stripe(process.env.stripe_api_key);
export default stripe;
