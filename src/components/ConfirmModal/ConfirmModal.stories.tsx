import React, { useState } from "react";
import { expect, within, userEvent, waitFor, screen } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConfirmModal, type ConfirmModalProps } from "./ConfirmModal";
import { Button } from "../Button";
import { Alert } from "../Alert";
import { Checkbox } from "../Checkbox";
import { StatusIcon } from "../StatusIcon";

type Args = Omit<ConfirmModalProps, "open" | "onOpenChange">;

function Demo({ trigger = "Open", ...args }: Args & { trigger?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{trigger}</Button>
      <ConfirmModal {...args} open={open} onOpenChange={setOpen} />
    </>
  );
}

const meta: Meta<Args> = {
  title: "P1 Components/Confirm Modal",
  component: ConfirmModal as unknown as React.ComponentType<Args>,
  parameters: { layout: "centered" },
  argTypes: {
    tone: { control: "inline-radio", options: ["default", "critical"] },
    confirmDisabled: { control: "boolean" },
    onConfirm: { action: "confirmed", table: { category: "Events" } },
  },
  args: {
    title: "Submit this transfer?",
    description: "1,000.00 XSGD will be sent to Priya Nair. You cannot cancel it after it is submitted.",
    confirmLabel: "Submit transfer",
    tone: "default",
  },
  render: (args) => <Demo {...args} />,
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog", { name: "Submit this transfer?" });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  },
};

export const Critical: Story = {
  args: {
    tone: "critical",
    title: "Remove Priya Nair?",
    description: "They lose access to this business account straight away. You can invite them again later.",
    confirmLabel: "Remove member",
  },
};

/** A pending promise keeps the modal open and shows a loading confirm button. */
export const AsyncConfirm: Story = {
  args: {
    title: "Revoke this API key?",
    description: "Apps using this key stop working straight away.",
    confirmLabel: "Revoke key",
    tone: "critical",
    onConfirm: () => new Promise((r) => setTimeout(r, 1500)),
  },
};

/** Confirm stays disabled until the acknowledgement is ticked. */
export const WithAcknowledgement: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [ack, setAck] = useState(false);
    return (
      <>
        <Button onClick={() => { setAck(false); setOpen(true); }}>Open</Button>
        <ConfirmModal
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Change destination wallet?"
          description="New mints go to the new wallet. Mints already in progress still go to the old one."
          confirmLabel="Change wallet"
          confirmDisabled={!ack}
        >
          <Alert tone="warning">Sending to an unsupported network can lose funds.</Alert>
          <label className="control" htmlFor="confirm-ack">
            <Checkbox.Root id="confirm-ack" checked={ack} onCheckedChange={setAck}>
              <Checkbox.Indicator />
            </Checkbox.Root>
            <span className="control__label">I have checked the wallet address and network</span>
          </label>
        </ConfirmModal>
      </>
    );
  },
};

export const WithIllustration: Story = {
  args: {
    title: "Cancel this payout?",
    description: "The funds return to your balance.",
    confirmLabel: "Cancel payout",
    cancelLabel: "Keep payout",
    illustration: <StatusIcon variant="warning" size={48} aria-label="Warning" />,
  },
};
