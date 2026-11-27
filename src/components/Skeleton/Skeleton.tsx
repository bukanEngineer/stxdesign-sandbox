import React from "react";
import { cn } from "../../lib/cn";
import "./Skeleton.css";

export type SkeletonShape = "text" | "rect" | "circle";

export type SkeletonProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** `text` is one line of body text, `rect` a block, `circle` an avatar or asset mark */
  shape?: SkeletonShape;
  /** CSS width, e.g. `120`, `"60%"`. Text defaults to 100%. */
  width?: number | string;
  /** CSS height. Text defaults to one line; a circle defaults to its width. */
  height?: number | string;
  /** Number of text lines; the last line is shorter. Only for `shape="text"`. */
  lines?: number;
};

/**
 * Placeholder shown while content loads. Decorative: put `aria-busy` on the
 * region that is loading, or pair it with a `Spinner` label. The shimmer stops
 * when the user prefers reduced motion.
 *
 *   <Skeleton width={160} />
 *   <Skeleton shape="circle" width={40} />
 *   <Skeleton shape="rect" height={200} />
 */
export function Skeleton({
  shape = "text",
  width,
  height,
  lines = 1,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const size = (v: number | string | undefined) => (typeof v === "number" ? `${v}px` : v);
  const boxStyle: React.CSSProperties = {
    width: size(width),
    height: size(height ?? (shape === "circle" ? width : undefined)),
    ...style,
  };

  if (shape === "text" && lines > 1) {
    return (
      <span className={cn("skeleton-lines", className)} aria-hidden="true" style={{ width: size(width), ...style }} {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className="skeleton"
            data-shape="text"
            style={{ height: size(height), width: i === lines - 1 ? "60%" : undefined }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={cn("skeleton", className)}
      data-shape={shape}
      aria-hidden="true"
      style={boxStyle}
      {...rest}
    />
  );
}
