import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";
import { assertClassNameForwarding, assertPropSpreading } from "../../test-utils";

describe("Spinner", () => {
  it("announces loading by default", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("uses a custom label", () => {
    render(<Spinner label="Loading QR code" />);
    expect(screen.getByRole("status", { name: "Loading QR code" })).toBeInTheDocument();
  });

  it("is hidden from assistive tech when label is null", () => {
    const { container } = render(<Spinner label={null} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("sets the size", () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.firstChild).toHaveAttribute("data-size", "lg");
  });

  it("forwards className and HTML attributes", () => {
    assertClassNameForwarding(Spinner);
    assertPropSpreading(Spinner);
  });
});
