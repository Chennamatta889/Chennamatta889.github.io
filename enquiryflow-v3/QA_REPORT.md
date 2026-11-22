# EnquiryFlow v3 — QA and deployment gate

Date: 22 November 2026

## Verified

- Two distinct HTML entrypoints, sharing a single data abstraction.
- 26 Node.js unit tests passed: consent, fictional-contact safeguards, fee/batch/FAQ retrieval, unknown-fact escalation, manual staff publishing, student enquiry isolation, editor publishing denial and CSV pending-draft approval.
- JavaScript syntax checked for all browser modules.
- Static review confirmed `ENABLE ROW LEVEL SECURITY` on all eight proposed database tables and no browser-side secret key.
- HTTP file server returned the student entrypoint successfully via `curl`.

## NOT YET VERIFIED

- Full browser end-to-end suite: blocked by environment's Chromium administrator policy (even for local and public URLs). The supplied test script did not complete.
- Supabase migration execution / database RLS enforcement: not applied to any real database.
- Owner/admin/editor/counselor Auth sessions against a real isolated project: not tested.
- Edge Function live deployment, consented lead creation, IP throttling, CORS and real provider AI behavior: not tested.
- Live student-facing URL, mobile usability, data persistence across devices: not deployed or confirmed.

## Risks / recommendations

1. Real institute data must be approved by the institute, including fees and current batches. The fixture is fictional.
2. The current import workflow supports manual CSV staging and official source links, not unattended crawling.
3. The local demo lets anyone simulate staff actions; it is **not** a secure production staff site. Real deployment must use Supabase Auth + RLS.
4. The optional AI model's generated answers require evaluation against published source records. No key is configured.
5. Anonymous Edge Functions have a basic request-count throttle, not a production bot defense. Add CAPTCHA and log-based detection before live collection.
6. Production CSV import requires tested transaction behavior and rollback/retry handling for invalid or duplicate records.
7. Staff enquiries currently fetch recent 80 records and provide a button for older records; pagination and retention tests must be done under realistic load.

## Release decision

**No-go for public real-data production release.** Suitable for offline internal review and further security testing. Requires one isolated project, role provisioning and live end-to-end tests before launch.

## Chat assistant v3.2 release QA

- 31 original automated tests and 19 additional assistant tests: **50/50 passed**.
- New scenarios: multi-intent fees/batches, follow-up context, compare/cheapest/all-fees, policy refusal, counselor handoff, unpublished data exclusion, outdated batch exclusion, null fees, public URL filtering, PII guards and staff-edited course prices.
- `node --check` passed for updated frontend code; `node scripts/check.mjs` passed static integrity checks. These tests do **not** establish production-grade Firebase security or AI model availability.
- Chromium graphical browser smoke test was attempted but blocked by environment policy (`ERR_BLOCKED_BY_ADMINISTRATOR` for local `127.0.0.1`). Live browser smoke tests remain a separate release gate.
- The chat engine remains a **deterministic retrieval simulation**, not a generative AI API or official institute service. All demo records are fictional.


## v3.3 generalized institution knowledge tests

Added 18 regression tests covering institute introduction, accurate course totals, public-only counts, all published fees, missing prices, cross-course next batch, weekend filtering, expired batches, combined fee and schedule answers, staff privacy, approved/unapproved faculty FAQs, human handoff, course-context retention and bounded large catalogue responses. Full Node test suite: **68 tests passing**; static check: **8/8 expected RLS schema declarations present**. These results are local tests, **not** evidence that Firebase Firestore RLS/rules were deployed or that real students can safely submit enquiries.