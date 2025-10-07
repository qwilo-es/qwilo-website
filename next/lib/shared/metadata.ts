import { getStrapiMedia } from '../strapi/strapiImage';

export function generateMetadataObject(seo: any, canonicalUrl?: string) {
  try {
    console.log('Generating metadata for SEO data:', seo);

    let metaImageUrl = null;
    if (seo?.metaImage?.url) {
      try {
        metaImageUrl = getStrapiMedia(seo.metaImage.url);
      } catch (error) {
        console.error('Error processing meta image:', error);
        metaImageUrl = null;
      }
    }

    const defaultKeywords = [
      'agencia IA',
      'automatización',
      'agente WhatsApp',
      'chatbot IA',
      'automatización ventas',
      'inteligencia artificial',
      'marketing automation',
      'asistente virtual',
      'chatbot WhatsApp',
      'IA empresas',
      'chatbot automatizado',
      'IA conversacional',
      'automatización empresarial',
      'soluciones IA',
      'agente inteligente',
    ];

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qwilo.es';
    const fullCanonicalUrl = canonicalUrl
      ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`)
      : baseUrl;

    return {
      title: seo?.metaTitle || 'Qwilo - Automatización de Ventas con IA',
      description:
        seo?.metaDescription ||
        'Transforma tu negocio con automatización inteligente de ventas y marketing. Chatbots de WhatsApp con IA, agentes conversacionales y soluciones empresariales.',
      keywords: seo?.keywords || defaultKeywords.join(', '),
      authors: [{ name: 'Qwilo' }],
      creator: 'Qwilo',
      publisher: 'Qwilo',
      alternates: {
        canonical: fullCanonicalUrl,
        languages: {
          'es-ES': `${baseUrl}/es`,
          'en-US': `${baseUrl}/en`,
        },
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      },
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      },
      openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: canonicalUrl || 'https://qwilo.es',
        siteName: 'Qwilo',
        title:
          seo?.ogTitle ||
          seo?.metaTitle ||
          'Qwilo - Automatización de Ventas con IA',
        description:
          seo?.ogDescription ||
          seo?.metaDescription ||
          'Transforma tu negocio con automatización inteligente de ventas y marketing.',
        images: metaImageUrl ? [{
          url: metaImageUrl,
          width: 1200,
          height: 630,
          alt: seo?.metaTitle || 'Qwilo - Automatización de Ventas con IA',
        }] : [],
      },
      twitter: {
        card: seo?.twitterCard || 'summary_large_image',
        site: '@qwilo',
        creator: '@qwilo',
        title:
          seo?.twitterTitle ||
          seo?.metaTitle ||
          'Qwilo - Automatización de Ventas con IA',
        description:
          seo?.twitterDescription ||
          seo?.metaDescription ||
          'Transforma tu negocio con automatización inteligente de ventas y marketing.',
        images: seo?.twitterImage ? [{ url: seo.twitterImage }] : metaImageUrl ? [metaImageUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error in generateMetadataObject:', error);
    // Return safe default metadata
    return {
      title: 'Qwilo - Automatización de Ventas con IA',
      description:
        'Transforma tu negocio con automatización inteligente de ventas y marketing.',
      keywords: 'agencia IA, automatización, agente WhatsApp, chatbot IA, automatización ventas',
      authors: [{ name: 'Qwilo' }],
      creator: 'Qwilo',
      publisher: 'Qwilo',
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: 'https://qwilo.es',
        siteName: 'Qwilo',
        title: 'Qwilo - Automatización de Ventas con IA',
        description:
          'Transforma tu negocio con automatización inteligente de ventas y marketing.',
        images: [],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@qwilo',
        creator: '@qwilo',
        title: 'Qwilo - Automatización de Ventas con IA',
        description:
          'Transforma tu negocio con automatización inteligente de ventas y marketing.',
        images: [],
      },
    };
  }
}
