'use client';

import { Gift } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SubscriptionStatus } from '@/lib/contracts/subscription';

interface PromoCodeRedeemerProps {
  onRedeemed?: (subscription: SubscriptionStatus) => void;
}

export function PromoCodeRedeemer({ onRedeemed }: PromoCodeRedeemerProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function redeem() {
    const value = code.trim().toUpperCase();
    if (!value) return;

    setLoading(true);
    try {
      const res = await fetch('/api/promo-codes/redeem', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code: value }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        subscription?: SubscriptionStatus;
        error?: string;
      };

      if (res.status === 401) {
        window.location.assign('/login');
        return;
      }
      if (!res.ok || !body.subscription) {
        throw new Error(body.error ?? 'Could not redeem that code.');
      }

      setCode('');
      onRedeemed?.(body.subscription);
      toast.success(`${body.subscription.plan} access activated`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not redeem that code.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-brand-200 bg-brand-50/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gift className="size-5 text-brand-600" aria-hidden />
          <CardTitle>Have a free access code?</CardTitle>
        </div>
        <CardDescription>Redeem a code from InternAI to activate Basic or Premium.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          <Label htmlFor="promo-code">Access code</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="promo-code"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="INTERN-ABCDEFGH"
              autoComplete="off"
            />
            <Button
              type="button"
              onClick={redeem}
              disabled={loading || !code.trim()}
              className="bg-brand-600 text-white hover:bg-brand-700"
            >
              {loading ? 'Redeeming...' : 'Redeem'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
