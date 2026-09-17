import React, { useState } from 'react';
import { Mail, ArrowUpRight, Copy, Check } from 'lucide-react';

export const ContactFooter: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const directEmail = 'rossmatthew75@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer id="contact" className="border-t border-neutral-800 bg-[#060607] py-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Editor Identity */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="font-display font-bold text-lg tracking-wider text-white uppercase">
              MATTHEW ROSS SANOTA
            </span>
          </div>
          <p className="font-mono text-xs text-neutral-400 max-w-sm">
            Short-form retention cuts & long-form narrative pacing.
          </p>
        </div>

        {/* Direct Email Contact */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/90 px-4 py-2.5 font-mono text-xs text-white hover:border-neutral-600 transition-colors"
            title="Copy email to clipboard"
          >
            <Mail className="h-3.5 w-3.5 text-neutral-400" />
            <span>{directEmail}</span>
            {copiedEmail ? (
              <Check className="h-3.5 w-3.5 text-emerald-400 ml-1" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-neutral-500 ml-1" />
            )}
          </button>

          {/* Social Links */}
          <div className="flex items-center gap-5 font-mono text-xs text-neutral-400">
            <a
              href="https://vimeo.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>VIMEO</span> <ArrowUpRight className="h-3 w-3" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>YOUTUBE</span> <ArrowUpRight className="h-3 w-3" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>INSTAGRAM</span> <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-neutral-900 text-center md:text-left font-mono text-[11px] text-neutral-600">
        © 2026 MATTHEW ROSS SANOTA. ALL CUTS PROTECTED.
      </div>
    </footer>
  );
};
