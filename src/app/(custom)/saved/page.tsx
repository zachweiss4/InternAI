import type { Metadata } from 'next';
import { InternAIAppShell } from '@/components/custom/internai-app-shell';
import { SavedIsland } from './saved-island';

export const metadata: Metadata = {
  title: 'Saved Internships - InternAI',
  description: 'Bookmark internships you are interested in.',
};

export default function SavedPage() {
  return (
    <InternAIAppShell>
      <main className="container-page py-section">
        <div className="mx-auto max-w-3xl">
          <SavedIsland />
        </div>
      </main>
    </InternAIAppShell>
  );
}
