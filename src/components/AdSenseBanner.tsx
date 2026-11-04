import React, { useState } from 'react';
import { Sparkles, ExternalLink, X } from 'lucide-react';

interface AdSenseBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId = 'zenvix-ad-slot-default',
  format = 'horizontal',
  className = '',
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={`my-6 mx-auto w-full max-w-4xl p-3 rounded-xl border border-purple-900/30 bg-[#0d0722]/50 text-slate-400 text-xs ${className}`}
    >
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-purple-900/20 text-[10px] uppercase tracking-wider text-slate-500 font-medium">
        <span>Advertisement &middot; Sponsor Showcase</span>
        <button
          onClick={() => setDismissed(true)}
          className="hover:text-slate-300 p-0.5 cursor-pointer"
          title="Dismiss ad preview"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-lg bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-purple-950/40 border border-purple-800/20 ${
          format === 'rectangle' ? 'min-h-[250px] justify-center text-center flex-col' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h5 className="font-semibold text-slate-200 text-sm">Deploy High-Speed Cloud Infrastructure</h5>
            <p className="text-slate-400 text-xs">
              Scale enterprise machine learning models and serverless APIs with 99.99% guaranteed uptime SLA.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.open('https://cloud.google.com', '_blank', 'noreferrer')}
          className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 font-medium text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <span>Learn More</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="mt-1.5 text-right text-[9px] text-slate-600">
        Slot ID: {slotId} &middot; Responsive Display Unit
      </div>
    </div>
  );
};
