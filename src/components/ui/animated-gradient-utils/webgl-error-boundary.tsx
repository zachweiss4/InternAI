'use client';

import { Component, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WebGLErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  override state: WebGLErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  override render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function WebGLFallback({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_75%_20%,#f20089_0%,transparent_38%),radial-gradient(circle_at_20%_80%,#5530ba_0%,transparent_42%),linear-gradient(145deg,#080014,#1a0b2e)]',
        className,
      )}
    >
      <div className="absolute -right-[12%] top-[8%] h-[65%] w-[65%] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute -bottom-[18%] -left-[8%] h-[60%] w-[60%] rounded-full bg-violet-500/25 blur-3xl" />
    </div>
  );
}
