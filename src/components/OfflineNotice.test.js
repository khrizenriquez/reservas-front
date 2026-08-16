import { fireEvent, render, screen } from "@testing-library/react";
import { LanguageProvider } from "./LanguageProvider";
import { OfflineNotice } from "./OfflineNotice";

const setOnline = (value) => Object.defineProperty(window.navigator, "onLine", { configurable: true, value });

afterEach(() => setOnline(true));

it("announces offline state and clears it after reconnecting", () => {
  setOnline(false);
  render(<LanguageProvider><OfflineNotice /></LanguageProvider>);
  expect(screen.getByRole("status")).toHaveTextContent("Sin conexión");
  fireEvent(window, new Event("online"));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
