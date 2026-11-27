import React from "react";
import { Icon } from "../Icon/Icon";
import { Card, CardHeader } from "../Card/Card";
import { List } from "../List/List";
import { ListAsset } from "../ListAsset/ListAsset";
import { cn } from "../../lib/cn";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import "./CardAsset.css";

export type CardAssetNetwork = {
  name?: string;
  logo?: React.ReactNode;
};

export type CardAssetItem = {
  symbol?: string;
  subtitle?: React.ReactNode;
  logo?: React.ReactNode;
  balance?: React.ReactNode;
  fiat?: React.ReactNode;
  networks?: CardAssetNetwork[];
};

export type CardAssetProps = Omit<React.ComponentProps<"section">, "title"> & {
  title?: React.ReactNode;
  assets?: CardAssetItem[];
  banner?: React.ReactNode;
  /** Control beside the title, e.g. a Cash / Stablecoin `Tabs` toggle */
  toggle?: React.ReactNode;
  /** Controls on the right of the header, e.g. a "View all" link */
  actions?: React.ReactNode;
  onRefresh?: () => void;
  onAdd?: (asset: CardAssetItem) => void;
  onSend?: (asset: CardAssetItem) => void;
  /**
   * Row layout. `desktop` shows Add / Send buttons on every row. `mobile` shows a
   * chevron instead, so the name, balance and networks fit a phone. `auto`
   * switches to `mobile` at viewport widths up to 599px.
   */
  platform?: CardAssetPlatform;
  /** Called when a row is tapped in the mobile layout (where Add / Send are hidden) */
  onSelect?: (asset: CardAssetItem) => void;
};

export type CardAssetPlatform = "desktop" | "mobile" | "auto";

/** Viewport width at or below which `platform="auto"` uses the mobile rows. */
export const CARD_ASSET_MOBILE_QUERY = "(max-width: 599px)";

/** Portfolio asset list card. */
export function CardAsset({
  title = "My Assets",
  assets = [],
  banner,
  toggle,
  actions,
  onRefresh,
  onAdd,
  onSend,
  platform = "desktop",
  onSelect,
  className,
  ...rest
}: CardAssetProps) {
  // "not all" never matches, so fixed platforms do not depend on the viewport.
  const narrow = useMediaQuery(platform === "auto" ? CARD_ASSET_MOBILE_QUERY : "not all");
  const rowPlatform = platform === "auto" ? (narrow ? "mobile" : "desktop") : platform;
  const isMobile = rowPlatform === "mobile";
  return (
    <Card className={cn("card-asset", className)} {...rest}>
      <CardHeader className="card-asset__header" actions={actions}>
        <div className="card-asset__title">
          <span>{title}</span>
          {onRefresh && (
            <button
              type="button"
              className="card-asset__refresh"
              onClick={onRefresh}
              aria-label="Refresh"
            >
              <Icon name="refresh" size={20} />
            </button>
          )}
        </div>
        {toggle}
      </CardHeader>

      {banner && (
        <div className="card-asset__banner" role="status">
          <Icon name="info" size={24} className="card-asset__banner-icon" />
          <p className="card-asset__banner-text">{banner}</p>
        </div>
      )}

      <List className="card-asset__list">
        {assets.map((a, i) => {
          const networks = a.networks ?? [];
          return (
            <ListAsset
              key={a.symbol || i}
              symbol={a.symbol}
              subtitle={a.subtitle}
              icon={a.logo}
              balance={a.balance}
              balanceSub={a.fiat}
              networks={networks.slice(0, MAX_NETWORKS).map((n, j) => (
                <Network key={n.name || j} logo={n.logo} name={n.name} />
              ))}
              networkOverflow={Math.max(0, networks.length - MAX_NETWORKS)}
              platform={rowPlatform}
              onAdd={onAdd ? () => onAdd(a) : undefined}
              onSend={onSend ? () => onSend(a) : undefined}
              onSelect={isMobile && onSelect ? () => onSelect(a) : undefined}
            />
          );
        })}
      </List>
    </Card>
  );
}

const MAX_NETWORKS = 4;

function Network({ logo, name }: { logo?: React.ReactNode; name?: string }) {
  return (
    <span className="card-asset__network" title={name}>
      {logo || (
        <span className="card-asset__network-initial" aria-hidden="true">
          {(name || "?").charAt(0)}
        </span>
      )}
    </span>
  );
}
