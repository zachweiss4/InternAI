import type { Metadata } from 'next';
import { FreeAccessLinkRedeemer } from '@/components/custom/free-access-link-redeemer';
import { InternAIAppShell } from '@/components/custom/internai-app-shell';

export const metadata: Metadata = {
  title: 'Free access',
  description: 'Activate a free InternAI subscription grant.',
};

interface FreeAccessPageProps {
  params: Promise<{ code: string }>;
}

function cleanCode(value: string): string {
  try {
    return decodeURIComponent(value).trim().toUpperCase();
  } catch {
    return value.trim().toUpperCase();
  }
}

export default async function FreeAccessPage({ params }: FreeAccessPageProps) {
  const { code } = await params;
  return (
    <InternAIAppShell>
      <FreeAccessLinkRedeemer code={cleanCode(code)} />
    </InternAIAppShell>
  );
}
