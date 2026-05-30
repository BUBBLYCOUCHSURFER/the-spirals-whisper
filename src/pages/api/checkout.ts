import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";

type ResponseData = {
  url?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPEPRICEID!,
          quantity: 1
        }
      ],
      success_url: `${req.headers.origin}/unlock?success=1`,
      cancel_url: `${req.headers.origin}/play?canceled=1`
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
