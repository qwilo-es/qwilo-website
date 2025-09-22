import { Link } from 'next-view-transitions';
import React from 'react';

import { BlurImage } from './blur-image';
import { getStrapiMedia } from '@/lib/strapi/strapiImage';
import { Image } from '@/types/types';

export const Logo = ({ image, locale }: { image?: Image; locale?: string }) => {
  console.log('Logo component - locale received:', locale);

  if (image) {
    console.log('Logo component - using image with locale:', locale);
    return (
      <Link
        href={`/${locale || 'es'}`}
        className="font-normal flex space-x-2 items-center text-sm mr-4  text-black   relative z-20"
      >
        <BlurImage
          src={getStrapiMedia(image?.url) || ''}
          alt={image.alternativeText}
          width={200}
          height={200}
          className="h-10 w-10 rounded-xl mr-2"
        />

        <span className="text-white font-bold">Qwilo</span>
      </Link>
    );
  }

  // Fallback when no image - still provide a working logo link
  console.log('Logo component - using fallback with locale:', locale);
  return (
    <Link
      href={`/${locale || 'es'}`}
      className="font-normal flex space-x-2 items-center text-sm mr-4  text-black   relative z-20"
    >
      <span className="text-white font-bold">Qwilo</span>
    </Link>
  );
};
