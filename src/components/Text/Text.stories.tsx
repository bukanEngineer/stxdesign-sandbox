import React from "react";
import { Text, Caption, Footnote } from "./Text";

export default {
  title: "Atoms/Text",
  component: Text,
  parameters: { layout: "centered" },
  args: { children: "Straits eXchange" },
};

export const Default = {};
export const Secondary = { args: { variant: "body-small", tone: "secondary" } };
export const Positive = { args: { variant: "body-bold-medium", tone: "positive", children: "+S$1,200.00" } };

export const Presets = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Caption>Caption under an action button</Caption>
      <Footnote>Footnote: rates are indicative and may change.</Footnote>
    </div>
  ),
};
