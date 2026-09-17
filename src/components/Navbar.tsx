import React, { useState, useEffect } from 'react';
import { Menu, X, Play, Clock, Sparkles, Send } from 'lucide-react';
import { DecryptedText } from './reactbits/DecryptedText';
import { MagneticButton } from './reactbits/MagneticButton';

interface NavbarProps {
  onScrollTo: (id: string) => void;
  onOpenDirectReel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollTo,
  onOpenDirectReel,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTimecode, setCurrentTimecode] = useState('00:00:00:00');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timecode simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const frame = String(Math.floor((now.getMilliseconds() / 1000) * 24)).padStart(2, '0');
      setCurrentTimecode(`${hrs}:${mins}:${secs}:${frame}`);
    }, 42); // ~24 fps update rate
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'SHOWREEL', id: 'hero-showreel' },
    { label: 'SELECTED WORKS', id: 'projects' },
    { label: 'CONTACT', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/90 border-b border-neutral-800/80 backdrop-blur-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-left group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="h-6 w-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs tracking-tight">
              MS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-wider text-white group-hover:text-neutral-300 transition-colors">
                  MATTHEW ROSS SANOTA
                </span>
              </div>
              <span className="font-mono text-[10px] text-neutral-500 hidden md:block">
                SHORT-FORM & LONG-FORM EDITORIAL
              </span>
            </div>
          </button>
        </div>

        {/* Center Live Timecode & Status */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 px-3 py-1.5 rounded-full">
          <Clock className="h-3 w-3 text-neutral-500" />
          <span className="text-neutral-500">TC</span>
          <span className="text-neutral-200 tracking-wider font-semibold">{currentTimecode}</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400 text-[11px]">24 FPS MASTER</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-neutral-400 hover:text-white transition-colors uppercase relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-white hover:after:w-full after:transition-all"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          <MagneticButton
            id="nav-showreel-btn"
            onClick={onOpenDirectReel}
            className="px-4 py-2 rounded-lg bg-white text-black text-xs font-mono font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
          >
            <span>WATCH SHOWREEL</span>
          </MagneticButton>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-[#0c0c0e] px-4 py-6 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-neutral-400 pb-3 border-b border-neutral-800">
            <span>LIVE TIMECODE:</span>
            <span className="text-white font-semibold">{currentTimecode}</span>
          </div>

          <nav className="flex flex-col space-y-3 font-mono text-sm">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left text-neutral-300 hover:text-white py-1 transition-colors uppercase"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenDirectReel();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-white text-black font-mono text-xs font-bold text-center"
            >
              WATCH SHOWREEL
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
