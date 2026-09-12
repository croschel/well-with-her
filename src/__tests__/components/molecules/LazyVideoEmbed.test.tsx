import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LazyVideoEmbed } from "@/components/molecules/LazyVideoEmbed";

describe("LazyVideoEmbed", () => {
  it("shows a play button and no iframe before load", () => {
    render(
      <LazyVideoEmbed
        video={{
          provider: "youtube",
          embedUrl: "https://www.youtube.com/embed/abc123",
          thumbnailUrl: "https://img.youtube.com/vi/abc123/hqdefault.jpg",
        }}
        title="A demo video"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Play video" }),
    ).toBeInTheDocument();
    expect(screen.queryByTitle("A demo video")).not.toBeInTheDocument();
  });

  it("loads the real iframe with autoplay after the play button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <LazyVideoEmbed
        video={{
          provider: "vimeo",
          embedUrl: "https://player.vimeo.com/video/123456",
        }}
        title="A demo video"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Play video" }));

    const iframe = screen.getByTitle("A demo video");
    expect(iframe).toHaveAttribute(
      "src",
      "https://player.vimeo.com/video/123456?autoplay=1",
    );
  });
});
