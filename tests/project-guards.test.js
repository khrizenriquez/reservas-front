import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("project guards", () => {
  it("ships an installable manifest with required icons", async () => {
    const manifest = JSON.parse(await readFile(path.join(root, "public/manifest.webmanifest"), "utf8"));
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.map((icon) => icon.sizes)).toEqual(["192x192", "512x512"]);
  });

  it("never queues mutations in the service worker", async () => {
    const worker = await readFile(path.join(root, "public/sw.js"), "utf8");
    expect(worker).toContain('if (request.method !== "GET") return;');
    expect(worker).not.toMatch(/sync|queue|indexedDB/i);
  });

  it("uses only the explicit namespaced local session store", async () => {
    const sources = await Promise.all([
      readFile(path.join(root, "providers/SessionProvider.js"), "utf8"),
      readFile(path.join(root, "lib/api/client.js"), "utf8"),
    ]);
    const source = sources.join("\n");
    expect(source).not.toMatch(/sessionStorage|indexedDB/);
    expect(source).toContain("SESSION_NAMESPACE");
    expect(source).not.toMatch(/localStorage\.(?:getItem|setItem|removeItem)\([^S]/);
  });
});
