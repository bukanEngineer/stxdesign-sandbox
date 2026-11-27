import React from "react";
import { expect, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyValueRows } from "./KeyValueRows";
import { Card, CardHeader, CardTitle, CardContent } from "../Card";
import { StatusTag } from "../StatusTag";

const transfer = [
  { label: "Transaction ID", value: "TXN-20261127-0042", copyable: "TXN-20261127-0042" },
  { label: "Recipient", value: "Priya Nair" },
  { label: "Bank", value: "DBS Bank Ltd" },
  { label: "Status", value: <StatusTag status="processing" /> },
  { label: "Network fee", value: "1.00 XSGD", info: "Charged by the blockchain network" },
  { label: "Total", value: "1,001.00 XSGD", emphasis: true },
];

const meta: Meta<typeof KeyValueRows> = {
  title: "P1 Components/Key Value Rows",
  component: KeyValueRows,
  parameters: { layout: "padded" },
  argTypes: {
    layout: { control: "inline-radio", options: ["inline", "stacked", "grid"], table: { defaultValue: { summary: "inline" } } },
    size: { control: "inline-radio", options: ["default", "compact"], table: { defaultValue: { summary: "default" } } },
    dividers: { control: "boolean", table: { defaultValue: { summary: "false" } } },
  },
  args: { items: transfer, layout: "inline", size: "default", dividers: false },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof KeyValueRows>;

export const Inline: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByText("Recipient").closest(".kv-rows__row")!;
    await expect(getComputedStyle(row).flexDirection).toBe("row");
    await expect(canvas.getByRole("button", { name: "Copy transaction id" })).toBeVisible();
  },
};
export const WithDividers: Story = { args: { dividers: true } };
export const Compact: Story = { args: { size: "compact" } };

/** Label above value, for narrow panels and long values such as addresses. */
export const Stacked: Story = {
  args: {
    layout: "stacked",
    items: [
      { label: "Wallet address", value: "0x8f3c2a91b4e7d6f05c1a2b3c4d5e6f7a8b9c0d1e", copyable: "0x8f3c2a91b4e7d6f05c1a2b3c4d5e6f7a8b9c0d1e" },
      { label: "Network", value: "Polygon" },
    ],
  },
};

/** Two columns of stacked pairs; one column below 480px of container width. */
export const Grid: Story = {
  args: { layout: "grid" },
  decorators: [(Story) => <div style={{ maxWidth: 720 }}><Story /></div>],
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector(".kv-rows")!;
    await expect(getComputedStyle(list).gridTemplateColumns.split(" ")).toHaveLength(2);
  },
};

export const InCard: Story = {
  render: (args) => (
    <Card radius="lg">
      <CardHeader>
        <CardTitle>Transfer details</CardTitle>
      </CardHeader>
      <CardContent>
        <KeyValueRows {...args} />
      </CardContent>
    </Card>
  ),
};
