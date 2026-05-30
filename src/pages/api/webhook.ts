import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sig = req.headers["stripe-signature"] as string | undefined;

  if (!sig) {
    return res.status(400).send("Missing Stripe signature");
  }

  const buf = await buffer(req);

  try {
    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPEWEBHOOKSECRET!
    );

    if (event.type === "checkout.session.completed") {
      // const session = event.data.object as any;
      // TODO: mark user as unlocked in DB if you add auth
      console.log("Payment successful:", event.data.object);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
