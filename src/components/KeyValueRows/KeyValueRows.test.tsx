import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KeyValueRows } from "./KeyValueRows";
import { assertClassNameForwarding, assertPropSpreading } from "../../test-utils";

const items = [
  { label: "Recipient", value: "Priya Nair" },
  { label: "Wallet address", value: "0x12…ab", copyable: "0x12ab34cd" },
  { label: "Total", value: "1,000.00 XSGD", emphasis: true, helper: "Includes a 1.00 XSGD fee" },
];

describe("KeyValueRows", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders a description list of terms and values", () => {
    render(<KeyValueRows items={items} />);
    expect(screen.getAllByRole("term")).toHaveLength(3);
    expect(screen.getAllByRole("definition")).toHaveLength(3);
    expect(screen.getByText("Priya Nair")).toBeInTheDocument();
    expect(screen.getByText("Includes a 1.00 XSGD fee")).toBeInTheDocument();
  });

  it("marks emphasised rows", () => {
    const { container } = render(<KeyValueRows items={items} />);
    const rows = container.querySelectorAll(".kv-rows__row");
    expect(rows[2]).toHaveAttribute("data-emphasis");
    expect(rows[0]).not.toHaveAttribute("data-emphasis");
  });

  it("copies the copyable string", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<KeyValueRows items={items} />);
    await user.click(screen.getByRole("button", { name: "Copy wallet address" }));
    expect(writeText).toHaveBeenCalledWith("0x12ab34cd");
    await waitFor(() => expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument());
  });

  it("renders an info trigger with an accessible name", () => {
    render(<KeyValueRows items={[{ label: "Fee", value: "1.00 XSGD", info: "Charged by the network" }]} />);
    expect(screen.getByRole("button", { name: "Charged by the network" })).toBeInTheDocument();
  });

  it("sets layout, size and dividers", () => {
    const { container } = render(<KeyValueRows items={items} layout="grid" size="compact" dividers />);
    expect(container.firstChild).toHaveAttribute("data-layout", "grid");
    expect(container.firstChild).toHaveAttribute("data-size", "compact");
    expect(container.firstChild).toHaveAttribute("data-dividers");
  });

  it("forwards className and HTML attributes", () => {
    assertClassNameForwarding(KeyValueRows, { items });
    assertPropSpreading(KeyValueRows, { items });
  });
});
