import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const {
  validateManifest,
  validateSnapshot,
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
const snapshotErrors = validateSnapshot(profile, snapshot);

if (snapshotErrors.length > 0) {
  throw new Error(validationMessage(snapshotErrors));
}

console.log(`Render v1 snapshot contract verified: ${profile.snapshot}`);
