import { Router, type IRouter, type Request, type Response } from "express";
import { logger } from "../lib/logger";

/**
 * Reverse proxy for the external Mpanolontsaina IA API.
 *
 * The real API (http://api.mpanolontsaina-ia.duckdns.org) is HTTP-only,
 * while the frontend is served over HTTPS in deployment. Browsers block HTTPS pages from calling plain HTTP endpoints
 * ("mixed content"), so the frontend never talks to that host directly.
 *
 * In development, the frontend's own Vite dev server proxies `/ext-api`.
 * In production (static build, no dev server), the frontend instead calls
 * `/api/ext-api/*`, which the shared router sends here, and this route
 * forwards it server-side to the real HTTP API.
 */

/**
 * URL de base de l'API externe.
 * Configurable via la variable d'environnement EXTERNAL_API_URL dans .env.
 * Défaut : http://api.mpanolontsaina-ia.duckdns.org
 */
const EXTERNAL_API_ORIGIN =
  process.env["EXTERNAL_API_URL"]?.replace(/\/$/, "") ??
  "http://api.mpanolontsaina-ia.duckdns.org";

const HOP_BY_HOP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
]);

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  "connection",
  "transfer-encoding",
  "content-encoding",
]);

const router: IRouter = Router();

router.all("/ext-api/{*splat}", async (req: Request, res: Response) => {
  const targetPath = req.originalUrl.replace(/^\/api\/ext-api/, "");
  const targetUrl = `${EXTERNAL_API_ORIGIN}${targetPath}`;

  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value !== "string" || HOP_BY_HOP_REQUEST_HEADERS.has(key.toLowerCase())) {
      continue;
    }
    headers[key] = value;
  }

  const hasBody = !["GET", "HEAD"].includes(req.method) && req.body && Object.keys(req.body).length > 0;
  if (hasBody) {
    headers["content-type"] = "application/json";
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: hasBody ? JSON.stringify(req.body) : undefined,
    });

    res.status(upstreamResponse.status);
    upstreamResponse.headers.forEach((value, key) => {
      if (!HOP_BY_HOP_RESPONSE_HEADERS.has(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    const buffer = Buffer.from(await upstreamResponse.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    logger.error({ err, targetUrl }, "ext-api proxy request failed");
    res.status(502).json({
      status: "error",
      error: { code: "UPSTREAM_UNAVAILABLE", message: "External API unreachable" },
    });
  }
});

export default router;
