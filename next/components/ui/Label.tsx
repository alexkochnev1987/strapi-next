'use client';

import { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  // All standard label props are inherited from LabelHTMLAttributes
}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn('block text-sm font-medium text-text mb-2', className)}
      {...props}
    />
  );
}

