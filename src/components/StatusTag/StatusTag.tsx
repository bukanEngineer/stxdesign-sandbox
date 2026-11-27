import React from "react";
import { cn } from "../../lib/cn";
import { Tag, type TagProps } from "../Tag/Tag";
import type { TagTone } from "../Tag/styles";

/** The shared status vocabulary for records: transactions, invites, members, keys. */
export type Status =
  | "completed"
  | "pending"
  | "processing"
  | "awaiting-approval"
  | "failed"
  | "cancelled"
  | "expired"
  | "active"
  | "invited"
  | "disabled";

/**
 * Tone for each status. Export it so tables, filters and legends colour a
 * status the same way the tag does.
 */
export const statusTone = {
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
} as const satisfies Record<Status, TagTone>;

/** Default English label for each status. */
export const statusLabel = {
  completed: "Completed",
  active: "Active",
  pending: "Pending",
  processing: "Processing",
  "awaiting-approval": "Awaiting approval",
  invited: "Invited",
  failed: "Failed",
  cancelled: "Cancelled",
  expired: "Expired",
  disabled: "Disabled",
} as const satisfies Record<Status, string>;

export type StatusTagProps = Omit<
  TagProps,
  "tone" | "variant" | "clickable" | "selected" | "onClick" | "removable" | "onRemove" | "children"
> & {
  status: Status;
  /** Overrides the default label, e.g. a translated string */
  label?: React.ReactNode;
};

/**
 * A `Tag` that picks its tone from a status, so every page shows a status the
 * same way.
 *
 *   <StatusTag status="pending" />
 *   <StatusTag status="failed" label="Rejected" />
 */
export function StatusTag({ status, label, size = "small", className, ...rest }: StatusTagProps) {
  return (
    <Tag
      tone={statusTone[status]}
      size={size}
      data-status={status}
      className={cn("status-tag", className)}
      {...rest}
    >
      {label ?? statusLabel[status]}
    </Tag>
  );
}
