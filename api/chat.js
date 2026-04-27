import https from 'https';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: true, message: 'Method not allowed' });

    const data = JSON.stringify(req.body);

    const options = {
        hostname: 'n8nluan.suamayinanduong.com',
        port: 443,
        path: '/webhook/94d9615e-2759-4eb4-bbf3-0b29e18d4cbc',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    try {
        const result = await new Promise((resolve, reject) => {
            const request = https.request(options, (response) => {
                let body = '';
                response.on('data', (chunk) => { body += chunk; });
                response.on('end', () => {
                    if (response.statusCode >= 400) {
                        resolve({ error: true, status: response.statusCode, body });
                    } else {
                        resolve({ error: false, body });
                    }
                });
            });
            request.on('error', reject);
            request.write(data);
            request.end();
        });

        if (result.error) {
            return res.status(result.status).json({ error: true, message: `n8n lỗi HTTP ${result.status}: ${result.body}` });
        }

        try {
            return res.json(JSON.parse(result.body));
        } catch(e) {
            return res.json({ text: result.body });
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: `Không thể kết nối n8n: ${error.message}` });
    }
}
