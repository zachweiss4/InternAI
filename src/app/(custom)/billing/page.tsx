import type { Metadata } from 'next';
import { InternAIAppShell } from '@/components/custom/internai-app-shell';
import { BillingIsland } from './billing-island';

export const metadata: Metadata = {
  title: 'Billing - InternAI',
  description: 'Manage your InternAI subscription plan and billing details.',
};

export default function BillingPage() {
  return (
    <InternAIAppShell>
      <main className="min-h-screen px-gutter py-section">
        <div className="container-page mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="font-display text-h1">Billing</h1>
            <p className="mt-2 text-body text-muted-foreground">
              Manage your subscription plan and billing.
            </p>
          </div>
          <BillingIsland />
        </div>
      </main>
    </InternAIAppShell>
  );
}
