'use client';

// @:user-owned

import { motion, useReducedMotion } from 'framer-motion';
import {
  BellRing,
  FileCheck2,
  Fingerprint,
  ListChecks,
  type LucideIcon,
  SearchCheck,
  Waypoints,
} from 'lucide-react';

interface Feature {
  number: string;
  tag: string;
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  className: string;
  tone?: 'ink' | 'coral';
}

const FEATURES: Feature[] = [
  {
    number: '01',
    tag: 'Discovery',
    title: 'Search beyond the obvious job boards',
    description:
      'InternAI starts with company career pages and public ATS feeds, then widens the search with trusted job APIs and public social signals.',
    detail: 'Source-first results with fewer dead links',
    icon: Waypoints,
    className: 'lg:col-span-7',
    tone: 'ink',
  },
  {
    number: '02',
    tag: 'Relevance',
    title: 'A match score you can actually understand',
    description:
      'Optional resume matching explains the overlap between your background and each role without hiding the original listing.',
    detail: 'Skills, role intent, recency, and source quality',
    icon: Fingerprint,
    className: 'lg:col-span-5 lg:translate-y-10',
  },
  {
    number: '03',
    tag: 'Search',
    title: 'Ask naturally. Refine precisely.',
    description:
      'Start with plain English, then narrow by role, company, location, season, working style, or the newest postings.',
    detail: 'From “finance near campus” to a focused shortlist',
    icon: SearchCheck,
    className: 'lg:col-span-5',
  },
  {
    number: '04',
    tag: 'Applications',
    title: 'Keep every next step in one place',
    description:
      'Save promising roles, track applications, add notes, and see deadlines without rebuilding the same spreadsheet every week.',
    detail: 'A calmer pipeline from saved to offer',
    icon: ListChecks,
    className: 'lg:col-span-7',
    tone: 'coral',
  },
  {
    number: '05',
    tag: 'Documents',
    title: 'Shape stronger applications without losing your voice',
    description:
      'Use your profile and the real job description to draft materials that are specific, reviewable, and still sound like you.',
    detail: 'Resume analysis and application-ready documents',
    icon: FileCheck2,
    className: 'lg:col-span-7 lg:ml-12',
  },
  {
    number: '06',
    tag: 'Timing',
    title: 'Let fresh roles find you',
    description:
      'Daily alerts check for new matches and remember what they already sent, so your inbox stays useful instead of repetitive.',
    detail: 'New postings, not recycled noise',
    icon: BellRing,
    className: 'lg:col-span-5 lg:-ml-12 lg:translate-y-8',
    tone: 'ink',
  },
];

export function InternAIFeatures() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="features" className="px-gutter py-section-lg">
      <div className="editorial-page">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 grid gap-6 border-b border-[var(--editorial-line)] pb-9 lg:grid-cols-[minmax(0,0.82fr)_minmax(18rem,0.38fr)] lg:items-end"
        >
          <div>
            <p className="editorial-kicker mb-4">A better operating system for the search</p>
            <h2 className="editorial-serif max-w-4xl text-[clamp(2.8rem,5.5vw,5.5rem)] leading-[0.9]">
              Everything between “I should apply” and “submitted.”
            </h2>
          </div>
          <p className="editorial-copy lg:pb-2">
            Built to reduce the fragmented tabs, stale links, repeated searches, and forgotten
            deadlines that make internship hunting feel like a second job.
          </p>
        </motion.header>

        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.6, delay: (index % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`editorial-feature-card group relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-[16px] border border-[var(--editorial-line)] p-6 sm:p-8 ${
                  feature.tone === 'ink'
                    ? 'feature-tone-ink bg-[var(--editorial-ink)] text-[var(--editorial-paper)]'
                    : feature.tone === 'coral'
                      ? 'feature-tone-coral bg-[var(--editorial-coral)] text-[#30231f]'
                      : 'feature-tone-glass bg-[var(--editorial-cream)] text-[var(--editorial-ink)]'
                } ${feature.className}`}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-14 -top-14 h-40 w-40 rounded-full border border-current opacity-10 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="relative flex items-start justify-between gap-5">
                  <span className="inline-flex min-h-8 items-center rounded-full border border-current/20 px-3 text-[0.68rem] font-bold uppercase tracking-[0.1em]">
                    {feature.tag}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-[11px] border border-current/15 bg-current/5">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                </div>

                <div className="relative mt-10">
                  <span className="editorial-serif text-4xl leading-none text-[var(--editorial-coral-soft)]">
                    {feature.number}
                  </span>
                  <h3 className="editorial-serif mt-4 max-w-2xl text-[clamp(2rem,3.5vw,3.4rem)] leading-[0.96]">
                    {feature.title}
                  </h3>
                  <p className="mt-5 max-w-2xl text-sm leading-7 opacity-75">
                    {feature.description}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center gap-3 border-t border-current/15 pt-4 text-xs font-bold uppercase tracking-[0.08em] opacity-70">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                  {feature.detail}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
