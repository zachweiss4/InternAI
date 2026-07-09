'use client';

import { Gift, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LookupResult {
  found?: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
  subscription?: {
    plan: string;
    status: string;
    currentPeriodEnd: string | null;
  } | null;
  error?: string;
}

interface PromoCode {
  id: string;
  code: string;
  plan: string;
  months: number;
  maxRedemptions: number;
  redeemedCount: number;
  note: string | null;
  expiresAt: string | null;
  disabledAt: string | null;
  createdAt: string;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return 'No end date';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function AdminPremiumIsland() {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'basic' | 'premium'>('premium');
  const [months, setMonths] = useState('12');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [codePlan, setCodePlan] = useState<'basic' | 'premium'>('premium');
  const [codeMonths, setCodeMonths] = useState('12');
  const [maxRedemptions, setMaxRedemptions] = useState('1');
  const [customCode, setCustomCode] = useState('');
  const [codeNote, setCodeNote] = useState('');
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [codeLoading, setCodeLoading] = useState(false);

  async function lookup() {
    const value = email.trim().toLowerCase();
    if (!value) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/premium?email=${encodeURIComponent(value)}`);
      const body = (await res.json().catch(() => ({}))) as LookupResult;
      if (!res.ok) throw new Error(body.error ?? 'Lookup failed');
      setResult(body);
      if (!body.found) toast.error('No user found with that email');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lookup failed');
    } finally {
      setLoading(false);
    }
  }

  async function grant() {
    const value = email.trim().toLowerCase();
    if (!value) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/premium', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: value, plan, months: Number(months) || 12 }),
      });
      const body = (await res.json().catch(() => ({}))) as LookupResult;
      if (!res.ok) throw new Error(body.error ?? 'Grant failed');
      setResult({ found: true, ...body });
      toast.success(`Granted ${plan} access`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Grant failed');
    } finally {
      setLoading(false);
    }
  }

  async function revoke() {
    const value = email.trim().toLowerCase();
    if (!value) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/premium?email=${encodeURIComponent(value)}`, {
        method: 'DELETE',
      });
      const body = (await res.json().catch(() => ({}))) as LookupResult;
      if (!res.ok) throw new Error(body.error ?? 'Revoke failed');
      setResult({ found: true, ...body });
      toast.success('Premium access revoked');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Revoke failed');
    } finally {
      setLoading(false);
    }
  }

  async function loadCodes() {
    setCodeLoading(true);
    try {
      const res = await fetch('/api/admin/promo-codes');
      const body = (await res.json().catch(() => ({}))) as { codes?: PromoCode[]; error?: string };
      if (!res.ok) throw new Error(body.error ?? 'Could not load codes');
      setPromoCodes(body.codes ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not load codes');
    } finally {
      setCodeLoading(false);
    }
  }

  async function createCode() {
    setCodeLoading(true);
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          code: customCode.trim() || undefined,
          plan: codePlan,
          months: Number(codeMonths) || 12,
          maxRedemptions: Number(maxRedemptions) || 1,
          note: codeNote.trim() || undefined,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { code?: PromoCode; error?: string };
      if (!res.ok || !body.code) throw new Error(body.error ?? 'Could not create code');
      setPromoCodes((prev) => [body.code as PromoCode, ...prev]);
      setCustomCode('');
      setCodeNote('');
      await navigator.clipboard?.writeText(body.code.code).catch(() => {});
      toast.success(`Created code ${body.code.code}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create code');
    } finally {
      setCodeLoading(false);
    }
  }

  async function disableCode(code: string) {
    setCodeLoading(true);
    try {
      const res = await fetch(`/api/admin/promo-codes?code=${encodeURIComponent(code)}`, {
        method: 'DELETE',
      });
      const body = (await res.json().catch(() => ({}))) as { code?: PromoCode; error?: string };
      if (!res.ok || !body.code) throw new Error(body.error ?? 'Could not disable code');
      setPromoCodes((prev) => prev.map((item) => (item.code === code ? (body.code as PromoCode) : item)));
      toast.success('Code disabled');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not disable code');
    } finally {
      setCodeLoading(false);
    }
  }

  const subscription = result?.subscription;

  return (
    <main className="min-h-dvh px-gutter py-section">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-brand-600" aria-hidden />
            <p className="text-eyebrow">Owner Admin</p>
          </div>
          <h1 className="text-h2 font-display">Grant Premium Access</h1>
          <p className="text-body text-muted-foreground">
            Give a specific account Basic or Premium access without Stripe checkout.
          </p>
        </div>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>User access</CardTitle>
            <CardDescription>
              The user must already have created an InternAI account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="admin-email">User email</Label>
              <div className="flex gap-2">
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="friend@example.com"
                />
                <Button type="button" variant="outline" onClick={lookup} disabled={loading}>
                  Lookup
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <div className="grid gap-2">
                <Label>Plan</Label>
                <Select value={plan} onValueChange={(value) => setPlan(value as typeof plan)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grant-months">Months</Label>
                <Input
                  id="grant-months"
                  type="number"
                  min="1"
                  max="120"
                  value={months}
                  onChange={(event) => setMonths(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={grant} disabled={loading || !email.trim()}>
                Grant access
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={revoke}
                disabled={loading || !email.trim()}
              >
                Revoke to free
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Account status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!result.found ? (
                <p className="text-sm text-muted-foreground">No account found for that email.</p>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{result.user?.email}</p>
                    {result.user?.role === 'admin' && <Badge>Admin</Badge>}
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide">Plan</p>
                      <p className="text-foreground">{subscription?.plan ?? 'free'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide">Status</p>
                      <p className="text-foreground">{subscription?.status ?? 'none'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide">Ends</p>
                      <p className="text-foreground">
                        {formatDate(subscription?.currentPeriodEnd)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-border/70">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gift className="size-5 text-brand-600" aria-hidden />
              <CardTitle>Free access codes</CardTitle>
            </div>
            <CardDescription>
              Create a code someone can redeem from Pricing or Billing after signing in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Plan</Label>
                <Select value={codePlan} onValueChange={(value) => setCodePlan(value as typeof codePlan)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code-months">Months</Label>
                <Input
                  id="code-months"
                  type="number"
                  min="1"
                  max="120"
                  value={codeMonths}
                  onChange={(event) => setCodeMonths(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code-redemptions">Uses</Label>
                <Input
                  id="code-redemptions"
                  type="number"
                  min="1"
                  max="1000"
                  value={maxRedemptions}
                  onChange={(event) => setMaxRedemptions(event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="custom-code">Custom code</Label>
                <Input
                  id="custom-code"
                  value={customCode}
                  onChange={(event) => setCustomCode(event.target.value.toUpperCase())}
                  placeholder="Leave blank to auto-generate"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code-note">Note</Label>
                <Input
                  id="code-note"
                  value={codeNote}
                  onChange={(event) => setCodeNote(event.target.value)}
                  placeholder="Beta tester, friend, campus group..."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={createCode} disabled={codeLoading}>
                Create code
              </Button>
              <Button type="button" variant="outline" onClick={loadCodes} disabled={codeLoading}>
                Load recent codes
              </Button>
            </div>

            {promoCodes.length > 0 && (
              <div className="space-y-2">
                {promoCodes.map((promo) => (
                  <div
                    key={promo.id}
                    className="flex flex-col gap-3 rounded-lg border border-border/70 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                          {promo.code}
                        </code>
                        <Badge variant="outline">{promo.plan}</Badge>
                        {promo.disabledAt && <Badge variant="secondary">Disabled</Badge>}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {promo.redeemedCount}/{promo.maxRedemptions} used · {promo.months} months
                        {promo.note ? ` · ${promo.note}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard?.writeText(promo.code).catch(() => {});
                          toast.success('Code copied');
                        }}
                      >
                        Copy
                      </Button>
                      {!promo.disabledAt && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => disableCode(promo.code)}
                          disabled={codeLoading}
                        >
                          Disable
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
