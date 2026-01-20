// api/submit-request.js
const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'data', 'requests.json');

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const newRequest = {
        id: Date.now(), // ID بەکارهێنانی کاتی ئێستا
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleString('ar-IQ')
      };

      // داتای کۆن وەربگرە
      let data = [];
      if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }

      // نوێترین ID بدۆزەرەوە
      const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
      newRequest.id = maxId + 1;

      // زیادکردنی داواکاری نوێ
      data.push(newRequest);
      
      // نوێکردنەوەی داتا فایل
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

      return res.status(201).json({
        success: true,
        message: 'داواکاریەکەت بە سەرکەوتوویی نێردرا',
        request: newRequest,
        systemResponse: {
          request: {
            id: newRequest.id,
            status: newRequest.status,
            date: newRequest.date
          }
        }
      });

    } catch (error) {
      console.error('Error saving request:', error);
      return res.status(500).json({
        success: false,
        message: 'هەڵەیەک ڕوویدا لە ناردنی داواکاری'
      });
    }
  }

  return res.status(405).json({ success: false, message: 'مێسۆدی پشتگیری نەکراوە' });
}
