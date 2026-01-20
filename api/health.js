// api/health.js (ئەگەر پێویست بیت بۆ تاقیکردنەوە)
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'API چالاکە',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: [
        '/api/requests',
        '/api/submit-request',
        '/api/stats',
        '/api/health'
      ]
    });
  }

  return res.status(405).json({ success: false, message: 'مێسۆدی پشتگیری نەکراوە' });
}
