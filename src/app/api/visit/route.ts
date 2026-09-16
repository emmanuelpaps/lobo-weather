import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { neighborhood = 'Campestre Senecú', city = 'Ciudad Juárez', tempF = 90, conditionText = 'Soleado', isGps = false } = body;

    const userAgent = req.headers.get('user-agent') || '';
    let device = '📱 Móvil';
    if (/iPhone/i.test(userAgent)) device = '🍎 iPhone (Safari / PWA)';
    else if (/iPad/i.test(userAgent)) device = '🍎 iPad';
    else if (/Android/i.test(userAgent)) device = '🤖 Android';
    else if (/Macintosh/i.test(userAgent)) device = '💻 Mac (Escritorio)';
    else if (/Windows/i.test(userAgent)) device = '💻 Windows (PC)';

    const nowStr = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Denver',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short',
    }).format(new Date());

    const botToken = process.env.LOBO_TELEGRAM_BOT_TOKEN || '8539545294:AAHw5rsj7Z0Dg9dA6YiXaXU23uf_LnIYZUY';
    const chatId = process.env.LOBO_TELEGRAM_CHAT_ID || '1813977310';

    const gpsTag = isGps ? '🟢 GPS en vivo' : '📍 Predeterminado';
    const message = `🐺🐾 *¡Alguien abrió Lobo Weather!*\n\n` +
      `📍 *Zona:* \`${neighborhood}, ${city}\` (${gpsTag})\n` +
      `🌡️ *Clima:* *${tempF}°F* • ${conditionText}\n` +
      `📱 *Dispositivo:* ${device}\n` +
      `⏰ *Hora Juárez:* ${nowStr}\n\n` +
      `❤️ _Miriam (o amorcillo) está consultando el clima de Lobo._`;

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
    console.error('Error al notificar visita por Telegram:', err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
