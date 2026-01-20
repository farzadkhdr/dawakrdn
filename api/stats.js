// api/stats.js
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
      // بەکارهێنانی داتا
      let data = [];
      if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }

      // ژمێردنی ئامارەکان
      const today = new Date().toISOString().split('T')[0];
      const weeklyStart = new Date();
      weeklyStart.setDate(weeklyStart.getDate() - 7);

      const dailyRequests = data.filter(item => {
        const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
        return itemDate === today;
      });

      const weeklyRequests = data.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= weeklyStart;
      });

      const stats = {
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        accepted: data.filter(r => r.status === 'accepted').length,
        rejected: data.filter(r => r.status === 'rejected').length,
        today: dailyRequests.length,
        weekly: weeklyRequests.length,
        byType: {
          houseSell: data.filter(r => r.type === 'فرۆشتی خانوو').length,
          houseBuy: data.filter(r => r.type === 'کڕینی خانوو').length,
          landSell: data.filter(r => r.type === 'فرۆشتی زەوی').length,
          landBuy: data.filter(r => r.type === 'کڕینی زەوی').length
        },
        byLocation: {}
      };

      // ئاماری شوێنەکان
      const locations = {};
      data.forEach(item => {
        if (item.location) {
          locations[item.location] = (locations[item.location] || 0) + 1;
        }
      });

      // زیاتر لە 5 داواکاری لە شوێنێک
      stats.byLocation = Object.fromEntries(
        Object.entries(locations)
          .filter(([_, count]) => count > 5)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
      );

      return res.status(200).json({
        success: true,
        stats: stats,
        updatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error calculating stats:', error);
      return res.status(500).json({
        success: false,
        message: 'هەڵە لە ژمێردنی ئامارەکان',
        error: error.message
      });
    }
  }

  return res.status(405).json({ success: false, message: 'مێسۆدی پشتگیری نەکراوە' });
}
