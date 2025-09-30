'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { Cover } from '../decorations/cover';
import ShootingStars from '../decorations/shooting-star';
import StarBackground from '../decorations/star-background';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { CALENDAR_LINK } from '@/lib/constants';

// Recibe la función de scroll como una prop
export const Hero = ({
  heading,
  sub_heading,
  CTAs,
  onScrollToFeatures,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  onScrollToFeatures: () => void;
}) => {
  return (
    <div className="h-screen overflow-hidden relative flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <StarBackground />
        <ShootingStars />
      </motion.div>
      <Heading
        as="h1"
        className="text-4xl md:text-4xl lg:text-8xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-10  py-6"
      >
        {heading.substring(0, heading.lastIndexOf(' '))}{' '}
        <Cover>{heading.split(' ').pop()}</Cover>
      </Heading>
      <Subheading className="text-center mt-2 md:mt-6 text-base md:text-xl text-muted max-w-3xl mx-auto relative z-10 whitespace-pre-line">
        {`Tu socio estratégico en automatización empresarial.\nMás productividad, menos trabajo manual.`}
      </Subheading>
      <div className="flex space-x-4 items-center mt-8">
        {CTAs &&
          CTAs.map((cta) => {
            const isDemoButton =
              cta.text.toLowerCase().includes('sesión') ||
              cta.text.toLowerCase().includes('estratégica');
            const url = isDemoButton ? CALENDAR_LINK : cta.URL;
            const isExternalLink =
              url.startsWith('http') || url.startsWith('https');

            return (
              <Button
                key={cta?.id}
                as="a"
                href={
                  isDemoButton
                    ? CALENDAR_LINK
                    : isExternalLink
                      ? url
                      : undefined
                }
                target={isDemoButton || isExternalLink ? '_blank' : undefined}
                rel={
                  isDemoButton || isExternalLink
                    ? 'noopener noreferrer'
                    : undefined
                }
                onClick={
                  !isDemoButton && !isExternalLink && cta.URL === '#features'
                    ? onScrollToFeatures
                    : undefined
                }
                className={isDemoButton ? 'text-base px-6 py-3' : undefined}
                {...(cta.variant && { variant: cta.variant })}
              >
                {cta.text}
              </Button>
            );
          })}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-charcoal to-transparent" />
    </div>
  );
};
