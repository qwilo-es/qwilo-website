import { Metadata } from 'next';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  try {
    const pageData = await fetchContentType(
      'pages',
      {
        filters: {
          slug: 'homepage',
          locale: params.locale,
        },
        populate: 'seo.metaImage',
      },
      true
    );

    const seo = pageData?.seo;
    const metadata = generateMetadataObject(seo);
    return metadata;
  } catch (error) {
    console.log('Failed to fetch homepage metadata from Strapi:', error);
    // Return default metadata
    return generateMetadataObject(null);
  }
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  let pageData;
  try {
    pageData = await fetchContentType(
      'pages',
      {
        filters: {
          slug: 'homepage',
          locale: params.locale,
        },
      },
      true
    );
  } catch (error) {
    console.log('Failed to fetch homepage data from Strapi:', error);
    // Create fallback data structure
    pageData = {
      title: 'Qwilo',
      content: [],
      localizations: []
    };
  }

  // Fallback if no data is returned
  if (!pageData) {
    pageData = {
      title: 'Qwilo',
      content: [],
      localizations: []
    };
  }

  const localizedSlugs = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = '';
      return acc;
    },
    { [params.locale]: '' }
  );

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>
  );
}
