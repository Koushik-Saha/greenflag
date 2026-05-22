'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Loader2, X } from 'lucide-react';

interface UploadZoneProps {
  onSuccess: (resumeId: string, fileName: string) => void;
}

export function UploadZone({ onSuccess }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'md'].includes(ext ?? '')) {
      setError('Please upload a PDF, DOCX, or Markdown file');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('File is too large. Max size is 4 MB.');
      return;
    }

    setError(null);
    setUploadedFile({ name: file.name, size: (file.size / 1024).toFixed(0) + ' KB' });
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      setIsUploading(false);
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          onSuccess(data.resumeId, data.fileName);
        } else {
          setError(data.error ?? 'Upload failed. Please try again.');
          setUploadedFile(null);
        }
      } catch {
        setError('Upload failed. Please try again.');
        setUploadedFile(null);
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setError('Network error. Please try again.');
      setUploadedFile(null);
    };

    xhr.send(formData);
  }, [onSuccess]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div style={{ width: '100%' }}>
      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 220,
              borderRadius: 16,
              border: `2px dashed ${isDragging ? 'var(--gf-signal)' : 'var(--gf-border)'}`,
              background: isDragging ? 'rgba(0,232,135,0.05)' : 'var(--gf-card)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isDragging ? '0 0 24px rgba(0,232,135,0.15)' : 'none',
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <input
              type="file"
              style={{ display: 'none' }}
              accept=".pdf,.docx,.md"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: 28 }}>
              <motion.div
                animate={isDragging ? { scale: 1.12 } : { scale: 1 }}
                whileHover={{ scale: 1.06 }}
                style={{
                  width: 60, height: 60,
                  borderRadius: 16,
                  background: 'rgba(0,232,135,0.08)',
                  border: '1px solid rgba(0,232,135,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Upload size={28} color="var(--gf-signal)" />
              </motion.div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 600, fontSize: 16, color: 'var(--gf-text-primary)', marginBottom: 4 }}>
                  Drop your resume here
                </p>
                <p style={{ fontSize: 13, color: 'var(--gf-text-tertiary)' }}>PDF, DOCX, or Markdown · Max 4 MB</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['PDF', 'DOCX', 'MD'].map(type => (
                  <span key={type} style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono, monospace)',
                    border: '1px solid var(--gf-border)',
                    borderRadius: 20,
                    padding: '3px 10px',
                    color: 'var(--gf-text-tertiary)',
                    background: 'var(--gf-elevated)',
                  }}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </motion.label>
        ) : (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 20,
              borderRadius: 14,
              border: isUploading
                ? '1px solid rgba(0,232,135,0.2)'
                : '1px solid rgba(0,232,135,0.3)',
              background: isUploading
                ? 'rgba(0,232,135,0.04)'
                : 'rgba(0,232,135,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              >
                {isUploading ? (
                  <Loader2 size={28} color="var(--gf-signal)" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <CheckCircle size={28} color="var(--gf-signal)" />
                )}
              </motion.div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: 'var(--gf-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {uploadedFile.name}
                </p>
                <p style={{ fontSize: 12, color: 'var(--gf-text-tertiary)' }}>
                  {uploadedFile.size} · {isUploading ? `Uploading ${uploadProgress}%` : 'Upload complete'}
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={() => { setUploadedFile(null); setUploadProgress(0); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--gf-text-tertiary)', padding: 4, borderRadius: 6,
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {isUploading && (
              <div style={{ height: 3, background: 'var(--gf-elevated)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'var(--gf-signal)', borderRadius: 2 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: 10, fontSize: 13, color: 'var(--gf-score-low)', textAlign: 'center' }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
