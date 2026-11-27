import React, { useState } from "react";
import { expect, within, userEvent, screen, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterBar, type FilterBarProps } from "./FilterBar";
import { Button } from "../Button";
import { Card } from "../Card";

const statusOptions = [
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];
const assetOptions = [
  { value: "XSGD", label: "XSGD" },
  { value: "XUSD", label: "XUSD" },
  { value: "XIDR", label: "XIDR" },
  { value: "USDC", label: "USDC" },
];

function Demo(props: Pick<FilterBarProps, "collapse" | "collapseQuery">) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [assets, setAssets] = useState<string[]>([]);
  const [range, setRange] = useState<{ start?: string; end?: string }>({});
  return (
    <FilterBar
      {...props}
      search={{ value: search, onChange: setSearch, placeholder: "Search by payout ID" }}
      filters={[
        { id: "status", label: "Status", options: statusOptions, value: status, onChange: setStatus },
        { id: "asset", label: "Asset", options: assetOptions, multiple: true, value: assets, onChange: setAssets },
      ]}
      dateRange={{ ...range, onChange: setRange, presets: ["7d", "30d", "month"] }}
      onClear={() => {
        setSearch("");
        setStatus(null);
        setAssets([]);
        setRange({});
      }}
      resultCount="24 results"
      actions={<Button variant="secondary" size="sm">Export CSV</Button>}
    />
  );
}

const meta: Meta<typeof FilterBar> = {
  title: "P1 Components/Filter Bar",
  component: FilterBar,
  parameters: { layout: "padded" },
  render: () => (
    <Card radius="lg">
      <Demo />
    </Card>
  ),
};
export default meta;

type Story = StoryObj<typeof FilterBar>;

/** Search, a single-choice filter, a multi-choice filter, a date range with presets, clear, count and actions. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();

    // Multi-choice filter stays one row high and summarises the selection.
    const asset = canvas.getByRole("combobox", { name: "Asset" });
    const height = asset.closest(".multiselect")!.getBoundingClientRect().height;
    await userEvent.click(canvas.getByRole("button", { name: "Open Asset" }));
    await userEvent.click(await screen.findByRole("option", { name: "XSGD" }));
    await userEvent.click(await screen.findByRole("option", { name: "XUSD" }));
    await userEvent.click(await screen.findByRole("option", { name: "USDC" }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(asset).toHaveAttribute("placeholder", "XSGD +2"));
    await expect(asset.closest(".multiselect")!.getBoundingClientRect().height).toBe(height);

    // A preset toggles on and off.
    const preset = canvas.getByRole("button", { name: "Last 7 days" });
    await userEvent.click(preset);
    await expect(preset).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(canvas.getByRole("button", { name: "Clear filters" }));
    await expect(preset).toHaveAttribute("aria-pressed", "false");
    await waitFor(() => expect(asset).toHaveAttribute("placeholder", "Asset"));
  },
};

/**
 * `collapse="sheet"` on a phone: search stays inline, everything else moves
 * into a bottom sheet. `collapseQuery="all"` forces the phone layout here.
 */
export const CollapsedIntoSheet: Story = {
  render: () => (
    <div style={{ maxWidth: 390 }}>
      <Card radius="lg" padding="sm">
        <Demo collapse="sheet" collapseQuery="all" />
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("combobox", { name: "Status" })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    const sheet = await screen.findByRole("dialog", { name: "Filters" });

    // A select inside the sheet opens above it and applies.
    await userEvent.click(within(sheet).getByRole("combobox", { name: "Status" }));
    await userEvent.click(await screen.findByRole("option", { name: "Pending" }));
    await userEvent.click(within(sheet).getByRole("button", { name: "Last 30 days" }));
    await userEvent.click(within(sheet).getByRole("button", { name: "Show 24 results" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(canvas.getByRole("button", { name: "Filters, 2 applied" })).toBeVisible();
  },
};
