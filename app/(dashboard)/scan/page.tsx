'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadZone } from '@/components/scan/UploadZone';
import { ScanProgress } from '@/components/scan/ScanProgress';
import { useScanProgress } from '@/hooks/useScanProgress';
import { ChevronRight } from 'lucide-react';

type Step = 'upload' | 'jd' | 'profile' | 'scanning';

const UNLOCKS_WITH_JD = ['Keyword Match', 'OPT / Visa Friendliness', 'Salary Positioning', 'Ghost Job Risk'];

export default function ScanPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('upload');
  const [resumeId, setResumeId] = useState('');
  const [resumeName, setResumeFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [workAuth, setWorkAuth] = useState('');

  const { scores, overallScore, scanId, isComplete, error, progress, startScan } = useScanProgress();

  useEffect(() => {
    if (isComplete && scanId) {
      setTimeout(() => router.push(`/results/${scanId}`), 1500);
    }
  }, [isComplete, scanId, router]);

  const handleUploadSuccess = (id: string, name: string) => {
    setResumeId(id);
    setResumeFileName(name);
    setStep('jd');
  };

  const handleStartScan = async () => {
    setStep('scanning');
    await startScan({ resumeId, jobDescription: jobDescription || undefined, targetRole: targetRole || undefined, targetCompany: targetCompany || undefined, targetIndustry: targetIndustry || undefined });
  };

  if (step === 'scanning') {
    return <ScanProgress scores={scores} overallScore={overallScore} progress={progress} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-8">
          {(['upload', 'jd', 'profile'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s ? 'bg-blue-600 text-white' : ['jd', 'profile'].indexOf(s) < ['upload', 'jd', 'profile'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-500'}`}>
                {i + 1}
              </div>
              {i < 2 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h1>
              <p className="text-slate-500 mb-8">PDF, DOCX, or Markdown — up to 4MB</p>
              <UploadZone onSuccess={handleUploadSuccess} />
            </motion.div>
          )}

          {step === 'jd' && (
            <motion.div key="jd" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-white mb-2">Paste Job Description</h1>
              <p className="text-slate-500 mb-4">Optional — but unlocks 4 more score lenses</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {UNLOCKS_WITH_JD.map(s => (
                  <span key={s} className={`text-xs border rounded-full px-3 py-1 font-mono transition-all ${jobDescription ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-white/10 text-slate-500'}`}>
                    {s} {jobDescription ? '✓' : '🔒'}
                  </span>
                ))}
              </div>

              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={10}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 resize-none"
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep('profile')}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Skip (general scan)
                </button>
                <button
                  onClick={() => setStep('profile')}
                  className="flex items-center gap-2 ml-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-white mb-2">Quick Profile</h1>
              <p className="text-slate-500 mb-6">Helps personalize your Salary & OPT/Visa scores</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Work Authorization</label>
                  <select value={workAuth} onChange={e => setWorkAuth(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
                    <option value="">Select...</option>
                    <option value="citizen">US Citizen</option>
                    <option value="gc">Green Card</option>
                    <option value="h1b">H1B</option>
                    <option value="opt">OPT / F-1</option>
                    <option value="tn">TN Visa</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Target Role</label>
                  <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Senior Software Engineer" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Target Company (optional)</label>
                  <input value={targetCompany} onChange={e => setTargetCompany(e.target.value)} placeholder="e.g. Google, Stripe, Airbnb..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Industry</label>
                  <select value={targetIndustry} onChange={e => setTargetIndustry(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
                    <option value="">Select...</option>
                    <option value="bigtech">Big Tech</option>
                    <option value="fintech">Fintech</option>
                    <option value="consulting">Consulting</option>
                    <option value="startup">Startup</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep('jd')} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  Back
                </button>
                <button
                  onClick={handleStartScan}
                  className="flex items-center gap-2 ml-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  Start Scanning <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-slate-600 mt-8">Scanning: {resumeName}</p>
      </div>
    </div>
  );
}
