const { createHash } = require("node:crypto");
const {
  renderV1Manifest,
  renderV1Profile,
  renderV1Schema
} = require("./__fixtures__/render-v1-contract");
const {
  validateManifest,
  validatePublishedSchema,
  validateSnapshot,
  validationMessage
} = require("./validate.cjs");

describe("Render v1 contract validation", () => {
  it("accepts the Render-only manifest and its published operations", () => {
    expect(validateManifest(renderV1Manifest)).toEqual([]);
    expect(validatePublishedSchema(renderV1Profile, renderV1Schema)).toEqual([]);
  });

  it("rejects a manifest that exposes another API profile", () => {
    const manifest = {
      profiles: {
        ...renderV1Manifest.profiles,
        unsupported: {}
      }
    };

    expect(validateManifest(manifest)).toContain(
      "The contract manifest must contain only the Render v1 profile."
    );
  });

  it("rejects absent profiles and a missing Render v1 profile", () => {
    expect(validateManifest()).toEqual(["The contract manifest must define profiles."]);
    expect(validateManifest({ profiles: { unsupported: {} } })).toEqual([
      "The contract manifest must contain only the Render v1 profile."
    ]);
  });

  it("rejects a profile with a drifted snapshot hash", () => {
    const profile = { ...renderV1Profile, sha256: "not-a-sha256" };

    expect(validateManifest({ profiles: { "render-v1": profile } })).toContain(
      "Render v1 must declare a SHA-256 snapshot hash."
    );
  });

  it("reports each missing Render profile requirement", () => {
    const profile = {
      ...renderV1Profile,
      source: "https://example.test/schema",
      snapshot: "specs/contracts/openapi.yaml",
      requiredPaths: null
    };

    expect(validateManifest({ profiles: { "render-v1": profile } })).toEqual([
      "Render v1 must use the published Render schema URL.",
      "Render v1 must reference the Render v1 snapshot.",
      "Render v1 must declare required paths."
    ]);
  });

  it("reports a missing published operation with a readable message", () => {
    const schema = {
      paths: {
        "/api/auth/login/": { post: {} },
        "/api/labs/": { get: {} }
      }
    };
    const errors = validatePublishedSchema(renderV1Profile, schema);

    expect(errors).toEqual(["Render schema is missing POST /api/labs/."]);
    expect(validationMessage(errors)).toContain("Render v1 contract validation failed:");
  });

  it("rejects a schema without paths and reports a missing required path", () => {
    expect(validatePublishedSchema(renderV1Profile, {})).toEqual([
      "The published Render schema does not contain paths."
    ]);

    expect(
      validatePublishedSchema(
        { ...renderV1Profile, requiredPaths: { "/api/usuarios/": ["get"] } },
        renderV1Schema
      )
    ).toEqual(["Render schema is missing required path /api/usuarios/."]);
  });

  it("validates the versioned snapshot without a live Render request", () => {
    const snapshot = [
      "openapi: 3.0.3",
      "paths:",
      "  /api/auth/login/:",
      "    post:",
      "  /api/labs/:",
      "    get:",
      "    post:",
      "components:",
      "  schemas: {}"
    ].join("\n");
    const profile = {
      ...renderV1Profile,
      sha256: createHash("sha256").update(snapshot).digest("hex")
    };

    expect(validateSnapshot(profile, snapshot)).toEqual([]);
  });

  it("reports drifted hashes and missing operations in the versioned snapshot", () => {
    const snapshot = ["openapi: 3.0.3", "paths:", "  /api/auth/login/:", "    post:"].join(
      "\n"
    );
    const profile = {
      ...renderV1Profile,
      sha256: "0".repeat(64)
    };

    expect(validateSnapshot(profile, snapshot)).toEqual([
      "The Render v1 snapshot hash does not match the contract manifest.",
      "Render schema is missing required path /api/labs/."
    ]);
  });
});
