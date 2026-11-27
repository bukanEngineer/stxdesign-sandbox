import React, { useState } from "react";
import { expect, within, userEvent } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterBar } from "./FilterBar";
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
];

function Demo({ withActions = true }: { withActions?: boolean }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [asset, setAsset] = useState<string | null>(null);
  const [range, setRange] = useState<{ start?: string; end?: string }>({});
  return (
    <FilterBar
      search={{ value: search, onChange: setSearch, placeholder: "Search by payout ID" }}
      filters={[
        { id: "status", label: "Status", options: statusOptions, value: status, onChange: setStatus },
        { id: "asset", label: "Asset", options: assetOptions, value: asset, onChange: setAsset },
      ]}
      dateRange={{ ...range, onChange: setRange }}
      onClear={() => {
        setSearch("");
        setStatus(null);
        setAsset(null);
        setRange({});
      }}
      resultCount="24 results"
      actions={withActions ? <Button variant="secondary" size="sm">Export CSV</Button> : undefined}
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
    await userEvent.type(canvas.getByRole("searchbox"), "PO-1");
    await expect(canvas.getByRole("button", { name: "Clear filters" })).toBeVisible();
  },
};

export const SearchOnly: Story = {
  render: () => {
    const [q, setQ] = useState("");
    return <FilterBar search={{ value: q, onChange: setQ, placeholder: "Search members" }} resultCount="8 members" />;
  },
};

/** Controls wrap as the container narrows. */
export const Mobile: Story = {
  render: () => (
    <div style={{ maxWidth: 390 }}>
      <Demo withActions={false} />
    </div>
  ),
};
