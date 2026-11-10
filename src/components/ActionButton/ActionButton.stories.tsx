import React from "react";
import { ActionButton } from "./ActionButton";

export default {
  title: "Molecules/ActionButton",
  component: ActionButton,
  parameters: { layout: "centered" },
  args: { icon: "add", label: "Transfer In" },
};

export const Default = {};
export const Row = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <ActionButton icon="arrow_downward" label="Transfer In" />
      <ActionButton icon="arrow_upward" label="Transfer Out" />
      <ActionButton icon="swap_horiz" label="Swap" />
    </div>
  ),
};
