import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CardStatus } from "./CardStatus";
import { renderSmoke } from "../../test-utils";

describe("CardStatus", () => {
  it.each([
    { status: "error", label: "Error", icon: "close" },
    { status: "warning", label: "Warning", icon: "schedule" },
    { status: "needApproval", label: "Needs approval", icon: "hourglass_top" },
  ] as const)("renders $status without a success glyph or label", ({ status, label, icon }) => {
    render(<CardStatus status={status} title="Payment outcome" />);
    expect(screen.getByRole("img", { name: label }).querySelector("svg")).toHaveAttribute(
      "data-icon",
      icon,
    );
    expect(screen.queryByRole("img", { name: "Success" })).not.toBeInTheDocument();
  });

  it("renders without crashing (no props)", () => {
    renderSmoke(CardStatus);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <CardStatus
        title="Transfer Submitted"
        status="success"
        description="Your transfer has been processed."
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  it("places the info icon on the label", () => {
    const { container } = render(
      <CardStatus
        sections={[
          {
            items: [{ label: "Network fee", value: "1.00 SGD", info: true }],
          },
        ]}
      />,
    );
    const row = container.querySelector(".card-detail-row");
    expect(row).toHaveAttribute("data-info-placement", "label");
    expect(row?.querySelector(".card-detail-row__label .card-detail-row__info")).not.toBeNull();
  });
});
