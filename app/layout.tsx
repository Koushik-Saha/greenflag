import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'ResumeScore.ai — 11-Lens AI Resume Intelligence',
  description: 'The only resume tool with Bias Risk Score, AI Detection, Ghost Job Detector, OPT/Visa scoring, and 7 more unique analyses. Trusted by 2,400+ job seekers.',
  openGraph: {
    title: 'ResumeScore.ai — 11-Lens AI Resume Intelligence',
    description: 'Find every weakness in your resume with 11 AI-powered lenses nobody else runs.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
