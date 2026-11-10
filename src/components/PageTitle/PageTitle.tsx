import React from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "../IconButton/IconButton";
import { resolveIcon, type IconSource } from "../Icon/Icon";
import "./PageTitle.css";

export type PageTitleProps = Omit<React.ComponentProps<"header">, "title"> & {
  /** Page heading — string or ReactNode (e.g. asset mark + name) */
  title: React.ReactNode;
  /** Subtitle text */
  subtitle?: React.ReactNode;
  /** Breadcrumb element */
  breadcrumb?: React.ReactNode;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Icon before the title: an icon name, or your own element */
  icon?: IconSource;
  /** Shows a back button before the title and calls this when clicked */
  onBack?: () => void;
  /** Accessible label for the back button */
  backLabel?: string;
};

/**
 * Page header with optional breadcrumb, subtitle and action cluster.
 *
 *   <PageTitle
 *     title="Transfers"
 *     subtitle="Last 30 days"
 *     actions={<Button>Export</Button>}
 *   />
 */
export function PageTitle({
  title,
  subtitle,
  breadcrumb,
  actions,
  icon,
  onBack,
  backLabel = "Back",
  className,
  ref,
  ...rest
}: PageTitleProps) {
  return (
    <header ref={ref} className={cn("page-title", className)} {...rest}>
      <div className="page-title__head">
        {breadcrumb}
        <div className="page-title__row">
          {onBack && (
            <IconButton
              icon="chevron_left"
              variant="tertiary"
              size="sm"
              label={backLabel}
              onClick={onBack}
              className="page-title__back"
            />
          )}
          <h1 className="page-title__h1">
            {icon != null && (
              <span className="page-title__icon" aria-hidden="true">
                {resolveIcon(icon)}
              </span>
            )}
            {title}
          </h1>
        </div>
        {subtitle != null && <p className="page-title__sub">{subtitle}</p>}
      </div>
      {actions != null && (
        <div className="page-title__actions" role="group" aria-label="Page actions">
          {actions}
        </div>
      )}
    </header>
  );
}
