import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const apiMocks = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock("@/lib/api/client", () => apiMocks);

import { API_PROFILE, IS_LEGACY, SESSION_NAMESPACE } from "@/lib/api/profile";
import { SessionProvider, useSession } from "@/providers/SessionProvider";

function Probe() {
  const session = useSession();
  return (
    <div>
      <span>{session.status}</span>
      <span>{session.user?.firstName ?? "none"}</span>
      <button type="button" onClick={() => session.login({ username: "teacher@umg.edu.gt", password: "valid-password" })}>Login</button>
    </div>
  );
}

describe(`${API_PROFILE} SessionProvider`, () => {
  beforeEach(() => {
    localStorage.clear();
    apiMocks.apiRequest.mockReset();
  });

  it("stores only the session belonging to the explicit profile namespace", async () => {
    const user = { id: 7, firstName: "Ana", role: { name: "TEACHER" } };
    apiMocks.apiRequest.mockResolvedValue(IS_LEGACY
      ? { user, legacy: true }
      : { accessToken: "access-1", refreshToken: "refresh-1", user });

    render(<SessionProvider><Probe /></SessionProvider>);
    await screen.findByText("anonymous");
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => expect(screen.getByText("authenticated")).toBeInTheDocument());
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(apiMocks.apiRequest).toHaveBeenCalledWith("login", {
      body: { username: "teacher@umg.edu.gt", password: "valid-password" },
    });
    expect(JSON.parse(localStorage.getItem(SESSION_NAMESPACE))).toEqual(
      IS_LEGACY ? { user } : { accessToken: "access-1", refreshToken: "refresh-1" },
    );
  });
});
