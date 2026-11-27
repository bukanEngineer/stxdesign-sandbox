import React, { useState } from "react";
import { cn } from "../../lib/cn";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Input } from "../Input/Input";
import { Select } from "../Select/Select";
import { MultiSelect } from "../MultiSelect/MultiSelect";
import { DateInput } from "../DateInput/DateInput";
import { LinkButton } from "../LinkButton/LinkButton";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";
import { Tag } from "../Tag/Tag";
import { BottomSheet } from "../BottomSheet/BottomSheet";
import "./FilterBar.css";

export type FilterBarOption = { value: string; label: string };

type FilterBase = {
  id: string;
  /** Accessible name and placeholder, e.g. "Status" */
  label: string;
  options: FilterBarOption[];
};

/** Pick one value. `null` means no filter is applied. */
export type FilterBarSingleFilter = FilterBase & {
  multiple?: false;
  value: string | null;
  onChange: (value: string | null) => void;
};

/** Pick any number of values. An empty array means no filter is applied. */
export type FilterBarMultipleFilter = FilterBase & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
};

export type FilterBarFilter = FilterBarSingleFilter | FilterBarMultipleFilter;

export type FilterBarDateRange = { start?: string; end?: string };

/** Quick ranges ending today: the last 7, 30 or 90 days, or this calendar month so far. */
export type FilterBarDatePreset = "7d" | "30d" | "90d" | "month";

export type FilterBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  search?: {
    value: string;
    onChange: (value: string) => void;
    /** Also the accessible name. Default "Search". */
    placeholder?: string;
  };
  /** Small selects; `multiple: true` filters use a multi-select */
  filters?: FilterBarFilter[];
  /** ISO dates (`YYYY-MM-DD`), as `DateInput` uses */
  dateRange?: {
    start?: string;
    end?: string;
    onChange: (range: FilterBarDateRange) => void;
    placeholder?: string;
    /** Quick ranges shown as chips beside the date input */
    presets?: FilterBarDatePreset[];
    /** "Today" for the presets, as an ISO date. Defaults to the viewer's local date. */
    today?: string;
  };
  /**
   * Shows "Clear filters" while any search, filter or date is set. Reset your
   * own state in it.
   */
  onClear?: () => void;
  clearLabel?: React.ReactNode;
  /** "24 results". Announced politely when it changes. */
  resultCount?: React.ReactNode;
  /** Right-aligned controls, e.g. Export CSV */
  actions?: React.ReactNode;
  /**
   * Narrow screens. `wrap` (default): controls wrap onto more rows. `sheet`:
   * search stays inline and the filters and dates move into a bottom sheet
   * opened by a "Filters" button, at widths matching `collapseQuery`.
   */
  collapse?: "wrap" | "sheet";
  /** When `collapse="sheet"` applies. Default `(max-width: 767px)`. */
  collapseQuery?: string;
};

export const FILTER_BAR_COLLAPSE_QUERY = "(max-width: 767px)";

export const filterBarPresetLabel = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  month: "This month",
} as const satisfies Record<FilterBarDatePreset, string>;

/**
 * The row above a table: search, filters, a date range with quick presets, a
 * clear action, a result count and actions. Wraps as the container narrows,
 * or collapses into a bottom sheet on phones with `collapse="sheet"`.
 *
 *   <FilterBar
 *     search={{ value: q, onChange: setQ, placeholder: "Search by payout ID" }}
 *     filters={[
 *       { id: "status", label: "Status", options, value: status, onChange: setStatus },
 *       { id: "asset", label: "Asset", options: assets, multiple: true, value: picked, onChange: setPicked },
 *     ]}
 *     dateRange={{ ...range, onChange: setRange, presets: ["7d", "30d", "month"] }}
 *     onClear={clearAll}
 *     resultCount={`${rows.length} results`}
 *     collapse="sheet"
 *   />
 */
export function FilterBar({
  search,
  filters = [],
  dateRange,
  onClear,
  clearLabel = "Clear filters",
  resultCount,
  actions,
  collapse = "wrap",
  collapseQuery = FILTER_BAR_COLLAPSE_QUERY,
  className,
  ...rest
}: FilterBarProps) {
  // "not all" never matches, so `wrap` does not depend on the viewport.
  const collapsed = useMediaQuery(collapse === "sheet" ? collapseQuery : "not all");
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeFilters =
    filters.filter(isFilterActive).length + (dateRange?.start || dateRange?.end ? 1 : 0);
  const active = !!search?.value || activeFilters > 0;
  const clear =
    onClear && active ? (
      <LinkButton className="filter-bar__clear" onClick={onClear}>
        {clearLabel}
      </LinkButton>
    ) : null;

  const searchControl = search && (
    <div className="filter-bar__search">
      <Input
        type="search"
        size="small"
        placeholder={search.placeholder ?? "Search"}
        aria-label={search.placeholder ?? "Search"}
        value={search.value}
        onValueChange={search.onChange}
      />
    </div>
  );

  const filterControls = filters.map((filter) => (
    <div key={filter.id} className="filter-bar__filter" data-multiple={filter.multiple || undefined}>
      {collapsed && <span className="filter-bar__sheet-label" aria-hidden="true">{filter.label}</span>}
      {filter.multiple ? <MultiFilter filter={filter} /> : <SingleFilter filter={filter} />}
    </div>
  ));

  const dateControl = dateRange && (
    <div className="filter-bar__dates">
      {collapsed && <span className="filter-bar__sheet-label" aria-hidden="true">Date</span>}
      <div className="filter-bar__date">
        <DateInput
          size="small"
          range
          placeholder={dateRange.placeholder ?? "Date range"}
          startValue={dateRange.start}
          endValue={dateRange.end}
          onRangeChange={dateRange.onChange}
        />
      </div>
      {dateRange.presets && dateRange.presets.length > 0 && (
        <DatePresets
          presets={dateRange.presets}
          today={dateRange.today ?? localToday()}
          start={dateRange.start}
          end={dateRange.end}
          onChange={dateRange.onChange}
        />
      )}
    </div>
  );

  const end =
    resultCount != null || actions != null ? (
      <div className="filter-bar__end">
        {resultCount != null && (
          <span className="filter-bar__count" aria-live="polite">
            {resultCount}
          </span>
        )}
        {actions}
      </div>
    ) : null;

  if (collapsed) {
    const hasSheetContent = filters.length > 0 || dateRange != null;
    return (
      <div
        role="group"
        aria-label="Filters"
        data-collapsed=""
        className={cn("filter-bar", className)}
        {...rest}
      >
        <div className="filter-bar__controls">
          {searchControl}
          {hasSheetContent && (
            <Button
              variant="secondary"
              size="sm"
              startIcon="tune"
              className="filter-bar__open"
              aria-label={activeFilters > 0 ? `Filters, ${activeFilters} applied` : "Filters"}
              onClick={() => setSheetOpen(true)}
            >
              Filters
              {activeFilters > 0 && (
                <Badge size="sm" aria-hidden="true">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          )}
        </div>
        {end}
        {hasSheetContent && (
          <BottomSheet.Root open={sheetOpen} onOpenChange={setSheetOpen}>
            <BottomSheet.Popup className="filter-bar__sheet">
              <BottomSheet.Header>
                <BottomSheet.Title>Filters</BottomSheet.Title>
                <BottomSheet.Close />
              </BottomSheet.Header>
              <BottomSheet.Body>
                <div className="filter-bar__sheet-body">
                  {filterControls}
                  {dateControl}
                </div>
              </BottomSheet.Body>
              <BottomSheet.Footer className="filter-bar__sheet-foot">
                {onClear && (
                  <Button variant="secondary" fullWidth disabled={!active} onClick={onClear}>
                    {clearLabel}
                  </Button>
                )}
                <BottomSheet.Close render={<Button fullWidth />}>
                  {typeof resultCount === "string" ? `Show ${resultCount}` : "Done"}
                </BottomSheet.Close>
              </BottomSheet.Footer>
            </BottomSheet.Popup>
          </BottomSheet.Root>
        )}
      </div>
    );
  }

  return (
    <div role="group" aria-label="Filters" className={cn("filter-bar", className)} {...rest}>
      <div className="filter-bar__controls">
        {searchControl}
        {filterControls}
        {dateControl}
        {clear}
      </div>
      {end}
    </div>
  );
}

function isFilterActive(filter: FilterBarFilter) {
  return filter.multiple ? filter.value.length > 0 : filter.value != null && filter.value !== "";
}

function SingleFilter({ filter }: { filter: FilterBarSingleFilter }) {
  return (
    <Select.Root
      items={filter.options}
      value={filter.value}
      onValueChange={(value) => filter.onChange(value as string | null)}
    >
      <Select.Trigger size="small" aria-label={filter.label}>
        <Select.Value placeholder={filter.label} />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popup>
        <Select.List>
          {filter.options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.List>
      </Select.Popup>
    </Select.Root>
  );
}

/**
 * A multi-select that stays one row high: the selection is summarised
 * ("XSGD, XUSD" or "XSGD +2") instead of shown as chips. Typing filters the options.
 */
function MultiFilter({ filter }: { filter: FilterBarMultipleFilter }) {
  const labelFor = (value: string) => filter.options.find((o) => o.value === value)?.label ?? value;
  const summary = summarise(filter.value.map(labelFor));
  return (
    <MultiSelect.Root
      items={filter.options.map((o) => o.value)}
      value={filter.value}
      onValueChange={(value) => filter.onChange(value as string[])}
      itemToStringLabel={labelFor}
      isItemEqualToValue={(a, b) => a === b}
    >
      <MultiSelect.InputGroup
        className="filter-bar__multi"
        data-has-value={filter.value.length > 0 || undefined}
      >
        <MultiSelect.Input
          placeholder={summary ?? filter.label}
          aria-label={filter.label}
          aria-description={summary ? `Selected: ${filter.value.map(labelFor).join(", ")}` : undefined}
        />
        {filter.value.length > 0 && <MultiSelect.Clear aria-label={`Clear ${filter.label}`} />}
        <MultiSelect.Trigger aria-label={`Open ${filter.label}`} />
      </MultiSelect.InputGroup>
      <MultiSelect.Popup>
        <MultiSelect.Empty>No matches</MultiSelect.Empty>
        <MultiSelect.List>
          {(value: string) => (
            <MultiSelect.Item key={value} value={value}>
              {labelFor(value)}
            </MultiSelect.Item>
          )}
        </MultiSelect.List>
      </MultiSelect.Popup>
    </MultiSelect.Root>
  );
}

function summarise(labels: string[]) {
  if (labels.length === 0) return null;
  if (labels.length <= 2) return labels.join(", ");
  return `${labels[0]} +${labels.length - 1}`;
}

function DatePresets({
  presets,
  today,
  start,
  end,
  onChange,
}: {
  presets: FilterBarDatePreset[];
  today: string;
  start?: string;
  end?: string;
  onChange: (range: FilterBarDateRange) => void;
}) {
  return (
    <div role="group" aria-label="Date presets" className="filter-bar__presets">
      {presets.map((preset) => {
        const range = presetRange(preset, today);
        const selected = range.start === start && range.end === end;
        return (
          <Tag
            key={preset}
            clickable
            size="small"
            selected={selected}
            onClick={() => onChange(selected ? {} : range)}
          >
            {filterBarPresetLabel[preset]}
          </Tag>
        );
      })}
    </div>
  );
}

/** The ISO date range a preset covers, ending on `today` (inclusive). */
export function presetRange(preset: FilterBarDatePreset, today: string): Required<FilterBarDateRange> {
  const [y, m, d] = today.split("-").map(Number);
  if (preset === "month") return { start: isoDate(new Date(y, m - 1, 1)), end: today };
  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  return { start: isoDate(new Date(y, m - 1, d - (days - 1))), end: today };
}

function isoDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function localToday() {
  return isoDate(new Date());
}
