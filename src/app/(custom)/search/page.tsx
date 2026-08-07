import { Building2, Globe2, Radar, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { SearchIsland } from './search-island';

export const metadata: Metadata = {
  title: 'Search Internships - InternAI',
  description: 'Find real internships from company sources, job feeds, and profile-aware filters.',
};

const SEARCH_SIGNALS = [
  {
    icon: Building2,
    title: 'Source-first',
    detail: 'Company boards and ATS feeds',
  },
  {
    icon: Globe2,
    title: 'Wider coverage',
    detail: 'Job APIs and public social web',
  },
  {
    icon: Sparkles,
    title: 'Your ranking',
    detail: 'Optional profile-aware fit',
  },
];

export default function SearchPage() {
  return (
    <main className="editorial-home min-h-screen px-gutter pb-section-lg pt-[clamp(3rem,7vw,6rem)]">
      <div className="editorial-page">
        <header className="grid gap-8 border-b border-[var(--editorial-line)] pb-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,0.65fr)] lg:items-end">
          <div>
            <div className="internai-status-pill mb-6">
              <span className="internai-status-dot" aria-hidden="true" />
              Search network ready
            </div>
            <p className="editorial-kicker mb-4">InternAI opportunity radar</p>
            <h1 className="editorial-serif max-w-4xl text-[clamp(3.2rem,6.5vw,6.4rem)] leading-[0.88]">
              Find the role before everyone finds the listing.
            </h1>
            <p className="editorial-copy mt-6 max-w-2xl">
              Search naturally, refine with precise filters, and keep the original source visible.
              Profile matching stays optional and under your control.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {SEARCH_SIGNALS.map((signal) => {
              const Icon = signal.icon;
              return (
                <div
                  key={signal.title}
                  className="flex items-center gap-3 rounded-[12px] border border-[var(--editorial-line)] bg-[var(--editorial-cream)] p-3.5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--editorial-sage)] text-[var(--editorial-moss-deep)]">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--editorial-ink)]">{signal.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--editorial-muted)]">{signal.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        <section aria-labelledby="search-workspace-title" className="mt-9">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--editorial-ink)] text-[var(--editorial-paper)]">
                <Radar aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <h2
                  id="search-workspace-title"
                  className="text-sm font-extrabold text-[var(--editorial-ink)]"
                >
                  Search workspace
                </h2>
                <p className="text-xs text-[var(--editorial-muted)]">
                  Start broad, then sharpen the result set
                </p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.09em] text-[var(--editorial-muted)]">
              Source quality · recency · relevance
            </span>
          </div>

          <div className="internai-search-shell">
            <SearchIsland />
          </div>
        </section>
      </div>
    </main>
  );
}
