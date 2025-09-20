export const defaultLocale = 'es' as const;
export const locales = ['es'] as const;

export type Locale = (typeof locales)[number];

export const pathnames = {};
export const localePrefix = 'always';

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_URL
  ? `https://${process.env.WEBSITE_URL}`
  : `http://localhost:${port}`;
