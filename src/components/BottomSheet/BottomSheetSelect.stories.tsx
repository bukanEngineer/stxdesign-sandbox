import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { BottomSheetSelect } from "./BottomSheetSelect";
import { Button } from "../Button";

const meta: Meta<typeof BottomSheetSelect> = {
  title: "Patterns/Bottom Sheet/Select",
  component: BottomSheetSelect,
  parameters: { layout: "centered", chromatic: { viewports: [360] } },
  argTypes: {
    searchable: { control: "boolean" },
    onValueChange: { action: "onValueChange" },
  },
};
export default meta;

type Story = StoryObj<typeof BottomSheetSelect>;

const assets = [
  { id: "xsgd", name: "XSGD", description: "Singapore dollar" },
  { id: "xidr", name: "XIDR", description: "Indonesian rupiah" },
  { id: "xusd", name: "XUSD", description: "US dollar" },
  { id: "usdc", name: "USDC", description: "USD Coin" },
  { id: "usdt", name: "USDT", description: "Tether", disabled: true },
  { id: "eth", name: "Ether", description: "Ethereum" },
  { id: "btc", name: "Bitcoin", description: "Bitcoin" },
];

function Render(args: React.ComponentProps<typeof BottomSheetSelect>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | null>("xsgd");
  return (
    <>
      <Button onClick={() => setOpen(true)}>Select asset</Button>
      <BottomSheetSelect
        {...args}
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={(id) => {
          setValue(id);
          setOpen(false);
        }}
      />
    </>
  );
}

export const Default: Story = {
  render: Render,
  args: { title: "Select asset", items: assets },
};

/** `searchable` adds a filter field and an empty state. */
export const Searchable: Story = {
  render: Render,
  args: { title: "Select asset", description: "Pick the asset to send.", items: assets, searchable: true },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Select asset" }));
    const dialog = await page.findByRole("dialog");
    await canvasElement.ownerDocument.fonts.ready;
    const openingHeight = dialog.offsetHeight;
    const search = page.getByRole("searchbox");

    await userEvent.type(search, "Bitcoin");
    await expect(page.getAllByRole("option")).toHaveLength(1);
    await expect(dialog.offsetHeight).toBe(openingHeight);

    await userEvent.clear(search);
    await userEvent.type(search, "no matching asset");
    await expect(page.getByRole("status")).toHaveTextContent("No results found");
    await expect(dialog.offsetHeight).toBe(openingHeight);

    await userEvent.clear(search);
    await expect(page.getAllByRole("option")).toHaveLength(assets.length);
    await expect(dialog.offsetHeight).toBe(openingHeight);
  },
};

export const Open: Story = {
  args: { title: "Select asset", items: assets, value: "xsgd", defaultOpen: true, searchable: true },
};
