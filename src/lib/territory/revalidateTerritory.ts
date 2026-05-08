import { revalidateTag } from 'next/cache';

export function revalidateTerritoryPublicCache(): void {
  try {
    revalidateTag('territory', 'default');
  } catch {
    // revalidateTag is a no-op outside the Next cache context (e.g. tests).
  }
}
