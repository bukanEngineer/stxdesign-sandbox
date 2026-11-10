import React from "react";
import { IconButton, type IconButtonProps } from "../IconButton/IconButton";
import { cn } from "../../lib/cn";
import "./ActionButton.css";

export type ActionButtonProps = Omit<IconButtonProps, "label" | "children"> & {
  /** Caption under the button. Also the accessible name. */
  label: string;
};

/**
 * Icon button with a caption underneath, for quick actions such as Transfer In / Transfer Out.
 *
 *   <ActionButton icon="add" label="Transfer In" onClick={...} />
 */
export function ActionButton({
  label,
  variant = "secondary",
  className,
  wrapperClassName,
  ...props
}: ActionButtonProps & { wrapperClassName?: string }) {
  return (
    <span className={cn("action-button", wrapperClassName)}>
      <IconButton label={label} variant={variant} className={className} {...props} />
      <span className="action-button__caption" aria-hidden="true">
        {label}
      </span>
    </span>
  );
}
