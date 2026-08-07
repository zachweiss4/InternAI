import type { Metadata } from 'next';
import { InternAIAppShell } from '@/components/custom/internai-app-shell';
import { AlertsIsland } from './alerts-island';

export const metadata: Metadata = {
  title: 'Job Alerts - InternAI',
  description: 'Create and manage internship alert notifications.',
};

export default function AlertsPage() {
  return (
    <InternAIAppShell>
      <AlertsIsland />
    </InternAIAppShell>
  );
}
