import { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Inter } from 'next/font/google';
import React from 'react';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { CartProvider } from '@/context/cart-context';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

// Default Global SEO for pages without them
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  console.log('generateMetadata called for locale:', params.locale);

  try {
    const pageData = await fetchContentType(
      'global',
      {
        filters: { locale: params.locale },
        populate: 'seo.metaImage',
      },
      true
    );

    console.log('Global page data fetched:', pageData);
    const seo = pageData?.seo;
    const metadata = generateMetadataObject(seo);
    console.log('Generated metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    // Return safe default metadata
    return generateMetadataObject(null);
  }
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  console.log('LocaleLayout: Starting rendering...');

  let params;
  try {
    params = await props.params;
    console.log('LocaleLayout: Params resolved:', params);
  } catch (error) {
    console.error('LocaleLayout: Error resolving params:', error);
    // Return a safe fallback
    return (
      <html lang="en">
        <body className="bg-charcoal text-white">
          <div>Error loading page</div>
        </body>
      </html>
    );
  }

  const { locale } = params;
  const { children } = props;

  console.log('LocaleLayout: About to fetch global data for locale:', locale);

  let pageData;
  try {
    pageData = await fetchContentType('global', { locale }, true);
    console.log('LocaleLayout: Global data fetched successfully:', !!pageData);
  } catch (error) {
    console.error('LocaleLayout: Error fetching global data:', error);
    pageData = null;
  }

  // Fallback if global content doesn't exist
  const globalData = pageData || { navbar: null, footer: null };
  console.log('LocaleLayout: Using global data:', {
    hasNavbar: !!globalData.navbar,
    hasFooter: !!globalData.footer,
  });

  console.log('LocaleLayout: About to render components...');

  try {
    return (
      <ViewTransitions>
        <CartProvider>
          <div
            className={cn(
              inter.className,
              'bg-charcoal antialiased h-full w-full'
            )}
          >
            <Navbar data={globalData.navbar} locale={locale} />
            {children}
            <Footer data={globalData.footer} locale={locale} />
          </div>
        </CartProvider>
      </ViewTransitions>
    );
  } catch (error) {
    console.error('LocaleLayout: Error rendering components:', error);
    // Return a minimal fallback
    return (
      <html lang={locale}>
        <body className="bg-charcoal text-white">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1>Loading...</h1>
              <p>Setting up your experience...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }
}
