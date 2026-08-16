import { fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("closes with Escape and the backdrop when dismissal is enabled", () => {
    const onClose = jest.fn();
    const { container } = render(<Modal isOpen onClose={onClose} title="Details" closeLabel="Close"><p>Content</p></Modal>);
    expect(screen.getByRole("dialog", { name: "Details" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.mouseDown(container.querySelector(".app-modal"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("does not dismiss a guarded dialog", () => {
    const onClose = jest.fn();
    const { container } = render(<Modal isOpen onClose={onClose} title="Confirm" closeLabel="Close" dismissible={false}><p>Content</p></Modal>);
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.mouseDown(container.querySelector(".app-modal"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not render when closed", () => {
    render(<Modal isOpen={false} onClose={() => {}} title="Hidden" closeLabel="Close"><p>Content</p></Modal>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
