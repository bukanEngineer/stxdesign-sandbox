import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImportantNotes } from "./ImportantNotes";
import {
  renderSmoke,
  assertClassNameForwarding,
  assertPropSpreading,
} from "../../test-utils";

describe("ImportantNotes", () => {
  it("renders with no props", () => {
    renderSmoke(ImportantNotes);
  });

  it("renders the default title and body", () => {
    render(
      <ImportantNotes>
        Our verification process may take up to 1 business day.
      </ImportantNotes>,
    );
    expect(screen.getByText("Important Notes:")).toBeInTheDocument();
    expect(
      screen.getByText("Our verification process may take up to 1 business day."),
    ).toBeInTheDocument();
  });

  it("hides the title when title is null", () => {
    render(
      <ImportantNotes title={null}>
        Body only
      </ImportantNotes>,
    );
    expect(screen.queryByText("Important Notes:")).not.toBeInTheDocument();
    expect(screen.getByText("Body only")).toBeInTheDocument();
  });

  it("forwards className", () => {
    assertClassNameForwarding(ImportantNotes);
  });

  it("spreads HTML attributes onto the root", () => {
    assertPropSpreading(ImportantNotes);
  });

  it("has role=note", () => {
    render(<ImportantNotes>Notice</ImportantNotes>);
    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it("accepts complex children", () => {
    render(
      <ImportantNotes title="Fees">
        <ul>
          <li>Platform fee: 0.1%</li>
          <li>Network fee: varies</li>
        </ul>
      </ImportantNotes>,
    );
    expect(screen.getByText("Platform fee: 0.1%")).toBeInTheDocument();
    expect(screen.getByText("Network fee: varies")).toBeInTheDocument();
  });
});
