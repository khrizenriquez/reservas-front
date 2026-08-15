import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const {
  validateManifest,
  validatePublishedSchema,
  validationMessage
} = require("./contract/validate.cjs");

const manifestPath = resolve("specs/api-contract.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const manifestErrors = validateManifest(manifest);

if (manifestErrors.length > 0) {
  throw new Error(validationMessage(manifestErrors));
}

const profile = manifest.profiles["render-v1"];
const snapshotPath = resolve(profile.snapshot);
await access(snapshotPath, constants.R_OK);

const snapshot = await readFile(snapshotPath);
const snapshotHash = createHash("sha256").update(snapshot).digest("hex");

if (snapshotHash !== profile.sha256) {
  throw new Error("The Render v1 snapshot hash does not match the contract manifest.");
}

const response = await fetch(profile.source, {
  headers: { Accept: "application/json" },
  signal: AbortSignal.timeout(30_000)
});

if (!response.ok) {
  throw new Error(`Render schema request failed with HTTP ${response.status}.`);
}

const publishedSchema = await response.json();
const schemaErrors = validatePublishedSchema(profile, publishedSchema);

if (schemaErrors.length > 0) {
  throw new Error(validationMessage(schemaErrors));
}

console.log(`Render v1 contract verified: ${profile.snapshot}`);
