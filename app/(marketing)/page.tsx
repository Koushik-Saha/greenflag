import { HeroSection } from '@/components/landing/HeroSection';
import { ScorePreview } from '@/components/landing/ScorePreview';
import { SocialProof } from '@/components/landing/SocialProof';
import { PricingSection } from '@/components/landing/PricingSection';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <SocialProof />
      <ScorePreview />
      <PricingSection />
      <footer className="py-12 border-t border-white/5 bg-[#0a0a0f] text-center text-slate-600 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-slate-500">ResumeScore.ai</span>
          <div className="flex gap-6">
            <Link href="/sign-in" className="hover:text-slate-400 transition-colors">Sign In</Link>
            <Link href="/sign-up" className="hover:text-slate-400 transition-colors">Get Started</Link>
            <Link href="#pricing" className="hover:text-slate-400 transition-colors">Pricing</Link>
          </div>
          <span>© {new Date().getFullYear()} ResumeScore.ai</span>
        </div>
      </footer>
    </main>
  );
}
