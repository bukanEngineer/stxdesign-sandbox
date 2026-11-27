import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { CardAsset } from "./CardAsset";
import { renderSmoke } from "../../test-utils";

describe("CardAsset", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(CardAsset);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <CardAsset name="XSGD" balance="1,000.00" currency="SGD" icon="xsgd" />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  const assets = [
    {
      symbol: "XSGD",
      balance: "1,000.00",
      networks: ["Ethereum", "Polygon", "Avalanche", "Solana", "Base", "Tron"].map((name) => ({
        name,
      })),
    },
    { symbol: "USDC", balance: "500.00" },
  ];

  it("renders each asset as a list item", () => {
    render(<CardAsset assets={assets} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("caps networks at 4 and shows the overflow count", () => {
    render(<CardAsset assets={assets} />);
    const [first] = screen.getAllByRole("listitem");
    expect(within(first).getByText("+2")).toBeInTheDocument();
  });

  it("uses the asset logo when recognized artwork is omitted", () => {
    render(<CardAsset assets={assets} />);
    expect(screen.getByRole("img", { name: "XSGD" })).toBeInTheDocument();
  });

  it("retains initials for unknown symbols and hides an explicit null logo", () => {
    const { container } = render(
      <CardAsset assets={[{ symbol: "POINTS" }, { symbol: "XSGD", logo: null }]} />,
    );
    expect(screen.getByText("PO")).toBeInTheDocument();
    expect(container.querySelectorAll(".list-asset__icon")).toHaveLength(1);
  });

  it("passes the asset to onAdd / onSend", async () => {
    const onAdd = vi.fn();
    const onSend = vi.fn();
    render(<CardAsset assets={assets} onAdd={onAdd} onSend={onSend} />);
    const [first] = screen.getAllByRole("listitem");
    await userEvent.click(within(first).getByRole("button", { name: "Add" }));
    await userEvent.click(within(first).getByRole("button", { name: "Send" }));
    expect(onAdd).toHaveBeenCalledWith(assets[0]);
    expect(onSend).toHaveBeenCalledWith(assets[0]);
  });

  it("renders the toggle and header actions slots", () => {
    render(
      <CardAsset
        assets={[]}
        toggle={<span>Cash toggle</span>}
        actions={<button type="button">View all</button>}
      />,
    );
    expect(screen.getByText("Cash toggle")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View all" })).toBeInTheDocument();
  });

  it("shows Add / Send on desktop rows by default", () => {
    render(<CardAsset assets={[{ symbol: "XSGD" }]} onAdd={() => {}} onSend={() => {}} />);
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(document.querySelector(".list-asset--desktop")).not.toBeNull();
  });

  it("uses mobile rows with platform=\"mobile\" and selects a row by click and keyboard", async () => {
    const onSelect = vi.fn();
    render(<CardAsset platform="mobile" assets={[{ symbol: "XSGD" }]} onAdd={() => {}} onSelect={onSelect} />);
    expect(screen.queryByRole("button", { name: "Add" })).not.toBeInTheDocument();
    const row = screen.getByRole("button", { name: "View XSGD" });
    expect(row.closest(".list-asset")).toHaveClass("list-asset--mobile");
    await userEvent.click(row);
    row.focus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith({ symbol: "XSGD" });
  });

  it("leaves mobile rows non-interactive without onSelect", () => {
    render(<CardAsset platform="mobile" assets={[{ symbol: "XSGD" }]} />);
    expect(screen.queryByRole("button", { name: "View XSGD" })).not.toBeInTheDocument();
  });

  it("falls back to desktop rows for platform=\"auto\" without matchMedia", () => {
    render(<CardAsset platform="auto" assets={[{ symbol: "XSGD" }]} />);
    expect(document.querySelector(".list-asset--desktop")).not.toBeNull();
  });
});
