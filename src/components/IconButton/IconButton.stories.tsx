import React from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { IconButton } from "./IconButton";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof IconButton> = {
  title: "Atoms/Icon Button",
  component: IconButton,
  parameters: { layout: "centered" },
  argTypes: {
    icon: { control: "text" },
    variant: { control: "inline-radio", options: ["primary", "secondary", "tertiary", "destructive"] },
    shape: { control: "inline-radio", options: ["circle", "square"] },
    size: { control: "inline-radio", options: ["lg", "sm", "xs"] },
    disabled: { control: "boolean" },
    touchTarget: { control: "boolean" },
  },
  args: { icon: "notifications", label: "Notifications", disabled: false },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Tertiary: Story = { args: { variant: "tertiary" } };

export const Destructive: Story = { args: { variant: "destructive", icon: "delete", label: "Delete" } };
export const Toggle: Story = { args: { variant: "secondary", pressed: true, icon: "star", label: "Favourite" } };

export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <IconButton icon="search" variant="secondary" size="lg" label="Search lg" />
      <IconButton icon="search" variant="secondary" size="sm" label="Search sm" />
      <IconButton icon="search" variant="secondary" size="xs" label="Search xs" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: "primary", disabled: true, icon: "notifications", label: "Notifications" },
};

export const States: Story = {
  parameters: {
    layout: "padded",
    pseudo: {
      hover: ["#icon-primary-hover", "#icon-secondary-hover", "#icon-tertiary-hover"],
      active: ["#icon-primary-active", "#icon-secondary-active", "#icon-tertiary-active"],
    },
  },
  render: () => {
    const variants = ["primary", "secondary", "tertiary"] as const;
    const colHead = { font: "var(--label-small)", color: "var(--text-secondary)" };
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto repeat(4, max-content)",
          gap: 16,
          alignItems: "center",
        }}
      >
        <span />
        <span style={colHead}>Enabled</span>
        <span style={colHead}>Hovered</span>
        <span style={colHead}>Pressed</span>
        <span style={colHead}>Disabled</span>
        {variants.map((v) => (
          <React.Fragment key={v}>
            <span style={{ ...colHead, textTransform: "capitalize" }}>{v}</span>
            <IconButton icon="notifications" variant={v} label={`${v} enabled`} />
            <IconButton icon="notifications" variant={v} id={`icon-${v}-hover`} label={`${v} hovered`} />
            <IconButton icon="notifications" variant={v} id={`icon-${v}-active`} label={`${v} pressed`} />
            <IconButton icon="notifications" variant={v} disabled label={`${v} disabled`} />
          </React.Fragment>
        ))}
      </div>
    );
  },
};

export const Showcase: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <IconButton icon="close" variant="tertiary" label="Close" />
      <IconButton icon="more_vert" variant="tertiary" label="More" />
      <IconButton icon="notifications" variant="secondary" label="Notifications" />
      <IconButton icon="settings" variant="secondary" shape="square" label="Settings" />
      <IconButton icon="arrow_forward" variant="primary" label="Next" />
      <IconButton icon="check" variant="primary" shape="square" label="Confirm" />
    </div>
  ),
};

export const ExtraSmall: Story = {
  args: { icon: "content_copy", label: "Copy address", size: "xs", touchTarget: true },
};

/** 56px row pitch keeps 48px targets separate. Insets contain the expanded area.
 * Wire onClick to the application's clipboard handler; this story logs the action. */
export const CompactDetailList: Story = {
  args: { onClick: fn() },
  parameters: { layout: "padded" },
  render: (args) => (
    <dl style={{ margin: 0, width: "100%", maxWidth: 360, paddingInline: 12 }}>
      {[
        { label: "Address", value: "0x1234…abcd" },
        { label: "Txn hash", value: "0xabcd…5678" },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center", minHeight: 56 }}>
          <dt style={{ font: "var(--body-medium)" }}>{label}</dt>
          <dd style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 24px", gap: 16, alignItems: "center", font: "var(--body-medium)" }}>
            <span>{value}</span>
            <IconButton icon="content_copy" label={`Copy ${label.toLowerCase()}`} size="xs" touchTarget onClick={args.onClick} />
          </dd>
        </div>
      ))}
    </dl>
  ),
  play: async ({ canvasElement, args }) => {
    const buttons = within(canvasElement).getAllByRole("button");
    for (const button of buttons) {
      const box = button.getBoundingClientRect();
      await expect(box.width).toBe(24);
      await expect(box.height).toBe(24);
      const glyph = button.querySelector("svg");
      await expect(glyph).not.toBeNull();
      if (glyph) await expect(getComputedStyle(glyph).fontSize).toBe("16px");
      const target = getComputedStyle(button, "::after");
      await expect(target.width).toBe("48px");
      await expect(target.height).toBe("48px");
      // Points beyond the visual button must still hit this button, not its neighbour.
      for (const offset of [-22, 22]) {
        const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2 + offset);
        await expect(hit).toBe(button);
      }
      const hit = document.elementFromPoint(box.left + box.width / 2 + 22, box.top + box.height / 2);
      await expect(hit).toBe(button);
      if (hit) await userEvent.click(hit);
    }
    const first = buttons[0].getBoundingClientRect();
    const second = buttons[1].getBoundingClientRect();
    await expect(second.top - first.top).toBeGreaterThanOrEqual(48);
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    buttons[0].focus();
    await userEvent.tab();
    await expect(buttons[1]).toHaveFocus();
  },
};
