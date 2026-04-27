const {
    ServicePrincipalCredentials,
    PDFServices,
    MimeType,
    ExportPDFJob,
    ExportPDFParams,
    ExportPDFTargetFormat
} = require('@adobe/pdfservices-node-sdk');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// Tắt body parser mặc định của Vercel
module.exports.config = {
    api: {
        bodyParser: false,
    },
};

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: true, message: 'Method not allowed' });
    }

    let filePath = null;
    let outputPath = null;

    try {
        // Parse file upload
        const form = formidable({ uploadDir: '/tmp', keepExtensions: true, maxFileSize: 50 * 1024 * 1024 });

        const { files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        const uploadedFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
        if (!uploadedFile) {
            return res.status(400).json({ error: true, message: 'Không tìm thấy file PDF.' });
        }

        filePath = uploadedFile.filepath || uploadedFile.path;

        // 1. Khởi tạo chứng chỉ Adobe
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.ADOBE_CLIENT_ID || '733e7b1fd2194ec2bf028d375978f04d',
            clientSecret: process.env.ADOBE_CLIENT_SECRET || 'p8e-Wx1rvvQXA94KFmOtHr_-CdeqUbpBWm_-'
        });

        const pdfServices = new PDFServices({ credentials });

        // 2. Tải file PDF lên Adobe Cloud
        const readStream = fs.createReadStream(filePath);
        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.PDF
        });

        // 3. Tạo lệnh chuyển đổi sang DOCX
        const params = new ExportPDFParams({
            targetFormat: ExportPDFTargetFormat.DOCX
        });
        const job = new ExportPDFJob({ inputAsset, params });

        // 4. Thực thi và chờ kết quả
        const pollingURL = await pdfServices.submit({ job });
        const jobResult = await pdfServices.getJobResult({
            pollingURL,
            resultType: ExportPDFJob.Result
        });

        // 5. Lưu file DOCX kết quả
        const resultAsset = jobResult.result.asset;
        const streamAsset = await pdfServices.getContent({ asset: resultAsset });
        
        outputPath = path.join('/tmp', `converted_${Date.now()}.docx`);
        const writeStream = fs.createWriteStream(outputPath);

        await new Promise((resolve, reject) => {
            streamAsset.readStream.pipe(writeStream);
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        // 6. Gửi file DOCX về cho người dùng
        const fileBuffer = fs.readFileSync(outputPath);
        const originalName = (uploadedFile.originalFilename || 'document').replace(/\.pdf$/i, '');
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalName)}_converted.docx"`);
        return res.send(fileBuffer);

    } catch (e) {
        console.error('Adobe PDF Services Error:', e);
        return res.status(500).json({ 
            error: true, 
            message: e.message || 'Lỗi trong quá trình chuyển đổi.'
        });
    } finally {
        try { if (filePath) fs.unlinkSync(filePath); } catch(e) {}
        try { if (outputPath) fs.unlinkSync(outputPath); } catch(e) {}
    }
};
