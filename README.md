# CookLab AI

Monetizable cooking planner with:
- Supabase auth (email/password)
- Waitlist backend (Supabase table write)
- Stripe checkout session backend
- i18n (`en`, `zh-TW`)

## Tech

- Frontend: React + Vite + TypeScript
- Auth: Supabase (`@supabase/supabase-js`)
- Payments: Stripe (`stripe`)
- i18n: `i18next` + `react-i18next`
- Backend endpoints: `api/*` (serverless style, for Vercel-compatible deployments)

## Local setup

1. Install dependencies

```bash
npm install
```

2. Create env file

```bash
cp .env.example .env
```

3. Fill required values in `.env`

- Client env (Vite):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Server env:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PRICE_PRO_MONTHLY`
  - `APP_URL`

4. Start dev server

```bash
npm run dev
```

5. Build

```bash
npm run build
```

## Required Supabase table

Create table `waitlist_leads`:

```sql
create table if not exists public.waitlist_leads (
  id bigint generated always as identity primary key,
  email text not null unique,
  locale text,
  source text,
  user_id uuid,
  plan_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Optional update trigger:

```sql
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists waitlist_leads_set_updated_at on public.waitlist_leads;
create trigger waitlist_leads_set_updated_at
before update on public.waitlist_leads
for each row execute function public.set_updated_at();
```

## API routes

- `POST /api/waitlist`
  - body: `{ email, locale, source, userId, planId }`
  - upserts into `waitlist_leads` by `email`

- `POST /api/stripe/checkout`
  - body: `{ checkoutKey, email, locale, userId }`
  - supports `checkoutKey: "pro_monthly"`
  - returns Stripe checkout `url`

## Notes

- Frontend auth requires `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.
- Backend waitlist and checkout require server env values; missing values return explicit API errors.
- Current checkout key map is in `api/stripe/checkout.ts`.
