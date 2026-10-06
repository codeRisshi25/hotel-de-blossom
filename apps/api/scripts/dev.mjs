// Local API runner: mirrors the repo-root .env into wrangler's .dev.vars,
// then serves the Pages Functions on http://127.0.0.1:8788 for the Vite proxy.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const apiDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rootEnv = resolve(apiDir, "../../.env");
const devVars = resolve(apiDir, ".dev.vars");
const staticDir = resolve(apiDir, "../web/dist");

if (existsSync(rootEnv)) {
  writeFileSync(devVars, readFileSync(rootEnv, "utf8"));
} else {
  console.warn("[api] No .env at the repo root. API routes will answer 503 until Supabase secrets are added (copy .env.example to .env).");
}
mkdirSync(staticDir, { recursive: true });

const port = process.env.API_PORT ?? "8788";
const child = spawn("npx", ["wrangler", "pages", "dev", staticDir, "--port", port, "--ip", "127.0.0.1", "--show-interactive-dev-session=false"], {
  cwd: apiDir,
  stdio: "inherit",
  shell: process.platform === "win32",
});
child.on("exit", (code) => process.exit(code ?? 0));
