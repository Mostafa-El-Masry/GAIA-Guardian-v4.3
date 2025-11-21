const EXTENSION_PATTERN = /\.(png|jpe?g|gif|webp|bmp|tiff|heic|heif|mp4|mov|mkv|avi|webm|m4v|flv|wmv)$/i;

/**
 * Remove common image/video extensions for display-only labels.
 */
export function formatMediaTitle(title: string): string {
  return title.replace(EXTENSION_PATTERN, '');
}

