import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton";
import { assertClassNameForwarding, assertPropSpreading } from "../../test-utils";

describe("Skeleton", () => {
  it("renders a decorative text line by default", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("data-shape", "text");
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("converts numeric sizes to px", () => {
    const { container } = render(<Skeleton shape="rect" width={120} height="50%" />);
    expect(container.firstChild).toHaveStyle({ width: "120px", height: "50%" });
  });

  it("makes a circle as tall as it is wide", () => {
    const { container } = render(<Skeleton shape="circle" width={32} />);
    expect(container.firstChild).toHaveStyle({ width: "32px", height: "32px" });
  });

  it("renders several text lines with a shorter last line", () => {
    const { container } = render(<Skeleton lines={3} />);
    const lines = container.querySelectorAll(".skeleton");
    expect(lines).toHaveLength(3);
    expect(lines[2]).toHaveStyle({ width: "60%" });
  });

  it("forwards className and HTML attributes", () => {
    assertClassNameForwarding(Skeleton);
    assertPropSpreading(Skeleton);
    assertClassNameForwarding(Skeleton, { lines: 2 });
  });
});
