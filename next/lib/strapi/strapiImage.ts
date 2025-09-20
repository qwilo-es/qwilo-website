import { unstable_noStore as noStore } from 'next/cache';

export function getStrapiMedia(url: string | null) {
  const strapiURL = process.env.NEXT_PUBLIC_API_URL;
  
  console.log('getStrapiMedia called with:', { url, strapiURL });
  
  if (url == null) return null;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  if (url.startsWith('/')) {
    // Check if we're in browser environment before accessing document
    if (!strapiURL && typeof window !== 'undefined' && typeof document !== 'undefined' && document?.location.host.endsWith('.strapidemo.com')) {
      return `https://${document.location.host.replace('client-', 'api-')}${url}`;
    }
    
    if (!strapiURL) {
      console.error('NEXT_PUBLIC_API_URL is not defined and cannot construct media URL');
      return null;
    }

    return strapiURL + url;
  }
  return url;
}
