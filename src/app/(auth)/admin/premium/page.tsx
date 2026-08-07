import { AdminPremiumIsland } from '@/components/custom/admin-premium-island';
import { InternAIAppShell } from '@/components/custom/internai-app-shell';
// biome-ignore lint/style/noRestrictedImports: This is a protected Server Component and invokes the guard before rendering.
import { requireAdmin } from '@/lib/require-admin';

export default async function AdminPremiumPage() {
  await requireAdmin();
  return (
    <InternAIAppShell>
      <AdminPremiumIsland />
    </InternAIAppShell>
  );
}
