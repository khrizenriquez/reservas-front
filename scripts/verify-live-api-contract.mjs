import { readFile } from "node:fs/promises";
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
let response;

try {
  response = await fetch(profile.source, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000)
  });
} catch (error) {
  throw new Error(`Render live schema request failed: ${error.message}`, { cause: error });
}

if (!response.ok) {
  throw new Error(`Render live schema request failed with HTTP ${response.status}.`);
}

let publishedSchema;

try {
  publishedSchema = await response.json();
} catch (error) {
  throw new Error(`Render live schema response is not valid JSON: ${error.message}`, {
    cause: error
  });
}

const schemaErrors = validatePublishedSchema(profile, publishedSchema);

if (schemaErrors.length > 0) {
  throw new Error(validationMessage(schemaErrors));
}

console.log(`Render v1 live schema verified: ${profile.source}`);
