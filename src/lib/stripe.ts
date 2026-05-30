import Stripe from "stripe";

if (!process.env.STRIPESECRETKEY) {
  throw new Error("STRIPESECRETKEY is not set");
}

export const stripe = new Stripe(process.env.STRIPESECRETKEY, {
  apiVersion: "2024-06-20"
});
