import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import fs from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api", router);

// ── Production: serve built frontend + SPA fallback ──────────────────────────
// In development, the Vite dev server handles the frontend.
// In production (NODE_ENV=production), Express takes over:
//   1. Serve hashed static assets with long-lived cache headers (immutable).
//   2. For every non-/api/* request, return index.html so client-side routing
//      (wouter) works on hard reload / direct URL access.
//
// The frontend is built into artifacts/mpanolontsaina-ia/dist/public.
// At runtime this module lives in artifacts/api-server/dist/index.mjs, so
// the relative path is ../../mpanolontsaina-ia/dist/public.
// Override with the FRONTEND_DIST env var if the layout differs on the server.
if (process.env.NODE_ENV === "production") {
  const frontendDist =
    process.env.FRONTEND_DIST ??
    path.resolve(import.meta.dirname, "../../mpanolontsaina-ia/dist/public");

  if (!fs.existsSync(frontendDist)) {
    logger.warn(
      { frontendDist },
      "Frontend dist directory not found — did you run the build step?",
    );
  } else {
    logger.info({ frontendDist }, "Serving frontend static files");
  }

  // Hashed assets (JS/CSS/fonts) get a 1-year immutable cache.
  app.use(
    express.static(frontendDist, {
      maxAge: "1y",
      immutable: true,
      index: false, // We control index.html delivery manually below.
    }),
  );

  // SPA fallback — any route not handled above serves index.html.
  // /api/* is already handled and will never reach here.
  app.get("/*", (_req: Request, res: Response) => {
    const indexPath = path.join(frontendDist, "index.html");
    res.sendFile(indexPath);
  });
}

export default app;
