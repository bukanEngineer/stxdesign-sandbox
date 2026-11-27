import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusIcon, type StatusIconVariant } from "./StatusIcon";
import { renderSmoke, assertPropSpreading } from "../../test-utils";

describe("StatusIcon", () => {
  it.each<{ variant: StatusIconVariant; label: string; icon: string }>([
    { variant: "success", label: "Success", icon: "check" },
    { variant: "needApproval", label: "Needs approval", icon: "hourglass_top" },
    { variant: "error", label: "Error", icon: "close" },
    { variant: "warning", label: "Warning", icon: "schedule" },
  ])("renders $variant with its accessible label and glyph", ({ variant, label, icon }) => {
    render(<StatusIcon variant={variant} />);
    const status = screen.getByRole("img", { name: label });
    expect(status.querySelector("svg")).toHaveAttribute("data-icon", icon);
    expect(status).toHaveStyle({ "--status-icon-size": "36px" });
  });

  it("allows an outcome-specific label and glyph override", () => {
    render(<StatusIcon variant="warning" icon="hourglass_top" aria-label="Expired" />);
    const status = screen.getByRole("img", { name: "Expired" });
    expect(status.querySelector("svg")).toHaveAttribute("data-icon", "hourglass_top");
    expect(screen.queryByRole("img", { name: "Success" })).not.toBeInTheDocument();
  });

  // A: Renderability
  it("renders with no props (defaults to success)", () => {
    renderSmoke(StatusIcon);
  });

  it("renders with variant prop", () => {
    const { container } = render(<StatusIcon variant="needApproval" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    const { container } = render(<StatusIcon className="custom" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes onto the root span", () => {
    assertPropSpreading(StatusIcon);
  });

  it("accepts a custom size", () => {
    const { container } = render(<StatusIcon size={48} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("accepts a custom icon override", () => {
    const { container } = render(<StatusIcon icon="star" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // C: All variants render without crashing
  it("renders success variant", () => {
    const { container } = render(<StatusIcon variant="success" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders needApproval variant", () => {
    const { container } = render(<StatusIcon variant="needApproval" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
