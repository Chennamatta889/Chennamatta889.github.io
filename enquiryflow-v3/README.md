# EnquiryFlow v3 — Single Institute Pilot

**Status: isolated implementation / demonstration. NOT DEPLOYED.** This bundle is independent of Career-Ops and the existing EnquiryFlow v2 site. The default mode contains **only fictional institute and student records** and stores changes in this browser's `localStorage` (not a secure shared database). Real student data must never be entered in demo mode.

## Two separate portals

- Student website: `/index.html` — institute profile, published course catalogue and fees, schedules, syllabus topics, knowledge assistant, student enquiry form and voluntary consent. No student enquiry records are exposed.
- Staff website: `/staff/index.html` — overview, course editing/pricing, batches, private enquiry queue, FAQ approval, staged CSV imports, institution profile. Staff actions in demo mode are simulated. In connected mode, sign-in is required and role permissions are enforced in PostgreSQL RLS.
- Both portals use one `assets/platform.js` data access module and a single Supabase database once configured.

### Local preview (no installations)

From the extracted project directory:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/` for students and `http://localhost:8000/staff/` for the console. The two screens share simulated information in the same browser origin. To reset local simulation click **Reset demo records** in the staff portal. Do not open using `file://`; JavaScript ES modules require an HTTP(S) origin.

### Tested locally

```bash
npm test
npm run check
```

Runs 26 offline functional tests and static checks. No npm installation is required. A Playwright browser suite is provided in `tests/browser_e2e.py`, but this execution environment blocks Chromium navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Browser layout and cross-browser QA remain **unverified**. The Supabase migration and live RLS policies have **not** been applied to a database and cannot be claimed as runtime-tested.

## Architecture and trust boundaries

```text
Student browser                              Authorized staff browser
     |                                               |
     | public SELECT published only                  | password Auth -> JWT -> RLS
     |                                               |
     +---- Supabase Data API ----> PostgreSQL <-------+
     |                                   |             \ private enquiries read/update
     +---- Edge Function submit-enquiry ->+  (secret key only inside server function)
     |                                         
     +---- Edge Function ai-assistant -> verified public rows + optional Gemini API key

Staff CSV -> import_jobs pending -> owner/admin approves as DRAFT -> staff verifies/publishes
```

**Data boundaries**: anonymous visitors have RLS SELECT only on published institute/course/batch/FAQ data. The `ef3_enquiries`, `ef3_staff`, `ef3_import_jobs`, and `ef3_ingress_events` tables have no anonymous SELECT permissions. Student leads are inserted only through a server Edge Function, with validation, a hashed-IP best-effort request throttle and consent field. AI function never receives private student records. Service/secret keys are never in frontend code.

## Database and roles

- Tables: `ef3_institutes`, `ef3_staff`, `ef3_courses`, `ef3_batches`, `ef3_faqs`, `ef3_enquiries`, `ef3_import_jobs`, `ef3_ingress_events`.
- Owner/admin: edit institute, prices, courses, FAQs, batch publishing, review imports, manage enquiries.
- Editor: draft courses/batches/FAQs; cannot publish without owner/admin.
- Counselor: view published & draft info, manage follow-ups/status for student enquiries; cannot change prices or publish.
- Anonymous student: read published verified content and submit consented enquiry through the Edge Function; cannot read enquiries.

Role membership lives in `ef3_staff`, linked to Supabase Auth user ID. It is *not* assigned through user-editable JWT metadata or by the client. There is deliberately **no public signup route** for staff; a trusted administrator provisions user access.

## Ready to connect a real isolated Supabase project

1. **Confirm the target Supabase organization and free plan.** Do not use the existing Career-Ops or DraftflowAI projects. The plan quote for a new project was $0/month when checked on 22 Nov 2026; project creation may still be limited by the free-project quota.
2. Create a new project called `enquiryflow-v3-pilot` in `ap-south-1`, if allowed at zero cost. Apply `supabase/migrations/20261122173000_enquiryflow_v3.sql` to the **new project only**. In Supabase, verify the RLS policies on all eight tables and run the security advisors.
3. Create the owner in Supabase Auth, using an institute-controlled email address. Create one institute row, unpublished initially. Insert the owner membership through trusted SQL using the sample at the end of the migration. Use the *actual*, freshly created project/Auth UUIDs only.
4. Open `assets/config.js`. Set `supabaseUrl` to the project's `https://<ref>.supabase.co`, `supabasePublishableKey` to the **publishable** (not secret/service role) key, `instituteSlug` to the institute slug and `demoMode:false`. These are the only client-side environment values. The default `demoMode:true` must never be advertised as a secure production site.
5. Deploy `supabase/functions/submit-enquiry` and `supabase/functions/ai-assistant` with `verify_jwt=false` **only after** configuring restrictive `ENQUIRYFLOW_ALLOWED_ORIGINS` and a random `ENQUIRYFLOW_RATE_SALT` (at least 24 characters), and completing API abuse/authorization review. Store the new project's secret key using platform-managed Edge Function secrets; never commit it. `GEMINI_API_KEY` is optional and must also be set as a secret. The AI model is configurable with `ENQUIRYFLOW_AI_MODEL`.
6. Verify anonymous SELECT restrictions; anonymous INSERT/UPDATE denial; staff owner/admin/editor/counselor access; data retrieval after login; one real consented *test* enquiry; function rate limits; AI prompt injection and accurate fallback behavior. Before receiving real contacts add CAPTCHA and production abuse monitoring. Do not collect real students until these checks pass.
7. Only when the new pilot passes security, functional and mobile QA, deploy the two portals to a **separate URL/path**. Do not overwrite `/`, Career-Ops, or existing `/enquiryflow/`.

## AI integration

The offline demo has a deterministic, source-based FAQ assistant. In connected mode an optional Supabase Edge Function fetches only published institute, course, batch and FAQ data, then uses a server-side Gemini API key if one is provided. Without the key, it returns an explicit unavailable message and a local approved-knowledge fallback. Generated answers can still be wrong; the staff knowledge base is the source of truth and the product must never claim guaranteed placements, confirmed seat availability or unverified fees. Model pricing and free-tier quotas can change; check provider terms before activation.

## Manual data, imports, and verification

Staff can enter details manually in the console, or upload `sample_courses.csv` / other institution-supplied CSV files. Accepted columns: `title, description, category, duration_weeks, fee_inr, delivery_modes, curriculum, source_url, fee_note`. Separate multiple modes/topics with the `|` character. An optional official URL records provenance; the app does **not** scrape websites or claim official institute affiliation. Import is staged, reviewed by an owner/admin, and creates **unpublished** drafts that must be verified and published individually. Imported prices should not automatically become student-facing facts.

## Production TODO (do not skip)

- Confirm ownership/authorization of the real institute's data, brand and admissions flow.
- Run actual database migration and RLS tests with anonymous and each staff role; run advisors.
- Enable MFA for owner/admin if available; set appropriate Auth session policies and recovery processes.
- Set live secret/CORS restrictions and protect Edge endpoints with stronger CAPTCHA/anti-abuse controls.
- Finish visual, accessibility, mobile and browser QA using a permitted browser environment.
- Add audit logging, backup/restore drills, deletion/retention policy, privacy notice, contact-data consent and access reviews.
- Add email notifications only after explicit staff approval, proper setup and provider quota assessment.
- Review security, data processing agreements, source licences and Indian privacy obligations before real enrolment data.

## Current GitHub safety

This release is provided as a separate versioned ZIP. The existing GitHub Pages root site, Career-Ops repo, current `/enquiryflow/` demo, and existing Supabase projects have **not** been modified by v3 work.

## Firebase Spark fallback (new backend; Supabase free-project quota reached)

A separate Firebase Spark project `enquiryflow-v3-pilot` was created for this app. The files
`firestore.rules` and `assets/firebase-platform.js` implement a stand-alone alternative to
Supabase. Firestore rules MUST be deployed before turning off `demoMode`; default Firestore
rules should deny all. Staff memberships are NEVER self-created: use Firebase Console/Admin
SDK to add a document `ef3_staff/<auth uid>` with `role: 'owner'` and `active: true` only after
verifying identity. Owners must sign in with Firebase Email/Password; public staff registration
is intentionally not implemented. Set only the publicly shareable `CONFIG.firebase` Web App
configuration in `assets/config.js`, and set `demoMode:false` only after live role and rule tests.

Free Spark plan doesn't include the backend used for generative AI/production anti-abuse here.
The AI assistant therefore continues as a source-grounded FAQ retriever. The Firestore intake
is deliberately limited to `Demo/Test/Sample` names and example.com/.org/.net emails, and
MUST NOT be used for real customer information until consent, anti-abuse, and notification
security reviews pass. If the project lacks Firestore, Auth or correct rules, leave the public
preview in clearly labelled, local demo mode.