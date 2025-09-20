import { getStrapiMedia } from '../strapi/strapiImage';

export function generateMetadataObject(seo: any) {
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

    return {
      title: seo?.metaTitle || 'Qwilo - Automatización de Ventas con IA',
      description: seo?.metaDescription || 'Transforma tu negocio con automatización inteligente de ventas y marketing.',
      openGraph: {
        title: seo?.ogTitle || seo?.metaTitle || 'Qwilo - Automatización de Ventas con IA',
        description:
          seo?.ogDescription || seo?.metaDescription || 'Transforma tu negocio con automatización inteligente de ventas y marketing.',
        images: metaImageUrl ? [{ url: metaImageUrl }] : [],
      },
      twitter: {
        card: seo?.twitterCard || 'summary_large_image',
        title: seo?.twitterTitle || seo?.metaTitle || 'Qwilo - Automatización de Ventas con IA',
        description:
          seo?.twitterDescription ||
          seo?.metaDescription ||
          'Transforma tu negocio con automatización inteligente de ventas y marketing.',
        images: seo?.twitterImage ? [{ url: seo.twitterImage }] : [],
      },
    };
  } catch (error) {
    console.error('Error in generateMetadataObject:', error);
    // Return safe default metadata
    return {
      title: 'Qwilo - Automatización de Ventas con IA',
      description: 'Transforma tu negocio con automatización inteligente de ventas y marketing.',
      openGraph: {
        title: 'Qwilo - Automatización de Ventas con IA',
        description: 'Transforma tu negocio con automatización inteligente de ventas y marketing.',
        images: [],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Qwilo - Automatización de Ventas con IA',
        description: 'Transforma tu negocio con automatización inteligente de ventas y marketing.',
        images: [],
      },
    };
  }
}
