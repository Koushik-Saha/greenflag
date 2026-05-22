'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScanLine } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(6,10,7,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--gf-border)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, #00E887, #007A3D)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(0,232,135,0.3)',
          }}>
            <ScanLine size={16} color="#060A07" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#F0FFF4', letterSpacing: '-0.3px' }}>
            Green<span style={{ color: '#00E887' }}>Flag</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 13, color: '#3D6B50' }}>
          <a href="#how-it-works" style={{ color: '#3D6B50', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F0FFF4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#3D6B50')}>
            How it works
          </a>
          <a href="#scores" style={{ color: '#3D6B50', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F0FFF4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#3D6B50')}>
            11 Scores
          </a>
          <a href="#pricing" style={{ color: '#3D6B50', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F0FFF4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#3D6B50')}>
            Pricing
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/sign-in" style={{ fontSize: 13, color: '#3D6B50', textDecoration: 'none', transition: 'color 0.15s' }}>
            Sign in
          </Link>
          <Link
            href="/sign-up"
            style={{
              fontSize: 13, fontWeight: 700,
              background: '#00E887',
              color: '#060A07',
              padding: '8px 16px',
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'opacity 0.15s',
              boxShadow: '0 0 16px rgba(0,232,135,0.25)',
            }}
          >
            Get started free
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
