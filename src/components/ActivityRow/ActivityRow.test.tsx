import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActivityRow } from "./ActivityRow";
import { List } from "../List/List";

const wrap = (ui: React.ReactElement) => render(<List>{ui}</List>);

describe("ActivityRow", () => {
  it("renders title, status, date and amount", () => {
    wrap(<ActivityRow icon="add" title="Transfer In" status="Completed" date="3 Nov" amount="+S$10.00" />);
    expect(screen.getByText("Transfer In")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("3 Nov")).toBeInTheDocument();
    expect(screen.getByText("+S$10.00")).toBeInTheDocument();
  });

  it("applies the amount tone", () => {
    wrap(<ActivityRow title="In" amount="+1" amountTone="positive" />);
    expect(screen.getByText("+1")).toHaveAttribute("data-tone", "positive");
  });

  it("defaults the amount tone to neutral", () => {
    wrap(<ActivityRow title="Out" amount="-1" />);
    expect(screen.getByText("-1")).toHaveAttribute("data-tone", "neutral");
  });

  it("renders as a list item inside List", () => {
    wrap(<ActivityRow title="Row" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("forwards className", () => {
    wrap(<ActivityRow title="x" className="custom" />);
    expect(screen.getByRole("listitem")).toHaveClass("custom");
  });
});
