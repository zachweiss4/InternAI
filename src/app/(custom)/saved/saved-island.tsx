'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api-client';
import { ApplicationsListResponse } from '@/lib/contracts/applications';
import {
  type JobDataType,
  SavedInternshipListResponse,
  type SavedInternshipResponseType,
} from '@/lib/contracts/saved';

function ModalityBadge({ modality }: { modality?: JobDataType['modality'] }) {
  if (!modality) return null;
  const styles: Record<NonNullable<JobDataType['modality']>, string> = {
    remote: 'bg-brand-100 text-brand-700 border-brand-200',
    hybrid: 'bg-amber-50 text-amber-700 border-amber-200',
    'on-site': 'bg-slate-100 text-slate-700 border-slate-200',
  };
  const labels: Record<NonNullable<JobDataType['modality']>, string> = {
    remote: 'Remote',
    hybrid: 'Hybrid',
    'on-site': 'On-site',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[modality]}`}
    >
      {labels[modality]}
    </span>
  );
}

function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;
  if (min && max) return `${fmt(min)}–${fmt(max)}/mo`;
  if (min) return `${fmt(min)}+/mo`;
  return max ? `Up to ${fmt(max)}/mo` : null;
}

function SavedCard({
  saved,
  isApplied,
  onUnsave,
}: {
  saved: SavedInternshipResponseType;
  isApplied: boolean;
  onUnsave: () => Promise<void>;
}) {
  const [unsaving, setUnsaving] = useState(false);
  const jobData = saved.jobData as JobDataType;
  const salary = formatSalary(jobData.salaryMin, jobData.salaryMax);

  async function handleUnsave() {
    setUnsaving(true);
    try {
      await onUnsave();
    } finally {
      setUnsaving(false);
    }
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-h4 leading-snug">{jobData.title}</CardTitle>
            <p className="mt-1 text-body font-medium text-foreground">{jobData.company}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUnsave}
            disabled={unsaving}
            className="text-muted-foreground hover:text-foreground shrink-0"
            title="Remove from saved"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 1.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM2 6a6 6 0 1 1 10.84 3.553l2.803 2.804a.75.75 0 1 1-1.06 1.06l-2.804-2.803A6 6 0 0 1 2 6Z"
                clipRule="evenodd"
              />
            </svg>
            {jobData.location}
          </span>
          <ModalityBadge modality={jobData.modality} />
          {salary && (
            <Badge variant="outline" className="text-xs font-medium">
              {salary}
            </Badge>
          )}
        </div>
        {jobData.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {jobData.description}
          </p>
        )}
        <div className="pt-1 flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-brand-200 text-brand-700 hover:bg-brand-50 hover:text-brand-800"
          >
            <a href={jobData.applyUrl} target="_blank" rel="noopener noreferrer">
              Apply now →
            </a>
          </Button>
          {isApplied && (
            <Badge
              variant="secondary"
              className="text-emerald-700 bg-emerald-50 border border-emerald-200"
            >
              Applied ✓
            </Badge>
          )}
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
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </CardContent>
    </Card>
  );
}

export function SavedIsland() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<SavedInternshipResponseType[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const [savedData, appliedData] = await Promise.all([
          apiFetch('/api/saved', { method: 'GET', schema: SavedInternshipListResponse }),
          apiFetch('/api/applications', { method: 'GET', schema: ApplicationsListResponse }).catch(
            () => null,
          ),
        ]);
        setSaved(savedData.saved);
        if (appliedData?.applications) {
          setAppliedJobIds(new Set(appliedData.applications.map((a) => a.jobId)));
        }
      } catch {
        toast.error('Failed to load saved internships.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((n) => (
          <SkeletonCard key={n} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display font-bold text-foreground">Saved Internships</h1>
        <p className="mt-2 text-body-lg text-muted-foreground">Internships you have bookmarked.</p>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
            <svg
              className="h-6 w-6 text-brand-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-h4 font-semibold text-foreground">No saved internships yet</p>
          <p className="mt-1 text-body text-muted-foreground">
            Search for internships and bookmark the ones you are interested in.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/search">Search internships</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {saved.map((item) => (
            <SavedCard
              key={item.id}
              saved={item}
              isApplied={appliedJobIds.has(item.jobId)}
              onUnsave={async () => {
                await apiFetch(`/api/saved/${item.id}`, { method: 'DELETE' });
                setSaved((prev) => prev.filter((s) => s.id !== item.id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
