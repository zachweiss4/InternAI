import type { ReactNode } from 'react';
import { InternAIThemeAtmosphere } from '@/components/custom/internai-theme-atmosphere';
import { cn } from '@/lib/utils';

export function InternAIAppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('editorial-home internai-app-shell min-h-dvh', className)}>
      <InternAIThemeAtmosphere />
      {children}
    </div>
  );
}
