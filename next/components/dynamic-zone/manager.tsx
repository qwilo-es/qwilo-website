'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { LazySection } from '@/components/lazy-section';

interface DynamicZoneComponent {
  __component: string;
  id: number;
  documentId?: string;
  [key: string]: unknown;
}

interface Props {
  dynamicZone: DynamicZoneComponent[];
  locale: string;
}

const componentMapping: { [key: string]: any } = {
  'dynamic-zone.hero': dynamic(() => import('./hero').then((mod) => mod.Hero)),
  'dynamic-zone.features': dynamic(
    () => import('./features').then((mod) => mod.Features),
    { ssr: true, loading: () => <div className="min-h-screen" /> }
  ),
  'dynamic-zone.testimonials': dynamic(
    () => import('./testimonials').then((mod) => mod.Testimonials),
    { ssr: true, loading: () => <div className="min-h-[400px]" /> }
  ),
  'dynamic-zone.how-it-works': dynamic(
    () => import('./how-it-works').then((mod) => mod.HowItWorks),
    { ssr: true, loading: () => <div className="min-h-[400px]" /> }
  ),
  'dynamic-zone.brands': dynamic(
    () => import('./brands').then((mod) => mod.Brands),
    { ssr: true, loading: () => <div className="min-h-[200px]" /> }
  ),
  'dynamic-zone.pricing': dynamic(
    () => import('./pricing').then((mod) => mod.Pricing),
    { ssr: true, loading: () => <div className="min-h-[600px]" /> }
  ),
  'dynamic-zone.launches': dynamic(
    () => import('./launches').then((mod) => mod.Launches),
    { ssr: true, loading: () => <div className="min-h-[400px]" /> }
  ),
  'dynamic-zone.cta': dynamic(() => import('./cta').then((mod) => mod.CTA), {
    ssr: true,
    loading: () => <div className="min-h-[300px]" />,
  }),

  'dynamic-zone.faq': dynamic(() => import('./faq').then((mod) => mod.FAQ), {
    ssr: true,
    loading: () => <div className="min-h-[400px]" />,
  }),
  'dynamic-zone.related-products': dynamic(
    () => import('./related-products').then((mod) => mod.RelatedProducts),
    { ssr: true, loading: () => <div className="min-h-[400px]" /> }
  ),
  'dynamic-zone.related-articles': dynamic(
    () => import('./related-articles').then((mod) => mod.RelatedArticles),
    { ssr: true, loading: () => <div className="min-h-[400px]" /> }
  ),
};

const DynamicZoneManager: React.FC<Props> = ({ dynamicZone, locale }) => {
  return (
    <div>
      {dynamicZone.map((componentData, index) => {
        const Component = componentMapping[componentData.__component];
        if (!Component) {
          console.error(
            `Error: No se encontró el componente '${componentData.__component}'. Revisa si el nombre coincide en Strapi y en manager.tsx.`
          );
          return null;
        }

        // Hero loads immediately, everything else lazy loads
        const isHero = componentData.__component === 'dynamic-zone.hero';

        if (isHero) {
          return (
            <Component
              key={`${componentData.__component}-${componentData.id}-${index}`}
              {...componentData}
              locale={locale}
            />
          );
        }

        return (
          <LazySection
            key={`${componentData.__component}-${componentData.id}-${index}`}
            rootMargin="300px"
          >
            <Component {...componentData} locale={locale} />
          </LazySection>
        );
      })}
    </div>
  );
};

export default DynamicZoneManager;
