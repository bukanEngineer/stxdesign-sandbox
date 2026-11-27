import React from "react";
import { cn } from "../../lib/cn";
import "./StatusIcon.css";
import { Icon, type IconName } from "../Icon/Icon";

export type StatusIconVariant = "success" | "needApproval" | "error" | "warning";

export type StatusIconProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Visual status */
  variant?: StatusIconVariant;
  /** Icon name override */
  icon?: IconName;
  /** Diameter in px */
  size?: number;
};

const variantDefaults = {
  success: { icon: "check", label: "Success" },
  needApproval: { icon: "hourglass_top", label: "Needs approval" },
  error: { icon: "close", label: "Error" },
  warning: { icon: "schedule", label: "Warning" },
} satisfies Record<StatusIconVariant, { icon: IconName; label: string }>;

/**
 * Circular status glyph used in cards and confirmation screens.
 *
 *   <StatusIcon variant="success" size={36} />
 */
export function StatusIcon({
  variant = "success",
  icon,
  size = 36,
  className,
  style,
  "aria-label": ariaLabel,
  ...rest
}: StatusIconProps) {
  const defaults = variantDefaults[variant];
  return (
    <span
      role="img"
      aria-label={ariaLabel ?? defaults.label}
      data-variant={variant}
      className={cn("status-icon", `status-icon--${variant}`, className)}
      style={{ ["--status-icon-size" as string]: `${size}px`, ...style }}
      {...rest}
    >
      <Icon name={icon ?? defaults.icon} />
    </span>
  );
}
