const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports.config = {
    api: { bodyParser: false },
};

// Gọi HTTP request trả về Promise
function httpsRequest(options, postData, isBinary) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const body = Buffer.concat(chunks);
                resolve({ 
                    statusCode: res.statusCode, 
                    headers: res.headers,
                    body: isBinary ? body : body.toString() 
                });
            });
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: true, message: 'Method not allowed' });

    let filePath = null;
    try {
        // 1. Parse file upload
        const form = formidable({ uploadDir: '/tmp', keepExtensions: true, maxFileSize: 50 * 1024 * 1024 });
        const { files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });
        const uploadedFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
        if (!uploadedFile) return res.status(400).json({ error: true, message: 'Không tìm thấy file PDF.' });
        filePath = uploadedFile.filepath || uploadedFile.path;

        const CLIENT_ID = process.env.ADOBE_CLIENT_ID || '733e7b1fd2194ec2bf028d375978f04d';
        const CLIENT_SECRET = process.env.ADOBE_CLIENT_SECRET || 'p8e-Wx1rvvQXA94KFmOtHr_-CdeqUbpBWm_-';

        // 2. Lấy Access Token từ Adobe
        const tokenData = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
        const tokenRes = await httpsRequest({
            hostname: 'pdf-services-ue1.adobe.io',
            path: '/token',
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }, tokenData);

        const token = JSON.parse(tokenRes.body).access_token;
        if (!token) throw new Error('Không lấy được token từ Adobe. Kiểm tra lại Client ID/Secret.');

        // 3. Yêu cầu URL upload từ Adobe
        const uploadReqRes = await httpsRequest({
            hostname: 'pdf-services-ue1.adobe.io',
            path: '/assets',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-api-key': CLIENT_ID,
                'Content-Type': 'application/json'
            }
        }, JSON.stringify({ mediaType: 'application/pdf' }));

        const uploadInfo = JSON.parse(uploadReqRes.body);
        const uploadUri = uploadInfo.uploadUri;
        const assetID = uploadInfo.assetID;

        // 4. Upload file PDF lên Adobe Cloud
        const fileBuffer = fs.readFileSync(filePath);
        const uploadUrl = new URL(uploadUri);
        await httpsRequest({
            hostname: uploadUrl.hostname,
            path: uploadUrl.pathname + uploadUrl.search,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Length': fileBuffer.length
            }
        }, fileBuffer);

        // 5. Tạo lệnh chuyển đổi Export PDF sang DOCX
        const exportRes = await httpsRequest({
            hostname: 'pdf-services-ue1.adobe.io',
            path: '/operation/exportpdf',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-api-key': CLIENT_ID,
                'Content-Type': 'application/json'
            }
        }, JSON.stringify({
            assetID: assetID,
            targetFormat: 'docx'
        }));

        // 6. Polling - chờ Adobe xử lý xong
        const pollUrl = exportRes.headers['location'] || exportRes.headers['Location'];
        if (!pollUrl) throw new Error('Không nhận được URL theo dõi tiến trình từ Adobe.');
        
        const pollUrlParsed = new URL(pollUrl);
        let result = null;
        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 2000)); // Chờ 2 giây mỗi lần
            const pollRes = await httpsRequest({
                hostname: pollUrlParsed.hostname,
                path: pollUrlParsed.pathname + pollUrlParsed.search,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-api-key': CLIENT_ID
                }
            });
            const pollData = JSON.parse(pollRes.body);
            if (pollData.status === 'done') {
                result = pollData;
                break;
            } else if (pollData.status === 'failed') {
                throw new Error('Adobe báo lỗi xử lý file: ' + (pollData.error?.message || 'Không rõ'));
            }
        }
        if (!result) throw new Error('Hết thời gian chờ Adobe xử lý.');

        // 7. Tải file DOCX kết quả từ Adobe
        const downloadUrl = result.asset?.downloadUri || result.content?.downloadUri;
        if (!downloadUrl) throw new Error('Không tìm thấy link tải file kết quả.');

        const dlUrl = new URL(downloadUrl);
        const docxRes = await httpsRequest({
            hostname: dlUrl.hostname,
            path: dlUrl.pathname + dlUrl.search,
            method: 'GET',
            headers: {}
        }, null, true); // isBinary = true

        // 8. Gửi file DOCX về cho người dùng
        const originalName = (uploadedFile.originalFilename || 'document').replace(/\.pdf$/i, '');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalName)}_converted.docx"`);
        return res.send(docxRes.body);

    } catch (e) {
        console.error('Adobe Error:', e);
        return res.status(500).json({ error: true, message: e.message || 'Lỗi chuyển đổi.' });
    } finally {
        try { if (filePath) fs.unlinkSync(filePath); } catch(e) {}
    }
};
