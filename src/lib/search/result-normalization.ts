const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function normalizePostingDate(value?: string | null, now = Date.now()): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  const lower = raw.toLowerCase();
  if (/\b(just posted|just now|today)\b/.test(lower)) {
    return new Date(now).toISOString();
  }
  if (/\byesterday\b/.test(lower)) {
    return new Date(now - DAY_MS).toISOString();
  }

  const relative = lower.match(
    /\b(\d+|an?|one)\+?\s+(minute|hour|day|week|month)s?(?:\s+ago)?\b/,
  );
  if (relative) {
    const amount = /^(a|an|one)$/.test(relative[1] ?? '') ? 1 : Number(relative[1]);
    const unit = relative[2];
    const unitMs =
      unit === 'minute'
        ? MINUTE_MS
        : unit === 'hour'
          ? HOUR_MS
          : unit === 'day'
            ? DAY_MS
            : unit === 'week'
              ? 7 * DAY_MS
              : 30 * DAY_MS;
    return new Date(now - amount * unitMs).toISOString();
  }

  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) return null;

  // Reject impossible provider values instead of presenting them as newly posted.
  if (parsed > now + DAY_MS || parsed < Date.UTC(1990, 0, 1)) return null;
  return new Date(parsed).toISOString();
}

export function normalizeUnixPostingDate(value?: number | null, now = Date.now()): string | null {
  if (!value || !Number.isFinite(value)) return null;
  const milliseconds = value > 10_000_000_000 ? value : value * 1000;
  return normalizePostingDate(new Date(milliseconds).toISOString(), now);
}

export function postingDateTimestamp(value?: string | null): number {
  if (!value) return 0;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function formatPostingAge(value?: string | null, now = Date.now()): string {
  const timestamp = postingDateTimestamp(value);
  if (timestamp === 0) return 'Date not provided';

  const daysAgo = Math.max(0, Math.floor((now - timestamp) / DAY_MS));
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo < 30) return `${daysAgo}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
