import { Category } from "@/models/enums";

const CATEGORY_VALUES: string[] = Object.values(Category);

export const isCategory = (value: string): value is Category =>
  CATEGORY_VALUES.includes(value);
