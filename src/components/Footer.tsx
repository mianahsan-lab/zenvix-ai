import React from 'react';

interface FooterProps {
  onOpenLegal: (modal: 'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact') => void;
  onNavigate: (view: string, toolId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onNavigate }) => {
  return (
    <footer className="border-t border-purple-900/30 bg-[#06030d] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5">
                <div className="w-full h-full bg-[#0d0722] rounded-[6px] flex items-center justify-center font-bold text-purple-300 text-xs">
                  Z
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">ZENVIX AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-4">
              Your All-in-One AI Workspace. Designed for modern creators, software engineers, researchers, and marketing teams to produce high-impact work faster.
            </p>
            <div className="text-[11px] text-slate-500 space-y-1">
              <p>Engineered with Gemini 3.8 Flash, Node.js, and React.</p>
              <p>© {new Date().getFullYear()} ZENVIX AI Platform. All rights reserved.</p>
            </div>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Popular Tools</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('tool', 'ai-writer')} className="hover:text-purple-300 transition-colors cursor-pointer text-left">
                  AI Writer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool', 'code-assistant')} className="hover:text-purple-300 transition-colors cursor-pointer text-left">
                  AI Code Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool', 'youtube-script')} className="hover:text-purple-300 transition-colors cursor-pointer text-left">
                  YouTube Script Gen
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool', 'study-notes')} className="hover:text-purple-300 transition-colors cursor-pointer text-left">
                  Cornell Study Notes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools')} className="text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer text-left">
                  View All 24 Tools →
                </button>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Pricing & Subscriptions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  User Workspace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('docs')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  API & Setup Guide
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('about')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  About ZENVIX AI
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('contact')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Legal & Trust</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('disclaimer')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  AI Disclaimer
                </button>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-purple-300 transition-colors">
                  Robots.txt
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-purple-300 transition-colors">
                  Sitemap.xml
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* AdSense / Compliance Disclosure Bar */}
        <div className="pt-8 border-t border-purple-900/20 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            Transparency Note: ZENVIX AI provides AI-assisted content tools. Results are model-generated and should be reviewed for factual accuracy. We respect user privacy and do not sell personal data.
          </p>
          <div className="flex items-center gap-4">
            <span>Server Status: Operational</span>
            <span aria-hidden="true">·</span>
            <span>API: Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
