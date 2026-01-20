// api/stats-simple.js (ئەگەر پێویست بیت)
const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'data', 'requests.json');

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      let data = [];
      if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }

      const stats = {
        pending: data.filter(r => r.status === 'pending').length,
        accepted: data.filter(r => r.status === 'accepted').length,
        rejected: data.filter(r => r.status === 'rejected').length,
        total: data.length
      };

      return res.status(200).json({
        success: true,
        stats: stats,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'مێسۆدی پشتگیری نەکراوە' });
}
