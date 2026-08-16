import { readFile } from "node:fs/promises";

const requiredBuildCommand =
  "npm run contract && npm run check && npm run release:check && npm run build";

const [vercelConfigText, nextConfigText] = await Promise.all([
  readFile("vercel.json", "utf8"),
  readFile("next.config.mjs", "utf8")
]);

const vercelConfig = JSON.parse(vercelConfigText);
const missing = [];

if (vercelConfig.framework !== "nextjs") {
  missing.push('Vercel framework "nextjs"');
}

if (vercelConfig.buildCommand !== requiredBuildCommand) {
  missing.push("Vercel build quality gates");
}

if (
  vercelConfigText.includes("NEXT_PUBLIC_API_BASE_URL") ||
  vercelConfigText.includes("NEXT_PUBLIC_API_PROFILE")
) {
  missing.push("environment values must remain outside vercel.json");
}

const requiredNextConfigSnippets = [
  "Content-Security-Policy",
  "connect-src 'self' https://umg-api-django.onrender.com",
  "Permissions-Policy",
  "Referrer-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  'source: "/sw.js"',
  "no-cache, no-store, must-revalidate"
];

for (const snippet of requiredNextConfigSnippets) {
  if (!nextConfigText.includes(snippet)) {
    missing.push(`Next.js security header: ${snippet}`);
  }
}

if (missing.length > 0) {
  throw new Error(
    `Vercel release configuration is incomplete: ${missing.join(", ")}`
  );
}

console.log("Vercel release configuration verified.");
