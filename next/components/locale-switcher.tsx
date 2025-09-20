'use client';

import React from 'react';

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  return (
    <div className="flex gap-2 p-1 rounded-md">
      <div className="flex cursor-pointer items-center justify-center text-sm leading-[110%] w-8 py-1 rounded-md bg-neutral-800 text-white shadow-[0px_1px_0px_0px_var(--neutral-600)_inset]">
        es
      </div>
    </div>
  );
}
