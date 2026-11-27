import React from "react";
import { expect, within } from "storybook/test";
import { StatusIcon } from "./StatusIcon";

export default {
  title: "Atoms/Status Icon",
  component: StatusIcon,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "inline-radio", options: ["success", "needApproval", "error", "warning"] },
    size: { control: { type: "number" } },
  },
  args: { variant: "success", size: 36 },
};

export const Success = { args: { variant: "success" } };
export const NeedApproval = { args: { variant: "needApproval" } };

export const Error = { args: { variant: "error" } };
export const Warning = { args: { variant: "warning" } };
export const Expired = { args: { variant: "warning", "aria-label": "Expired" } };

export const Variants = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    for (const label of ["Success", "Error", "Warning", "Needs approval"]) {
      const status = canvas.getByRole("img", { name: label });
      const style = getComputedStyle(status);
      await expect(style.width).toBe("36px");
      await expect(style.height).toBe("36px");
      await expect(style.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
      await expect(style.color).toBe("rgb(255, 255, 255)");
    }
    const fill = (label: string) => getComputedStyle(canvas.getByRole("img", { name: label })).backgroundColor;
    await expect(fill("Warning")).toBe(fill("Needs approval"));
    await expect(fill("Error")).not.toBe(fill("Success"));
    await expect(fill("Error")).not.toBe(fill("Warning"));
  },
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      {(["success", "error", "warning", "needApproval"] as const).map((variant) => (
        <div key={variant} style={{ display: "grid", justifyItems: "center", gap: 8 }}>
          <StatusIcon variant={variant} />
          <span>{variant}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <StatusIcon variant="success" size={24} />
      <StatusIcon variant="success" size={36} />
      <StatusIcon variant="needApproval" size={48} />
    </div>
  ),
};
