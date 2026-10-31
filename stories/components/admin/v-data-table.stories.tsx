import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { VDataTable } from "@volo-uti/volo-web-admin-ui";
import { StorybookPageLayout, StorybookSection, StorybookSubsection } from "../../_components";

interface Person {
  id: string;
  name: string;
  role: string;
}

const people: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Admin" },
  { id: "2", name: "Grace Hopper", role: "Editor" },
  { id: "3", name: "Alan Turing", role: "Viewer" },
];
const columns = [
  { key: "name", title: "Name" },
  { key: "role", title: "Role" },
];

const meta: Meta<typeof VDataTable<Person>> = {
  title: "Components/Admin/VDataTable",
  component: VDataTable<Person>,
  tags: ["autodocs"],
  args: { columns, data: people, rowKey: "id", loading: false, selectable: false },
};
export default meta;
type Story = StoryObj<typeof meta>;

// ─── Primary (hidden from sidebar, powers Docs controls) ───
export const Default: Story = { tags: ["!dev"] };

function Selectable() {
  const [keys, setKeys] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  return (
    <VDataTable<Person>
      columns={columns}
      data={people}
      rowKey="id"
      selectable
      selectedKeys={keys}
      onSelectedKeysChange={setKeys}
      page={page}
      pageCount={5}
      onPageChange={setPage}
      hoverable
    />
  );
}

// ─── Showcase ───
export const Showcase: Story = {
  tags: ["!autodocs"],
  render: () => (
    <StorybookPageLayout
      title="VDataTable"
      description="Table with row selection, loading and error states and pagination."
    >
      <StorybookSection title="States">
        <StorybookSubsection title="selectable with pages" labels={["VDataTable(selectable)"]}>
          <div className="w-full">
            <Selectable />
          </div>
        </StorybookSubsection>
        <StorybookSubsection title="loading" labels={["VDataTable(loading)"]}>
          <div className="w-full">
            <VDataTable<Person> columns={columns} data={people} rowKey="id" loading />
          </div>
        </StorybookSubsection>
        <StorybookSubsection title="error" labels={["VDataTable(error)"]}>
          <div className="w-full">
            <VDataTable<Person> columns={columns} data={[]} rowKey="id" error onRetry={() => {}} />
          </div>
        </StorybookSubsection>
        <StorybookSubsection title="empty" labels={["VDataTable"]}>
          <div className="w-full">
            <VDataTable<Person> columns={columns} data={[]} rowKey="id" />
          </div>
        </StorybookSubsection>
      </StorybookSection>
    </StorybookPageLayout>
  ),
};
