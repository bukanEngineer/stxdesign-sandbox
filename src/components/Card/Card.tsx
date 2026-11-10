import React from "react";
import { Icon } from "../Icon/Icon";
import { cn } from "../../lib/cn";
import "./Card.css";

export type CardShadow = false | 1 | 2 | 3;

export type CardRadius = "md" | "lg";
export type CardPadding = "none" | "md" | "lg";

export type CardProps = React.ComponentProps<"section"> & {
  /** Shadow elevation (1–3), or `false` for none */
  shadow?: CardShadow;
  /** Corner radius: `md` (8px) for small cards, `lg` (12px) for larger section panels */
  radius?: CardRadius;
  /** Inner padding: `md` (20px, default), `lg` (24px) or `none` */
  padding?: CardPadding;
};

/** Surface container. Compose with `CardHeader` / `CardTitle` / `CardContent` / `CardFooter`. */
export function Card({
  shadow = false,
  radius = "md",
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <section
      data-shadow={shadow || undefined}
      data-radius={radius === "md" ? undefined : radius}
      data-padding={padding === "md" ? undefined : padding}
      className={cn("card", className)}
      {...props}
    />
  );
}

export type CardHeaderProps = React.ComponentProps<"div"> & {
  /** Controls on the right of the heading, e.g. a refresh button or a "View all" link */
  actions?: React.ReactNode;
};

export function CardHeader({ actions, className, children, ...props }: CardHeaderProps) {
  if (actions == null) {
    return (
      <div className={cn("card__header", className)} {...props}>
        {children}
      </div>
    );
  }
  return (
    <div className={cn("card__header", "card__header--with-actions", className)} {...props}>
      <div className="card__heading">{children}</div>
      <div className="card__actions">{actions}</div>
    </div>
  );
}

export type CardTitleProps = React.ComponentProps<"h3">;

export function CardTitle({ className, ...props }: CardTitleProps) {
  // Content comes from `children` via props; empty headings are a consumer mistake.
  // eslint-disable-next-line jsx-a11y/heading-has-content -- compound part
  return <h3 className={cn("card__title", className)} {...props} />;
}

export type CardDescriptionProps = React.ComponentProps<"p">;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn("card__description", className)} {...props} />;
}

export type CardContentProps = React.ComponentProps<"div">;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("card__content", className)} {...props} />;
}

export type CardFooterProps = React.ComponentProps<"div">;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn("card__footer", className)} {...props} />;
}

export type CardDetailRowProps = Omit<React.ComponentProps<"div">, "children"> & {
  label?: React.ReactNode;
  value?: React.ReactNode;
  /** Show an info icon beside the label or value */
  info?: boolean;
  /** Which side gets the info icon. `CardStatus` uses `"label"`; `CardSummary` uses `"value"`. */
  infoPlacement?: "label" | "value";
  /** Info icon size in px. `CardStatus` uses 16; `CardSummary` uses 18. */
  infoSize?: number;
  /** Secondary text under the value, e.g. "Fee for transactions of 10 XSGD or more" */
  helper?: React.ReactNode;
};

/**
 * Horizontal label / value row for detail cards (`CardStatus`, `CardSummary`).
 * Render inside a `<dl>`. Placement and size of the optional info icon stay
 * configurable so each card keeps its own look.
 */
export function CardDetailRow({
  label,
  value,
  info = false,
  infoPlacement = "label",
  infoSize = 16,
  helper,
  className,
  ...props
}: CardDetailRowProps) {
  const infoIcon = info ? (
    <Icon name="info" size={infoSize} className="card-detail-row__info" />
  ) : null;

  return (
    <div
      className={cn("card-detail-row", className)}
      data-info-placement={infoPlacement}
      data-has-helper={helper != null ? "" : undefined}
      {...props}
    >
      <dt className="card-detail-row__label">
        {label}
        {infoPlacement === "label" && infoIcon}
      </dt>
      <dd className="card-detail-row__value">
        {infoPlacement === "value" && infoIcon}
        {value}
        {helper != null && <span className="card-detail-row__helper">{helper}</span>}
      </dd>
    </div>
  );
}
