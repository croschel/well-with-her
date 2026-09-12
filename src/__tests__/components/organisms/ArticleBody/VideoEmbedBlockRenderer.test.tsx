import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VideoEmbedBlockRenderer } from "@/components/organisms/ArticleBody/blocks/VideoEmbedBlockRenderer";

describe("VideoEmbedBlockRenderer", () => {
  it("renders a play button and caption for a recognized URL", () => {
    render(
      <VideoEmbedBlockRenderer
        url="https://www.youtube.com/watch?v=abc123"
        caption="A caption"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Play video" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A caption")).toBeInTheDocument();
  });

  it("renders without a caption element when none is provided", () => {
    render(<VideoEmbedBlockRenderer url="https://youtu.be/abc123" />);

    expect(
      screen.getByRole("button", { name: "Play video" }),
    ).toBeInTheDocument();
  });

  it("renders nothing for an unrecognized URL", () => {
    const { container } = render(
      <VideoEmbedBlockRenderer url="https://example.com/video" />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
