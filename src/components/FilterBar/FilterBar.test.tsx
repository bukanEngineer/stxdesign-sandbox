import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "./FilterBar";
import { assertClassNameForwarding, assertPropSpreading } from "../../test-utils";

const options = [
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
];

describe("FilterBar", () => {
  it("renders a labelled search, filter and date range", () => {
    render(
      <FilterBar
        search={{ value: "", onChange: () => {}, placeholder: "Search by payout ID" }}
        filters={[{ id: "status", label: "Status", options, value: null, onChange: () => {} }]}
        dateRange={{ onChange: () => {} }}
      />,
    );
    expect(screen.getByRole("group", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search by payout ID" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Status" })).toBeInTheDocument();
  });

  it("calls the search handler as the user types", async () => {
    const onChange = vi.fn();
    render(<FilterBar search={{ value: "", onChange }} />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Search" }), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("shows Clear filters only while something is set", async () => {
    const onClear = vi.fn();
    const { rerender } = render(
      <FilterBar onClear={onClear} filters={[{ id: "s", label: "Status", options, value: null, onChange: () => {} }]} />,
    );
    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();

    rerender(
      <FilterBar onClear={onClear} filters={[{ id: "s", label: "Status", options, value: "pending", onChange: () => {} }]} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("treats a date as an active filter", () => {
    render(<FilterBar onClear={() => {}} dateRange={{ start: "2026-11-01", onChange: () => {} }} />);
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
  });

  it("renders the result count in a live region and the actions", () => {
    render(<FilterBar resultCount="24 results" actions={<button type="button">Export CSV</button>} />);
    expect(screen.getByText("24 results")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeInTheDocument();
  });

  it("forwards className and HTML attributes", () => {
    assertClassNameForwarding(FilterBar);
    assertPropSpreading(FilterBar);
  });
});
