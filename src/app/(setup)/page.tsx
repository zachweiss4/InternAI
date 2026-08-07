// @:user-owned - starter home served at /. Replace it in place, or delete
// this route group before adding another page that resolves to /.

import type { Metadata } from 'next';
import { InternAICTA } from '@/app/(custom)/internai-cta';
import { InternAIFAQ } from '@/app/(custom)/internai-faq';
import { InternAIFeatures } from '@/app/(custom)/internai-features';
import { InternAIHero } from '@/app/(custom)/internai-hero';
import { InternAIHowItWorks } from '@/app/(custom)/internai-how-it-works';
import { InternAIThemeAtmosphere } from '@/components/custom/internai-theme-atmosphere';
import { siteDescription, siteName } from '@/lib/site';

// Keep this a Server Component so it can export metadata.
export const metadata: Metadata = {
  title: { absolute: siteName },
  description: siteDescription,
  alternates: { canonical: '/' },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: '/',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'InternAI opportunity radar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/og.png'],
  },
};

export default function SetupPlaceholder() {
  return (
    <main className="editorial-home">
      <InternAIThemeAtmosphere />
      <InternAIHero />
      <InternAIFeatures />
      <InternAIHowItWorks />
      <InternAIFAQ />
      <InternAICTA />
    </main>
  );
}
