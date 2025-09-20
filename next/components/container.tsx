import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className, ...rest }: ContainerProps) => {
  return (
    <div className={cn(`max-w-7xl mx-auto px-4 md:px-10 xl:px-4 `, className)} {...rest}>
      {children}
    </div>
  );
};