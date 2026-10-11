export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const origin = req.headers.origin || '';
  if (!origin.includes('github.io') && !origin.includes('vercel.app')) {
    return res.status(403).end();
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  const form = new FormData();
  form.append('chat_id', CHAT_ID);
  form.append('photo', req.body.photo);

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    body: form
  });

  res.status(200).json({ ok: true });
}
