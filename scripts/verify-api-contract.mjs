import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const manifestPath = resolve("specs/api-contract.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const profiles = Object.keys(manifest.profiles ?? {});

if (profiles.length !== 1 || profiles[0] !== "render-v1") {
  throw new Error("The contract manifest must contain only the Render v1 profile.");
}

const snapshot = manifest.profiles["render-v1"].snapshot;
await access(resolve(snapshot), constants.R_OK);

console.log(`Render v1 contract manifest is valid: ${snapshot}`);
