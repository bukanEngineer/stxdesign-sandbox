import React from "react";
import { ImportantNotes } from "./ImportantNotes";
import { LinkButton } from "../LinkButton/LinkButton";

export default {
  title: "Components/Important Notes",
  component: ImportantNotes,
  parameters: { layout: "padded" },
  decorators: [(S) => <div style={{ maxWidth: 328 }}><S /></div>],
  argTypes: {
    title: { control: "text" },
    className: { control: "text" },
  },
  args: {
    title: "Important Notes:",
  },
};

export const WithTitle = {
  args: {
    title: "Important Notes:",
    children: "Our verification process may take up to 1 business day.",
  },
};

export const WithoutTitle = {
  args: {
    title: null,
    children: "Our verification process may take up to 1 business day.",
  },
};

export const WithRichContent = {
  args: {
    title: "Important Notes:",
    children: (
      <>
        We do not accept deposits from third parties or unrecognized accounts;
        incorrect or missing codes may lead to rejection with{" "}
        <strong>50 SGD refund</strong> fee deducted.
        <br />
        <LinkButton as="a" href="#restricted" size="md">
          Restricted third-parties
        </LinkButton>
      </>
    ),
  },
};
