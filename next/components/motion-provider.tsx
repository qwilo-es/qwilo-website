'use client';

import { LazyMotion } from 'framer-motion';
import { ReactNode } from 'react';

const loadFeatures = () =>
  import('@/lib/motion-features').then((res) => res.domAnimation);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
