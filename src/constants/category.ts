import { Category } from "@/models/enums";

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.WomensHealth]: "Women's Health",
  [Category.Sleep]: "Sleep",
  [Category.Nutrition]: "Nutrition",
  [Category.Wellness]: "Wellness",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  [Category.WomensHealth]: "Hormones, cycles, and caring for your body.",
  [Category.Sleep]: "Rest better, wake up brighter.",
  [Category.Nutrition]:
    "Simple, evidence-inspired food and supplement guidance.",
  [Category.Wellness]:
    "Everyday rituals for a calmer, more balanced life.",
};
