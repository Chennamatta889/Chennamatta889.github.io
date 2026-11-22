# GharWatt AI backend

The public GharWatt site stays on GitHub Pages. This isolated `gharwatt-ai` Supabase Edge Function lives in the already-connected private Supabase project (`nnhzihcugvifhegsfmua`); it does not change Career-Ops functions and does not query career data.

## Status and activation

This is deployed **disabled by default**. In the **Supabase Dashboard → Project → Edge Functions → Secrets**, configure server-only secrets:

- `GEMINI_API_KEY` — a valid AI Studio API key; may already be configured on the shared project, but must be verified privately.
- `GHARWATT_AI_ENABLED=true` — **opt-in switch**. Do not enable until the provider billing/free tier and privacy controls have been reviewed.
- `GHARWATT_GEMINI_MODEL` — optional, defaults to `gemini-3.5-flash-lite`. Verify the chosen model is available to the key.

Do not place any secret in GitHub Pages HTML/JavaScript, in the repository, or in a chat message. Use server-side Edge Function secrets only.

### URLs

- Frontend: `https://chennamatta889.github.io/gharwatt/discover/`
- Function: `https://nnhzihcugvifhegsfmua.supabase.co/functions/v1/gharwatt-ai`
- GET with the site's browser origin returns an `ok` status and `ready` boolean; it does not expose secret values.

### Controls

- Only the GitHub Pages origin is allowed; the endpoint has no login requirement.
- Origin checking is **not** a substitute for authentication, so durable quota reservation is required BEFORE any model call.
- Atomic database RPC `public.gharwatt_ai_reserve_request` caps AI calls at **3 per visitor per UTC day** and **20 for the whole site per UTC day**; quotas fail closed on errors. No chat content, bill or raw IP is stored.
- Visitor hash is an opaque daily SHA-256 fingerprint; the proxy-supplied IP is not guaranteed unspoofable. The shared global cap prevents unlimited provider calls even under spoofing.
- Function requires `GHARWATT_AI_ENABLED=true`; no model call otherwise.
- Only the user's question and optional whitelisted numeric bill fields are sent, after explicit consent. The client keeps conversation history in memory and does not store chats.
- Outputs are explanations, not audited tariffs or financial advice. Keep all cost calculations deterministic.
- This function uses `verify_jwt=false` deliberately because the website is account-free. Do not remove the quota or consent gates.

### Safe check

Visit the frontend and open **Ask GharWatt AI**. When disabled, it shows an accurate setup message and the user can still copy a reviewed question into ChatGPT. Once activated, use a harmless question such as "Why is total bill divided by units not my official tariff?" and verify the response.

This setup does not guarantee cost-free inference. Provider usage or Supabase Edge Function volume may incur charges depending on their plans.

## Deployment

The canonical source is `gharwatt/backend/gharwatt-ai/index.ts`. Update and deploy that function through the Supabase dashboard/CLI/connected tools; repository-only changes do not redeploy the backend.
