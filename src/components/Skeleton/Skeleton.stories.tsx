import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";
import { Card, CardHeader, CardTitle } from "../Card";

const meta: Meta<typeof Skeleton> = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  parameters: { layout: "padded" },
  argTypes: {
    shape: { control: "inline-radio", options: ["text", "rect", "circle"], table: { defaultValue: { summary: "text" } } },
    width: { control: "text" },
    height: { control: "text" },
    lines: { control: { type: "number", min: 1, max: 6 } },
  },
  args: { shape: "text", width: 240, lines: 1 },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};
export const Paragraph: Story = { args: { lines: 3, width: 320 } };
export const Circle: Story = { args: { shape: "circle", width: 40 } };
export const Block: Story = { args: { shape: "rect", width: 200, height: 200 } };

/** An asset list while balances load. Mark the loading region with `aria-busy`. */
export const AssetRows: Story = {
  render: () => (
    <Card style={{ maxWidth: 480 }} aria-busy="true" aria-label="Loading assets">
      <CardHeader>
        <CardTitle>My Assets</CardTitle>
      </CardHeader>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 20 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Skeleton shape="circle" width={40} />
            <div style={{ flex: 1 }}>
              <Skeleton width="40%" />
              <Skeleton width="25%" />
            </div>
            <Skeleton width={80} />
          </div>
        ))}
      </div>
    </Card>
  ),
};
