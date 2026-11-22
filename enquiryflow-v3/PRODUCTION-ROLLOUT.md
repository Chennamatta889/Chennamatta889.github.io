# EnquiryFlow v3 – Real student enquiry rollout (STAGED, NOT ACTIVATED)

This is an *isolated* Firebase-backed website. Existing student/staff demo and fictional pilot remain untouched.

## Current controls
- Only verified Google sign-in can submit real student enquiries; submitted email must match the token.
- Public read of `ef3_real_enquiries` is denied. Authenticated active staff can list; only owner/admin can delete.
- 15-minute per-Google-account cooldown is enforced using an **atomic Firestore write batch** and `getAfter()` security rules. It is not an IP rate limit and determined adversaries can create multiple accounts.
- Required consent and privacy version, restricted field schema, server timestamps. No email notification service is configured.
- Before any write, Firestore requires the published institute document `ef3_institutes/demo-tech-academy` to have `production_ready=true`, a real institute name (not Demo Tech Academy), and a real contact email (not admissions@example.com). Do not mark ready unless the real institute and its privacy/contact policies are confirmed.
- Public source pages are `/enquiryflow-v3/assets/production-student.html`, `/enquiryflow-v3/assets/production-staff.html`, and `/enquiryflow-v3/assets/production-privacy.html`.

## Manual launch checklist
1. REVIEW the whole `enquiryflow-v3/firestore-production.rules` in GitHub against the currently published rules. It retains all existing fictional rules and adds only two private real-enquiry collections. Inspect/test denial of public reads, test only staff reads, test batch cooldown, and test field validation in Firebase Rules Playground/emulator. Never paste only the new section or replace with allow-all.
2. Replace Firebase Console > Firestore Database > Rules with the *entire combined rules file* and publish after checks pass. If Firebase reports syntax errors, keep old rules and request a corrected version.
3. Firebase Authentication > Sign-in method > **Google**: enable, choose support email. Firebase Authentication > Settings > Authorized domains: add `chennamatta889.github.io` (host only, no https:// or path). The current email/password owner account remains usable in the staff portal.
4. On actual institute ownership agreement, set the **real** institute name, **real** admissions/privacy email and `production_ready` Boolean `true` on `ef3_institutes/demo-tech-academy`, keeping `published` Boolean true. Replace any fictional course and fee content with authorized accurate records. Ensure public site discloses the real institute and privacy contact.
5. On the staging URLs, verify Google sign-in, that email matches Google account, that one enquiry succeeds, the same reference appears in production staff inbox on a different browser, a second enquiry within 15 minutes fails, and anonymous access to real enquiry collection is denied.
6. Monitor Firestore quota/usage, suspicious activity, deletion requests, and publication approval. **Consider Firebase App Check reCAPTCHA Enterprise** after making all currently deployed Firebase clients App Check compatible; project-wide enforcement on Cloud Firestore otherwise breaks the fictional pilot and diagnostics. A true per-IP rate limit requires a trusted backend and is not provided by these rules.
7. ONLY after full testing, privacy review and institute approval, consider replacing the canonical `/enquiryflow-v3/` routes with the verified production pages. Do not switch the demo proactively.

## Privacy limitations and operations
- This does not send email or SMS. Staff must log in and review enquiries.
- There is no automatic deletion or expiry. The owner can manually delete each real enquiry in staff view; institute should set a documented retention process.
- This deployment does not register App Check, create any billing account, upgrade Firebase Spark, or enable any paid services.
- The site's Google identity verification is intentionally a friction tradeoff for safer free-tier operation.