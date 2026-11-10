import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { PageTitle } from "./PageTitle";
import { renderSmoke } from "../../test-utils";

describe("PageTitle", () => {
  // A: Renderability
  it("renders with required title prop", () => {
    renderSmoke(PageTitle, { title: "Dashboard" });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <PageTitle
        title="Transactions"
        subtitle="View all your transactions"
        breadcrumb={<nav>Home / Transactions</nav>}
        actions={<button>Export</button>}
      />,
    );
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("View all your transactions")).toBeInTheDocument();
    expect(screen.getByText("Home / Transactions")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the root div", () => {
    const { container } = render(
      <PageTitle title="Test" className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("has page-title class on root", () => {
    const { container } = render(<PageTitle title="Test" />);
    expect(container.querySelector(".page-title")).toBeInTheDocument();
  });

  // C: Composability
  it("accepts ReactNode for breadcrumb slot", () => {
    render(
      <PageTitle
        title="Page"
        breadcrumb={<div data-testid="custom-breadcrumb">Crumb</div>}
      />,
    );
    expect(screen.getByTestId("custom-breadcrumb")).toBeInTheDocument();
  });

  it("accepts ReactNode for actions slot", () => {
    render(
      <PageTitle
        title="Page"
        actions={
          <div>
            <button>Action 1</button>
            <button>Action 2</button>
          </div>
        }
      />,
    );
    expect(screen.getByRole("button", { name: "Action 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action 2" })).toBeInTheDocument();
  });

  it("shows a back button that calls onBack", async () => {
    const onBack = vi.fn();
    render(<PageTitle title="Transfer In" onBack={onBack} />);
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("has no back button without onBack", () => {
    render(<PageTitle title="Transfer In" />);
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
  });

  it("renders an inline icon before the title", () => {
    const { container } = render(<PageTitle title="Transfer In" icon="add" />);
    expect(container.querySelector(".page-title__h1 [data-icon='add']")).not.toBeNull();
  });
});
