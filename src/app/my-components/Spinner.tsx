import { cn } from '@/lib/utils';
import React from 'react';

export default function Spinner({ classes }: { classes?: string }) {
  return <div className={cn('size-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin', classes)}></div>;
}
