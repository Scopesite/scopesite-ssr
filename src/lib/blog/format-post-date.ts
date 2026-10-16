/** Shared display helper kept separate from the server-side Ghost/correction client. */
export function formatPostDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
