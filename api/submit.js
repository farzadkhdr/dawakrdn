// api/submit.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'تەنها مێساجی POST پشتگیری دەکرێت' });
  }

  const requestData = req.body;

  try {
    // ناردنی داواکاری بۆ سیستەمی بەڕێوەبردنی داواکاری
    const adminApiResponse = await fetch('https://systamwargrtn.vercel.app/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const adminApiResult = await adminApiResponse.json();

    if (adminApiResult.success) {
      return res.status(200).json({
        success: true,
        message: 'داواکاری بە سەرکەوتویی نێردرا',
        data: adminApiResult.data,
      });
    } else {
      throw new Error(adminApiResult.error || 'هەڵە لە ناردنی داواکاری');
    }
  } catch (error) {
    console.error('هەڵە لە ناردنی داواکاری:', error);
    return res.status(500).json({
      success: false,
      error: 'هەڵە لە ناردنی داواکاری. تکایە دووبارە هەوڵ بدەرەوە.',
    });
  }
}
