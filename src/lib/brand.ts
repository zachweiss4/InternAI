// @:user-owned — brand identity. Edit freely. `site.ts` re-exports
// siteName/siteDescription; `manifest.ts` + `opengraph-image.tsx` read `brandVisual`.

export const siteName = 'InternAI';
export const siteDescription =
  'Land your dream internship without the grind. AI-powered internship search automation for college students.';

// PWA + social-share colors. HEX only (the oklch() tokens in globals.css aren't
// readable here) — set to match your brand seed.
export const brandVisual = {
  /** PWA browser-UI / status-bar color. */
  themeColor: '#d97706',
  /** PWA splash + install background. */
  backgroundColor: '#fefce8',
  /** Social-share (OG/Twitter) image. */
  og: {
    background: '#0c0a09',
    foreground: '#fef9ee',
    /** Second line under the site name; '' hides it. */
    tagline: 'Land your dream internship without the grind.',
  },
} as const;
