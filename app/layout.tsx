import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'GreenFlag — Resume Intelligence Platform',
  description: 'Turn every red flag green. 11-lens AI resume analysis with Bias Risk, Ghost Job Detector, OPT/Visa scoring, and more.',
  openGraph: {
    title: 'GreenFlag — Resume Intelligence Platform',
    description: 'Turn every red flag green.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen antialiased" style={{ fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)' }}>
        {children}
      </body>
    </html>
  );
}
