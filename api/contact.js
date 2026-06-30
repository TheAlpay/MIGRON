/* global process */

const RESEND_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL   = 'migron@mtive.tech';
const FROM_EMAIL = 'MIGRON Contact <no-reply@migron.mtive.tech>';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (message.length > 5000) {
    return res.status(400).json({ error: 'Message is too long (max 5000 characters).' });
  }

  const body = {
    from: FROM_EMAIL,
    to:   [TO_EMAIL],
    reply_to: email,
    subject: `[MIGRON Contact] ${subject || 'New message'} — from ${name}`,
    html: `
      <div style="font-family: monospace; background: #050505; color: #e0e0e0; padding: 32px; max-width: 600px;">
        <h2 style="color: #ccff00; font-size: 18px; margin: 0 0 24px; text-transform: uppercase; letter-spacing: 0.1em;">
          New Contact Message — MIGRON
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 16px 8px 0; color: #888; width: 90px; vertical-align: top;">Name</td>
            <td style="padding: 8px 0; color: #e0e0e0; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 16px 8px 0; color: #888; vertical-align: top;">Email</td>
            <td style="padding: 8px 0; color: #ccff00;">${email}</td>
          </tr>
          ${subject ? `
          <tr>
            <td style="padding: 8px 16px 8px 0; color: #888; vertical-align: top;">Subject</td>
            <td style="padding: 8px 0; color: #e0e0e0;">${subject}</td>
          </tr>` : ''}
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #111; border-left: 3px solid #ccff00;">
          <p style="margin: 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Message</p>
          <p style="margin: 0; color: #e0e0e0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #444; font-size: 11px; margin-top: 24px;">Sent from migron.mtive.tech/iletisim</p>
      </div>
    `,
  };

  if (RESEND_KEY) {
    try {
      const sendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!sendRes.ok) {
        const err = await sendRes.json().catch(() => ({}));
        console.error('[contact] Resend error:', err);
        return res.status(500).json({ error: 'Failed to send email. Please try again.' });
      }

      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('[contact] Fetch error:', e.message);
      return res.status(500).json({ error: 'Network error. Please try again.' });
    }
  }

  // No Resend key — log and return success (dev mode)
  console.log('[contact] No RESEND_API_KEY — email not sent. Body:', { name, email, subject, message });
  return res.status(200).json({ ok: true, note: 'dev-mode-no-send' });
}
