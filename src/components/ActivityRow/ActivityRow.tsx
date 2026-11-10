import React from "react";
import { cn } from "../../lib/cn";
import { resolveIcon, type IconSource } from "../Icon/Icon";
import "./ActivityRow.css";

export type ActivityAmountTone = "positive" | "negative" | "neutral";

export type ActivityRowProps = Omit<React.ComponentProps<"li">, "title"> & {
  /** Icon name or element shown in the round badge */
  icon?: IconSource;
  /** Bold title, e.g. "Transfer In" */
  title: React.ReactNode;
  /** Grey status text, e.g. "Completed" */
  status?: React.ReactNode;
  /** Grey date text */
  date?: React.ReactNode;
  /** Amount on the right, e.g. "+S$1,200.00" */
  amount?: React.ReactNode;
  /** Amount colour: positive is green, negative is red, neutral is default text */
  amountTone?: ActivityAmountTone;
  /** Grey text under the amount, e.g. a fiat value */
  amountSub?: React.ReactNode;
};

/**
 * One row of a recent-activity list. Render inside `<List>`.
 *
 *   <List divided>
 *     <ActivityRow icon="south_west" title="Transfer In" status="Completed" date="3 Nov" amount="+S$1,200.00" amountTone="positive" />
 *   </List>
 */
export function ActivityRow({
  icon,
  title,
  status,
  date,
  amount,
  amountTone = "neutral",
  amountSub,
  className,
  ...props
}: ActivityRowProps) {
  const meta = [status, date].filter((v) => v != null && v !== "");
  return (
    <li className={cn("activity-row", className)} {...props}>
      {icon != null && (
        <span className="activity-row__icon" aria-hidden="true">
          {resolveIcon(icon)}
        </span>
      )}
      <div className="activity-row__main">
        <span className="activity-row__title">{title}</span>
        {meta.length > 0 && (
          <span className="activity-row__meta">
            {meta.map((m, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="activity-row__dot" aria-hidden="true"> · </span>}
                <span>{m}</span>
              </React.Fragment>
            ))}
          </span>
        )}
      </div>
      {(amount != null || amountSub != null) && (
        <div className="activity-row__amount-wrap">
          {amount != null && (
            <span className="activity-row__amount" data-tone={amountTone}>
              {amount}
            </span>
          )}
          {amountSub != null && <span className="activity-row__amount-sub">{amountSub}</span>}
        </div>
      )}
    </li>
  );
}
