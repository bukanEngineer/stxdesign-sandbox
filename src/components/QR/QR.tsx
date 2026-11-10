import React, { useMemo } from "react";
import { encode } from "uqr";
import { cn } from "../../lib/cn";
import "./QR.css";

export type QRProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Value to encode in the QR code */
  value: string;
  /** QR code size in pixels */
  size?: number;
  /** Label text below the code */
  label?: React.ReactNode;
  /** Sub-label text */
  sub?: React.ReactNode;
  /** Mark shown in the centre of the code (e.g. a chain logo). Raises error correction to H. */
  logo?: React.ReactNode;
  /**
   * Render the code through a remote image service instead of locally.
   * Opt-in only: the encoded value is sent to whatever URL you return, so do not use
   * it for deposit addresses or other sensitive values.
   */
  urlBuilder?: (value: string, size: number) => string;
};

const QUIET_ZONE = 2;

/** Dark modules as one SVG path of unit squares, merging horizontal runs. */
function modulesToPath(data: boolean[][]) {
  let d = "";
  data.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x += 1;
        continue;
      }
      const start = x;
      while (x < row.length && row[x]) x += 1;
      d += `M${start + QUIET_ZONE} ${y + QUIET_ZONE}h${x - start}v1h${-(x - start)}z`;
    }
  });
  return d;
}

function LocalCode({ value, size, hasLogo, alt }: { value: string; size: number; hasLogo: boolean; alt: string }) {
  const { path, units } = useMemo(() => {
    const qr = encode(value, { ecc: hasLogo ? "H" : "M", border: 0 });
    return { path: modulesToPath(qr.data), units: qr.size + QUIET_ZONE * 2 };
  }, [value, hasLogo]);

  return (
    <svg
      className="qr__img"
      style={{ width: size, height: size }}
      viewBox={`0 0 ${units} ${units}`}
      role="img"
      aria-label={alt}
      shapeRendering="crispEdges"
    >
      <rect width={units} height={units} fill="#fff" />
      <path d={path} fill="#000" />
    </svg>
  );
}

/**
 * QR code. Rendered locally as inline SVG, so the value never leaves the browser.
 * Pass `logo` for a centre mark.
 */
export function QR({
  value,
  size = 200,
  label,
  sub,
  logo,
  urlBuilder,
  className,
  ...rest
}: QRProps) {
  const alt = typeof label === "string" ? label : "QR code";
  const logoSize = Math.round(size * 0.22);

  return (
    <div className={cn("qr", className)} {...rest}>
      <div className="qr__code" style={{ width: size, height: size }}>
        {urlBuilder ? (
          <img
            className="qr__img"
            style={{ width: size, height: size }}
            src={urlBuilder(value, size)}
            alt={alt}
            loading="lazy"
          />
        ) : (
          <LocalCode value={value} size={size} hasLogo={logo != null} alt={alt} />
        )}
        {logo != null && (
          <span className="qr__logo" style={{ width: logoSize, height: logoSize }}>
            {logo}
          </span>
        )}
      </div>
      {label != null && <div className="qr__label">{label}</div>}
      {sub != null && <div className="qr__sub">{sub}</div>}
    </div>
  );
}
