import React, { useState } from "react";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import { Spinner } from "../Spinner/Spinner";
import "./ConfirmModal.css";

export type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A question: "Remove Priya Nair?" */
  title: React.ReactNode;
  /** What happens, and whether it can be undone */
  description?: React.ReactNode;
  /** Verb first: "Remove member" */
  confirmLabel: React.ReactNode;
  cancelLabel?: React.ReactNode;
  /**
   * Called on confirm. Return a promise to keep the modal open with a loading
   * button until it settles; it closes when the promise resolves and stays
   * open if it rejects, so you can show the error.
   */
  onConfirm: () => void | Promise<unknown>;
  /** `critical` uses a destructive confirm button */
  tone?: "default" | "critical";
  /** Disable confirm, e.g. until an acknowledgement checkbox in `children` is ticked */
  confirmDisabled?: boolean;
  /** Optional body under the description: an `Alert`, an acknowledgement, a short summary */
  children?: React.ReactNode;
  /** Optional `StatusIcon` or illustration; centres the header */
  illustration?: React.ReactNode;
  /** Allow closing by backdrop click and Escape (default true). Ignored while confirming. */
  dismissable?: boolean;
};

/**
 * Asks the user to confirm one action before it runs. Use before
 * irreversible or high-impact actions: remove, revoke, cancel, change destination.
 *
 *   <ConfirmModal
 *     open={open}
 *     onOpenChange={setOpen}
 *     tone="critical"
 *     title="Remove Priya Nair?"
 *     description="They lose access to this account straight away."
 *     confirmLabel="Remove member"
 *     onConfirm={removeMember}
 *   />
 */
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  tone = "default",
  confirmDisabled = false,
  children,
  illustration,
  dismissable = true,
}: ConfirmModalProps) {
  const [pending, setPending] = useState(false);
  const centered = illustration != null;

  const confirm = async () => {
    const result = onConfirm();
    if (!(result instanceof Promise)) {
      onOpenChange(false);
      return;
    }
    setPending(true);
    try {
      await result;
      onOpenChange(false);
    } catch {
      /* stay open: the caller shows the error */
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal.Root
      open={open}
      onOpenChange={(next) => {
        if (!pending) onOpenChange(next);
      }}
      dismissable={dismissable && !pending}
    >
      <Modal.Popup size="small" className="confirm-modal" data-tone={tone}>
        <Modal.Header variant={centered ? "centered" : "default"} className="confirm-modal__head">
          {centered && <Modal.Illustration>{illustration}</Modal.Illustration>}
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        {(description != null || children != null) && (
          <Modal.Body align={centered ? "center" : "start"} className="confirm-modal__body">
            {description != null && <Modal.Description>{description}</Modal.Description>}
            {children}
          </Modal.Body>
        )}
        <Modal.Footer layout="responsive">
          <Modal.Close
            disabled={pending}
            render={<Button variant="secondary" size="lg" fullWidth />}
          >
            {cancelLabel}
          </Modal.Close>
          <Button
            variant={tone === "critical" ? "destructive" : "primary"}
            size="lg"
            fullWidth
            disabled={confirmDisabled || pending}
            aria-busy={pending || undefined}
            startIcon={pending ? <Spinner size="sm" label={null} /> : undefined}
            onClick={confirm}
          >
            {confirmLabel}
          </Button>
        </Modal.Footer>
      </Modal.Popup>
    </Modal.Root>
  );
}
