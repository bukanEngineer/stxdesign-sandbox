import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionButton } from "./ActionButton";

describe("ActionButton", () => {
  it("shows the caption and uses it as the accessible name", () => {
    render(<ActionButton icon="add" label="Transfer In" />);
    expect(screen.getByRole("button", { name: "Transfer In" })).toBeInTheDocument();
    expect(screen.getByText("Transfer In")).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<ActionButton icon="add" label="Transfer In" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Transfer In" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
