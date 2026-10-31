import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  VAdminProvider,
  VAdminShell,
  VPageHeader,
  VSidebar,
  type VSidebarItem,
} from "@volo-uti/volo-web-admin-ui";
import { VBreadcrumb, VBreadcrumbItem, VButton } from "@volo-uti/volo-web-ui";

const items: VSidebarItem[] = [
  { key: "dashboard", label: "Dashboard", href: "#dashboard", icon: "▦" },
  {
    key: "manage",
    label: "Manage",
    children: [
      { key: "users", label: "Users", href: "#users", icon: "◉", badge: "12" },
      { key: "orders", label: "Orders", href: "#orders", icon: "▤" },
      { key: "roles", label: "Roles", href: "#roles", icon: "◈", permission: "roles.read" },
    ],
  },
];

const meta: Meta<typeof VAdminShell> = {
  title: "Components/Admin/VAdminShell",
  component: VAdminShell,
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof meta>;

/** The roles entry is hidden because the permission check denies `roles.read`. */
export const Showcase: Story = {
  render: () => (
    <VAdminProvider can={(permission) => permission !== "roles.read"}>
      <VAdminShell
        title="Console"
        actions={<VButton variant="text">Sign out</VButton>}
        sidebar={({ collapsed, setCollapsed }) => (
          <VSidebar
            items={items}
            activeKey="users"
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            header={<strong>{collapsed ? "C" : "Console"}</strong>}
          />
        )}
      >
        <VPageHeader
          title="Users"
          description="People who can sign in"
          breadcrumb={
            <VBreadcrumb>
              <VBreadcrumbItem href="#dashboard">Dashboard</VBreadcrumbItem>
              <VBreadcrumbItem active>Users</VBreadcrumbItem>
            </VBreadcrumb>
          }
          actions={<VButton>Invite</VButton>}
        />
      </VAdminShell>
    </VAdminProvider>
  ),
};
