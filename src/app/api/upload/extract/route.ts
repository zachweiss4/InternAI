import 'server-only';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';

export async function POST(req: Request) {
  try {
    await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.fileUrl !== 'string') {
    return NextResponse.json({ text: '' }, { status: 400 });
  }

  const fileUrl: string = body.fileUrl;

  const lowerUrl = fileUrl.toLowerCase();
  const isPdf = lowerUrl.includes('.pdf');
  const isDocx = lowerUrl.includes('.docx');

  if (!isPdf && !isDocx) {
    return NextResponse.json({ text: '' });
  }

  let fileRes: globalThis.Response;
  try {
    fileRes = await fetch(fileUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    // biome-ignore lint/suspicious/noConsole: structured server-side error logging for upload diagnostics
    console.error(`[upload/extract] fetch threw: ${msg}`, stack);
    return NextResponse.json({ text: '' }, { status: 502 });
  }

  if (!fileRes.ok) {
    // biome-ignore lint/suspicious/noConsole: structured server-side error logging for upload diagnostics
    console.error(`[upload/extract] file fetch non-ok: status=${fileRes.status}`);
    return NextResponse.json({ text: '' }, { status: 502 });
  }

  try {
    const buffer = Buffer.from(await fileRes.arrayBuffer());
    if (isDocx) {
      const mammoth = await import('mammoth');
      const parsed = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: parsed.value });
    }

    const pdfParse = (await import('pdf-parse')).default;
    const parsed = await pdfParse(buffer);

    return NextResponse.json({ text: parsed.text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    // biome-ignore lint/suspicious/noConsole: structured server-side error logging for upload diagnostics
    console.error(`[upload/extract] pdf-parse threw: ${msg}`, stack);
    return NextResponse.json({ text: '' }, { status: 500 });
  }
}
