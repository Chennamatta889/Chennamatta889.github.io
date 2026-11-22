# EnquiryFlow v3.6 — Confirmed browser form-submission repair

**Root cause:** `staff.js` compared `e.target.id === 'recordForm'`, but the form contains an `<input name="id">`. In real browsers, the named input shadows `HTMLFormElement.id`, so the test fails. The submit handler skipped `preventDefault()` and the form performed a native GET navigation, losing the course entry. Earlier unit tests missed this actual DOM behavior.

**Fix:** Detect the form via `e.target instanceof HTMLFormElement && e.target.matches('#recordForm')` (also updated `#importForm` for consistency). Bumped staff page/module cache-busting query to `v=3.6` while retaining local storage key and user test data.

**Verified:**
- 103/103 Node automated unit/regression tests passed.
- A real headless Chromium DOM test passed using the actual production HTML and bundled source modules rendered without external page navigation: a published new course persisted, a ₹0 draft persisted without public disclosure, and a new student page displayed the published course and hid the draft.
- Same test passed adding/publishing a new course on a 390px mobile viewport.
- The browser no longer navigates to `?id=&title=...` when the Save button is clicked; no JavaScript page errors were observed.
- Static integrity check passed: 8 prepared SQL tables with RLS, no service secrets.

**Scope:** Still a fictional-data localStorage preview; not yet a shared live Firebase backend. Browser-local records are not shared across separate devices or browser profiles. No real student details should be entered. This release makes the already-present demo add/publish functionality actually work.

---

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


## v3.4 UI, student discovery, and staff experience

- Added course search/category/mode/sort and fee/duration comparison, with nonpublic courses already excluded by the shared `publicData()` layer.
- Added future-only, published batch filters using the `Asia/Kolkata` date.
- Added display of only public approved FAQs, responsive mobile nav and opt-in answer copy.
- Added staff-only enquiry filters, pipeline summary, next batches, and CSV export with formula-injection escaping.
- All **90 automated tests passed**; static check passed, JavaScript syntax checked.
- Real database integration remains **disabled** in the public v3 demo. The separate Firebase project exists but restrictive rules were not successfully published and live auth/role testing remains incomplete.
- Attempted Playwright screenshot using local Chromium; `net::ERR_BLOCKED_BY_ADMINISTRATOR` prevents local page navigation. Live browser checks are needed after Pages deployment. Production release remains NO-GO for real student records.


## v3.5 Staff save diagnosis and release gate

- Cause 1: public `CONFIG.demoMode` remains true; localStorage saves cannot synchronize devices or sessions.
- Cause 2: a new course's Publish checkbox was unchecked by default, which saved a staff-visible draft but not a student-visible record.
- Cause 3: previous course validation treated `0` as a missing fee.
- Cause 4: saving errors and CSV import approvals were not displayed persistently near the form; prior success messages could be misleading.
- Added `staff-form.js` pure input normalization, `Save draft` / `Save & publish` controls, explicit browser-only storage messaging, inline validation errors, duplicate-submission prevention, read-after-write verification, new saved-record IDs, and specific import approval guidance.
- `npm test`: **103/103 passing**; `node scripts/check.mjs`: static checks pass. Browser E2E remains blocked by environment admin policy. **Do not treat the real Firebase backend as configured.**


## v3.7 — enquiry intake delivery clarity

- Confirmed live prior code routed `submitEnquiry()` to same-browser `localStorage` while `CONFIG.demoMode:true` and never sent email or server requests.
- New UX explicitly separates successful local-only test saving from a verified backend receipt. Demo success includes the local `DEMO-` reference, no-delivery warning, and a same-browser Staff → Enquiries link.
- Pending and error states now disable duplicate submits and keep failure visible.
- Staff Enquiries now labels the inbox as browser-local simulation.
- Verified using headless Chromium with actual student form submission, persisted localStorage state, staff inbox read, invalid real-data rejection and no page errors; no TinyFish used.
- The Firestore rules were not deployed through this change. Real cross-device or email delivery is **not** provided.