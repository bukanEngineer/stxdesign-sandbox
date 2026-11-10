import React from "react";
import { cn } from "../../lib/cn";
import "./Text.css";

export type TextVariant =
  | "display-large" | "display-medium" | "display-small"
  | "headline-large" | "headline-medium" | "headline-small"
  | "title-large" | "title-medium" | "title-small"
  | "label-large" | "label-medium" | "label-small"
  | "body-large" | "body-medium" | "body-small"
  | "body-bold-large" | "body-bold-medium" | "body-bold-small";

export type TextTone = "primary" | "secondary" | "inverse" | "positive" | "critical";

export type TextProps = React.ComponentProps<"span"> & {
  /** Type style from the typography scale */
  variant?: TextVariant;
  /** Text colour */
  tone?: TextTone;
  /** Element to render. Defaults to `span`. */
  as?: "span" | "p" | "small" | "div" | "h1" | "h2" | "h3" | "h4" | "label";
};

/**
 * Typed text. Sets the font and colour from tokens, so screens never need inline typography.
 *
 *   <Text variant="body-small" tone="secondary">Footnote</Text>
 */
export function Text({
  variant = "body-medium",
  tone = "primary",
  as: Component = "span",
  className,
  ...props
}: TextProps) {
  const Element = Component as React.ElementType;
  return <Element data-tone={tone} className={cn("text", variant, className)} {...props} />;
}

/** Small grey text, e.g. under action buttons or a status line. */
export function Caption(props: Omit<TextProps, "variant" | "tone">) {
  return <Text variant="body-small" tone="secondary" {...props} />;
}

/** Small grey paragraph for footnotes and legal lines. */
export function Footnote({ as = "p", ...props }: Omit<TextProps, "variant" | "tone">) {
  return <Text as={as} variant="body-small" tone="secondary" {...props} />;
}
