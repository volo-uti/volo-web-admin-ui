import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { VSidebar, type VSidebarItem } from "@volo-uti/volo-web-admin-ui";
import { StorybookPageLayout, StorybookSection, StorybookSubsection } from "../../_components";

const items: VSidebarItem[] = [
  { key: "dashboard", label: "Dashboard", href: "#dashboard", icon: "▦" },
  {
    key: "manage",
    label: "Manage",
    children: [
      { key: "users", label: "Users", href: "#users", icon: "◉", badge: "12" },
      { key: "orders", label: "Orders", href: "#orders", icon: "▤" },
    ],
  },
  { key: "export", label: "Export", icon: "⇩" },
];

const meta: Meta<typeof VSidebar> = {
  title: "Components/Admin/VSidebar",
  component: VSidebar,
  tags: ["autodocs"],
  parameters: { controls: { sort: "none" } },
  args: { items, activeKey: "users", collapsed: false },
  render: (args) => (
    <div className="h-96 w-64 border border-[var(--v-border)]">
      <VSidebar {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof meta>;

// ─── Primary (hidden from sidebar, powers Docs controls) ───
export const Default: Story = { tags: ["!dev"] };

// ─── Showcase ───
export const Showcase: Story = {
  tags: ["!autodocs"],
  render: () => (
    <StorybookPageLayout
      title="VSidebar"
      description="Side navigation with groups, icon-only collapse and permission-aware entries."
    >
      <StorybookSection title="States">
        <StorybookSubsection title="expanded" labels={["VSidebar"]}>
          <div className="h-96 w-64 border border-[var(--v-border)]">
            <VSidebar
              aria-label="Expanded navigation"
              items={items}
              activeKey="users"
              onCollapsedChange={() => {}}
            />
          </div>
        </StorybookSubsection>
        <StorybookSubsection title="collapsed" labels={["VSidebar(collapsed)"]}>
          <div className="h-96 w-16 border border-[var(--v-border)]">
            <VSidebar
              aria-label="Collapsed navigation"
              items={items}
              activeKey="users"
              collapsed
              onCollapsedChange={() => {}}
            />
          </div>
        </StorybookSubsection>
      </StorybookSection>
    </StorybookPageLayout>
  ),
};
