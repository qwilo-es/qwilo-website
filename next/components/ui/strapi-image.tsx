import { unstable_noStore as noStore } from 'next/cache';
import Image from 'next/image';
import { ComponentProps } from 'react';

interface StrapiImageProps
  extends Omit<ComponentProps<typeof Image>, 'src' | 'alt'> {
  src: string;
  alt: string | null;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function getStrapiMedia(url: string | null) {
  const strapiURL = process.env.NEXT_PUBLIC_API_URL;
  if (url == null) return null;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  if (url.startsWith('/')) {
    if (!strapiURL && typeof window !== 'undefined' && window?.location?.host?.endsWith('.strapidemo.com')) {
      return `https://${window.location.host.replace('client-', 'api-')}${url}`;
    }
    return strapiURL + url;
  }
  return `${strapiURL}${url}`;
}

export function StrapiImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  ...rest
}: Readonly<StrapiImageProps>) {
  noStore();
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;

  // Provide default dimensions if not specified to prevent CLS
  const imgWidth = width || 1200;
  const imgHeight = height || 800;

  return (
    <Image
      src={imageUrl}
      alt={alt ?? 'No alternative text provided'}
      width={imgWidth}
      height={imgHeight}
      className={className}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      {...rest}
    />
  );
}
