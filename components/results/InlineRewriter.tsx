'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Check, X, Copy, Loader2 } from 'lucide-react';
import { Typewriter } from '@/components/ui/typewriter';

interface InlineRewriterProps {
  scanId: string;
  originalBullet: string;
  targetRole?: string;
  targetIndustry?: string;
  onAccept?: (rewritten: string) => void;
}

export function InlineRewriter({ scanId, originalBullet, targetRole, targetIndustry, onAccept }: InlineRewriterProps) {
  const [rewritten, setRewritten] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRewrite, setShowRewrite] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    setIsLoading(true);
    setRewritten('');
    setShowRewrite(true);
    setIsTypingDone(false);

    const response = await fetch('/api/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scanId, originalBullet, targetRole, targetIndustry }),
    });

    if (!response.ok || !response.body) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let full = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      const lines = text.split('\n').filter(l => l.startsWith('data: '));
      for (const line of lines) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.text) full += data.text;
        } catch { /* skip */ }
      }
    }

    setRewritten(full.trim());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        <p className="text-sm text-slate-400 mb-2 text-xs uppercase tracking-wider">Original</p>
        <p className="text-sm text-slate-300">{originalBullet}</p>
      </div>

      {!showRewrite && (
        <button
          onClick={handleRewrite}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-400 text-sm rounded-lg transition-all"
        >
          <Wand2 className="w-4 h-4" />
          AI Rewrite
        </button>
      )}

      <AnimatePresence>
        {showRewrite && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/30"
          >
            <p className="text-sm text-slate-400 mb-2 text-xs uppercase tracking-wider">AI Rewrite</p>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Rewriting...
              </div>
            ) : (
              <Typewriter
                text={rewritten}
                speed={20}
                onComplete={() => setIsTypingDone(true)}
                className="text-sm text-slate-200"
              />
            )}

            {isTypingDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 mt-3"
              >
                <button
                  onClick={() => { onAccept?.(rewritten); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 text-xs rounded-lg transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accept
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-xs rounded-lg transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => setShowRewrite(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-xs rounded-lg transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
