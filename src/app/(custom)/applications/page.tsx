import type { Metadata } from 'next';
import { InternAIAppShell } from '@/components/custom/internai-app-shell';
import { ApplicationsIsland } from './applications-island';

export const metadata: Metadata = {
  title: 'My Applications - InternAI',
  description: 'Track the internships you have applied to.',
};

export default function ApplicationsPage() {
  return (
    <InternAIAppShell>
      <main className="container-page py-section">
        <div className="mx-auto max-w-3xl">
          <ApplicationsIsland />
        </div>
      </main>
    </InternAIAppShell>
  );
}
