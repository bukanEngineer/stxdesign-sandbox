import React from "react";
import { expect, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import { Button } from "../Button";

const meta: Meta<typeof Spinner> = {
  title: "Atoms/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"], table: { defaultValue: { summary: "md" } } },
    label: { control: "text" },
  },
  args: { size: "md", label: "Loading" },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <Spinner size="sm" label="Small" />
      <Spinner size="md" label="Medium" />
      <Spinner size="lg" label="Large" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(getComputedStyle(canvas.getByRole("status", { name: "Small" })).width).toBe("16px");
    await expect(getComputedStyle(canvas.getByRole("status", { name: "Medium" })).width).toBe("24px");
    await expect(getComputedStyle(canvas.getByRole("status", { name: "Large" })).width).toBe("40px");
  },
};

/** Inherits the text colour, so it works on brand and secondary surfaces. */
export const InheritsColor: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <span style={{ color: "var(--text-secondary)" }}><Spinner /></span>
      <span style={{ color: "var(--status-information)" }}><Spinner /></span>
      <Button disabled startIcon={<Spinner size="sm" label={null} />}>Submitting</Button>
    </div>
  ),
};

/** A loading panel, e.g. while a deposit QR code is generated. */
export const LoadingPanel: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        width: 200,
        height: 200,
        borderRadius: "var(--radius-md)",
        background: "var(--surface-secondary)",
        color: "var(--text-secondary)",
      }}
    >
      <Spinner size="lg" label="Loading QR code" />
    </div>
  ),
};
