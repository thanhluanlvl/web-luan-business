import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUp, FileSignature, Files, Scissors, AlertCircle, X, FileText } from 'lucide-react';
import './PdfTools.css';

const PdfTools = () => {
  const [activeTab, setActiveTab] = useState('merge');
  const [files, setFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [pageRange, setPageRange] = useState('');
  const [convertToDocxFile, setConvertToDocxFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState('');

  const handleMergeFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    if (validFiles.length !== selectedFiles.length) {
      setError('Vui lòng chỉ chọn các file định dạng PDF.');
    } else {
      setError('');
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleSplitFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSplitFile(file);
      setError('');
    } else {
      setError('Vui lòng chọn 1 file định dạng PDF.');
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleConvertToDocxFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setConvertToDocxFile(file);
      setError('');
    } else {
      setError('Vui lòng chọn 1 file định dạng PDF.');
    }
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError('Vui lòng chọn ít nhất 2 file PDF để gộp.');
      return;
    }
    setIsProcessing(true);
    setError('');
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const fileArrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedPdfBytes = await mergedPdf.save();
      downloadBlob(mergedPdfBytes, 'TaiLieuGop_WebLuan.pdf', 'application/pdf');
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra trong quá trình gộp file. Đảm bảo file PDF không bị khóa mật khẩu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const splitPdf = async () => {
    if (!splitFile) {
      setError('Vui lòng chọn 1 file PDF để tách.');
      return;
    }
    if (!pageRange.trim()) {
      setError('Vui lòng nhập khoảng trang cần tách (VD: 1-3, 5).');
      return;
    }
    setIsProcessing(true);
    setError('');
    try {
      const fileArrayBuffer = await splitFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      const pagesToExtract = new Set();
      const parts = pageRange.split(',');
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map(Number);
          if (start > 0 && end >= start && end <= totalPages) {
            for (let i = start; i <= end; i++) pagesToExtract.add(i - 1);
          }
        } else {
          const pageNum = Number(trimmed);
          if (pageNum > 0 && pageNum <= totalPages) {
            pagesToExtract.add(pageNum - 1);
          }
        }
      }
      if (pagesToExtract.size === 0) {
        throw new Error('Định dạng trang không hợp lệ hoặc số trang vượt quá tài liệu.');
      }
      const newPdf = await PDFDocument.create();
      const sortedIndices = Array.from(pagesToExtract).sort((a, b) => a - b);
      const copiedPages = await newPdf.copyPages(pdfDoc, sortedIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));
      const newPdfBytes = await newPdf.save();
      downloadBlob(newPdfBytes, 'TaiLieuTach_WebLuan.pdf', 'application/pdf');
    } catch (err) {
      console.error(err);
      setError(`Lỗi: ${err.message || 'Không thể tách file.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // ====== CHUYỂN ĐỔI PDF SANG DOCX (Adobe PDF Services - 500 lượt miễn phí/tháng) ======
  const convertToDocx = async () => {
    if (!convertToDocxFile) {
      setError('Vui lòng chọn 1 file PDF để chuyển đổi.');
      return;
    }
    setIsProcessing(true);
    setError('');
    setProgressText('Đang tải file lên máy chủ Adobe...');

    try {
      const formData = new FormData();
      formData.append('pdf', convertToDocxFile);

      // Tự động phát hiện: chạy trên máy (localhost) hay trên mạng (Vercel)
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocal 
        ? 'http://localhost:3001/api/convert/pdf-to-docx' 
        : '/api/convert/pdf-to-docx';

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Lỗi máy chủ: HTTP ${response.status}`);
      }

      setProgressText('Đang tải file Word về máy...');

      // Nhận file DOCX dạng binary từ server
      const blob = await response.blob();
      const originalName = convertToDocxFile.name.replace('.pdf', '').replace('.PDF', '');
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${originalName}_converted.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      setError(`Lỗi: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setProgressText('');
    }
  };

  const downloadBlob = (bytes, filename, mimeType) => {
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pdf-tools-page animate-fade-in">
      <div className="pdf-header">
        <h1>Công Cụ Xử Lý <span className="text-highlight">PDF</span></h1>
        <p>Xử lý tài liệu chớp nhoáng. Khẳng định bảo mật tuyệt đối.</p>
      </div>

      <div className="pdf-container">
        <div className="pdf-tabs">
          <button className={`pdf-tab ${activeTab === 'merge' ? 'active' : ''}`}
            onClick={() => { setActiveTab('merge'); setError(''); }}>
            <Files size={20} /> Gộp File
          </button>
          <button className={`pdf-tab ${activeTab === 'split' ? 'active' : ''}`}
            onClick={() => { setActiveTab('split'); setError(''); }}>
            <Scissors size={20} /> Tách Trang
          </button>
          <button className={`pdf-tab ${activeTab === 'to-docx' ? 'active' : ''}`}
            onClick={() => { setActiveTab('to-docx'); setError(''); }}>
            <FileText size={20} /> Sang Word
          </button>
        </div>

        <div className="pdf-workspace">
          {error && (
            <div className="pdf-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {activeTab === 'merge' && (
            <div className="pdf-tab-content">
              <h3>Gộp nhiều file PDF thành một tệp duy nhất</h3>
              <div className="upload-zone">
                <input type="file" id="merge-upload" multiple accept=".pdf" onChange={handleMergeFilesChange} />
                <label htmlFor="merge-upload" className="upload-label">
                  <FileUp size={48} className="upload-icon" />
                  <span>Kéo thả hoặc Bấm vào đây để chọn các file PDF</span>
                  <small>Chọn nhiều file cùng lúc để gộp</small>
                </label>
              </div>
              {files.length > 0 && (
                <div className="file-list">
                  <h4>Các file đã chọn ({files.length} file):</h4>
                  <ul>
                    {files.map((f, i) => (
                      <li key={i}>
                        <FileSignature size={16} />
                        <span className="file-name">{f.name}</span>
                        <button className="remove-btn" onClick={() => removeFile(i)}><X size={14} /></button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button className="btn-action" onClick={mergePdfs} disabled={files.length < 2 || isProcessing}>
                {isProcessing ? 'Đang xử lý xin vui lòng chờ...' : <><Files size={18} /> Tiến hành Gộp PDF</>}
              </button>
            </div>
          )}

          {activeTab === 'split' && (
            <div className="pdf-tab-content">
              <h3>Trích xuất các trang từ tệp PDF</h3>
              <div className="upload-zone">
                <input type="file" id="split-upload" accept=".pdf" onChange={handleSplitFileChange} />
                <label htmlFor="split-upload" className="upload-label">
                  <FileUp size={48} className="upload-icon" />
                  <span>Bấm vào đây để chọn 1 file PDF gốc</span>
                  <small className="file-selected-name">{splitFile ? `Đã chọn: ${splitFile.name}` : 'Chưa chọn file nào'}</small>
                </label>
              </div>
              {splitFile && (
                <div className="split-options">
                  <label>Nhập các trang cần trích xuất (VD: 1-3, 5, 8-10):</label>
                  <input type="text" placeholder="Nhập 1, 3-5, 7..." value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)} className="page-input" />
                </div>
              )}
              <button className="btn-action" onClick={splitPdf} disabled={!splitFile || !pageRange || isProcessing}>
                {isProcessing ? 'Đang cắt trang...' : <><Scissors size={18} /> Cắt và Tải Xuống File Mới</>}
              </button>
            </div>
          )}

          {activeTab === 'to-docx' && (
            <div className="pdf-tab-content">
              <h3>Chuyển đổi PDF sang Word (DOCX)</h3>
              <p style={{color: '#cbd5e1', marginBottom: '1rem'}}>Sử dụng công nghệ Adobe Acrobat — chuẩn xác tuyệt đối, giữ nguyên 100% bố cục, bảng biểu và phông chữ gốc. Miễn phí cho tất cả người dùng.</p>
              <div className="pdf-notice">
                <span>🏆</span> Powered by Adobe — Ông tổ phát minh ra định dạng PDF. Chất lượng chuyển đổi tốt nhất thế giới.
              </div>
              <div className="upload-zone">
                <input type="file" id="docx-upload" accept=".pdf" onChange={handleConvertToDocxFileChange} />
                <label htmlFor="docx-upload" className="upload-label">
                  <FileUp size={48} className="upload-icon" />
                  <span>Bấm vào đây để chọn 1 file PDF</span>
                  <small className="file-selected-name">{convertToDocxFile ? `Đã chọn: ${convertToDocxFile.name}` : 'Chưa chọn file nào'}</small>
                </label>
              </div>
              <button className="btn-action" onClick={convertToDocx} disabled={!convertToDocxFile || isProcessing}
                style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}>
                {isProcessing ? (progressText || 'Đang xử lý...') : <><FileText size={18} /> Chuyển Sang Word (Adobe)</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfTools;
