# GharWatt AI backend

The public GharWatt site stays on GitHub Pages. This isolated `gharwatt-ai` Supabase Edge Function lives in the already-connected private Supabase project (`nnhzihcugvifhegsfmua`); it does not change Career-Ops functions and does not query career data.

## Status and activation

This is deployed **disabled by default**. In the **Supabase Dashboard → Project → Edge Functions → Secrets**, configure server-only secrets:

- `GEMINI_API_KEY` — a valid AI Studio API key; may already be configured on the shared project, but must be verified privately.
- `GHARWATT_AI_ENABLED=true` — **opt-in switch**. Do not enable until the provider billing/free tier and privacy controls have been reviewed.
- `GHARWATT_GEMINI_MODEL` — optional, defaults to `gemini-3.5-flash-lite`. Verify the chosen model is available to the key.
- Status: live Gemini integration may already be enabled by the owner. The function does **not** require sign-in; quotas apply to anonymous browser identities, not verified people.

Do not place any secret in GitHub Pages HTML/JavaScript, in the repository, or in a chat message. Use server-side Edge Function secrets only.

### URLs

- Frontend: `https://chennamatta889.github.io/gharwatt/discover/`
- Function: `https://nnhzihcugvifhegsfmua.supabase.co/functions/v1/gharwatt-ai`
- GET with the site's browser origin returns an `ok` status and `ready` boolean; it does not expose secret values.

### Controls

- Only the GitHub Pages origin is allowed; the endpoint has no login requirement.
- Origin checking is **not** a substitute for authentication, so durable quota reservation is required BEFORE any model call.
- Atomic database RPC `public.gharwatt_ai_reserve_request` caps AI calls at **5 per anonymous browser per UTC day**, **400 across the website per UTC day**, and **10 across the website in any rolling 60 seconds**; quotas fail closed on errors. No chat content, bill or raw IP is stored.
- On the first consented AI request, the browser creates a random UUIDv4 and saves it in local storage (or session storage where available). Separate browsers, including browsers on the same Wi-Fi or mobile carrier, receive independent **5-message UTC-day allowances**.
- The backend stores only a daily salted SHA-256 hash of the browser ID, not the raw ID, raw IP, or conversation. Clearing browser storage can create another ID; this is not secure identity. A strict site-wide **400-request daily cap** and **10-request rolling-minute cap** prevent unlimited paid traffic and rapid bursts. After the site cap is reached, *all* visitors are blocked until the next UTC day (05:30 India time). For higher traffic use verified sign-in/CAPTCHA with rate limits.
- Existing IP-hashed quota rows remain in history but no longer affect the anonymous browser quota. No previous usage counters were deleted or reset.
- The minute limit uses an advisory transaction lock and an atomic PostgreSQL rolling 60-second counter; minute-blocked requests do **not** consume daily allowances. Request timestamps are kept briefly (old rows are removed on subsequent reservations) without user IDs or message content.
- These three limits count reservations before contacting Gemini, including failed provider attempts. They do not limit other apps using the same Google project or guarantee free provider availability. If the dashboard quota is 500 RPD, reserving 400 for GharWatt leaves at most 100 for other same-model uses, assuming no other traffic.
- Canonical SQL: `gharwatt/backend/gharwatt-ai/quota-400-5-10.sql`. For rollbacks, the SQL allows lower quota arguments and stays compatible with earlier Edge Function settings.
- Function requires `GHARWATT_AI_ENABLED=true`; no model call otherwise.
- Only the user's question and optional whitelisted numeric bill fields are sent for text chat, after explicit consent. A separate bill-upload form sends one specifically selected bill photo or PDF only after an additional, document-specific consent checkbox. JPEG, PNG and WebP are converted in the browser to JPEG (up to 3 MiB, stripping photo metadata); PDFs are sent unchanged up to 3 MiB. MIME, size and PDF/JPEG magic headers are validated server-side before any quota reservation. Requests are read with a byte limit even without Content-Length. The file and AI response exist only in transient request memory and are not saved in Supabase Storage or database; Google handles submitted media under its own policies. **Photo content and PDFs are not automatically redacted**, so users are told to crop/cover private details.
- The same authenticated-to-provider **service-side Gemini key**, explicit consent, origin check, atomic 400/day + 5/browser/day + 10/minute guard, and quota reservation apply to text and media uploads. The uploaded file is included only for the current analysis, not subsequent text chat. A failed media model call still consumes a reserved quota attempt. The client keeps chat history in memory and does not store chats.
- Outputs are explanations, not audited tariffs or financial advice. Keep all cost calculations deterministic.
- This function uses `verify_jwt=false` deliberately because the website is account-free. Do not remove the quota or consent gates.

### Bill AI upload

Open `https://chennamatta889.github.io/gharwatt/discover/#gw-ai-bill-upload` and expand the optional upload panel. A photo/PDF is only sent after a clear consent checkbox and user click. The older `bill-reader/` tool continues processing images/PDFs locally without transmitting to AI. The upload form is intentionally outside the number-based snapshot so people can start with a bill alone.

### Safe check

Visit the frontend and open **Ask GharWatt AI**. When disabled, it shows an accurate setup message and the user can still copy a reviewed question into ChatGPT. Once activated, use a harmless question such as "Why is total bill divided by units not my official tariff?" and verify the response.

This setup does not guarantee cost-free inference. Provider usage or Supabase Edge Function volume may incur charges depending on their plans.

## Deployment

The canonical source is `gharwatt/backend/gharwatt-ai/index.ts`. Update and deploy that function through the Supabase dashboard/CLI/connected tools; repository-only changes do not redeploy the backend.

## Post-analysis recommendations

After a consented bill upload, Gemini's answer now includes a prioritized next step and alternatives: billing/arrears review, no-cost efficiency habits, appliance upgrade checks and solar screening. That narrative is not verified financial advice.

To get a deterministic recommendation, the customer must verify and enter the bill amount, units, previous unpaid dues and billing period, as well as home/roof access, then click "Show my recommended next step." This uses the existing browser-only GharWatt Verdict engine and consumes no extra Gemini request. The values are not uploaded or stored in a database.

The rule engine puts arrears checks before upgrades when a payable bill is dominated by previous dues; suggests free habits for low usage; and marks rooftop solar as "worth comparing" only after stronger indicators (confirmed monthly usage, home ownership and potential roof access). Solar is not a proven best purchase from bill data: local tariffs, shade, permissions, real installation quote, verified energy yield, subsidies and ongoing costs are needed for a financial comparison.
