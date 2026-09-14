import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockSetValue, mockUseField, mockImportArticleHtml } = vi.hoisted(() => ({
  mockSetValue: vi.fn(),
  mockUseField: vi.fn(),
  mockImportArticleHtml: vi.fn(),
}));

vi.mock("@payloadcms/ui", () => ({
  useField: mockUseField,
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock("@/services/importArticleHtml", () => ({
  importArticleHtml: mockImportArticleHtml,
}));

import { HtmlImportPanel } from "@/components/organisms/HtmlImportPanel";

beforeEach(() => {
  mockSetValue.mockReset();
  mockUseField.mockReturnValue({ setValue: mockSetValue });
  mockImportArticleHtml.mockReset();
});

describe("HtmlImportPanel", () => {
  it("shows an error and does not call the import service when the textarea is empty", async () => {
    const user = userEvent.setup();
    render(<HtmlImportPanel />);

    await user.click(screen.getByRole("button", { name: "Import into article body" }));

    expect(await screen.findByText("Paste some HTML first.")).toBeInTheDocument();
    expect(mockImportArticleHtml).not.toHaveBeenCalled();
  });

  it("imports successfully and sets the mainArticleContent field value", async () => {
    const user = userEvent.setup();
    mockImportArticleHtml.mockResolvedValue({ root: { children: [] } });

    render(<HtmlImportPanel />);
    await user.type(
      screen.getByLabelText("Paste HTML to import"),
      "<p>hello</p>",
    );
    await user.click(screen.getByRole("button", { name: "Import into article body" }));

    expect(await screen.findByText(/Imported/)).toBeInTheDocument();
    expect(mockImportArticleHtml).toHaveBeenCalledWith("<p>hello</p>");
    expect(mockSetValue).toHaveBeenCalledWith({ root: { children: [] } });
  });

  it("shows an error when the import service rejects", async () => {
    const user = userEvent.setup();
    mockImportArticleHtml.mockRejectedValue(new Error("Import failed with status 500"));

    render(<HtmlImportPanel />);
    await user.type(screen.getByLabelText("Paste HTML to import"), "<p>x</p>");
    await user.click(screen.getByRole("button", { name: "Import into article body" }));

    expect(
      await screen.findByText("Import failed — check the HTML and try again."),
    ).toBeInTheDocument();
    expect(mockSetValue).not.toHaveBeenCalled();
  });
});
