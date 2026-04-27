import { createReadStream, readFileSync, unlinkSync, createWriteStream } from 'fs';
import { join } from 'path';
import https from 'https';
import { IncomingForm } from 'formidable';

export const config = {
    api: { bodyParser: false },
};

function httpsReq(options, postData, isBinary) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => {
                const body = Buffer.concat(chunks);
                resolve({ statusCode: res.statusCode, headers: res.headers, body: isBinary ? body : body.toString() });
            });
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: true, message: 'Method not allowed' });

    let filePath = null;
    try {
        const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true, maxFileSize: 50 * 1024 * 1024 });
        const { files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });
        const uploadedFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
        if (!uploadedFile) return res.status(400).json({ error: true, message: 'Không tìm thấy file PDF.' });
        filePath = uploadedFile.filepath || uploadedFile.path;

        const CID = '733e7b1fd2194ec2bf028d375978f04d';
        const CSE = 'p8e-Wx1rvvQXA94KFmOtHr_-CdeqUbpBWm_-';

        // Lấy Access Token
        const tokenRes = await httpsReq({ hostname: 'pdf-services-ue1.adobe.io', path: '/token', method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, `client_id=${CID}&client_secret=${CSE}`);
        const token = JSON.parse(tokenRes.body).access_token;
        if (!token) throw new Error('Không lấy được token từ Adobe.');

        // Yêu cầu URL upload
        const upReqRes = await httpsReq({ hostname: 'pdf-services-ue1.adobe.io', path: '/assets', method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': CID, 'Content-Type': 'application/json' } }, JSON.stringify({ mediaType: 'application/pdf' }));
        const upInfo = JSON.parse(upReqRes.body);
        const uploadUri = upInfo.uploadUri;
        const assetID = upInfo.assetID;

        // Upload file PDF
        const fileBuffer = readFileSync(filePath);
        const upUrl = new URL(uploadUri);
        await httpsReq({ hostname: upUrl.hostname, path: upUrl.pathname + upUrl.search, method: 'PUT', headers: { 'Content-Type': 'application/pdf', 'Content-Length': fileBuffer.length } }, fileBuffer);

        // Tạo lệnh Export PDF sang DOCX
        const expRes = await httpsReq({ hostname: 'pdf-services-ue1.adobe.io', path: '/operation/exportpdf', method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': CID, 'Content-Type': 'application/json' } }, JSON.stringify({ assetID, targetFormat: 'docx' }));
        const pollUrl = expRes.headers['location'] || expRes.headers['Location'];
        if (!pollUrl) throw new Error('Adobe không trả về URL theo dõi tiến trình.');

        // Polling
        const pUrl = new URL(pollUrl);
        let result = null;
        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 2000));
            const pRes = await httpsReq({ hostname: pUrl.hostname, path: pUrl.pathname + pUrl.search, method: 'GET', headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': CID } });
            const pData = JSON.parse(pRes.body);
            if (pData.status === 'done') { result = pData; break; }
            if (pData.status === 'failed') throw new Error('Adobe xử lý thất bại: ' + JSON.stringify(pData));
        }
        if (!result) throw new Error('Hết thời gian chờ Adobe xử lý.');

        // Tải file DOCX kết quả
        const dlUri = result.asset?.downloadUri || result.content?.downloadUri;
        if (!dlUri) throw new Error('Không tìm thấy link tải kết quả.');
        const dlUrl = new URL(dlUri);
        const docxRes = await httpsReq({ hostname: dlUrl.hostname, path: dlUrl.pathname + dlUrl.search, method: 'GET' }, null, true);

        const origName = (uploadedFile.originalFilename || 'document').replace(/\.pdf$/i, '');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(origName)}_converted.docx"`);
        return res.send(docxRes.body);

    } catch (e) {
        console.error('Adobe Error:', e);
        return res.status(500).json({ error: true, message: e.message || 'Lỗi chuyển đổi.' });
    } finally {
        try { if (filePath) unlinkSync(filePath); } catch(e) {}
    }
}
