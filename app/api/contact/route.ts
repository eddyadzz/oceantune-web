import { NextRequest, NextResponse } from 'next/server';

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  message?: string;
};

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json(
      { error: 'Telegram notifications are not configured.' },
      { status: 503 }
    );
  }

  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const phone = (body.phone ?? '').trim();
  const email = (body.email ?? '').trim();
  const service = (body.service ?? '').trim();
  const message = (body.message ?? '').trim();

  if (!name || !phone || !email || !service || !message) {
    return NextResponse.json({ error: 'Please fill in all fields.' }, { status: 400 });
  }

  const text = [
    '🛎 New website enquiry',
    '—'.repeat(24),
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Service: ${service}`,
    '—'.repeat(24),
    message,
  ]
    .join('\n')
    .slice(0, 4096);

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`Telegram sendMessage failed (${res.status}):`, detail);
      return NextResponse.json({ error: 'Could not send your message.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Telegram send failed:', err);
    return NextResponse.json({ error: 'Could not send your message.' }, { status: 502 });
  }
}