import type { Metadata } from 'next';
import { InternAIAppShell } from '@/components/custom/internai-app-shell';
import { PricingIsland } from './pricing-island';

export const metadata: Metadata = {
  title: 'Pricing - InternAI',
  description:
    'Simple, transparent pricing for AI-powered internship search. Start free, upgrade when you need unlimited access.',
};

export default function PricingPage() {
  return (
    <InternAIAppShell>
      <main className="min-h-screen">
        <PricingIsland />
      </main>
    </InternAIAppShell>
  );
}
