'use client';

import { LiquidMetalShader } from '@/app/(custom)/design-lab/liquid-metal-shader';
import { AnimatedGradient, type GradientConfig } from '@/components/ui/animated-gradient';
import { cn } from '@/lib/utils';

const AURORA_CONFIG: GradientConfig = {
  preset: 'custom',
  color1: '#d8faff',
  color2: '#8d7cff',
  color3: '#ff8bd5',
  rotation: -24,
  proportion: 58,
  scale: 0.72,
  speed: 8,
  distortion: 26,
  swirl: 72,
  swirlIterations: 10,
  softness: 96,
  offset: 180,
  shape: 'Edge',
  shapeSize: 48,
};

export function InternAIThemeAtmosphere({ className }: { className?: string }) {
  return (
    <div className={cn('internai-home-theme-canvas', className)} aria-hidden="true">
      <AnimatedGradient
        className="internai-home-aurora-shader"
        config={AURORA_CONFIG}
        noise={{ opacity: 0.12, scale: 0.8 }}
      />
      <LiquidMetalShader className="internai-home-chrome-shader" />
    </div>
  );
}
