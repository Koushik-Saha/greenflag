'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadZone } from '@/components/scan/UploadZone';
import { ScanProgress } from '@/components/scan/ScanProgress';
import { useScanProgress } from '@/hooks/useScanProgress';
import { ChevronRight, CheckCircle } from 'lucide-react';

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
    await startScan({
      resumeId,
      jobDescription: jobDescription || undefined,
      targetRole: targetRole || undefined,
      targetCompany: targetCompany || undefined,
      targetIndustry: targetIndustry || undefined,
    });
  };

  if (step === 'scanning') {
    return <ScanProgress scores={scores} overallScore={overallScore} progress={progress} />;
  }

  const steps: Step[] = ['upload', 'jd', 'profile'];
  const stepIndex = steps.indexOf(step);

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--gf-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    display: 'block',
    marginBottom: 6,
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    background: '#0A1410',
    border: '1px solid var(--gf-border)',
    borderRadius: 10,
    color: 'var(--gf-text-primary)',
    padding: '11px 16px',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                transition: 'all 0.2s',
                background: step === s
                  ? 'var(--gf-signal)'
                  : i < stepIndex
                  ? 'rgba(0,232,135,0.2)'
                  : 'var(--gf-elevated)',
                color: step === s
                  ? '#060A07'
                  : i < stepIndex
                  ? 'var(--gf-signal)'
                  : 'var(--gf-text-muted)',
                border: step === s
                  ? 'none'
                  : i < stepIndex
                  ? '1px solid rgba(0,232,135,0.3)'
                  : '1px solid var(--gf-border)',
              }}>
                {i < stepIndex ? <CheckCircle size={14} color="var(--gf-signal)" /> : i + 1}
              </div>
              {i < 2 && (
                <div style={{
                  width: 40, height: 1,
                  background: i < stepIndex ? 'rgba(0,232,135,0.3)' : 'var(--gf-border)',
                }} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gf-text-primary)', marginBottom: 6, letterSpacing: '-0.4px' }}>
                Upload Your Resume
              </h1>
              <p style={{ color: 'var(--gf-text-tertiary)', marginBottom: 28, fontSize: 14 }}>
                PDF, DOCX, or Markdown — up to 4 MB
              </p>
              <UploadZone onSuccess={handleUploadSuccess} />
            </motion.div>
          )}

          {step === 'jd' && (
            <motion.div key="jd" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gf-text-primary)', marginBottom: 6, letterSpacing: '-0.4px' }}>
                Paste Job Description
              </h1>
              <p style={{ color: 'var(--gf-text-tertiary)', marginBottom: 16, fontSize: 14 }}>
                Optional — unlocks 4 more score lenses
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {UNLOCKS_WITH_JD.map(s => (
                  <span key={s} style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono, monospace)',
                    padding: '4px 10px',
                    borderRadius: 20,
                    transition: 'all 0.2s',
                    border: jobDescription ? '1px solid rgba(0,232,135,0.3)' : '1px solid var(--gf-border)',
                    color: jobDescription ? 'var(--gf-signal)' : 'var(--gf-text-tertiary)',
                    background: jobDescription ? 'rgba(0,232,135,0.08)' : 'transparent',
                  }}>
                    {s} {jobDescription ? '✓' : '🔒'}
                  </span>
                ))}
              </div>

              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={10}
                className="gf-input"
                style={{ resize: 'none', lineHeight: 1.6 }}
              />

              <div style={{ display: 'flex', gap: 12, marginTop: 20, alignItems: 'center' }}>
                <button
                  onClick={() => setStep('profile')}
                  style={{ fontSize: 13, color: 'var(--gf-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Skip
                </button>
                <button
                  onClick={() => setStep('profile')}
                  style={{
                    marginLeft: 'auto',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px',
                    background: 'var(--gf-signal)',
                    color: '#060A07',
                    fontSize: 14, fontWeight: 700,
                    borderRadius: 10, border: 'none', cursor: 'pointer',
                    transition: 'opacity 0.15s',
                  }}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gf-text-primary)', marginBottom: 6, letterSpacing: '-0.4px' }}>
                Quick Profile
              </h1>
              <p style={{ color: 'var(--gf-text-tertiary)', marginBottom: 24, fontSize: 14 }}>
                Helps personalize your Salary &amp; OPT/Visa scores
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Work Authorization</label>
                  <select value={workAuth} onChange={e => setWorkAuth(e.target.value)} style={selectStyle}>
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
                  <label style={labelStyle}>Target Role</label>
                  <input
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="gf-input"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Target Company (optional)</label>
                  <input
                    value={targetCompany}
                    onChange={e => setTargetCompany(e.target.value)}
                    placeholder="e.g. Google, Stripe, Airbnb..."
                    className="gf-input"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Industry</label>
                  <select value={targetIndustry} onChange={e => setTargetIndustry(e.target.value)} style={selectStyle}>
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

              {error && (
                <p style={{ marginTop: 14, fontSize: 13, color: 'var(--gf-score-low)' }}>{error}</p>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 28, alignItems: 'center' }}>
                <button
                  onClick={() => setStep('jd')}
                  style={{ fontSize: 13, color: 'var(--gf-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Back
                </button>
                <button
                  onClick={handleStartScan}
                  style={{
                    marginLeft: 'auto',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 24px',
                    background: 'var(--gf-signal)',
                    color: '#060A07',
                    fontSize: 14, fontWeight: 700,
                    borderRadius: 10, border: 'none', cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(0,232,135,0.3)',
                    transition: 'opacity 0.15s',
                  }}
                >
                  Start Scanning <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {resumeName && (
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gf-text-tertiary)', marginTop: 28 }}>
            Scanning: {resumeName}
          </p>
        )}
      </div>
    </div>
  );
}
