import React from "react";
import { cn } from "../../lib/cn";
import "./ImportantNotes.css";

export type ImportantNotesProps = Omit<React.ComponentProps<"div">, "title"> & {
  /**
   * Title above the description. Defaults to `"Important Notes:"`.
   * Pass `null` to hide the title.
   */
  title?: React.ReactNode | null;
};

/**
 * Contextual callout with a left accent line — for process constraints and
 * caveats, not errors or success feedback.
 *
 *   <ImportantNotes>
 *     Our verification process may take up to 1 business day.
 *   </ImportantNotes>
 */
export function ImportantNotes({
  title = "Important Notes:",
  children,
  className,
  ...rest
}: ImportantNotesProps) {
  return (
    <div role="note" className={cn("important-notes", className)} {...rest}>
      <span className="important-notes__bar" aria-hidden="true" />
      <div className="important-notes__content">
        {title != null && <p className="important-notes__title">{title}</p>}
        {children != null &&
          (typeof children === "string" || typeof children === "number" ? (
            <p className="important-notes__body">{children}</p>
          ) : (
            <div className="important-notes__body">{children}</div>
          ))}
      </div>
    </div>
  );
}
