import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CtaBlockRenderer } from "@/components/organisms/ArticleBody/blocks/CtaBlockRenderer";

const URL = "https://example.com/shop";

describe("CtaBlockRenderer", () => {
  it("renders a buy button with the block's label and URL", () => {
    render(<CtaBlockRenderer label="Shop this pick →" url={URL} />);

    expect(
      screen.getByRole("link", { name: "Shop this pick →" }),
    ).toHaveAttribute("href", URL);
  });

  it("keeps the original behavior for blocks saved without styling fields", () => {
    render(<CtaBlockRenderer label="Shop" url={URL} />);

    const link = screen.getByRole("link", { name: "Shop" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener sponsored");
    expect(link.className).toContain("MuiButton-contained");
  });

  it("treats null styling fields (as Payload stores them) like missing ones", () => {
    render(
      <CtaBlockRenderer
        label="Shop"
        url={URL}
        style={null}
        alignment={null}
        size={null}
        openInNewTab={null}
        sponsored={null}
      />,
    );

    const link = screen.getByRole("link", { name: "Shop" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener sponsored");
  });

  it("renders a plain text link instead of a button for the link style", () => {
    render(<CtaBlockRenderer label="Read more" url={URL} style="link" />);

    const link = screen.getByRole("link", { name: "Read more" });
    expect(link.className).not.toContain("MuiButton");
    expect(link.className).toContain("MuiLink");
  });

  it("applies the custom background and text colors to a button", () => {
    render(
      <CtaBlockRenderer
        label="Shop"
        url={URL}
        backgroundColor="#112233"
        textColor="#ffffff"
      />,
    );

    const link = screen.getByRole("link", { name: "Shop" });
    expect(link).toHaveStyle({
      backgroundColor: "rgb(17, 34, 51)",
      color: "rgb(255, 255, 255)",
    });
  });

  it("applies only the text color to a link", () => {
    render(
      <CtaBlockRenderer
        label="Read more"
        url={URL}
        style="link"
        textColor="#445566"
        backgroundColor="#112233"
      />,
    );

    const link = screen.getByRole("link", { name: "Read more" });
    expect(link).toHaveStyle({ color: "rgb(68, 85, 102)" });
    expect(link).not.toHaveStyle({ backgroundColor: "rgb(17, 34, 51)" });
  });

  it.each(["left", "center", "right"] as const)(
    "aligns the block %s",
    (alignment) => {
      const { container } = render(
        <CtaBlockRenderer label="Shop" url={URL} alignment={alignment} />,
      );

      expect(container.firstChild).toHaveStyle({ textAlign: alignment });
    },
  );

  it.each([
    ["small", "MuiButton-sizeSmall"],
    ["large", "MuiButton-sizeLarge"],
  ] as const)("renders the %s size", (size, className) => {
    render(<CtaBlockRenderer label="Shop" url={URL} size={size} />);

    expect(screen.getByRole("link", { name: "Shop" }).className).toContain(
      className,
    );
  });

  it("opens in the same tab when openInNewTab is off", () => {
    render(<CtaBlockRenderer label="Shop" url={URL} openInNewTab={false} />);

    expect(screen.getByRole("link", { name: "Shop" })).not.toHaveAttribute(
      "target",
    );
  });

  it("omits rel=sponsored when the link isn't an affiliate link", () => {
    render(<CtaBlockRenderer label="Shop" url={URL} sponsored={false} />);

    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute(
      "rel",
      "noopener",
    );
  });
});
