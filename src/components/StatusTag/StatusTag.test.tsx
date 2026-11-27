import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusTag, statusTone, statusLabel, type Status } from "./StatusTag";
import { assertClassNameForwarding, assertPropSpreading } from "../../test-utils";

describe("StatusTag", () => {
  it("renders the default label for a status", () => {
    render(<StatusTag status="awaiting-approval" />);
    expect(screen.getByText("Awaiting approval")).toBeInTheDocument();
  });

  it("maps every status to the documented tone", () => {
    const expected: Record<Status, string> = {
      completed: "positive",
      active: "positive",
      pending: "warning",
      processing: "warning",
      "awaiting-approval": "warning",
      invited: "info",
      failed: "critical",
      cancelled: "neutral",
      expired: "neutral",
      disabled: "neutral",
    };
    expect(statusTone).toEqual(expected);
    for (const status of Object.keys(expected) as Status[]) {
      const { container, unmount } = render(<StatusTag status={status} />);
      expect(container.firstChild).toHaveClass(`tag--${expected[status]}`);
      expect(container.firstChild).toHaveAttribute("data-status", status);
      unmount();
    }
  });

  it("has a label for every status", () => {
    expect(Object.keys(statusLabel).sort()).toEqual(Object.keys(statusTone).sort());
  });

  it("uses a label override", () => {
    render(<StatusTag status="failed" label="Rejected" />);
    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(screen.queryByText("Failed")).not.toBeInTheDocument();
  });

  it("defaults to the small size", () => {
    const { container } = render(<StatusTag status="completed" />);
    expect(container.firstChild).toHaveClass("tag--small");
  });

  it("forwards className and HTML attributes", () => {
    assertClassNameForwarding(StatusTag, { status: "completed" });
    assertPropSpreading(StatusTag, { status: "completed" });
  });
});
