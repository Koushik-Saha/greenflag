'use client';

import { useState, useTransition } from 'react';
import { updateUserProfile } from '@/lib/actions/user';
import { User, Briefcase, Globe, Check } from 'lucide-react';

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [workAuth, setWorkAuth] = useState('');

  const handleSave = () => {
    startTransition(async () => {
      await updateUserProfile({
        targetRole: targetRole || undefined,
        targetIndustry: targetIndustry || undefined,
        workAuthorization: workAuth as 'citizen' | 'gc' | 'h1b' | 'opt' | 'tn' | 'other' || undefined,
        isOPT: workAuth === 'opt',
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12, fontWeight: 600,
    color: 'var(--gf-text-tertiary)',
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
    <div style={{ padding: '32px', maxWidth: 640 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gf-text-primary)', letterSpacing: '-0.4px' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--gf-text-tertiary)', fontSize: 14, marginTop: 4 }}>
          Personalize your scoring preferences for more accurate results.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Profile */}
        <div style={{
          background: 'var(--gf-card)',
          border: '1px solid var(--gf-border)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--gf-border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 34, height: 34,
              borderRadius: 10,
              background: 'rgba(0,232,135,0.08)',
              border: '1px solid rgba(0,232,135,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <User size={16} color="var(--gf-signal)" />
            </div>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gf-text-primary)' }}>Profile Preferences</h2>
              <p style={{ fontSize: 12, color: 'var(--gf-text-tertiary)' }}>
                Used to personalize OPT/Visa, Salary, and Trajectory scores
              </p>
            </div>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>
                <Briefcase size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Target Role
              </label>
              <input
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="gf-input"
              />
            </div>

            <div>
              <label style={labelStyle}>
                <Globe size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Work Authorization
              </label>
              <select value={workAuth} onChange={e => setWorkAuth(e.target.value)} style={selectStyle}>
                <option value="">Select...</option>
                <option value="citizen">US Citizen</option>
                <option value="gc">Green Card</option>
                <option value="h1b">H1B</option>
                <option value="opt">OPT / F-1</option>
                <option value="tn">TN Visa</option>
                <option value="other">Other</option>
              </select>
              {(workAuth === 'opt' || workAuth === 'h1b') && (
                <p style={{
                  marginTop: 8, fontSize: 12,
                  color: 'var(--gf-signal)',
                  background: 'rgba(0,232,135,0.06)',
                  border: '1px solid rgba(0,232,135,0.15)',
                  borderRadius: 8, padding: '8px 12px',
                }}>
                  OPT/Visa score weight will increase to 10% for more relevant analysis.
                </p>
              )}
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
        </div>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: 'var(--gf-text-muted)' }}>Changes apply to your next scan.</p>
          <button
            onClick={handleSave}
            disabled={isPending}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px',
              fontSize: 13, fontWeight: 700,
              borderRadius: 10, cursor: 'pointer',
              transition: 'all 0.15s',
              opacity: isPending ? 0.6 : 1,
              background: saved ? 'rgba(0,232,135,0.15)' : 'var(--gf-signal)',
              color: saved ? 'var(--gf-signal)' : '#060A07',
              border: saved ? '1px solid rgba(0,232,135,0.3)' : 'none',
            }}
          >
            {saved && <Check size={14} />}
            {isPending ? 'Saving…' : saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
