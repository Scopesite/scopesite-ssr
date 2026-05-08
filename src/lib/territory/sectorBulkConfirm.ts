/** Bulk sector UI: confirm before applying changes that touch many rows. */
export function shouldPromptBulkSectorConfirm(affectedCount: number): boolean {
  return affectedCount >= 10;
}
