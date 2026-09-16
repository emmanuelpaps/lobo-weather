import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      reaction = '¡Te amo mucho, amorcillo! 💖',
    } = body;

    const userAgent = req.headers.get('user-agent') || '';
    let device = '📱 Móvil de Miriam';
    if (/iPhone/i.test(userAgent)) device = '🍎 iPhone de Miriam';
    else if (/iPad/i.test(userAgent)) device = '🍎 iPad de Miriam';
    else if (/Android/i.test(userAgent)) device = '🤖 Android';

    const nowStr = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Denver',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short',
    }).format(new Date());

    const botToken = process.env.LOBO_TELEGRAM_BOT_TOKEN || '8539545294:AAHw5rsj7Z0Dg9dA6YiXaXU23uf_LnIYZUY';
    const chatId = process.env.LOBO_TELEGRAM_CHAT_ID || '1813977310';

    const message = `💖🐺 *¡CARIÑITO DE CORAZONCILLO!* 🐺💖\n\n` +
      `Miriam te acaba de enviar un cariñito desde Lobo Weather:\n\n` +
      `💌 *"${reaction}"*\n\n` +
      `⏰ *Hora:* ${nowStr} (Ciudad Juárez)\n` +
      `📱 *Desde:* ${device}\n\n` +
      `_¡Corre a darle un abrazo o escribirle a tu amorcillo!_ 🥰🐾`;

    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const tgData = await telegramRes.json();

    return NextResponse.json({ ok: true, telegramSent: tgData.ok });
  } catch (err: any) {
    console.error('Error al enviar cariñito a Telegram:', err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
