import { AdminPremiumIsland } from '@/components/custom/admin-premium-island';
import { requireAdmin } from '@/lib/require-admin';

export default async function AdminPremiumPage() {
  await requireAdmin();
  return <AdminPremiumIsland />;
}
