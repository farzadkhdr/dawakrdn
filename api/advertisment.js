// api/advertisements.js
let advertisements = [
  {
    id: '1',
    title: 'رێکلامی نموونەیی',
    description: 'ئەمە رێکلامێکی نموونەییە',
    image: '/ads/sample.jpg',
    link: 'https://example.com',
    status: 'active',
    views: 100,
    clicks: 20,
    createdAt: new Date().toISOString(),
  },
];

export default function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  // Health Check
  if (req.url === '/api/health') {
    return res.status(200).json({ success: true, message: 'API چالاکە' });
  }

  // هەموو رێکلامەکان
  if (method === 'GET') {
    const { status } = req.query;
    let filteredAds = [...advertisements];
    
    if (status) {
      filteredAds = filteredAds.filter(ad => ad.status === status);
    }
    
    return res.status(200).json({
      success: true,
      data: filteredAds,
    });
  }

  // رێکلامی تایبەت
  if (method === 'GET' && id) {
    const ad = advertisements.find(ad => ad.id === id);
    if (ad) {
      // زیادکردنی بینین
      ad.views = (ad.views || 0) + 1;
      return res.status(200).json({ success: true, data: ad });
    }
    return res.status(404).json({ success: false, error: 'رێکلام نەدۆزرایەوە' });
  }

  // زیادکردنی رێکلامی نوێ
  if (method === 'POST') {
    const newAd = {
      id: Date.now().toString(),
      ...req.body,
      status: 'active',
      views: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };
    advertisements.push(newAd);
    return res.status(201).json({ success: true, data: newAd });
  }

  // نوێکردنەوەی رێکلام
  if (method === 'PUT' && id) {
    const { title, description, status } = req.body;
    const adIndex = advertisements.findIndex(ad => ad.id === id);
    
    if (adIndex !== -1) {
      advertisements[adIndex] = {
        ...advertisements[adIndex],
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        updatedAt: new Date().toISOString(),
      };
      return res.status(200).json({ success: true, data: advertisements[adIndex] });
    }
    
    return res.status(404).json({ success: false, error: 'رێکلام نەدۆزرایەوە' });
  }

  // سڕینەوەی رێکلام
  if (method === 'DELETE' && id) {
    advertisements = advertisements.filter(ad => ad.id !== id);
    return res.status(200).json({ success: true, message: 'رێکلام سڕایەوە' });
  }

  // زیادکردنی کلیک
  if (method === 'POST' && id && req.url.includes('click')) {
    const adIndex = advertisements.findIndex(ad => ad.id === id);
    if (adIndex !== -1) {
      advertisements[adIndex].clicks = (advertisements[adIndex].clicks || 0) + 1;
      return res.status(200).json({ success: true });
    }
    return res.status(404).json({ success: false, error: 'رێکلام نەدۆزرایەوە' });
  }

  res.status(405).json({ success: false, error: 'مێساجێکی نادروست' });
}
