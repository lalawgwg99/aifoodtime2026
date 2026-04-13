import Stripe from "stripe";

type Req = {
  method?: string;
  body?: unknown;
  headers?: {
    host?: string;
  };
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

interface CheckoutPayload {
  email?: string;
  checkoutKey?: string;
  locale?: string;
  userId?: string | null;
}

const CHECKOUT_PRICE_BY_KEY: Record<string, string | undefined> = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
};

function parseBody(body: unknown): CheckoutPayload {
  if (!body || typeof body !== "object") {
    return {};
  }
  return body as CheckoutPayload;
}

function normalizeLocale(locale?: string): Stripe.Checkout.SessionCreateParams.Locale {
  if (locale === "zh-TW") {
    return "zh";
  }
  if (locale === "en") {
    return "en";
  }
  return "auto";
}

export default async function handler(req: Req, res: Res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({ error: "missing_stripe_secret_key" });
    return;
  }

  const payload = parseBody(req.body);
  const priceId = CHECKOUT_PRICE_BY_KEY[payload.checkoutKey ?? ""];

  if (!priceId) {
    res.status(400).json({ error: "invalid_checkout_key" });
    return;
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-03-31.basil",
  });

  const origin = process.env.APP_URL ?? `https://${req.headers?.host ?? "localhost:3000"}`;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancel`,
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: payload.email,
    locale: normalizeLocale(payload.locale),
    allow_promotion_codes: true,
    metadata: {
      source: "cooklab_web_waitlist",
      user_id: payload.userId ?? "",
    },
  });

  res.status(200).json({ url: session.url });
}
