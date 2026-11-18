# DraftflowAI 3.0 — deployment and security checklist

## Status
The original landing page is preserved. The portal is a fictional, interactive demo until a dedicated backend and a commercial HTTPS hosting origin are explicitly configured. Do not onboard customers before completing the checklist. GitHub Pages must not be used to run the commercial customer portal.

## Hosting (Netlify)
1. Sign in to Netlify, import the GitHub repository, and select branch main. Authorize only the necessary repository.
2. From repository root use build command: `mkdir -p dist && cp draftflowai/index.html draftflowai/portal.html draftflowai/portal-config.js dist/`
3. Publish directory: `dist`. Set the site public when ready. Use the assigned HTTPS URL or a verified custom domain. This copies only the three public frontend files, excluding setup documentation and all personal portfolio files.
4. Check your Netlify plan's current credits and limits before inviting customers. Do not enable paid upgrades without owner permission.

## Database (Supabase)
1. Provision a dedicated project. Choose an appropriate region and review current plan quotas and pricing. Use a unique database password kept in a password manager, not in GitHub or chat.
2. In SQL Editor, run setup/schema.sql once in that new project. Check all policies and grants. Enable RLS on any future public tables as well.
3. In authentication settings enable email/password, require email confirmation, configure minimum password length 12, configure suitable rate limits and CAPTCHA/abuse controls for production, and set up a trusted custom SMTP provider for real confirmation and recovery emails. Supabase's built-in email delivery is not appropriate for unrestricted production signup. If CAPTCHA is required, wire its client token integration before going live.
4. Set the Site URL to the commercial HTTPS origin. Allow the exact portal URL and its recovery URL with ?recovery=1 in Auth redirect URLs. Avoid wildcard redirect rules.
5. Edit portal-config.js with the URL of this dedicated project, its sb_publishable_ public key, and the exact HTTPS commercial origin. Never include database passwords, secret/service_role keys, real customer records, or SMTP credentials in this repo. The portal deliberately remains disabled on github.io.
6. Before enabling accounts, replace the landing-page privacy information with an accurate business privacy notice covering customer authentication, data processing, retention, deletion and relevant third parties. Define renewal, cancellation and refund terms. Do not represent the draft service disclosures as a finalized legal policy.
7. Test two separate disposable verified customer accounts: signup, confirmation, login, recovery, preference save, refresh and logout. Insert an application update in the dashboard for each account (different user_id values). Check that neither can read the other's records or preferences, including direct Data API requests with a customer JWT, nor write application rows or change profile ownership. Confirm anonymous access is denied. Test on mobile, and review browser/network errors. Do not enter real customer data during testing.
8. Restrict staff access to authorized project members, enforce MFA, do not share dashboard credentials, and establish staff processes for verifying customer identities before assigning updates. Initially staff add/update records inside the Supabase project's restricted dashboard; a dedicated admin UI is not included. Customers can view records and save only their own preferences. No bulk emailing, automated CRM, billing, uploads, live subscriptions or tracking-sheet synchronization is implemented.
9. Before launch, pin and review the Supabase SDK version, consider bundling/self-hosting the dependency, review frontend security headers/CSP and run a security review. The browser currently loads SDK v2 from a CDN only when configured. The latest 1,000 entries are loaded; older records require a future pagination feature.
10. Review the old GitHub Pages business landing page and redirect/remove it after commercial deployment if needed, without affecting the personal portfolio.

Never commit PII, private credentials or test account passwords to this repository.
