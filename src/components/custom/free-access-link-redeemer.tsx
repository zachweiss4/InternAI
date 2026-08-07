'use client';

import { CheckCircle2, Gift, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/lib/auth-client';
import type { SubscriptionStatus } from '@/lib/contracts/subscription';

type RedeemState =
  | { status: 'checking' }
  | { status: 'signed-out' }
  | { status: 'redeeming' }
  | { status: 'redeemed'; subscription: SubscriptionStatus }
  | { status: 'error'; message: string };

interface FreeAccessLinkRedeemerProps {
  code: string;
}

function nextPathForCode(code: string): string {
  return `/free-access/${encodeURIComponent(code)}`;
}

export function FreeAccessLinkRedeemer({ code }: FreeAccessLinkRedeemerProps) {
  const { data: session, isPending } = useSession();
  const [state, setState] = useState<RedeemState>({ status: 'checking' });
  const attemptedRef = useRef(false);
  const nextPath = useMemo(() => nextPathForCode(code), [code]);
  const authQuery = useMemo(() => `?next=${encodeURIComponent(nextPath)}`, [nextPath]);

  useEffect(() => {
    if (isPending) {
      setState({ status: 'checking' });
      return;
    }
    if (!session?.user) {
      setState({ status: 'signed-out' });
      return;
    }
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    async function redeem() {
      setState({ status: 'redeeming' });
      const res = await fetch('/api/promo-codes/redeem', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        subscription?: SubscriptionStatus;
        error?: string;
      };
      if (!res.ok || !body.subscription) {
        throw new Error(body.error ?? 'This free access link could not be redeemed.');
      }
      return body.subscription;
    }

    redeem()
      .then((subscription) => {
        setState({ status: 'redeemed', subscription });
        toast.success(`${subscription.plan} access activated`);
      })
      .catch((error) => {
        setState({
          status: 'error',
          message:
            error instanceof Error ? error.message : 'This free access link could not be redeemed.',
        });
      });
  }, [code, isPending, session?.user]);

  return (
    <main className="min-h-dvh bg-transparent px-gutter py-section">
      <div className="mx-auto flex min-h-[70dvh] max-w-lg items-center">
        <Card className="w-full border-border/70 shadow-brand">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Gift className="size-6" aria-hidden />
            </div>
            <div>
              <CardTitle className="text-h3">Free InternAI access</CardTitle>
              <CardDescription>
                This private link activates a limited-use subscription grant.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 text-center">
            {(state.status === 'checking' || state.status === 'redeeming') && (
              <div className="space-y-3">
                <Loader2 className="mx-auto size-6 animate-spin text-brand-600" aria-hidden />
                <p className="text-sm text-muted-foreground">
                  {state.status === 'checking'
                    ? 'Checking your account...'
                    : 'Activating your access...'}
                </p>
              </div>
            )}

            {state.status === 'signed-out' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sign in or create an account, then this link will activate automatically.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button asChild className="bg-brand-600 text-white hover:bg-brand-700">
                    <Link href={`/signup${authQuery}`}>Create account</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/login${authQuery}`}>Sign in</Link>
                  </Button>
                </div>
              </div>
            )}

            {state.status === 'redeemed' && (
              <div className="space-y-4">
                <CheckCircle2 className="mx-auto size-8 text-emerald-600" aria-hidden />
                <div>
                  <p className="font-medium capitalize">
                    {state.subscription.plan} access is active.
                  </p>
                  {state.subscription.currentPeriodEnd && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Access ends{' '}
                      {new Date(state.subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
                <Button asChild className="bg-brand-600 text-white hover:bg-brand-700">
                  <Link href="/search">Start searching</Link>
                </Button>
              </div>
            )}

            {state.status === 'error' && (
              <div className="space-y-4">
                <XCircle className="mx-auto size-8 text-destructive" aria-hidden />
                <p className="text-sm text-muted-foreground">{state.message}</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button asChild variant="outline">
                    <Link href="/billing">Go to billing</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/pricing">View plans</Link>
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">Code: {code}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
