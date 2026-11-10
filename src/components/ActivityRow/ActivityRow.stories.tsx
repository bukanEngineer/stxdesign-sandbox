import React from "react";
import { ActivityRow } from "./ActivityRow";
import { List } from "../List/List";

export default {
  title: "Molecules/ActivityRow",
  component: ActivityRow,
  parameters: { layout: "padded" },
  decorators: [(Story: React.ComponentType) => <List divided style={{ maxWidth: 480 }}><Story /></List>],
};

export const Incoming = {
  args: { icon: "arrow_downward", title: "Transfer In", status: "Completed", date: "3 Nov 2026", amount: "+S$1,200.00", amountTone: "positive" },
};
export const Outgoing = {
  args: { icon: "arrow_upward", title: "Transfer Out", status: "Pending", date: "2 Nov 2026", amount: "-S$300.00", amountTone: "neutral", amountSub: "≈ US$224.00" },
};
