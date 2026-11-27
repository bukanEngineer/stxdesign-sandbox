import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar, presetRange } from "./FilterBar";
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

  describe("multiple filters", () => {
    const assets = [
      { value: "XSGD", label: "XSGD" },
      { value: "XUSD", label: "XUSD" },
      { value: "XIDR", label: "XIDR" },
    ];

    it("renders a labelled combobox that summarises the selection", () => {
      render(
        <FilterBar
          filters={[{ id: "asset", label: "Asset", options: assets, multiple: true, value: ["XSGD", "XUSD", "XIDR"], onChange: () => {} }]}
        />,
      );
      const input = screen.getByRole("combobox", { name: "Asset" });
      expect(input).toHaveAttribute("placeholder", "XSGD +2");
    });

    it("adds a value when an option is picked", async () => {
      const onChange = vi.fn();
      render(<FilterBar filters={[{ id: "asset", label: "Asset", options: assets, multiple: true, value: ["XSGD"], onChange }]} />);
      await userEvent.click(screen.getByRole("button", { name: "Open Asset" }));
      await userEvent.click(await screen.findByRole("option", { name: "XUSD" }));
      expect(onChange).toHaveBeenLastCalledWith(["XSGD", "XUSD"]);
    });

    it("counts as active only when something is selected", () => {
      const filter = (value: string[]) => [{ id: "a", label: "Asset", options: assets, multiple: true as const, value, onChange: () => {} }];
      const { rerender } = render(<FilterBar onClear={() => {}} filters={filter([])} />);
      expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
      rerender(<FilterBar onClear={() => {}} filters={filter(["XIDR"])} />);
      expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
    });
  });

  describe("date presets", () => {
    it("computes ranges that end today", () => {
      expect(presetRange("7d", "2026-11-27")).toEqual({ start: "2026-11-21", end: "2026-11-27" });
      expect(presetRange("30d", "2026-03-01")).toEqual({ start: "2026-01-31", end: "2026-03-01" });
      expect(presetRange("90d", "2026-11-27")).toEqual({ start: "2026-08-30", end: "2026-11-27" });
      expect(presetRange("month", "2026-11-27")).toEqual({ start: "2026-11-01", end: "2026-11-27" });
    });

    it("applies a preset, marks it selected and clears it on a second press", async () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <FilterBar dateRange={{ onChange, presets: ["7d", "month"], today: "2026-11-27" }} />,
      );
      await userEvent.click(screen.getByRole("button", { name: "Last 7 days" }));
      expect(onChange).toHaveBeenLastCalledWith({ start: "2026-11-21", end: "2026-11-27" });

      rerender(
        <FilterBar dateRange={{ start: "2026-11-21", end: "2026-11-27", onChange, presets: ["7d", "month"], today: "2026-11-27" }} />,
      );
      const chip = screen.getByRole("button", { name: "Last 7 days" });
      expect(chip).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "This month" })).toHaveAttribute("aria-pressed", "false");
      await userEvent.click(chip);
      expect(onChange).toHaveBeenLastCalledWith({});
    });
  });

  describe("collapse=\"sheet\"", () => {
    const props = {
      collapse: "sheet" as const,
      collapseQuery: "all",
      search: { value: "", onChange: () => {} },
      filters: [{ id: "status", label: "Status", options, value: "pending", onChange: () => {} }],
      dateRange: { start: "2026-11-01", onChange: () => {} },
      onClear: () => {},
      resultCount: "24 results",
    };

    it("keeps wrap layout when matchMedia is unavailable", () => {
      render(<FilterBar {...props} />);
      expect(screen.getByRole("combobox", { name: "Status" })).toBeInTheDocument();
    });

    describe("on a matching viewport", () => {
      const original = window.matchMedia;
      beforeEach(() => {
        window.matchMedia = ((query: string) => ({
          matches: query === "all",
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        })) as unknown as typeof window.matchMedia;
      });
      afterEach(() => {
        window.matchMedia = original;
      });

      it("shows search inline and moves filters behind a Filters button with the active count", () => {
        render(<FilterBar {...props} />);
        expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
        expect(screen.queryByRole("combobox", { name: "Status" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Filters, 2 applied" })).toBeInTheDocument();
      });

      it("opens a sheet with the filters, clear and show-results actions", async () => {
        const onClear = vi.fn();
        render(<FilterBar {...props} onClear={onClear} />);
        await userEvent.click(screen.getByRole("button", { name: "Filters, 2 applied" }));
        const sheet = await screen.findByRole("dialog", { name: "Filters" });
        expect(within(sheet).getByRole("combobox", { name: "Status" })).toBeInTheDocument();
        await userEvent.click(within(sheet).getByRole("button", { name: "Clear filters" }));
        expect(onClear).toHaveBeenCalledTimes(1);
        expect(within(sheet).getByRole("button", { name: "Show 24 results" })).toBeInTheDocument();
      });
    });
  });
});
