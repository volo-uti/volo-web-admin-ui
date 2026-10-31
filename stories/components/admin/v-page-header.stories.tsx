import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { VPageHeader } from "@volo-uti/volo-web-admin-ui";
import { VBreadcrumb, VBreadcrumbItem, VButton } from "@volo-uti/volo-web-ui";
import { StorybookPageLayout, StorybookSection, StorybookSubsection } from "../../_components";

const meta: Meta<typeof VPageHeader> = {
  title: "Components/Admin/VPageHeader",
  component: VPageHeader,
  tags: ["autodocs"],
  args: { title: "Users", description: "People who can sign in" },
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
      title="VPageHeader"
      description="Page heading with breadcrumb, title, description and actions."
    >
      <StorybookSection title="Slots">
        <StorybookSubsection title="full" labels={["VPageHeader"]}>
          <div className="w-full">
            <VPageHeader
              title="Users"
              description="People who can sign in"
              breadcrumb={
                <VBreadcrumb>
                  <VBreadcrumbItem href="#">Admin</VBreadcrumbItem>
                  <VBreadcrumbItem active>Users</VBreadcrumbItem>
                </VBreadcrumb>
              }
              actions={<VButton>Invite</VButton>}
            />
          </div>
        </StorybookSubsection>
        <StorybookSubsection title="title only" labels={["VPageHeader"]}>
          <div className="w-full">
            <VPageHeader title="Settings" />
          </div>
        </StorybookSubsection>
      </StorybookSection>
    </StorybookPageLayout>
  ),
};
