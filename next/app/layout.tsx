import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { Locale, i18n } from '@/i18n.config';

import './globals.css';

import { SlugProvider } from './context/SlugContext';
import { Preview } from '@/components/preview';
import QwiloChatbot from '@/components/QwiloChatbot';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#06b6d4' },
    { media: '(prefers-color-scheme: dark)', color: '#06b6d4' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://qwilo.es'),
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || ''} />
        <link rel="dns-prefetch" href="https://attractive-captain-e67c81eb66.media.strapiapp.com" />
        <Preview />
        <SlugProvider>{children}</SlugProvider>
        <QwiloChatbot />
      </body>
    </html>
  );
}
