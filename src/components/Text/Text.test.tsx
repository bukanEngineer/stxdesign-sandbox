import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text, Caption, Footnote } from "./Text";
import { renderSmoke, assertClassNameForwarding } from "../../test-utils";

describe("Text", () => {
  it("renders without crashing", () => {
    renderSmoke(Text, { children: "Hello" });
  });

  it("applies the typography class and tone", () => {
    render(<Text variant="label-small" tone="critical">Error</Text>);
    const el = screen.getByText("Error");
    expect(el).toHaveClass("text", "label-small");
    expect(el).toHaveAttribute("data-tone", "critical");
  });

  it("renders the requested element", () => {
    render(<Text as="p">Paragraph</Text>);
    expect(screen.getByText("Paragraph").tagName).toBe("P");
  });

  it("forwards className", () => {
    assertClassNameForwarding(Text, { children: "x" });
  });

  it("Caption is small secondary text", () => {
    render(<Caption>Transfer In</Caption>);
    const el = screen.getByText("Transfer In");
    expect(el).toHaveClass("body-small");
    expect(el).toHaveAttribute("data-tone", "secondary");
  });

  it("Footnote renders a paragraph", () => {
    render(<Footnote>Rates may change.</Footnote>);
    expect(screen.getByText("Rates may change.").tagName).toBe("P");
  });
});
