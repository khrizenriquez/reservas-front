import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiRequest } from "@/lib/api/client";
import { API_BASE_URL, API_PROFILE, IS_LEGACY } from "@/lib/api/profile";
import { ApiProblem } from "@/lib/api/problem";

describe(`${API_PROFILE} API client`, () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("maps Django arrays and applies unsupported filters locally", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiRequest("listReservations", {
      accessToken: "access-value",
      actor: { id: 7, role: { name: "TEACHER" } },
      query: { limit: 25, status: "ACTIVE", dateFrom: "2026-08-01" },
    })).resolves.toEqual({ items: [], total: 0 });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url.toString()).toBe(`${API_BASE_URL}/${IS_LEGACY ? "api" : "api/v2"}/reservas/?userId=7`);
    expect(options.cache).toBe("no-store");
    expect(options.headers.get("Authorization")).toBe("Bearer access-value");
  });

  const refreshTest = IS_LEGACY ? it.skip : it;
  refreshTest("sends the namespaced v2 refresh token without cookie fallback", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      accessToken: "rotated", refreshToken: "refresh-2", user: null,
    }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("refreshSession", { body: { refreshToken: "refresh-1" } });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url.toString()).toBe("http://localhost:8100/api/v2/auth/refresh/");
    expect(options.body).toBe(JSON.stringify({ refreshToken: "refresh-1" }));
    expect(options.credentials).toBeUndefined();
  });

  it("normalizes Django error messages", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ mensaje: "Usuario o contraseña incorrectos." }),
      { status: 401, headers: { "content-type": "application/json" } },
    )));

    let caught;
    try {
      await apiRequest("login", { body: {} });
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(ApiProblem);
    expect(caught).toMatchObject({ status: 401, code: "UNEXPECTED_ERROR" });
    expect(caught.message).toBe("Usuario o contraseña incorrectos.");
  });
});
