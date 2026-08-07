// @:user-owned - seeded by /modules/better-auth; restyle freely.

import type { Metadata } from 'next';
import { InternAIAppShell } from '@/components/custom/internai-app-shell';
import { ProfileIsland } from './profile-island';

export const metadata: Metadata = {
  title: 'Your Profile - InternAI',
  description: 'Manage your InternAI account details, university, and graduation year.',
};

export default function ProfilePage() {
  return (
    <InternAIAppShell>
      <ProfileIsland />
    </InternAIAppShell>
  );
}
