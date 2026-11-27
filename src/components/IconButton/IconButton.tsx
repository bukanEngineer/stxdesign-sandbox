import React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { withClass } from "../../lib/cn";
import {
  iconButtonClasses,
  type IconButtonVariant,
  type IconButtonShape,
  type IconButtonSize,
} from "./styles";
import "./IconButton.css";
import { resolveIcon, type IconSource } from "../Icon/Icon";

export type IconButtonProps = Omit<BaseButton.Props, "children"> & {
  /** Icon name, or your own icon element */
  icon: IconSource;
  /** Visual style variant */
  variant?: IconButtonVariant;
  /** Button shape */
  shape?: IconButtonShape;
  /** Visual size: `xs` 24px / 16px glyph, `sm` 36px / 20px, `lg` 48px / 24px. */
  size?: IconButtonSize;
  /** Accessible label (required for icon-only buttons) */
  label: string;
  /**
   * Extend the tap area to 48x48 without changing the visual size or layout.
   * Use with `xs` / `sm`; `lg` is already 48px. Leave enough row and column
   * spacing for targets to stay separate; the expanded area takes no layout space.
   */
  touchTarget?: boolean;
  /** Makes the button a toggle: sets `aria-pressed` and the active style. Omit for a plain button. */
  pressed?: boolean;
};

/**
 * Icon-only button built on Base UI `Button`. Kept as a separate export from
 * `Button` because it requires an accessible `label` and shape sizing.
 *
 *   <IconButton icon="close" label="Close" variant="tertiary" />
 */
export function IconButton({
  icon,
  variant = "tertiary",
  shape = "circle",
  size = "lg",
  label,
  touchTarget = false,
  pressed,
  type = "button",
  className,
  ...props
}: IconButtonProps) {
  return (
    <BaseButton
      type={type}
      aria-label={label}
      aria-pressed={pressed}
      className={withClass(
        [
          iconButtonClasses.root,
          iconButtonClasses.variant[variant],
          iconButtonClasses.shape[shape],
          iconButtonClasses.size[size],
          touchTarget && iconButtonClasses.touchTarget,
        ],
        className,
      )}
      {...props}
    >
      {resolveIcon(icon)}
    </BaseButton>
  );
}
