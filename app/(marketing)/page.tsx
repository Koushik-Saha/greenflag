import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProof } from '@/components/landing/SocialProof';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ScorePreview } from '@/components/landing/ScorePreview';
import { PricingSection } from '@/components/landing/PricingSection';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="bg-[#0a0a0f]">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <HowItWorks />
      <div id="scores">
        <ScorePreview />
      </div>
      <PricingSection />

      {/* Comparison table */}
      <section className="py-24 px-6 bg-[#0d0d14]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why not just use Jobscan?</h2>
            <p className="text-slate-400">Because they only check 3 things. We check 11.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 pr-6 text-slate-400 font-normal w-48">Feature</th>
                  <th className="py-4 px-4 text-slate-400 font-normal">Jobscan</th>
                  <th className="py-4 px-4 text-slate-400 font-normal">Resume Worded</th>
                  <th className="py-4 px-4 font-semibold" style={{ color: '#00E887' }}>GreenFlag</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['ATS Score', true, true, true],
                  ['Keyword Match', true, true, true],
                  ['Red Flag Score', false, false, true],
                  ['Impact Score', false, true, true],
                  ['Bias Risk Score', false, false, true],
                  ['AI Detection Score', false, false, true],
                  ['OPT / Visa Score', false, false, true],
                  ['Ghost Job Detector', false, false, true],
                  ['Salary Positioning', false, false, true],
                  ['Career Trajectory', false, false, true],
                  ['Inline AI Rewrites', false, false, true],
                ].map(([feature, jobscan, rw, us]) => (
                  <tr key={String(feature)} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3.5 pr-6 text-slate-300">{String(feature)}</td>
                    <td className="py-3.5 px-4 text-center">{jobscan ? '✓' : <span className="text-slate-700">—</span>}</td>
                    <td className="py-3.5 px-4 text-center">{rw ? '✓' : <span className="text-slate-700">—</span>}</td>
                    <td className="py-3.5 px-4 text-center font-semibold" style={{ color: '#00E887' }}>{us ? '✓' : <span className="text-slate-700">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#0a0a0f]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your resume has blind spots.<br />
            <span style={{ color: '#00E887' }}>Find them before recruiters do.</span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Free to start. No credit card. 3 full scans on us.
          </p>
          <Link
            href="/sign-up"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: '#00E887',
              color: '#060A07',
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 12,
              textDecoration: 'none',
              transition: 'opacity 0.15s',
              boxShadow: '0 0 40px rgba(0,232,135,0.4)',
            }}
          >
            Scan Your Resume Free →
          </Link>
        </div>
      </section>

      <footer className="py-10 border-t border-white/5 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <span className="font-mono text-slate-500">GreenFlag</span>
          <div className="flex gap-6">
            <Link href="/sign-in" className="hover:text-slate-400 transition-colors">Sign In</Link>
            <Link href="/sign-up" className="hover:text-slate-400 transition-colors">Get Started</Link>
            <a href="#pricing" className="hover:text-slate-400 transition-colors">Pricing</a>
          </div>
          <span>© {new Date().getFullYear()} GreenFlag</span>
        </div>
      </footer>
    </main>
  );
}
