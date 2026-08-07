'use client';

// @:user-owned

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BellRing, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function InternAICTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="cta" className="px-gutter pb-[clamp(4.5rem,9vw,8rem)] pt-section">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="editorial-page"
      >
        <div className="internai-cta-panel relative overflow-hidden rounded-[20px] border border-[var(--editorial-line)] bg-[var(--editorial-ink)] px-6 py-10 text-[var(--editorial-paper)] shadow-[var(--editorial-shadow)] sm:px-10 sm:py-14 lg:px-14">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/15 bg-[var(--editorial-moss)] opacity-40"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 right-[22%] h-52 w-52 rounded-full border border-dashed border-[var(--editorial-coral)] opacity-50"
          />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.6fr)] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--editorial-coral-soft)]">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                Your next application starts here
              </div>
              <h2 className="editorial-serif max-w-4xl text-[clamp(3rem,6vw,6rem)] leading-[0.88]">
                Stop searching harder. Start searching smarter.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Build one focused search, save the roles that deserve your attention, and let
                InternAI keep watch for what opens next.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-[10px] bg-[var(--editorial-coral)] px-6 text-[#30231f] shadow-none hover:bg-[var(--editorial-coral-soft)]"
                >
                  <Link href="/signup">
                    Create your workspace
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-[10px] border-white/20 bg-white/5 px-6 text-white shadow-none hover:bg-white/10 hover:text-white"
                >
                  <Link href="/search">
                    <Search aria-hidden="true" />
                    Explore internships
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[14px] border border-white/15 bg-white/[0.06] p-5 backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--editorial-coral)] text-[#30231f]">
                    <BellRing aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Daily opportunity watch</p>
                    <p className="text-xs text-white/55">New matches only</p>
                  </div>
                </div>
                <span className="internai-status-dot" aria-hidden="true" />
              </div>
              <div className="mt-5 grid gap-3 text-sm text-white/70">
                {[
                  'Choose a role, company, location, or season',
                  'Review source and match context',
                  'Get notified when something new appears',
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="editorial-serif text-xl leading-none text-[var(--editorial-coral-soft)]">
                      0{index + 1}
                    </span>
                    <span className="pt-0.5 leading-6">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
