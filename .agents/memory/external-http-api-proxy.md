---
name: External HTTP API from HTTPS frontend
description: How to call a real, plain-HTTP external API from an HTTPS frontend without browser mixed-content blocks, in both dev and production.
---

When a frontend artifact must call a real external backend that only serves plain HTTP (no TLS), the browser blocks direct calls because the page itself is served over HTTPS ("mixed content"). Two different mechanisms are needed because dev and prod are served differently:

- **Dev**: the frontend's own Vite dev server can proxy a same-origin path (e.g. `/ext-api`) to the external HTTP origin via `server.proxy` in `vite.config.ts` (`changeOrigin: true`, rewrite to strip the prefix). Works because Vite is a live Node process.
- **Production**: a `serve: "static"` frontend artifact has no server process, so Vite's proxy does not exist there. Instead, route the same-origin path (e.g. `/api/ext-api`) to a sibling Express/API-server artifact already in the project, which does a server-side `fetch` passthrough to the real external origin and streams the response back (forward headers except hop-by-hop ones like `host`/`content-length`; re-stringify `req.body` since `express.json()` already parsed it upstream).
- Pick the client's base URL via `import.meta.env.PROD` (or equivalent) so the same client code targets the Vite proxy path in dev and the API-server proxy path in prod — never hardcode the external http:// URL in frontend code (it would be blocked/mixed-content anyway).

**Why:** browsers enforce mixed-content blocking regardless of environment; the dev proxy and prod proxy are structurally different because only one of them has a live server process to do the forwarding.

**How to apply:** whenever a project's real backend is external and plain-HTTP while the frontend is served over HTTPS, reach for this two-path proxy pattern instead of trying to call the external origin directly from the browser.
