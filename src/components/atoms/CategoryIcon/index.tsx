import Bedtime from "@mui/icons-material/Bedtime";
import EnergySavingsLeaf from "@mui/icons-material/EnergySavingsLeaf";
import Grass from "@mui/icons-material/Grass";
import Spa from "@mui/icons-material/Spa";
import type { SvgIconProps } from "@mui/material";

import { Category } from "@/models/enums";

const ICONS_BY_CATEGORY: Record<Category, typeof EnergySavingsLeaf> = {
  [Category.WomensHealth]: EnergySavingsLeaf,
  [Category.Sleep]: Bedtime,
  [Category.Nutrition]: Grass,
  [Category.Wellness]: Spa,
};

export interface CategoryIconProps extends SvgIconProps {
  category: Category;
}

export const CategoryIcon = ({ category, ...props }: CategoryIconProps) => {
  const Icon = ICONS_BY_CATEGORY[category];
  return <Icon {...props} />;
};
