import { describe, expect, it } from "vitest";
import { axeTest, renderWithTheme, screen } from "../../../test-utils";
import { VPageHeader } from "./v-page-header";

describe("VPageHeader", () => {
  it("renders the title as the page heading", () => {
    renderWithTheme(<VPageHeader title="Users" />);
    expect(screen.getByRole("heading", { level: 1, name: "Users" })).toBeInTheDocument();
  });

  it("renders description, breadcrumb and actions when given", () => {
    renderWithTheme(
      <VPageHeader
        title="Users"
        description="People who can sign in"
        breadcrumb={<nav aria-label="Path">Admin</nav>}
        actions={<button type="button">Invite</button>}
      />,
    );
    expect(screen.getByText("People who can sign in")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Path" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithTheme(<VPageHeader title="Users" description="d" />);
    await axeTest(container);
  });
});
