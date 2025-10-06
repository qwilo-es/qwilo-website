'use client';

import Script from 'next/script';

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'article' | 'product';
  data?: any;
}

export function StructuredData({ type = 'organization', data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qwilo.es';

    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Qwilo',
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          description: 'Agencia especializada en automatización de ventas con IA y chatbots de WhatsApp',
          foundingDate: '2024',
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Ventas',
            availableLanguage: ['Spanish', 'English'],
          },
          sameAs: [
            'https://linkedin.com/company/qwilo',
            'https://twitter.com/qwilo',
          ],
          areaServed: {
            '@type': 'Country',
            name: 'España',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Servicios de Automatización',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Chatbot WhatsApp con IA',
                  description: 'Agentes conversacionales inteligentes para WhatsApp',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Automatización de Ventas',
                  description: 'Automatización inteligente de procesos de ventas',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Integración de IA',
                  description: 'Implementación de soluciones de inteligencia artificial',
                },
              },
            ],
          },
        };

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Qwilo',
          url: baseUrl,
          description: 'Automatización de ventas con IA y chatbots de WhatsApp',
          inLanguage: 'es-ES',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        };

      case 'article':
        return data ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.description,
          image: data.image,
          datePublished: data.publishedAt,
          dateModified: data.updatedAt,
          author: {
            '@type': 'Organization',
            name: 'Qwilo',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Qwilo',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
            },
          },
        } : null;

      case 'product':
        return data ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.name,
          description: data.description,
          image: data.image,
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/products/${data.slug}`,
          },
        } : null;

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
