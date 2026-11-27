import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmModal, type ConfirmModalProps } from "./ConfirmModal";

function setup(props: Partial<ConfirmModalProps> = {}) {
  const onOpenChange = vi.fn();
  const onConfirm = vi.fn();
  render(
    <ConfirmModal
      open
      onOpenChange={onOpenChange}
      title="Remove Priya Nair?"
      description="They lose access straight away."
      confirmLabel="Remove member"
      onConfirm={onConfirm}
      {...props}
    />,
  );
  return { onOpenChange, onConfirm, user: userEvent.setup() };
}

describe("ConfirmModal", () => {
  it("renders an accessible dialog with title and description", () => {
    setup();
    const dialog = screen.getByRole("dialog", { name: "Remove Priya Nair?" });
    expect(dialog).toHaveAccessibleDescription("They lose access straight away.");
  });

  it("confirms and closes for a synchronous handler", async () => {
    const { user, onConfirm, onOpenChange } = setup();
    await user.click(screen.getByRole("button", { name: "Remove member" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("cancels through the cancel button", async () => {
    const { user, onConfirm, onOpenChange } = setup({ cancelLabel: "Keep member" });
    await user.click(screen.getByRole("button", { name: "Keep member" }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows a loading confirm button while the promise is pending", async () => {
    let resolve!: () => void;
    const onConfirm = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    const { user, onOpenChange } = setup({ onConfirm });
    await user.click(screen.getByRole("button", { name: "Remove member" }));
    const confirm = screen.getByRole("button", { name: "Remove member" });
    expect(confirm).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(onOpenChange).not.toHaveBeenCalled();
    resolve();
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("stays open when the promise rejects", async () => {
    const onConfirm = vi.fn(() => Promise.reject(new Error("nope")));
    const { user, onOpenChange } = setup({ onConfirm });
    await user.click(screen.getByRole("button", { name: "Remove member" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Remove member" })).not.toHaveAttribute("aria-busy"),
    );
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("uses the destructive button for the critical tone", () => {
    setup({ tone: "critical" });
    expect(screen.getByRole("button", { name: "Remove member" })).toHaveClass("btn--destructive");
  });

  it("disables confirm with confirmDisabled", () => {
    setup({ confirmDisabled: true, children: <label><input type="checkbox" /> I understand</label> });
    expect(screen.getByRole("button", { name: "Remove member" })).toBeDisabled();
    expect(screen.getByLabelText("I understand")).toBeInTheDocument();
  });
});
