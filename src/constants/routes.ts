import type { Category } from "@/models/enums";

export const ROUTES = {
  home: "/",
  contact: "/contact",
  category: (category: Category) => `/${category}`,
};
