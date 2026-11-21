# Career-Ops at chennamatta889.github.io

The account homepage now displays Career-Ops at [https://chennamatta889.github.io/](https://chennamatta889.github.io/).

The root `index.html` is the original Career-Ops page with a same-origin HTML `<base href="/career-ops-cloud/">` reference. Scripts, styles, the published public job feed, and browser-only PDF/DOCX assets are served by the existing [career-ops-cloud](https://github.com/Chennamatta889/career-ops-cloud) GitHub Pages deployment. This keeps the main URL at the root and avoids duplicated assets and a second independent job scanner. **The site is not a redirect or an iframe.**

Existing content remains available:
- [Personal portfolio](https://chennamatta889.github.io/portfolio/) (saved copy of the previous homepage, CSS, JS and portrait).
- [DraftflowAI](https://chennamatta889.github.io/draftflowai/) (original directory retained).

The optional `.github/workflows/publish-career-ops.yml` is a full stand-alone artifact build if GitHub Pages is ever switched to GitHub Actions as publishing source. It is manually triggered only, to avoid duplicate scheduled scans.

For Google authentication, Career-Ops uses the original allowed Supabase callback at `/career-ops-cloud/` and then forwards the verified session to `/#ai` on the same origin without putting tokens in the destination URL.

When the source page's HTML layout changes, refresh this root `index.html` from the source repository, preserving the root `<base>` tag. JS/CSS/feed updates automatically load from the source path.
