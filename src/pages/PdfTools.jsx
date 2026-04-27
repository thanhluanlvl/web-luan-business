import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUp, FileSignature, Files, Scissors, AlertCircle, X } from 'lucide-react';
import './PdfTools.css';

const PdfTools = () => {
  const [activeTab, setActiveTab] = useState('merge'); // 'merge' or 'split'
  const [files, setFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection for merge
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

  // Handle file selection for split
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
      downloadBlob(mergedPdfBytes, 'TaiLieuGop_WebLuan.pdf');
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
      
      // Parse page range (e.g., "1-3, 5")
      const pagesToExtract = new Set();
      const parts = pageRange.split(',');
      
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map(Number);
          if (start > 0 && end >= start && end <= totalPages) {
            for (let i = start; i <= end; i++) pagesToExtract.add(i - 1); // 0-indexed
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
      downloadBlob(newPdfBytes, 'TaiLieuTach_WebLuan.pdf');
    } catch (err) {
      console.error(err);
      setError(`Lỗi: ${err.message || 'Không thể tách file. Vui lòng kiểm tra lại khoảng trang hoặc file bị khóa mật khẩu.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadBlob = (bytes, filename) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
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
        <p>Xử lý tài liệu chớp nhoáng 100% trên thiết bị của bạn. Khẳng định bảo mật tuyệt đối, không lưu trữ trên máy chủ.</p>
      </div>

      <div className="pdf-container">
        {/* Tabs */}
        <div className="pdf-tabs">
          <button 
            className={`pdf-tab ${activeTab === 'merge' ? 'active' : ''}`}
            onClick={() => { setActiveTab('merge'); setError(''); }}
          >
            <Files size={20} /> Gộp File PDF
          </button>
          <button 
            className={`pdf-tab ${activeTab === 'split' ? 'active' : ''}`}
            onClick={() => { setActiveTab('split'); setError(''); }}
          >
            <Scissors size={20} /> Tách Trang PDF
          </button>
        </div>

        <div className="pdf-workspace">
          {error && (
            <div className="pdf-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* MERGE TAB */}
          {activeTab === 'merge' && (
            <div className="pdf-tab-content">
              <h3>Gộp nhiều file PDF thành một tệp duy nhất</h3>
              
              <div className="upload-zone">
                <input 
                  type="file" 
                  id="merge-upload" 
                  multiple 
                  accept=".pdf" 
                  onChange={handleMergeFilesChange} 
                />
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

              <button 
                className="btn-action" 
                onClick={mergePdfs} 
                disabled={files.length < 2 || isProcessing}
              >
                {isProcessing ? 'Đang xử lý xin vui lòng chờ...' : <><Files size={18} /> Tiến hành Gộp PDF</>}
              </button>
            </div>
          )}

          {/* SPLIT TAB */}
          {activeTab === 'split' && (
            <div className="pdf-tab-content">
              <h3>Trích xuất các trang từ tệp PDF</h3>
              
              <div className="upload-zone">
                <input 
                  type="file" 
                  id="split-upload" 
                  accept=".pdf" 
                  onChange={handleSplitFileChange} 
                />
                <label htmlFor="split-upload" className="upload-label">
                  <FileUp size={48} className="upload-icon" />
                  <span>Bấm vào đây để chọn 1 file PDF gốc</span>
                  <small className="file-selected-name">{splitFile ? `Đã chọn: ${splitFile.name}` : 'Chưa chọn file nào'}</small>
                </label>
              </div>

              {splitFile && (
                <div className="split-options">
                  <label>Nhập các trang cần trích xuất (VD: 1-3, 5, 8-10):</label>
                  <input 
                    type="text" 
                    placeholder="Nhập 1, 3-5, 7..." 
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    className="page-input"
                  />
                </div>
              )}

              <button 
                className="btn-action" 
                onClick={splitPdf} 
                disabled={!splitFile || !pageRange || isProcessing}
              >
                {isProcessing ? 'Đang cắt trang...' : <><Scissors size={18} /> Cắt và Tải Xuống File Mới</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfTools;
