const { createHash } = require("node:crypto");

const RENDER_V1_PROFILE = "render-v1";

function validateManifest(manifest) {
  const profiles = manifest?.profiles;

  if (!profiles || typeof profiles !== "object") {
    return ["The contract manifest must define profiles."];
  }

  const profileNames = Object.keys(profiles);
  const errors = [];

  if (profileNames.length !== 1 || profileNames[0] !== RENDER_V1_PROFILE) {
    errors.push("The contract manifest must contain only the Render v1 profile.");
  }

  const profile = profiles[RENDER_V1_PROFILE];

  if (!profile) {
    return errors;
  }

  if (!profile.source?.startsWith("https://umg-api-django.onrender.com/")) {
    errors.push("Render v1 must use the published Render schema URL.");
  }

  if (!profile.snapshot?.endsWith("render-v1-openapi.yaml")) {
    errors.push("Render v1 must reference the Render v1 snapshot.");
  }

  if (!/^[a-f0-9]{64}$/.test(profile.sha256 ?? "")) {
    errors.push("Render v1 must declare a SHA-256 snapshot hash.");
  }

  if (!profile.requiredPaths || typeof profile.requiredPaths !== "object") {
    errors.push("Render v1 must declare required paths.");
  }

  return errors;
}

function validatePublishedSchema(profile, schema) {
  const errors = [];
  const paths = schema?.paths;

  if (!paths || typeof paths !== "object") {
    return ["The published Render schema does not contain paths."];
  }

  for (const [path, methods] of Object.entries(profile.requiredPaths ?? {})) {
    const publishedMethods = paths[path];

    if (!publishedMethods) {
      errors.push(`Render schema is missing required path ${path}.`);
      continue;
    }

    for (const method of methods) {
      if (!publishedMethods[method]) {
        errors.push(`Render schema is missing ${method.toUpperCase()} ${path}.`);
      }
    }
  }

  return errors;
}

function validateSnapshot(profile, snapshot) {
  const errors = [];
  const snapshotHash = createHash("sha256").update(snapshot).digest("hex");

  if (snapshotHash !== profile.sha256) {
    errors.push("The Render v1 snapshot hash does not match the contract manifest.");
  }

  const paths = {};
  let inPaths = false;
  let currentPath = null;

  for (const line of snapshot.toString().split(/\r?\n/)) {
    if (line === "paths:") {
      inPaths = true;
      continue;
    }

    if (inPaths && line.length > 0 && !line.startsWith(" ")) {
      break;
    }

    if (!inPaths) continue;

    const pathMatch = line.match(/^  (\/[^:]+):\s*$/);
    if (pathMatch) {
      currentPath = pathMatch[1];
      paths[currentPath] = {};
      continue;
    }

    const methodMatch = line.match(/^    (get|post|put|patch|delete|head|options):\s*$/i);
    if (currentPath && methodMatch) {
      paths[currentPath][methodMatch[1].toLowerCase()] = {};
    }
  }

  return [...errors, ...validatePublishedSchema(profile, { paths })];
}

function validationMessage(errors) {
  return [`Render v1 contract validation failed:`, ...errors.map((error) => `- ${error}`)].join("\n");
}

module.exports = {
  validateManifest,
  validatePublishedSchema,
  validateSnapshot,
  validationMessage
};
