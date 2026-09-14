// Client-side service wrapping the HTML import endpoint — kept out of
// HtmlImportPanel so the UI component only deals with form state/rendering,
// not the network call itself.
export class ArticleHtmlImportError extends Error {}

export const importArticleHtml = async (html: string): Promise<unknown> => {
  const response = await fetch("/api/articles/import-html", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  });

  if (!response.ok) {
    throw new ArticleHtmlImportError(`Import failed with status ${response.status}`);
  }

  const { content } = (await response.json()) as { content: unknown };
  return content;
};
