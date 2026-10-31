import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axeTest, renderWithTheme, screen, userEvent } from "../../../test-utils";
import { VListToolbar } from "./v-list-toolbar";

describe("VListToolbar", () => {
  it("shows the search field and reports edits", async () => {
    const onSearchChange = vi.fn();
    renderWithTheme(<VListToolbar search="" onSearchChange={onSearchChange} />);
    await userEvent.setup().type(screen.getByRole("searchbox", { name: "Search" }), "a");
    expect(onSearchChange).toHaveBeenCalledWith("a");
  });

  it("uses a custom search label", () => {
    renderWithTheme(<VListToolbar search="" searchPlaceholder="Find user" />);
    expect(screen.getByRole("searchbox", { name: "Find user" })).toBeInTheDocument();
  });

  it("omits the search field when neither search nor onSearchChange is given", () => {
    renderWithTheme(<VListToolbar actions={<button type="button">New</button>} />);
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });

  it("renders filters and actions", () => {
    renderWithTheme(
      <VListToolbar
        search=""
        filters={<span>Status filter</span>}
        actions={<button type="button">Export</button>}
      />,
    );
    expect(screen.getByText("Status filter")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("switches to the selection summary and bulk actions", async () => {
    const onClearSelection = vi.fn();
    renderWithTheme(
      <VListToolbar
        search=""
        selectedCount={3}
        bulkActions={<button type="button">Delete</button>}
        onClearSelection={onClearSelection}
      />,
    );
    expect(screen.getByText("3 selected")).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Clear selection" }));
    expect(onClearSelection).toHaveBeenCalled();
  });

  it("keeps uncontrolled search text and filter state while rows are selected", async () => {
    function Harness() {
      const [count, setCount] = useState(0);
      const [filter, setFilter] = useState("");
      return (
        <>
          <button type="button" onClick={() => setCount((c) => (c ? 0 : 1))}>
            toggle
          </button>
          <VListToolbar
            onSearchChange={() => {}}
            selectedCount={count}
            filters={
              <input
                aria-label="Status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            }
          />
        </>
      );
    }
    renderWithTheme(<Harness />);
    const user = userEvent.setup();
    await user.type(screen.getByRole("searchbox", { name: "Search" }), "abc");
    await user.type(screen.getByRole("textbox", { name: "Status" }), "open");
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("abc");
    expect(screen.getByRole("textbox", { name: "Status" })).toHaveValue("open");
  });

  it("keeps the live region mounted so the first selection is announced", () => {
    const { rerender } = renderWithTheme(<VListToolbar search="" />);
    const region = screen.getByRole("status");
    expect(region).toBeEmptyDOMElement();
    rerender(<VListToolbar search="" selectedCount={1} />);
    expect(screen.getByRole("status")).toBe(region);
    expect(region).toHaveTextContent("1 selected");
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithTheme(<VListToolbar search="" actions={<span>x</span>} />);
    await axeTest(container);
  });
});
