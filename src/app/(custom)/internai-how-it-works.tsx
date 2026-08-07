'use client';

// @:user-owned

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, BellRing, CircleCheckBig, Search, SlidersHorizontal } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    eyebrow: 'Brief',
    title: 'Describe the opportunity you want',
    description:
      'Write naturally or use the structured filters. Search a role, a specific company, a location, a season, or any combination that matters.',
    icon: Search,
    sample: '“Product internships in New York for summer 2027”',
  },
  {
    number: '02',
    eyebrow: 'Source',
    title: 'InternAI checks the places that matter',
    description:
      'Company career pages and ATS feeds come first. Selected APIs and public web sources widen the search when they add real coverage.',
    icon: SlidersHorizontal,
    sample: 'Company board → ATS feed → job API → public web',
  },
  {
    number: '03',
    eyebrow: 'Decide',
    title: 'Compare the shortlist on your terms',
    description:
      'Sort by relevance or recency, switch profile matching on when useful, and keep the original source visible before you apply.',
    icon: CircleCheckBig,
    sample: 'Source quality + intent + recency + optional profile fit',
  },
  {
    number: '04',
    eyebrow: 'Follow through',
    title: 'Save the search and keep moving',
    description:
      'Track applications and let daily alerts watch for new matches without sending the same stale listing over and over.',
    icon: BellRing,
    sample: 'Shortlist → apply → follow up → offer',
  },
];

export function InternAIHowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="px-gutter py-section-lg">
      <div className="editorial-page">
        <div className="grid gap-10 lg:grid-cols-[minmax(19rem,0.7fr)_minmax(0,1.3fr)] lg:items-start lg:gap-16">
          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-28"
          >
            <p className="editorial-kicker">From idea to application</p>
            <h2 className="editorial-serif mt-4 text-[clamp(2.8rem,5vw,5rem)] leading-[0.9]">
              Four moves. One clear trail.
            </h2>
            <p className="editorial-copy mt-6 max-w-md">
              The system does the repetitive work while keeping the source, reasoning, and final
              decision in your hands.
            </p>

            <div className="mt-8 rounded-[16px] border border-[var(--editorial-line)] bg-[var(--editorial-ink)] p-5 text-[var(--editorial-paper)] shadow-[var(--editorial-shadow)]">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--editorial-coral-soft)]">
                  What stays visible
                </span>
                <span className="internai-status-dot" aria-hidden="true" />
              </div>
              <ul className="mt-4 grid gap-3 text-sm text-white/75">
                {['Where the listing came from', 'Why it matches', 'When it was refreshed'].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CircleCheckBig
                        aria-hidden="true"
                        className="h-4 w-4 text-[var(--editorial-coral)]"
                      />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </motion.aside>

          <ol className="relative grid gap-5 before:absolute before:bottom-7 before:left-[1.4rem] before:top-7 before:w-px before:bg-[var(--editorial-line)] sm:before:left-[2.65rem]">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.number}
                  initial={reduceMotion ? false : { opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="relative grid gap-4 rounded-[16px] border border-[var(--editorial-line)] bg-[var(--editorial-cream)] p-5 shadow-[0_16px_42px_rgb(31_43_34_/_0.07)] sm:grid-cols-[4rem_1fr] sm:gap-6 sm:p-7"
                >
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--editorial-sage)] text-[var(--editorial-moss-deep)] sm:h-14 sm:w-14">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--editorial-coral)]">
                        {step.number} · {step.eyebrow}
                      </span>
                    </div>
                    <h3 className="editorial-serif mt-3 text-[clamp(1.8rem,3vw,2.8rem)] leading-[0.98] text-[var(--editorial-ink)]">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--editorial-muted)]">
                      {step.description}
                    </p>
                    <div className="mt-5 rounded-[10px] border border-[var(--editorial-line)] bg-[var(--editorial-paper)] px-4 py-3 font-mono text-xs leading-6 text-[var(--editorial-muted)]">
                      {step.sample}
                    </div>
                  </div>

                  {index < STEPS.length - 1 && (
                    <ArrowDown
                      aria-hidden="true"
                      className="absolute -bottom-4 right-6 z-20 h-7 w-7 rounded-full border border-[var(--editorial-line)] bg-[var(--editorial-paper)] p-1.5 text-[var(--editorial-moss-deep)]"
                    />
                  )}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
