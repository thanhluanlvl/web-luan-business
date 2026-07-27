/* global process */

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || '';
  const adminToken = process.env.ADMIN_API_TOKEN || '';

  if (!expectedPassword || !adminToken) {
    return res.status(500).json({
      success: false,
      message: 'Trang quản trị chưa được cấu hình.',
    });
  }

  if (String(req.body?.password || '') !== expectedPassword) {
    return res.status(401).json({ success: false, message: 'Sai mật khẩu!' });
  }

  return res.status(200).json({ success: true, token: adminToken });
}
