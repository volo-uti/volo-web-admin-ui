import { describe, expect, it, vi } from "vitest";
import { axeTest, renderWithTheme, screen, userEvent } from "../../../test-utils";
import { VAdminProvider } from "../../../provider";
import { VSidebar } from "./v-sidebar";
import type { VSidebarItem } from "./v-sidebar.types";

const items: VSidebarItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "reports", label: "Reports" },
  {
    key: "manage",
    label: "Manage",
    children: [
      { key: "users", label: "Users", href: "/users", permission: "users.read" },
      { key: "roles", label: "Roles", href: "/roles", permission: "roles.read" },
    ],
  },
];

describe("VSidebar", () => {
  it("renders a labelled navigation with links and a group heading", () => {
    renderWithTheme(<VSidebar items={items} />);
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Manage")).toBeInTheDocument();
  });

  it("marks the active entry with aria-current", () => {
    renderWithTheme(<VSidebar items={items} activeKey="home" />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Users" })).not.toHaveAttribute("aria-current");
  });

  it("reports an entry without href through onItemSelect", async () => {
    const onItemSelect = vi.fn();
    renderWithTheme(<VSidebar items={items} onItemSelect={onItemSelect} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Reports" }));
    expect(onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ key: "reports" }));
  });

  it("hides entries the permission check denies and drops empty groups", () => {
    renderWithTheme(
      <VAdminProvider can={(p) => p === "users.read"}>
        <VSidebar items={items} />
      </VAdminProvider>,
    );
    expect(screen.getByRole("link", { name: "Users" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Roles" })).not.toBeInTheDocument();

    renderWithTheme(
      <VAdminProvider can={() => false}>
        <VSidebar items={[items[2]!]} />
      </VAdminProvider>,
    );
    expect(screen.getAllByText("Manage")).toHaveLength(1);
  });

  it("keeps the accessible name when collapsed", () => {
    renderWithTheme(<VSidebar items={items} collapsed />);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("shows the collapse button only with onCollapsedChange and toggles", async () => {
    const onCollapsedChange = vi.fn();
    const { rerender } = renderWithTheme(<VSidebar items={items} />);
    expect(screen.queryByRole("button", { name: "Collapse sidebar" })).not.toBeInTheDocument();
    rerender(<VSidebar items={items} onCollapsedChange={onCollapsedChange} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it("draws links through renderLink", () => {
    renderWithTheme(
      <VSidebar
        items={items}
        renderLink={(item, props) => (
          <span data-testid="custom" {...props}>
            {props.children}
          </span>
        )}
      />,
    );
    expect(screen.getAllByTestId("custom").length).toBeGreaterThan(0);
  });

  it("renders header and footer slots", () => {
    renderWithTheme(<VSidebar items={items} header={<b>Brand</b>} footer={<i>User</i>} />);
    expect(screen.getByText("Brand")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("exposes the collapse button by its flipping label only, without aria-pressed", () => {
    renderWithTheme(<VSidebar items={items} collapsed onCollapsedChange={() => {}} />);
    const button = screen.getByRole("button", { name: "Expand sidebar" });
    expect(button).not.toHaveAttribute("aria-pressed");
  });

  it("uses the whole first character of an emoji label as the fallback icon", () => {
    renderWithTheme(<VSidebar items={[{ key: "fun", label: "\u{1F680} Launch", href: "/" }]} />);
    expect(
      screen.getByRole("link", { name: "\u{1F680} Launch" }).firstElementChild,
    ).toHaveTextContent(/^\u{1F680}$/u);
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithTheme(
      <VSidebar items={items} activeKey="home" onCollapsedChange={() => {}} />,
    );
    await axeTest(container);
  });
});
