import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axeTest, renderWithTheme, screen, userEvent } from "../../../test-utils";
import { VDataTable } from "./v-data-table";

interface Row {
  id: string;
  name: string;
}
const columns = [{ key: "name", title: "Name" }];
const noKeys: string[] = [];
const rows: Row[] = [
  { id: "a", name: "Ada" },
  { id: "b", name: "Grace" },
];

function Selectable({ onChange }: { onChange?: (keys: string[]) => void }) {
  const [keys, setKeys] = useState<string[]>([]);
  return (
    <VDataTable<Row>
      columns={columns}
      data={rows}
      rowKey="id"
      selectable
      selectedKeys={keys}
      onSelectedKeysChange={(next) => {
        setKeys(next);
        onChange?.(next);
      }}
    />
  );
}

describe("VDataTable", () => {
  it("renders rows", () => {
    renderWithTheme(<VDataTable<Row> columns={columns} data={rows} rowKey="id" />);
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("accepts a function as rowKey", () => {
    renderWithTheme(<VDataTable<Row> columns={columns} data={rows} rowKey={(row) => row.id} />);
    expect(screen.getByText("Grace")).toBeInTheDocument();
  });

  it("shows the empty message when there are no rows", () => {
    renderWithTheme(<VDataTable<Row> columns={columns} data={[]} rowKey="id" />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("selects and unselects single rows", async () => {
    const onChange = vi.fn();
    renderWithTheme(<Selectable onChange={onChange} />);
    const user = userEvent.setup();
    const [, first] = screen.getAllByRole("checkbox");
    await user.click(first!);
    expect(onChange).toHaveBeenLastCalledWith(["a"]);
    await user.click(first!);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("selects every row on the page from the header checkbox, then clears them", async () => {
    const onChange = vi.fn();
    renderWithTheme(<Selectable onChange={onChange} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("keeps selected keys of other pages when toggling all", async () => {
    const onChange = vi.fn();
    renderWithTheme(
      <VDataTable<Row>
        columns={columns}
        data={rows}
        rowKey="id"
        selectable
        selectedKeys={["z"]}
        onSelectedKeysChange={onChange}
      />,
    );
    await userEvent.setup().click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(onChange).toHaveBeenCalledWith(["z", "a", "b"]);
  });

  it("shows placeholder rows while loading", () => {
    renderWithTheme(<VDataTable<Row> columns={columns} data={rows} rowKey="id" loading />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Ada")).not.toBeInTheDocument();
  });

  it("shows the error state with a retry button", async () => {
    const onRetry = vi.fn();
    renderWithTheme(
      <VDataTable<Row> columns={columns} data={rows} rowKey="id" error onRetry={onRetry} />,
    );
    expect(screen.getByText("Could not load the data")).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("shows a custom error node without a retry button", () => {
    renderWithTheme(
      <VDataTable<Row> columns={columns} data={rows} rowKey="id" error="Server down" />,
    );
    expect(screen.getByText("Server down")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();
  });

  it("shows pagination only above one page and reports page changes", async () => {
    const onPageChange = vi.fn();
    const { rerender } = renderWithTheme(
      <VDataTable<Row> columns={columns} data={rows} rowKey="id" page={1} pageCount={1} />,
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    rerender(
      <VDataTable<Row>
        columns={columns}
        data={rows}
        rowKey="id"
        page={1}
        pageCount={3}
        onPageChange={onPageChange}
      />,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls the latest onSelectedKeysChange even when columns and data keep their identity", async () => {
    const first = vi.fn();
    const second = vi.fn();
    const ui = (onSelectedKeysChange: (keys: string[]) => void) => (
      <VDataTable<Row>
        columns={columns}
        data={rows}
        rowKey="id"
        selectable
        selectedKeys={noKeys}
        onSelectedKeysChange={onSelectedKeysChange}
      />
    );
    const { rerender } = renderWithTheme(ui(first));
    rerender(ui(second));
    await userEvent.setup().click(screen.getAllByRole("checkbox")[1]!);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(["a"]);
  });

  it("uses the latest rowKey when columns and data keep their identity", async () => {
    interface Coded extends Row {
      code: string;
    }
    const coded: Coded[] = [{ id: "a", code: "x", name: "Ada" }];
    const onChange = vi.fn();
    const ui = (rowKey: "id" | "code") => (
      <VDataTable<Coded>
        columns={columns}
        data={coded}
        rowKey={rowKey}
        selectable
        selectedKeys={noKeys}
        onSelectedKeysChange={onChange}
      />
    );
    const { rerender } = renderWithTheme(ui("id"));
    rerender(ui("code"));
    await userEvent.setup().click(screen.getAllByRole("checkbox")[1]!);
    expect(onChange).toHaveBeenCalledWith(["x"]);
  });

  it("selects only the clicked row when rows lack the key field", async () => {
    const keyless = [{ name: "Ada" }, { name: "Grace" }] as unknown as Row[];
    renderWithTheme(
      <VDataTable<Row>
        columns={columns}
        data={keyless}
        rowKey="id"
        selectable
        selectedKeys={["1"]}
        onSelectedKeysChange={() => {}}
      />,
    );
    const [, first, second] = screen.getAllByRole("checkbox");
    expect(first).not.toBeChecked();
    expect(second).toBeChecked();
  });

  it("announces loading with localized text", () => {
    renderWithTheme(<VDataTable<Row> columns={columns} data={rows} rowKey="id" loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithTheme(<Selectable />);
    await axeTest(container);
  });
});
