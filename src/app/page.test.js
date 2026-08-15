import { render, screen } from "@testing-library/react";

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the application title", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Reservas de laboratorios UMG" })
    ).toBeInTheDocument();
  });
});
