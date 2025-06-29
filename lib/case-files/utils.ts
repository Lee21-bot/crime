/**
 * Generates a URL-friendly slug from a title
 * @param title The title to convert to a slug
 * @returns A URL-friendly slug
 */
export async function generateSlug(title: string): Promise<string> {
  // Convert to lowercase and replace spaces with hyphens
  let slug = title.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen

  return slug
} 