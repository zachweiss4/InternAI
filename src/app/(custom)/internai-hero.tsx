'use client';

// @:user-owned

import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileSearch2,
  MapPin,
  Radar,
  Search,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SAMPLE_MATCHES = [
  {
    title: 'Product Management Intern',
    company: 'Microsoft',
    location: 'Redmond, WA',
    source: 'Company careers',
    score: 91,
    fresh: '2h',
  },
  {
    title: 'Software Engineering Intern',
    company: 'NVIDIA',
    location: 'Santa Clara, CA',
    source: 'Greenhouse',
    score: 88,
    fresh: '5h',
  },
  {
    title: 'Business Analyst Intern',
    company: 'Capital One',
    location: 'McLean, VA',
    source: 'Workday',
    score: 84,
    fresh: '1d',
  },
];

const SOURCE_LABELS = ['Company career pages', 'ATS feeds', 'Job APIs', 'Public social web'];

export function InternAIHero() {
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="internai-hero relative px-gutter pb-section-lg pt-[clamp(3.5rem,8vw,7rem)]">
      <div className="internai-orb internai-orb-one" aria-hidden="true" />
      <div className="internai-orb internai-orb-two" aria-hidden="true" />

      <div className="editorial-page relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(32rem,1.08fr)] lg:items-center lg:gap-14">
          <div>
            <motion.div {...reveal(0)} className="internai-status-pill mb-7">
              <span className="internai-status-dot" aria-hidden="true" />
              Search network online
              <span aria-hidden="true" className="h-3 w-px bg-current opacity-20" />
              Built for the next application cycle
            </motion.div>

            <motion.h1
              {...reveal(0.08)}
              className="editorial-serif max-w-4xl text-[clamp(3.5rem,7.4vw,6.9rem)] leading-[0.88]"
            >
              Your internship search,{' '}
              <span className="editorial-mark relative inline-block">finally intelligent.</span>
            </motion.h1>

            <motion.p {...reveal(0.16)} className="editorial-copy mt-7 max-w-2xl text-balance">
              InternAI searches the places students miss, ranks every role around what matters to
              you, and keeps the entire application journey in one calm workspace.
            </motion.p>

            <motion.div {...reveal(0.24)} className="internai-command mt-8">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Search aria-hidden="true" className="h-5 w-5 shrink-0" />
                <span className="truncate text-sm sm:text-base">
                  Product internships in New York for summer 2027
                </span>
              </div>
              <Button
                asChild
                size="lg"
                className="h-12 shrink-0 rounded-[10px] bg-[var(--editorial-ink)] px-5 text-[var(--editorial-paper)] shadow-none hover:bg-[var(--editorial-moss-deep)]"
              >
                <Link href="/search">
                  Run search
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>

            <motion.div {...reveal(0.32)} className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 rounded-[10px] border-[var(--editorial-line)] bg-[var(--editorial-cream)] px-5 text-[var(--editorial-ink)] shadow-none hover:bg-[var(--editorial-sage)]"
              >
                <Link href="/profile">
                  <FileSearch2 aria-hidden="true" />
                  Add your profile
                </Link>
              </Button>
              <Link
                href="#how-it-works"
                className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-[var(--editorial-moss-deep)] underline-offset-4 hover:underline"
              >
                See how matching works
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              {...reveal(0.4)}
              className="mt-9 border-t border-[var(--editorial-line)] pt-5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--editorial-muted)]">
                One search across
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {SOURCE_LABELS.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--editorial-ink)]"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="h-3.5 w-3.5 text-[var(--editorial-coral)]"
                    />
                    {source}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, x: 28, rotate: 0.6 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Illustration of the InternAI match workspace"
            className="relative"
          >
            <div className="internai-radar-ring" aria-hidden="true" />
            <div className="internai-product-window relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--editorial-line)] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--editorial-ink)] text-[var(--editorial-paper)]">
                    <Radar aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--editorial-ink)]">
                      Opportunity radar
                    </p>
                    <p className="text-xs text-[var(--editorial-muted)]">
                      Illustrative match workspace
                    </p>
                  </div>
                </div>
                <span className="internai-status-pill hidden sm:inline-flex">
                  <span className="internai-status-dot" aria-hidden="true" />
                  Sourcing
                </span>
              </div>

              <div className="grid grid-cols-3 border-b border-[var(--editorial-line)] bg-[var(--editorial-cream-deep)]/55">
                {[
                  ['12', 'source checks'],
                  ['3', 'strong matches'],
                  ['1', 'alert ready'],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="border-r border-[var(--editorial-line)] px-3 py-4 last:border-r-0 sm:px-5"
                  >
                    <p className="editorial-serif text-2xl leading-none text-[var(--editorial-ink)] sm:text-3xl">
                      {value}
                    </p>
                    <p className="mt-1 text-[0.67rem] font-bold uppercase tracking-[0.08em] text-[var(--editorial-muted)] sm:text-xs">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="editorial-kicker">Ranked shortlist</p>
                    <p className="mt-1 text-sm text-[var(--editorial-muted)]">
                      Source quality, recency, and optional profile fit
                    </p>
                  </div>
                  <Sparkles aria-hidden="true" className="h-5 w-5 text-[var(--editorial-coral)]" />
                </div>

                <ul className="grid gap-3">
                  {SAMPLE_MATCHES.map((match, index) => (
                    <motion.li
                      key={match.title}
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.42 + index * 0.1 }}
                      className="internai-match-row"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-[var(--editorial-sage)] text-[var(--editorial-moss-deep)]">
                          <BriefcaseBusiness aria-hidden="true" className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[var(--editorial-ink)]">
                            {match.title}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--editorial-muted)]">
                            {match.company} · {match.location}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[var(--editorial-muted)]">
                            <span>{match.source}</span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock3 aria-hidden="true" className="h-3 w-3" />
                              {match.fresh}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="internai-score">{match.score}</div>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between rounded-[10px] bg-[var(--editorial-ink)] px-4 py-3 text-[var(--editorial-paper)]">
                  <div className="flex items-center gap-2">
                    <BellRing
                      aria-hidden="true"
                      className="h-4 w-4 text-[var(--editorial-coral-soft)]"
                    />
                    <span className="text-xs font-semibold sm:text-sm">
                      Watch for new matches daily
                    </span>
                  </div>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </div>
              </div>
            </div>

            <motion.div
              aria-hidden="true"
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="absolute -bottom-5 -left-5 hidden rounded-[10px] border border-[var(--editorial-line)] bg-[var(--editorial-coral)] px-4 py-3 text-sm font-bold text-[#30231f] shadow-[var(--editorial-shadow)] sm:block"
            >
              <MapPin aria-hidden="true" className="mr-2 inline h-4 w-4" />
              Miami or remote
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
