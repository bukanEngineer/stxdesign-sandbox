import React from "react";
import { expect, within, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { VerifiedBadgeIllustration } from "../Illustration/illustrations/index";

const meta: Meta<typeof Modal.Popup> = {
  title: "P1 Components/Modal",
  component: Modal.Popup,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "inline-radio", options: ["small", "large"] },
  },
  args: { size: "small" },
};
export default meta;

type Story = StoryObj<typeof Modal.Popup>;

const trigger = (label: string) => <Modal.Trigger render={<Button />}>{label}</Modal.Trigger>;

export const Default: Story = {
  render: (args) => (
    <Modal.Root>
      {trigger("Open modal")}
      <Modal.Popup {...args}>
        <Modal.Header>
          <Modal.Title>Confirm transfer</Modal.Title>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>
          You are about to send <strong>1,250 XSGD</strong> to <strong>John Doe</strong>. This
          action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close render={<Button variant="secondary" size="lg" />}>Cancel</Modal.Close>
          <Modal.Close render={<Button variant="primary" size="lg" />}>Confirm</Modal.Close>
        </Modal.Footer>
      </Modal.Popup>
    </Modal.Root>
  ),
};

export const Large: Story = { ...Default, args: { size: "large" } };

/** Rendered open so the layout is visible without interaction. */
export const Open: Story = {
  render: (args) => (
    <Modal.Root defaultOpen>
      <Modal.Popup {...args}>
        <Modal.Header>
          <Modal.Title>Discard draft?</Modal.Title>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>Your changes will be lost.</Modal.Body>
        <Modal.Footer>
          <Modal.Close render={<Button variant="secondary" size="lg" />}>Cancel</Modal.Close>
          <Modal.Close render={<Button variant="primary" size="lg" />}>Discard</Modal.Close>
        </Modal.Footer>
      </Modal.Popup>
    </Modal.Root>
  ),
};

/** No header close button: leave out `<Modal.Close />` and dismiss from the footer. */
export const WithoutClose: Story = {
  render: (args) => (
    <Modal.Root>
      {trigger("Open modal (no close)")}
      <Modal.Popup {...args}>
        <Modal.Header>
          <Modal.Title>Confirm transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This modal has no header close button. Use the footer actions to dismiss it.
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close render={<Button variant="secondary" size="lg" />}>Cancel</Modal.Close>
          <Modal.Close render={<Button variant="primary" size="lg" />}>Confirm</Modal.Close>
        </Modal.Footer>
      </Modal.Popup>
    </Modal.Root>
  ),
};

/** `dismissable={false}`: backdrop clicks and Escape are ignored. */
export const NonDismissable: Story = {
  render: (args) => (
    <Modal.Root dismissable={false}>
      {trigger("Open modal (non-dismissable)")}
      <Modal.Popup {...args}>
        <Modal.Header>
          <Modal.Title>Action required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Backdrop clicks and the Escape key are disabled. Use an explicit action to continue.
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close render={<Button variant="primary" size="lg" />}>Acknowledge</Modal.Close>
        </Modal.Footer>
      </Modal.Popup>
    </Modal.Root>
  ),
};

/** Illustration layout: close-only toolbar, centered illustration + title, centered body. */
export const Illustration: Story = {
  render: (args) => (
    <Modal.Root>
      {trigger("Open illustration modal")}
      <Modal.Popup {...args}>
        <Modal.Header variant="toolbar">
          <Modal.Close />
        </Modal.Header>
        <Modal.Header variant="centered">
          <Modal.Illustration>
            <VerifiedBadgeIllustration />
          </Modal.Illustration>
          <Modal.Title>You&apos;re all set!</Modal.Title>
        </Modal.Header>
        <Modal.Body align="center">
          Your account has been verified. You can now transact across all supported stablecoins.
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close render={<Button variant="primary" size="lg" />}>Got it</Modal.Close>
        </Modal.Footer>
      </Modal.Popup>
    </Modal.Root>
  ),
};

/** New-feature layout: close-only toolbar, media block, centered title and body. */
export const NewFeature: Story = {
  args: { size: "large" },
  render: (args) => (
    <Modal.Root>
      {trigger("Open new-feature modal")}
      <Modal.Popup {...args}>
        <Modal.Header variant="toolbar">
          <Modal.Close />
        </Modal.Header>
        <Modal.Media>
          <div
            style={{
              height: 220,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              font: "var(--label-large)",
            }}
          >
            Screenshot / media
          </div>
        </Modal.Media>
        <Modal.Header variant="centered">
          <Modal.Title>Introducing instant swaps</Modal.Title>
        </Modal.Header>
        <Modal.Body align="center">
          Swap between stablecoins instantly with zero spread for the first 30 days.
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close render={<Button variant="primary" size="lg" />}>Get Started</Modal.Close>
        </Modal.Footer>
      </Modal.Popup>
    </Modal.Root>
  ),
};

/** Controlled: `open` + `onOpenChange`. */
export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open controlled modal</Button>
        <Modal.Root open={open} onOpenChange={setOpen}>
          <Modal.Popup {...args}>
            <Modal.Header>
              <Modal.Title>Controlled</Modal.Title>
              <Modal.Close />
            </Modal.Header>
            <Modal.Body>Open state lives in the parent.</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" size="lg" onClick={() => setOpen(false)}>
                Done
              </Button>
            </Modal.Footer>
          </Modal.Popup>
        </Modal.Root>
      </>
    );
  },
};

/** Put the safe action first in DOM order; no CSS reversal is applied. */
export const StackedFooter: Story = {
  render: () => (
    <div style={{ width: 272 }}>
      <Modal.Footer layout="stacked">
        <Button variant="primary">Keep payment</Button>
        <Button variant="secondary">Leave payment</Button>
      </Modal.Footer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const safe = canvas.getByRole("button", { name: "Keep payment" });
    const leave = canvas.getByRole("button", { name: "Leave payment" });
    const first = safe.getBoundingClientRect();
    const second = leave.getBoundingClientRect();
    await expect(first.width).toBe(232);
    await expect(second.width).toBe(first.width);
    await expect(first.height).toBe(48);
    await expect(second.height).toBe(48);
    await expect(second.top).toBeGreaterThan(first.bottom);
    safe.focus();
    await userEvent.tab();
    await expect(leave).toHaveFocus();
  },
};

export const ResponsiveFooter: Story = {
  render: () => (
    <Modal.Root defaultOpen>
      <Modal.Popup>
        <Modal.Header>
          <Modal.Title>Leave payment?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your payment is still awaiting confirmation.</Modal.Body>
        <Modal.Footer layout="responsive">
          <Modal.Close render={<Button />}>Keep payment</Modal.Close>
          <Modal.Close render={<Button variant="secondary" />}>Leave payment</Modal.Close>
        </Modal.Footer>
      </Modal.Popup>
    </Modal.Root>
  ),
  play: async () => {
    const body = within(document.body);
    const safe = await body.findByRole("button", { name: "Keep payment" });
    const leave = body.getByRole("button", { name: "Leave payment" });
    const first = safe.getBoundingClientRect();
    const second = leave.getBoundingClientRect();
    await expect(first.height).toBe(48);
    await expect(second.height).toBe(48);
    if (matchMedia("(max-width: 480px)").matches) {
      await expect(second.top).toBeGreaterThan(first.bottom);
      await expect(second.width).toBe(first.width);
    } else {
      await expect(second.top).toBe(first.top);
      await expect(second.left).toBeGreaterThan(first.right);
    }
    await expect(second.right).toBeLessThanOrEqual(window.innerWidth);
    safe.focus();
    await userEvent.tab();
    await expect(leave).toHaveFocus();
    await userEvent.click(safe);
    await waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
