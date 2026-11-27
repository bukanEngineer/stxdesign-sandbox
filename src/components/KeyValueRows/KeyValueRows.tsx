import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
import { Tooltip } from "../Tooltip/Tooltip";
import { useOptionalToast } from "../Toast/Toast";
import "./KeyValueRows.css";

export type KeyValueItem = {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Tooltip text shown from an info icon beside the label */
  info?: React.ReactNode;
  /** Adds a copy button that copies this string, e.g. an address or reference */
  copyable?: string;
  /** Bold label and value, e.g. a total */
  emphasis?: boolean;
  /** Secondary text under the value */
  helper?: React.ReactNode;
  /** React key; defaults to the label when it is a string */
  id?: string;
};

export type KeyValueRowsLayout = "inline" | "stacked" | "grid";

export type KeyValueRowsProps = Omit<React.ComponentProps<"dl">, "children"> & {
  items: KeyValueItem[];
  /**
   * `inline`: label left, value right. `stacked`: label above value (narrow
   * panels, long values such as addresses). `grid`: two columns of stacked
   * pairs that collapse to one column below 480px of container width.
   */
  layout?: KeyValueRowsLayout;
  /** Hairline between rows */
  dividers?: boolean;
  /** `compact` tightens the gap between rows from 12px to 8px */
  size?: "default" | "compact";
};

/**
 * Label / value list for record details, review and confirmation screens and
 * receipts. Renders a semantic `<dl>`.
 *
 *   <KeyValueRows
 *     items={[
 *       { label: "Recipient", value: "Priya Nair" },
 *       { label: "Wallet address", value: "0x12…ab", copyable: "0x12ab…" },
 *       { label: "Total", value: "1,000.00 XSGD", emphasis: true },
 *     ]}
 *   />
 */
export function KeyValueRows({
  items,
  layout = "inline",
  dividers = false,
  size = "default",
  className,
  ...rest
}: KeyValueRowsProps) {
  return (
    <dl
      data-layout={layout}
      data-size={size}
      data-dividers={dividers || undefined}
      className={cn("kv-rows", className)}
      {...rest}
    >
      {items.map((item, i) => (
        <div
          key={item.id ?? (typeof item.label === "string" ? item.label : i)}
          className="kv-rows__row"
          data-emphasis={item.emphasis || undefined}
        >
          <dt className="kv-rows__label">
            {item.label}
            {item.info != null && <InfoTip text={item.info} />}
          </dt>
          <dd className="kv-rows__value">
            <span className="kv-rows__value-line">
              <span className="kv-rows__value-text">{item.value}</span>
              {item.copyable != null && (
                <CopyButton value={item.copyable} label={typeof item.label === "string" ? item.label : undefined} />
              )}
            </span>
            {item.helper != null && <span className="kv-rows__helper">{item.helper}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function InfoTip({ text }: { text: React.ReactNode }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        className="kv-rows__info"
        aria-label={typeof text === "string" ? text : "More information"}
        render={<button type="button" />}
      >
        <Icon name="info" size={16} />
      </Tooltip.Trigger>
      <Tooltip.Popup side="top">{text}</Tooltip.Popup>
    </Tooltip.Root>
  );
}

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toast = useOptionalToast();
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return; /* clipboard unavailable */
    }
    setCopied(true);
    toast?.add({ tone: "positive", description: "Copied" });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <IconButton
      className="kv-rows__copy"
      icon={copied ? "check" : "content_copy"}
      label={copied ? "Copied" : label ? `Copy ${label.toLowerCase()}` : "Copy"}
      variant="tertiary"
      size="xs"
      touchTarget
      onClick={copy}
    />
  );
}
