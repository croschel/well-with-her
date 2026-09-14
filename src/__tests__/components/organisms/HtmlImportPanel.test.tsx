import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockSetValue, mockUseField } = vi.hoisted(() => ({
  mockSetValue: vi.fn(),
  mockUseField: vi.fn(),
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

import { HtmlImportPanel } from "@/components/organisms/HtmlImportPanel";

const mockFetch = vi.fn();

beforeEach(() => {
  mockSetValue.mockReset();
  mockUseField.mockReturnValue({ setValue: mockSetValue });
  vi.stubGlobal("fetch", mockFetch);
  mockFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HtmlImportPanel", () => {
  it("shows an error and does not call fetch when the textarea is empty", async () => {
    const user = userEvent.setup();
    render(<HtmlImportPanel />);

    await user.click(screen.getByRole("button", { name: "Import into article body" }));

    expect(await screen.findByText("Paste some HTML first.")).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("imports successfully and sets the mainArticleContent field value", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ content: { root: { children: [] } } }),
    });

    render(<HtmlImportPanel />);
    await user.type(
      screen.getByLabelText("Paste HTML to import"),
      "<p>hello</p>",
    );
    await user.click(screen.getByRole("button", { name: "Import into article body" }));

    expect(await screen.findByText(/Imported/)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/articles/import-html",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ html: "<p>hello</p>" }),
      }),
    );
    expect(mockSetValue).toHaveBeenCalledWith({ root: { children: [] } });
  });

  it("shows an error when the request fails", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({ ok: false });

    render(<HtmlImportPanel />);
    await user.type(screen.getByLabelText("Paste HTML to import"), "<p>x</p>");
    await user.click(screen.getByRole("button", { name: "Import into article body" }));

    expect(
      await screen.findByText("Import failed — check the HTML and try again."),
    ).toBeInTheDocument();
    expect(mockSetValue).not.toHaveBeenCalled();
  });

  it("shows an error when fetch itself throws", async () => {
    const user = userEvent.setup();
    mockFetch.mockRejectedValue(new Error("network down"));

    render(<HtmlImportPanel />);
    await user.type(screen.getByLabelText("Paste HTML to import"), "<p>x</p>");
    await user.click(screen.getByRole("button", { name: "Import into article body" }));

    expect(
      await screen.findByText("Import failed — check the HTML and try again."),
    ).toBeInTheDocument();
  });
});
