import { describe, expect, it, vi } from "vitest";
import { axeTest, renderWithTheme, screen, userEvent, within } from "../../../test-utils";
import { VSidebar } from "../v-sidebar";
import { VAdminShell } from "./v-admin-shell";

const items = [
  { key: "home", label: "Home", href: "#home" },
  { key: "users", label: "Users", href: "#users" },
];

const shell = (props = {}) => (
  <VAdminShell
    title="Console"
    sidebar={({ collapsed, setCollapsed }) => (
      <VSidebar items={items} collapsed={collapsed} onCollapsedChange={setCollapsed} />
    )}
    {...props}
  >
    <p>Page body</p>
  </VAdminShell>
);

describe("VAdminShell", () => {
  it("renders the title, the content landmark and a skip link", () => {
    renderWithTheme(shell());
    expect(screen.getByText("Console")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Page body");
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
      "href",
      "#v-admin-main",
    );
  });

  it("accepts a plain node as the sidebar", () => {
    renderWithTheme(<VAdminShell sidebar={<VSidebar items={items} />}>x</VAdminShell>);
    expect(screen.getAllByRole("link", { name: "Home" }).length).toBeGreaterThan(0);
  });

  it("collapses the desktop sidebar through the render function state", async () => {
    const onCollapsedChange = vi.fn();
    renderWithTheme(shell({ onCollapsedChange }));
    await userEvent.setup().click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });

  it("follows a controlled collapsed value", () => {
    renderWithTheme(shell({ collapsed: true }));
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });

  it("opens the menu drawer from the top bar and closes it when an entry is pressed", async () => {
    const user = userEvent.setup();
    renderWithTheme(shell());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    await user.click(within(dialog).getByRole("link", { name: "Users" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("names the menu dialog and closes it from a close button", async () => {
    const user = userEvent.setup();
    renderWithTheme(shell());
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    await user.click(within(dialog).getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has no accessibility violations with the menu open", async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(shell());
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await axeTest(container);
  });

  it("shows no collapse button inside the menu", async () => {
    const user = userEvent.setup();
    renderWithTheme(shell());
    expect(screen.getByRole("button", { name: "Collapse sidebar" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      within(screen.getByRole("dialog")).queryByRole("button", { name: /sidebar/ }),
    ).not.toBeInTheDocument();
  });

  it("keeps the menu open for prevented and modified clicks on an entry", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      shell({
        sidebar: () => (
          <VSidebar
            items={items}
            renderLink={(item, props) => (
              <a
                href={item.href}
                {...props}
                onClick={(event) => {
                  if (item.key === "home") event.preventDefault();
                }}
              />
            )}
          />
        ),
      }),
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("link", { name: "Home" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Control>}");
    await user.click(within(screen.getByRole("dialog")).getByRole("link", { name: "Users" }));
    await user.keyboard("{/Control}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(within(screen.getByRole("dialog")).getByRole("link", { name: "Users" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithTheme(shell());
    await axeTest(container);
  });
});
