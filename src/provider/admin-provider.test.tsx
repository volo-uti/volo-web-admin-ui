import { memo } from "react";
import { describe, expect, it } from "vitest";
import { renderWithTheme, screen } from "../test-utils";
import { VListToolbar } from "../components/data-display/v-list-toolbar";
import { VAccess, VAdminProvider, useAdminLocaleText, useCan } from "./admin-provider";

function Probe() {
  const text = useAdminLocaleText();
  const can = useCan();
  return (
    <p>
      {text.sidebarLabel}|{String(can("users.delete"))}
    </p>
  );
}

describe("VAdminProvider", () => {
  it("falls back to English text and allows everything without a provider", () => {
    renderWithTheme(<Probe />);
    expect(screen.getByText("Main navigation|true")).toBeInTheDocument();
  });

  it("merges localeText overrides over the English defaults", () => {
    renderWithTheme(
      <VAdminProvider localeText={{ sidebarLabel: "Menu" }}>
        <Probe />
      </VAdminProvider>,
    );
    expect(screen.getByText("Menu|true")).toBeInTheDocument();
  });

  it("passes the permission check to useCan", () => {
    renderWithTheme(
      <VAdminProvider can={(p) => p === "users.read"}>
        <Probe />
      </VAdminProvider>,
    );
    expect(screen.getByText("Main navigation|false")).toBeInTheDocument();
  });

  it("ignores localeText entries that are undefined", () => {
    renderWithTheme(
      <VAdminProvider localeText={{ toolbarSearch: undefined, toolbarSelected: undefined }}>
        <VListToolbar search="" selectedCount={0} />
        <VListToolbar selectedCount={2} />
      </VAdminProvider>,
    );
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  it("inherits the permission check and the texts of the enclosing provider", () => {
    renderWithTheme(
      <VAdminProvider can={() => false} localeText={{ toolbarSearch: "OUTER" }}>
        <VAdminProvider localeText={{ sidebarLabel: "inner" }}>
          <Probe />
          <VListToolbar search="" />
        </VAdminProvider>
      </VAdminProvider>,
    );
    expect(screen.getByText("inner|false")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "OUTER" })).toBeInTheDocument();
  });

  it("lets a nested provider replace the permission check", () => {
    renderWithTheme(
      <VAdminProvider can={() => false}>
        <VAdminProvider can={() => true}>
          <Probe />
        </VAdminProvider>
      </VAdminProvider>,
    );
    expect(screen.getByText("Main navigation|true")).toBeInTheDocument();
  });

  it("does not re-render consumers when an inline localeText has equal entries", () => {
    let renders = 0;
    const Counter = memo(function Counter() {
      renders += 1;
      return <p>{useAdminLocaleText().sidebarLabel}</p>;
    });
    const can = () => true;
    const ui = (n: number) => (
      <VAdminProvider localeText={{ sidebarLabel: "Menu" }} can={can}>
        <span>{n}</span>
        <Counter />
      </VAdminProvider>
    );
    const { rerender } = renderWithTheme(ui(1));
    rerender(ui(2));
    expect(renders).toBe(1);
  });
});

describe("VAccess", () => {
  const ui = (can: (p: string) => boolean) => (
    <VAdminProvider can={can}>
      <VAccess permission="users.delete" fallback={<span>no access</span>}>
        <button type="button">Delete</button>
      </VAccess>
    </VAdminProvider>
  );

  it("renders the children when allowed", () => {
    renderWithTheme(ui(() => true));
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("renders the fallback when denied", () => {
    renderWithTheme(ui(() => false));
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
    expect(screen.getByText("no access")).toBeInTheDocument();
  });
});
