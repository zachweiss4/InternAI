// @:user-owned — extra <head> rendered by the framework layout (null by default).
// Add <meta>/<link> here (verification, preconnect) — React hoists them. For scripts use
// next/script with the passed `nonce` (CSP-safe). Edit freely.

import Script from 'next/script';

export function HeadContent({ nonce }: { nonce?: string }) {
  return (
    <Script id="internai-default-theme" nonce={nonce} strategy="beforeInteractive">
      {`try{if(!localStorage.getItem('theme'))localStorage.setItem('theme','light')}catch{}`}
    </Script>
  );
}
