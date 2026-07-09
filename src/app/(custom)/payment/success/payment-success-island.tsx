'use client';

import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { PollResponseSchema } from '@/lib/contracts/subscription';

interface Props {
  sessionId: string | null;
}

export function PaymentSuccessIsland({ sessionId }: Props) {
  const [status, setStatus] = useState<'polling' | 'fulfilled' | 'error'>('polling');
  const attempts = useRef(0);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const MAX_ATTEMPTS = 15;
    const INTERVAL = 2000;

    function poll() {
      const sid = sessionId as string;
      apiFetch(`/api/payment/poll?session_id=${encodeURIComponent(sid)}`, {
        schema: PollResponseSchema,
      })
        .then((data) => {
          if (data.status === 'fulfilled') {
            setStatus('fulfilled');
            setTimeout(() => {
              window.location.assign('/billing');
            }, 1500);
          } else if (++attempts.current < MAX_ATTEMPTS) {
            setTimeout(poll, INTERVAL);
          } else {
            setStatus('error');
          }
        })
        .catch(() => {
          if (++attempts.current < MAX_ATTEMPTS) {
            setTimeout(poll, INTERVAL);
          } else {
            setStatus('error');
          }
        });
    }

    poll();
  }, [sessionId]);

  if (status === 'fulfilled') {
    return (
      <div className="text-center space-y-4 max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 mx-auto">
          <svg
            className="h-8 w-8 text-brand-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-h2 font-display">Payment confirmed!</h1>
        <p className="text-body text-muted-foreground">
          Your subscription is active. Redirecting to your billing dashboard…
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center space-y-4 max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto">
          <svg
            className="h-8 w-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-h2 font-display">Something went wrong</h1>
        <p className="text-body text-muted-foreground">
          We couldn&apos;t confirm your payment. If you were charged, contact us at{' '}
          <a
            href="mailto:support@internai.dev"
            className="underline underline-offset-2 hover:text-foreground"
          >
            support@internai.dev
          </a>{' '}
          and we&apos;ll sort it out.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6 max-w-md">
      <div className="flex h-16 w-16 items-center justify-center mx-auto">
        <svg
          className="h-10 w-10 animate-spin text-brand-600"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
      <h1 className="text-h2 font-display">Confirming your payment…</h1>
      <p className="text-body text-muted-foreground">
        This usually takes just a moment. Please don&apos;t close this page.
      </p>
    </div>
  );
}
