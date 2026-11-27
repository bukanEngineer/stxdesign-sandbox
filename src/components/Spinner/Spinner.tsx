import React from "react";
import { cn } from "../../lib/cn";
import "./Spinner.css";

export type SpinnerSize = "sm" | "md" | "lg";

export type SpinnerProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** `sm` 16px (inside buttons), `md` 24px, `lg` 40px (a loading panel) */
  size?: SpinnerSize;
  /** Accessible name read by screen readers. Pass `null` when a parent already announces loading. */
  label?: string | null;
};

/**
 * Indeterminate loading indicator. Inherits `color`, so it matches the text
 * around it. Rotation slows when the user prefers reduced motion.
 *
 *   <Spinner />
 *   <Spinner size="lg" label="Loading QR code" />
 */
export function Spinner({ size = "md", label = "Loading", className, ...rest }: SpinnerProps) {
  const a11y =
    label == null ? { "aria-hidden": true as const } : { role: "status", "aria-label": label };
  return (
    <span data-size={size} className={cn("spinner", className)} {...a11y} {...rest}>
      <svg className="spinner__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="spinner__track" cx="12" cy="12" r="10" strokeWidth="2.5" />
        <circle className="spinner__arc" cx="12" cy="12" r="10" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
