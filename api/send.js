export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);
  const contentType = req.headers['content-type'] || '';
  const boundary = contentType.split('boundary=')[1];

  const photoStart = buffer.indexOf(Buffer.from('filename="capture.jpg"'));
  const dataStart = buffer.indexOf(Buffer.from('\r\n\r\n'), photoStart) + 4;
  const dataEnd = buffer.indexOf(Buffer.from('\r\n--' + boundary), dataStart);
  const photoBuffer = buffer.slice(dataStart, dataEnd);

  const form = new FormData();
  form.append('chat_id', CHAT_ID);
  form.append('photo', new Blob([photoBuffer], { type: 'image/jpeg' }), 'capture.jpg');

  const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    body: form
  });

  if (!tgRes.ok) {
    const err = await tgRes.text();
    return res.status(500).json({ error: err });
  }

  res.status(200).json({ ok: true });
}
