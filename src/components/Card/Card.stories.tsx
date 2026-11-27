import React from "react";
import { expect, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { Button } from "../Button/Button";
import { Tag } from "../Tag/Tag";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    padding: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
    shadow: { control: "inline-radio", options: [false, 1, 2, 3] },
  },
  args: { shadow: false },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Complete identity verification for a smooth and secure experience.
        </CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const Shadow1: Story = {
  args: { shadow: 1 },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360, background: "#F1F2F4", padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Complete identity verification for a smooth and secure experience.
        </CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const Shadow2: Story = {
  ...Shadow1,
  args: { shadow: 2 },
};

export const Shadow3: Story = {
  ...Shadow1,
  args: { shadow: 3 },
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Complete identity verification for a smooth and secure experience.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Tag tone="positive">Verified</Tag>
        <Button size="sm" variant="tertiary">
          Edit
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const WithContent: Story = {
  render: (args) => (
    <Card {...args} shadow={1}>
      <CardHeader>
        <CardTitle>Account summary</CardTitle>
        <CardDescription>Balances update every few minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, font: "var(--body-large)" }}>S$12,450.00</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary">
          View details
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Compact: Story = { ...Default, args: { padding: "sm", radius: "lg" } };

export const PaddingOptions: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Card data-testid="default-padding"><span>Default: 20px</span></Card>
      {(["none", "sm", "md", "lg"] as const).map((padding) => (
        <Card key={padding} padding={padding} data-testid={`padding-${padding}`}>
          <span>{padding}</span>
        </Card>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(getComputedStyle(canvas.getByTestId("default-padding")).padding).toBe("20px");
    for (const [padding, expected] of [["none", 0], ["sm", 16], ["md", 20], ["lg", 24]] as const) {
      const card = canvas.getByTestId(`padding-${padding}`);
      await expect(getComputedStyle(card).padding).toBe(`${expected}px`);
      const content = card.firstElementChild;
      if (content) await expect(content.getBoundingClientRect().left - card.getBoundingClientRect().left).toBe(expected);
    }
  },
};
