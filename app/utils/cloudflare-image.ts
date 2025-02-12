interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'avif' | 'webp' | 'jpeg' | 'png';
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
}

export function getCloudflareImageUrl(imageId: string, options: ImageOptions = {}): string {
  const accountHash = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH;
  const isDev = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';

  // For the resume image in development
  if (isDev && imageId === process.env.NEXT_PUBLIC_RESUME_IMAGE_ID) {
    return '/resume/resume.webp';
  }

  if (!accountHash || !imageId) {
    console.warn('Required environment variables are not set');
    return '';
  }

  const params = new URLSearchParams();
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);
  if (options.fit) params.append('fit', options.fit);

  // Default to 'public' variant if no options are specified
  const variant = Object.keys(options).length > 0 ? `custom?${params.toString()}` : 'public';
  return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`;
}
