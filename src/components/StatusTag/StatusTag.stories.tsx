import React from "react";
import { expect, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusTag, statusTone, type Status } from "./StatusTag";

const statuses = Object.keys(statusTone) as Status[];

const meta: Meta<typeof StatusTag> = {
  title: "Atoms/Status Tag",
  component: StatusTag,
  parameters: { layout: "centered" },
  argTypes: {
    status: { control: "select", options: statuses },
    size: { control: "inline-radio", options: ["large", "small"], table: { defaultValue: { summary: "small" } } },
    label: { control: "text" },
  },
  args: { status: "completed", size: "small" },
};
export default meta;

type Story = StoryObj<typeof StatusTag>;

export const Default: Story = {};

/** Every status in the shared vocabulary, with the tone it maps to. */
export const AllStatuses: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "max-content max-content", gap: "8px 24px", alignItems: "center" }}>
      {statuses.map((status) => (
        <React.Fragment key={status}>
          <StatusTag status={status} />
          <code>{statusTone[status]}</code>
        </React.Fragment>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fill = (label: string) => getComputedStyle(canvas.getByText(label).closest(".tag")!).backgroundColor;
    await expect(fill("Completed")).toBe(fill("Active"));
    await expect(fill("Pending")).toBe(fill("Awaiting approval"));
    await expect(fill("Failed")).not.toBe(fill("Completed"));
  },
};

export const LabelOverride: Story = { args: { status: "failed", label: "Rejected" } };
