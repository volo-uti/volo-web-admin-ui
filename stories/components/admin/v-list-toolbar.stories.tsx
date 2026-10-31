import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { VListToolbar } from "@volo-uti/volo-web-admin-ui";
import { VButton } from "@volo-uti/volo-web-ui";
import { StorybookPageLayout, StorybookSection, StorybookSubsection } from "../../_components";

const meta: Meta<typeof VListToolbar> = {
  title: "Components/Admin/VListToolbar",
  component: VListToolbar,
  tags: ["autodocs"],
  args: { search: "", selectedCount: 0 },
};
export default meta;
type Story = StoryObj<typeof meta>;

// ─── Primary (hidden from sidebar, powers Docs controls) ───
export const Default: Story = { tags: ["!dev"] };

function Searchable() {
  const [search, setSearch] = useState("");
  return (
    <VListToolbar
      search={search}
      onSearchChange={setSearch}
      actions={<VButton>New user</VButton>}
    />
  );
}

// ─── Showcase ───
export const Showcase: Story = {
  tags: ["!autodocs"],
  render: () => (
    <StorybookPageLayout
      title="VListToolbar"
      description="Bar above a list with search, filters, actions and a bulk-action mode."
    >
      <StorybookSection title="Modes">
        <StorybookSubsection title="search and actions" labels={["VListToolbar"]}>
          <div className="w-full">
            <Searchable />
          </div>
        </StorybookSubsection>
        <StorybookSubsection title="rows selected" labels={["VListToolbar(selectedCount)"]}>
          <div className="w-full">
            <VListToolbar
              selectedCount={3}
              bulkActions={<VButton variant="outlined">Delete</VButton>}
              onClearSelection={() => {}}
            />
          </div>
        </StorybookSubsection>
      </StorybookSection>
    </StorybookPageLayout>
  ),
};
