import React from "react";
import { cn } from "../../lib/cn";
import { Input } from "../Input/Input";
import { Select } from "../Select/Select";
import { DateInput } from "../DateInput/DateInput";
import { LinkButton } from "../LinkButton/LinkButton";
import "./FilterBar.css";

export type FilterBarOption = { value: string; label: string };

export type FilterBarFilter = {
  id: string;
  /** Accessible name and placeholder, e.g. "Status" */
  label: string;
  options: FilterBarOption[];
  /** `null` means no filter is applied */
  value: string | null;
  onChange: (value: string | null) => void;
};

export type FilterBarDateRange = { start?: string; end?: string };

export type FilterBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  search?: {
    value: string;
    onChange: (value: string) => void;
    /** Also the accessible name. Default "Search". */
    placeholder?: string;
  };
  /** Single-choice filters rendered as small selects */
  filters?: FilterBarFilter[];
  /** ISO dates, as `DateInput` uses */
  dateRange?: {
    start?: string;
    end?: string;
    onChange: (range: FilterBarDateRange) => void;
    placeholder?: string;
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
};

/**
 * The row above a table: search, filters, a date range, a clear action, a
 * result count and actions. Wraps onto more lines as the container narrows.
 *
 *   <FilterBar
 *     search={{ value: q, onChange: setQ, placeholder: "Search by payout ID" }}
 *     filters={[{ id: "status", label: "Status", options, value: status, onChange: setStatus }]}
 *     dateRange={{ ...range, onChange: setRange }}
 *     onClear={clearAll}
 *     resultCount={`${rows.length} results`}
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
  className,
  ...rest
}: FilterBarProps) {
  const active =
    !!search?.value ||
    filters.some((f) => f.value != null && f.value !== "") ||
    !!dateRange?.start ||
    !!dateRange?.end;

  return (
    <div role="group" aria-label="Filters" className={cn("filter-bar", className)} {...rest}>
      <div className="filter-bar__controls">
        {search && (
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
        )}
        {filters.map((filter) => (
          <div key={filter.id} className="filter-bar__filter">
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
          </div>
        ))}
        {dateRange && (
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
        )}
        {onClear && active && (
          <LinkButton className="filter-bar__clear" onClick={onClear}>
            {clearLabel}
          </LinkButton>
        )}
      </div>
      {(resultCount != null || actions != null) && (
        <div className="filter-bar__end">
          {resultCount != null && (
            <span className="filter-bar__count" aria-live="polite">
              {resultCount}
            </span>
          )}
          {actions}
        </div>
      )}
    </div>
  );
}
