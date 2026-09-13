import { revalidatePath } from "next/cache";

import { ROUTES } from "@/constants/routes";
import type { Category } from "@/models/enums";

export interface RevalidateArticleParams {
  category: string;
  pinId: string;
  slug: string;
}

// Called from Payload collection hooks, which also fire for writes made
// outside a Next.js request (e.g. `payload run scripts/seed.ts`).
// `revalidatePath` throws when there's no active Next.js request context —
// nothing is cached yet in that case, so it's safe to swallow.
export const revalidateArticlePaths = ({
  category,
  pinId,
  slug,
}: RevalidateArticleParams): void => {
  try {
    revalidatePath(
      ROUTES.article({ category: category as Category, pinId, slug }),
    );
    revalidatePath(ROUTES.category(category as Category));
    revalidatePath(ROUTES.home);
  } catch {
    // See note above.
  }
};
