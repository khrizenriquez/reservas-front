import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "specs/api-contract.json"), "utf8"));
const clientSource = await readFile(path.join(root, "lib/api/operations.generated.js"), "utf8");
const clientOperations = new Set(
  [...clientSource.matchAll(/^ {2}([A-Za-z][A-Za-z0-9]+):/gm)].map((match) => match[1]),
);

for (const [profile, contract] of Object.entries(manifest.profiles)) {
  const missingClient = contract.requiredOperations.filter((id) => !clientOperations.has(id));
  if (missingClient.length) throw new Error(`${profile}: client operations missing: ${missingClient.join(", ")}`);

  const source = await readFile(path.join(root, contract.snapshot), "utf8");
  const digest = createHash("sha256").update(source).digest("hex");
  if (digest !== contract.sha256) throw new Error(`${profile}: expected ${contract.sha256}, received ${digest}`);

  const document = YAML.parse(source);
  for (const [apiPath, methods] of Object.entries(contract.requiredPaths)) {
    for (const method of methods) {
      if (!document.paths?.[apiPath]?.[method]) throw new Error(`${profile}: ${method.toUpperCase()} ${apiPath} absent from OpenAPI`);
    }
  }
}

process.stdout.write("API contracts verified independently for legacy and v2.\n");
