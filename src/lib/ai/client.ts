// Server-only helpers for OpenAI-compatible LLM calls.

import 'server-only';
import type { ChatMessage } from '@/lib/ai/schema';
import { env } from '@/lib/env';

export class AiConfigurationError extends Error {
  constructor(message = 'AI is not configured for this app.') {
    super(message);
    this.name = 'AiConfigurationError';
  }
}

const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_VISION_MODEL = 'gpt-4o';

// Vision messages carry an array content part; the public chat contract
// (ChatMessage) is text-only. This broader type is used internally only.
type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string; detail?: 'low' | 'high' | 'auto' } };
export type LlmMessage = ChatMessage | { role: ChatMessage['role']; content: ContentPart[] };

export interface ChatOptions {
  messages: LlmMessage[];
  model?: string;
  task?: string;
  temperature?: number;
  responseFormat?: 'text' | 'json_object';
  signal?: AbortSignal;
}

function aiBaseUrl() {
  return env.OPENAI_BASE_URL.replace(/\/+$/, '');
}

function aiApiKey() {
  if (env.OPENAI_API_KEY) return env.OPENAI_API_KEY;
  throw new AiConfigurationError('AI is not configured. Set OPENAI_API_KEY on Vercel.');
}

function chatCompletionsBody(opts: ChatOptions, stream: boolean) {
  return JSON.stringify({
    model: opts.model ?? DEFAULT_MODEL,
    messages: opts.messages,
    stream,
    ...(typeof opts.temperature === 'number' ? { temperature: opts.temperature } : {}),
    ...(opts.responseFormat === 'json_object' ? { response_format: { type: 'json_object' } } : {}),
  });
}

async function postChatCompletion(opts: ChatOptions, stream: boolean) {
  return fetch(`${aiBaseUrl()}/chat/completions`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${aiApiKey()}`,
      'content-type': 'application/json',
    },
    body: chatCompletionsBody(opts, stream),
    cache: 'no-store',
    signal: opts.signal,
  });
}

/** Non-streaming chat completion. Returns the assistant message text. */
export async function chat(opts: ChatOptions): Promise<string> {
  const res = await postChatCompletion(opts, false);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const detail =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : '';
    throw new Error(`AI request failed: ${res.status} ${detail}`.trim());
  }
  return body?.choices?.[0]?.message?.content ?? '';
}

/**
 * Streaming chat completion. Returns the upstream Response so a route handler
 * can relay the OpenAI-compatible SSE stream to the browser unchanged.
 */
export async function streamChat(opts: ChatOptions): Promise<Response> {
  const res = await postChatCompletion(opts, true);
  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '');
    throw new Error(`AI stream failed: ${res.status} ${detail}`.trim());
  }
  return res;
}

/**
 * Structured JSON output. Forces `response_format: json_object`, parses the
 * result, and retries once with a stricter instruction on a parse failure
 * (the resilience pattern customer apps converged on).
 */
export async function generateObject<T = unknown>(opts: ChatOptions): Promise<T> {
  const raw = await chat({ ...opts, responseFormat: 'json_object' });
  try {
    return JSON.parse(raw) as T;
  } catch {
    const retry = await chat({
      ...opts,
      responseFormat: 'json_object',
      messages: [
        ...opts.messages,
        { role: 'system', content: 'Respond with valid JSON only. No prose, no markdown fences.' },
      ],
    });
    return JSON.parse(retry) as T;
  }
}

export interface AnalyzeImageOptions {
  imageUrl: string;
  prompt: string;
  model?: string;
  task?: string;
  json?: boolean;
}

/** Vision: analyze an image URL against a prompt. */
export async function analyzeImage(opts: AnalyzeImageOptions): Promise<string> {
  return chat({
    model: opts.model ?? DEFAULT_VISION_MODEL,
    task: opts.task,
    responseFormat: opts.json ? 'json_object' : 'text',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: opts.prompt },
          { type: 'image_url', image_url: { url: opts.imageUrl, detail: 'high' } },
        ],
      },
    ],
  });
}
