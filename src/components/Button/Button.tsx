import React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { withClass } from "../../lib/cn";
import { buttonClasses, type ButtonVariant, type ButtonSize } from "./styles";
import "./Button.css";
import { resolveIcon, type IconSource } from "../Icon/Icon";

export type ButtonProps = BaseButton.Props & {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button height */
  size?: ButtonSize;
  /** Icon before the label: an icon name, or your own element */
  startIcon?: IconSource;
  /** Icon after the label: an icon name, or your own element */
  endIcon?: IconSource;
};

/** Button built on Base UI's Button. */
export function Button({
  variant = "primary",
  size = "lg",
  type = "button",
  startIcon,
  endIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      type={type}
      className={withClass(
        [buttonClasses.root, buttonClasses.variant[variant], buttonClasses.size[size]],
        className,
      )}
      {...props}
    >
      {startIcon != null && resolveIcon(startIcon)}
      {children}
      {endIcon != null && resolveIcon(endIcon)}
    </BaseButton>
  );
}
