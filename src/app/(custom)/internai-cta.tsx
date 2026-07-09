'use client';

// @:user-owned

import { Button } from '@/components/ui/button';

export function InternAICTA() {
  return (
    <section id="cta" className="py-section-lg">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-8 md:p-16 text-center">
          {/* Ambient glow */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,_var(--brand-200)_0%,_transparent_70%)] opacity-50" />
          </div>

          <div className="relative z-10">
            <p className="text-eyebrow mb-4">Start Today</p>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] tracking-tight leading-tight mb-4">
              Your next internship is waiting
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of students who stopped wasting time on job boards and started landing
              interviews. It only takes two minutes to set up.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <a href="/signup">Get Started Free</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/pricing">View Pricing</a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Questions?{' '}
              <a
                href="mailto:support@internai.app"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                support@internai.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
