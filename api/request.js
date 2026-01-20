// api/requests.js
const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'data', 'requests.json');

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // وەرگرتنی پارامەتری id
      const { id } = req.query;
      
      if (!fs.existsSync(dataPath)) {
        // ئەگەر فایل بوونی نییە، داتای بنەڕەتی دروست بکە
        const initialData = [
          {
            id: 1,
            name: "عەلی محەممەد",
            phone: "07501234567",
            type: "فرۆشتی خانوو",
            location: "شۆرش",
            size: "150 م²",
            price: "١٠٠،٠٠٠،٠٠٠ دینار",
            date: "٢٠٢٣-١٠-٠٥ ١٠:٣٠",
            status: "pending",
            sellingType: "تاپۆ",
            createdAt: "2023-10-05T10:30:00.000Z"
          },
          {
            id: 2,
            name: "سارە عەبدوڵڵا",
            phone: "07507654321",
            type: "کڕینی زەوی",
            location: "گوڵان ستی",
            size: "٥٠٠ م²",
            price: "٥٠،٠٠٠،٠٠٠ دینار",
            date: "٢٠٢٣-١٠-٠٤ ١٤:٢٠",
            status: "pending",
            sellingType: "کارت",
            createdAt: "2023-10-04T14:20:00.000Z"
          },
          {
            id: 3,
            name: "حەسەن کەریم",
            phone: "07509876543",
            type: "فرۆشتی زەوی",
            location: "ئارام گاردن",
            size: "١٠٠٠ م²",
            price: "٢٠٠،٠٠٠،٠٠٠ دینار",
            date: "٢٠٢٣-١٠-٠٣ ٠٩:١٥",
            status: "accepted",
            acceptedDate: "٢٠٢٣-١٠-٠٣ ١١:٤٥",
            sellingType: "تاپۆ",
            createdAt: "2023-10-03T09:15:00.000Z"
          }
        ];
        
        fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
        return res.status(200).json({ success: true, requests: initialData });
      }
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // ئەگەر id دابینکراوە، داواکاری تایبەت بگەڕێنەوە
      if (id) {
        const request = data.find(item => item.id === parseInt(id));
        if (request) {
          return res.status(200).json({ success: true, requests: [request] });
        } else {
          return res.status(404).json({ success: false, message: 'داواکاری نەدۆزرایەوە' });
        }
      }
      
      // ئامارەکان ژمێرە
      const stats = {
        pending: data.filter(r => r.status === 'pending').length,
        accepted: data.filter(r => r.status === 'accepted').length,
        rejected: data.filter(r => r.status === 'rejected').length,
        total: data.length
      };
      
      return res.status(200).json({ success: true, requests: data, stats });
      
    } catch (error) {
      console.error('Error reading data:', error);
      return res.status(500).json({ success: false, message: 'هەڵەیەک ڕوویدا' });
    }
  }
  
  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { status } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({ success: false, message: 'ID و status پێویستە' });
      }
      
      if (!fs.existsSync(dataPath)) {
        return res.status(404).json({ success: false, message: 'هیچ داواکارییەک بوونی نییە' });
      }
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const index = data.findIndex(item => item.id === parseInt(id));
      
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'داواکاری نەدۆزرایەوە' });
      }
      
      // نوێکردنەوەی دۆخ
      data[index].status = status;
      data[index].updatedAt = new Date().toISOString();
      
      // زیادکردنی کاتی وەرگرتن ئەگەر وەرگیرابێت
      if (status === 'accepted') {
        data[index].acceptedDate = new Date().toLocaleString('ar-IQ');
      }
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      return res.status(200).json({ 
        success: true, 
        message: `داواکاری نوێکرایەوە بۆ ${status}`
      });
      
    } catch (error) {
      console.error('Error updating data:', error);
      return res.status(500).json({ success: false, message: 'هەڵەیەک ڕوویدا' });
    }
  }
  
  return res.status(405).json({ success: false, message: 'مێسۆدی پشتگیری نەکراوە' });
}
