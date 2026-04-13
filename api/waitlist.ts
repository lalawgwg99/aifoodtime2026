import { createClient } from "@supabase/supabase-js";

type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

interface WaitlistPayload {
  email?: string;
  locale?: string;
  source?: string;
  userId?: string | null;
  planId?: string | null;
}

function parseBody(body: unknown): WaitlistPayload {
  if (!body || typeof body !== "object") {
    return {};
  }
  return body as WaitlistPayload;
}

export default async function handler(req: Req, res: Res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    res.status(500).json({ error: "missing_supabase_server_config" });
    return;
  }

  const payload = parseBody(req.body);
  const email = payload.email?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "invalid_email" });
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const { data, error } = await supabase
    .from("waitlist_leads")
    .upsert(
      {
        email,
        locale: payload.locale ?? "en",
        source: payload.source ?? "web",
        user_id: payload.userId ?? null,
        plan_id: payload.planId ?? null,
      },
      {
        onConflict: "email",
      }
    )
    .select("id")
    .single();

  if (error) {
    res.status(500).json({ error: "waitlist_insert_failed", detail: error.message });
    return;
  }

  res.status(200).json({ ok: true, id: data.id });
}
