'use client';

import { m as motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Container } from '../container';
import { AmbientColor } from '../decorations/ambient-color';
import { Button } from '../elements/button';
import { CALENDAR_LINK } from '@/lib/constants';

export const CTA = ({
  heading,
  sub_heading,
  CTAs,
  locale,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
}) => {
  return (
    <div className="relative py-40">
      <AmbientColor />
      <Container className="flex flex-col md:flex-row justify-between items-center w-full px-8">
        <div className="flex flex-col">
          <motion.h2 className="text-white text-xl text-center md:text-left md:text-3xl font-bold mx-auto md:mx-0 max-w-xl ">
            {heading}
          </motion.h2>
          <p className="max-w-md mt-8 text-center md:text-left text-sm md:text-base mx-auto md:mx-0 text-neutral-400">
            {sub_heading}
          </p>
        </div>
        {/* Aquí es donde añadimos el margen superior `mt-8` */}
        <div className="flex flex-col md:flex-row items-center gap-y-4 md:gap-x-4 mt-8 md:mt-0">
          {CTAs &&
            CTAs.map((cta, index) => {
              const isDemoButton =
                cta.text.toLowerCase().includes('sesión') ||
                cta.text.toLowerCase().includes('estratégica');
              const url = isDemoButton ? CALENDAR_LINK : cta.URL;
              const isExternalLink =
                url.startsWith('http') || url.startsWith('https');

              return (
                <Button
                  key={index}
                  as={isExternalLink ? 'a' : Link}
                  href={isExternalLink ? url : `/${locale}${cta.URL}`}
                  target={isDemoButton || isExternalLink ? '_blank' : undefined}
                  rel={
                    isDemoButton || isExternalLink
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  variant={cta.variant}
                  className={isDemoButton ? 'text-base px-6 py-3' : 'py-3'}
                >
                  {cta.text}
                </Button>
              );
            })}
        </div>
      </Container>
    </div>
  );
};
