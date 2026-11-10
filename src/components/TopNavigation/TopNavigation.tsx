import React, { useContext } from "react";
import { Badge } from "../Badge/Badge";
import { IconButton } from "../IconButton/IconButton";
import { Menu } from "../Menu/Menu";
import { TopNavProfileMenu } from "../TopNavProfileMenu/TopNavProfileMenu";
import { SidebarContext } from "../Sidebar/SidebarContext";
import { cn } from "../../lib/cn";
import "./TopNavigation.css";
import { Icon } from "../Icon/Icon";

export type TopNavigationUser = {
  name?: string;
  initials?: string;
  avatar?: string;
  company?: string;
  role?: string;
};

export type TopNavigationItem = {
  id: string;
  label: string;
  /** Renders a link when set, a button otherwise */
  href?: string;
  /** Marks the current page */
  active?: boolean;
  onClick?: () => void;
};

export type TopNavigationProps = React.ComponentProps<"header"> & {
  account?: "personal" | "business" | "sandbox";
  user?: TopNavigationUser;
  notifications?: number;
  /** Hamburger click handler (falls back to SidebarContext.toggleSidebar) */
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
  /** Profile menu action handler; receives action id (e.g. "logout") */
  onMenuAction?: (actionId: string) => void;
  /** Navigation items shown after the logo area. Hidden below 1280px, where the sidebar takes over. */
  items?: TopNavigationItem[];
  /** How many items stay visible; the rest go into a "More" menu. Default: all. */
  maxVisibleItems?: number;
  /** Label of the overflow menu trigger */
  moreLabel?: string;
};

export function TopNavigation({
  account = "personal",
  user = {},
  notifications = 0,
  onMenuClick,
  onNotificationsClick,
  onMenuAction,
  items = [],
  maxVisibleItems = Infinity,
  moreLabel = "More",
  className,
  children,
  ...rest
}: TopNavigationProps) {
  const sidebarCtx = useContext(SidebarContext);
  const handleMenuClick = sidebarCtx ? sidebarCtx.toggleSidebar : onMenuClick;

  const isSandbox = account === "sandbox";
  const isBusiness = account === "business";

  const primaryLabel = isSandbox
    ? user.company || user.name || ""
    : user.name || "";

  const subLabel = isBusiness
    ? user.role || ""
    : isSandbox
      ? user.name || ""
      : "";

  const initials =
    user.initials ||
    (user.name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();

  const avatar = (
    <span className="topnav__avatar" aria-hidden="true">
      {user.avatar ? (
        <img className="topnav__avatar-img" src={user.avatar} alt="" />
      ) : initials ? (
        <span className="topnav__initials">{initials}</span>
      ) : (
        <Icon name="person" />
      )}
    </span>
  );

  return (
    <header
      className={cn("topnav", sidebarCtx && "topnav--collapsible", className)}
      data-account={account}
      {...rest}
    >
      <IconButton
        icon="menu"
        variant="tertiary"
        label="Open menu"
        onClick={handleMenuClick}
        className="topnav__hamburger"
      />

      {items.length > 0 && (
        <nav className="topnav__nav" aria-label="Primary">
          {items.slice(0, maxVisibleItems).map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
          {items.length > maxVisibleItems && (
            <Menu.Root>
              <Menu.Trigger className="topnav__nav-item">
                {moreLabel}
                <Icon name="expand_more" />
              </Menu.Trigger>
              <Menu.Popup align="start">
                {items.slice(maxVisibleItems).map((item) => (
                  <Menu.Item
                    key={item.id}
                    onClick={item.onClick}
                    render={item.href ? <a href={item.href} /> : undefined}
                    nativeButton={item.href ? false : undefined}
                  >
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu.Popup>
            </Menu.Root>
          )}
        </nav>
      )}

      <div className="topnav__right">
        {children}

        <Badge.Wrap
          badge={
            notifications > 0 ? (
              <Badge tone="critical" size="sm">
                {notifications}
              </Badge>
            ) : null
          }
        >
          <IconButton
            icon="notifications"
            variant="secondary"
            size="sm"
            label="Notifications"
            onClick={onNotificationsClick}
          />
        </Badge.Wrap>

        <Menu.Root>
          <Menu.Trigger
            className="topnav__profile"
            aria-label={primaryLabel ? `Account: ${primaryLabel}` : "Account"}
          >
            {avatar}
            {primaryLabel && (
              <span className="topnav__profile-text">
                <span className="topnav__profile-name">{primaryLabel}</span>
                {subLabel && <span className="topnav__profile-sub">{subLabel}</span>}
              </span>
            )}
            <Icon name="expand_more" className="topnav__chevron" />
          </Menu.Trigger>
          <Menu.Popup align="end" className="topnav-menu">
            <TopNavProfileMenu account={account} onAction={onMenuAction} />
          </Menu.Popup>
        </Menu.Root>
      </div>
    </header>
  );
}

function NavItem({ item }: { item: TopNavigationItem }) {
  const props = {
    className: "topnav__nav-item",
    "aria-current": item.active ? ("page" as const) : undefined,
    "data-active": item.active || undefined,
  };
  return item.href ? (
    <a href={item.href} onClick={item.onClick} {...props}>
      {item.label}
    </a>
  ) : (
    <button type="button" onClick={item.onClick} {...props}>
      {item.label}
    </button>
  );
}
