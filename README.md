# Career-Ops — primary website

**Only supported public deployment:** https://chennamatta889.github.io/#discover

The account homepage repository publishes the latest Career-Ops source from
`Chennamatta889/career-ops-cloud` as a full root-level GitHub Pages artifact.
The root workflow builds its own anonymous India-only employer feed, checks
freshness and deduplication, and publishes `/data/jobs.json` plus
`/data/coverage-evidence.json`. The project repository remains the source of
code, **not a second production Pages destination**. Project-site deployments
are disabled in its `deploy-ui.yml` workflow.

The old `/career-ops-cloud/` GitHub Pages address may remain publicly reachable
until GitHub Pages is disabled in that repository's Settings → Pages. Do not
link to or rely on that old site.

Preserved root paths: `/portfolio/`, `/draftflowai/`, Google Search Console
verification files, `/ads.txt`, legal pages and resources.

GitHub OAuth callback settings may still reference the legacy project path;
update approved callback URLs only after confirming the root login flow.
