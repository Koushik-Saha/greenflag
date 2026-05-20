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
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        onSuccess(data.resumeId, data.fileName);
      } else {
        const data = JSON.parse(xhr.responseText);
        setError(data.error ?? 'Upload failed. Please try again.');
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
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative flex flex-col items-center justify-center w-full min-h-64 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/20 bg-white/5 hover:border-blue-500/50 hover:bg-white/8'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.docx,.md"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center"
              >
                <Upload className="w-8 h-8 text-blue-400" />
              </motion.div>
              <div>
                <p className="text-white font-semibold text-lg mb-1">Drop your resume here</p>
                <p className="text-slate-500 text-sm">PDF, DOCX, or Markdown · Max 4 MB</p>
              </div>
              <div className="flex gap-2">
                {['PDF', 'DOCX', 'MD'].map(type => (
                  <span key={type} className="text-xs border border-white/10 rounded-full px-3 py-1 text-slate-500 font-mono">
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
            className="flex flex-col gap-3 p-6 rounded-2xl border border-green-500/30 bg-green-500/10"
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                )}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{uploadedFile.name}</p>
                <p className="text-xs text-slate-500">
                  {uploadedFile.size} · {isUploading ? `Uploading ${uploadProgress}%` : 'Upload complete'}
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={() => { setUploadedFile(null); setUploadProgress(0); }}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isUploading && (
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
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
          className="mt-3 text-sm text-red-400 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
