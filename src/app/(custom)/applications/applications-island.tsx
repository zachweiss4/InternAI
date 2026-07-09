'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api-client';
import {
  ApplicationResponse,
  type ApplicationResponseType,
  ApplicationsListResponse,
} from '@/lib/contracts/applications';

const STATUSES = ['Applied', 'Interviewing', 'Rejected', 'Offer'] as const;

const STATUS_STYLES: Record<string, string> = {
  Applied: 'bg-brand-50 text-brand-700 border-brand-200',
  Interviewing: 'bg-amber-50 text-amber-700 border-amber-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
  Offer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ApplicationCard({
  app,
  onStatusChange,
}: {
  app: ApplicationResponseType;
  onStatusChange: (id: string, status: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(status: string) {
    setUpdating(true);
    try {
      await onStatusChange(app.id, status);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Card className="border-border/60 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-h4 leading-snug">{app.jobTitle}</CardTitle>
            <p className="mt-1 text-body font-medium text-foreground">{app.company}</p>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 text-xs font-medium ${STATUS_STYLES[app.status] ?? ''}`}
          >
            {app.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-muted-foreground">Applied {formatDate(app.appliedAt)}</p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={app.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-600 hover:text-brand-800 underline underline-offset-2"
          >
            View posting →
          </a>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <Select value={app.status} onValueChange={handleStatusChange} disabled={updating}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ApplicationsIsland() {
  const [applications, setApplications] = useState<ApplicationResponseType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch('/api/applications', { schema: ApplicationsListResponse })
      .then((data) => setApplications(data.applications))
      .catch((err) => {
        const status = (err as { status?: number }).status;
        if (status === 401) {
          setAuthError(true);
        } else {
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: string, status: string) {
    try {
      const updated = await apiFetch(`/api/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        schema: ApplicationResponse,
      });
      setApplications((prev) => (prev ? prev.map((a) => (a.id === id ? updated : a)) : prev));
    } catch {
      toast.error('Failed to update status. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <Card className="border-border/60 bg-card/95">
        <CardHeader className="text-center">
          <CardTitle className="text-h4">Sign in to view your applications</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Create account</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-8 text-center">
          <p className="text-body text-muted-foreground">
            Something went wrong loading your applications.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-h2 font-bold text-foreground">My Applications</h1>
        <p className="text-body text-muted-foreground">
          Track the internships you&apos;ve marked as Applied from the search page.
        </p>
      </div>

      {applications === null || applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-12 text-center space-y-4">
          <p className="text-body text-muted-foreground">No applications yet.</p>
          <p className="text-sm text-muted-foreground/70">
            Mark jobs as Applied from the Search page to track them here.
          </p>
          <Button asChild variant="outline">
            <Link href="/search">Go to Search</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
