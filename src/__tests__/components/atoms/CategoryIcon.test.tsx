import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryIcon } from "@/components/atoms/CategoryIcon";
import { Category } from "@/models/enums";

describe("CategoryIcon", () => {
  it.each(Object.values(Category))(
    "renders an svg icon for %s",
    (category) => {
      const { container } = render(<CategoryIcon category={category} />);
      expect(container.querySelector("svg")).not.toBeNull();
    },
  );

  it("forwards SvgIconProps such as fontSize", () => {
    const { container } = render(
      <CategoryIcon category={Category.Sleep} fontSize="small" />,
    );
    expect(container.querySelector("svg")).toHaveClass("MuiSvgIcon-fontSizeSmall");
  });
});
