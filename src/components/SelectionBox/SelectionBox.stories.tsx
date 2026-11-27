import React, { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectionBox } from "./SelectionBox";
import { Radio } from "../Radio/Radio";
import { Icon } from "../Icon/Icon";

const WalletIcon = <Icon name="account_balance_wallet" />;

const meta: Meta<typeof SelectionBox> = {
  title: "Components/Selection Box",
  component: SelectionBox,
  argTypes: { density: { control: "inline-radio", options: ["default", "compact"] } },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SelectionBox>;

export const RadioGroup: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("sgd");
    return (
      <Radio.Group value={value} onValueChange={setValue} style={{ display: "grid", gap: 8 }}>
        <SelectionBox density={args.density} type="radio" value="sgd" label="SGD account" description="Singapore Dollar" />
        <SelectionBox density={args.density} type="radio" value="usd" label="USD account" description="US Dollar" />
        <SelectionBox density={args.density} type="radio" value="locked" label="Locked" description="Unavailable" disabled />
      </Radio.Group>
    );
  },
};

export const WithIcons: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("a");
    return (
      <Radio.Group value={value} onValueChange={setValue} style={{ display: "grid", gap: 8 }}>
        <SelectionBox density={args.density} type="radio" value="a" icon={WalletIcon} label="Primary" description="Default wallet" />
        <SelectionBox density={args.density} type="radio" value="b" icon={WalletIcon} label="Secondary" description="Backup wallet" />
      </Radio.Group>
    );
  },
};

export const MultiCheck: Story = {
  render: function Render(args) {
    const [sel, setSel] = useState(["security"]);
    const toggle = (id: string, on: boolean) =>
      setSel((s) => (on ? [...s, id] : s.filter((x) => x !== id)));
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <SelectionBox
          density={args.density}
          type="check"
          label="Product updates"
          description="New features & releases"
          selected={sel.includes("product")}
          onChange={(on) => toggle("product", on)}
        />
        <SelectionBox
          density={args.density}
          type="check"
          label="Security alerts"
          description="Important account activity"
          selected={sel.includes("security")}
          onChange={(on) => toggle("security", on)}
        />
      </div>
    );
  },
};

export const Compact: Story = {
  ...RadioGroup,
  args: { density: "compact" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const option = canvas.getByRole("radio", { name: /USD account/ });
    const row = option.closest("label");
    await expect(row).not.toBeNull();
    if (row) {
      const style = getComputedStyle(row);
      await expect(style.paddingTop).toBe("8px");
      await expect(style.paddingRight).toBe("12px");
      await expect(style.columnGap).toBe("8px");
      const label = canvas.getByText("USD account");
      const description = canvas.getByText("US Dollar");
      await expect(getComputedStyle(label).fontWeight).toBe("700");
      await expect(getComputedStyle(label).fontSize).toBe("14px");
      await expect(getComputedStyle(label).fontFamily).toContain("Hanken Grotesk");
      await expect(getComputedStyle(description).fontWeight).toBe("400");
      await expect(getComputedStyle(description).fontSize).toBe("14px");
      await expect(getComputedStyle(label.parentElement ?? label).gap).toBe("0px");
    }
    await userEvent.click(canvas.getByText("USD account"));
    await expect(option).toBeChecked();
    await userEvent.click(canvas.getByText("Locked"));
    await expect(option).toBeChecked();
    await expect(canvas.getByRole("radio", { name: /Locked/ })).toHaveAttribute("aria-disabled", "true");
  },
};

export const CompactWithIcons: Story = { ...WithIcons, args: { density: "compact" } };
export const CompactChecks: Story = { ...MultiCheck, args: { density: "compact" } };

export const CompactNetworks: Story = {
  args: { density: "compact" },
  render: (args) => (
    <Radio.Group defaultValue="ethereum" style={{ display: "grid", gap: 8 }}>
      <SelectionBox density={args.density} value="ethereum" label="Ethereum" />
      <SelectionBox density={args.density} value="polygon" label="Polygon" />
    </Radio.Group>
  ),
};
