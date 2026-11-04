import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, FileText, AlertTriangle, Info, Mail } from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact' | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  if (!activeModal) return null;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setContactError(null);
    setContactSuccess(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit message');
      setContactSuccess(data.message);
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    } catch (err: any) {
      setContactError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0d0722] border border-purple-800/40 shadow-2xl p-6 sm:p-8 text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-purple-950/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Privacy Policy */}
        {activeModal === 'privacy' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2.5 mb-2 text-white">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold">Privacy Policy</h3>
            </div>
            <p className="text-[11px] text-slate-400">Last updated: November 2026</p>
            <p>
              At <strong>ZENVIX AI</strong>, we value the trust and privacy of our visitors and registered users. This Privacy Policy outlines what information we collect, how it is processed, and your privacy rights.
            </p>
            <h4 className="text-sm font-semibold text-white pt-2">1. Information We Collect</h4>
            <p>
              When you create an account, we store your email address, name, and hashed credentials. We never store raw passwords. Session identifiers and usage metadata (such as tool execution timestamps and token usage) are stored to provide analytics and enforce credit quotas.
            </p>
            <h4 className="text-sm font-semibold text-white pt-2">2. AI Prompts and Generated Data</h4>
            <p>
              Prompts submitted through ZENVIX AI are transmitted securely to our backend server and forwarded to the Google GenAI (Gemini) API to generate outputs. We do not sell your prompt submissions to external third-party advertisers.
            </p>
            <h4 className="text-sm font-semibold text-white pt-2">3. Cookies and Local Storage</h4>
            <p>
              We utilize minimal client-side browser storage (such as localStorage for authenticated JWT tokens) to preserve your login session across browser reloads.
            </p>
            <h4 className="text-sm font-semibold text-white pt-2">4. Your Data Rights</h4>
            <p>
              You have the right to inspect, export, or delete your account records and saved results at any time via the User Dashboard settings.
            </p>
          </div>
        )}

        {/* Terms of Service */}
        {activeModal === 'terms' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2.5 mb-2 text-white">
              <FileText className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold">Terms of Service</h3>
            </div>
            <p className="text-[11px] text-slate-400">Effective Date: November 2026</p>
            <p>
              By accessing or using the ZENVIX AI platform, you agree to comply with and be bound by these Terms of Service.
            </p>
            <h4 className="text-sm font-semibold text-white pt-2">1. Permitted Use</h4>
            <p>
              You agree to use ZENVIX AI only for lawful purposes. You must not use our AI generation tools to produce illegal material, malware, defamatory text, or unauthorized copyrighted materials.
            </p>
            <h4 className="text-sm font-semibold text-white pt-2">2. Credit Quotas and Subscriptions</h4>
            <p>
              Free accounts are granted daily credits that reset automatically. Pro subscriptions grant high-speed prioritized execution and higher monthly quotas. Subscriptions may be cancelled at any time through the billing dashboard.
            </p>
            <h4 className="text-sm font-semibold text-white pt-2">3. Intellectual Property</h4>
            <p>
              Content generated by users using the AI tools belongs to the user to the maximum extent permitted by applicable intellectual property laws.
            </p>
          </div>
        )}

        {/* AI Disclaimer */}
        {activeModal === 'disclaimer' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2.5 mb-2 text-white">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold">AI Generation & AdSense Disclaimer</h3>
            </div>
            <p className="text-[11px] text-slate-400">Official Notice</p>
            <h4 className="text-sm font-semibold text-white pt-2">1. Artificial Intelligence Output Accuracy</h4>
            <p>
              ZENVIX AI utilizes advanced deep learning and large language models (Google Gemini 3.8 Flash). While these models are engineered for high precision, AI generated text, code, translations, and suggestions may occasionally contain inaccuracies, hallucinations, or outdated facts. Always review critical technical, financial, or medical outputs independently.
            </p>
            <h4 className="text-sm font-semibold text-white pt-2">2. Google AdSense & Third-Party Advertising</h4>
            <p>
              ZENVIX AI may display clearly marked third-party sponsor advertisements (including Google AdSense display ads). These advertisements are distinguished with "Advertisement / Sponsor Showcase" headers. We do not endorse any external advertised products or services.
            </p>
            <h4 className="text-sm font-semibold text-white pt-2">3. Limitation of Liability</h4>
            <p>
              ZENVIX AI and its creators shall not be liable for any direct or indirect damages resulting from the use or inability to use the platform or reliance on generated content.
            </p>
          </div>
        )}

        {/* About Us */}
        {activeModal === 'about' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2.5 mb-2 text-white">
              <Info className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold">About ZENVIX AI</h3>
            </div>
            <p>
              <strong>ZENVIX AI</strong> was founded with a singular mission: to eliminate fragmented workflows by providing an <em>All-in-One AI Workspace</em> that unifies writing, coding, marketing, studying, and productivity tooling under a single intuitive interface.
            </p>
            <h4 className="text-sm font-semibold text-white pt-2">Architectural Philosophy</h4>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
              <li><strong>Zero Friction:</strong> No complicated setup or token math for everyday users.</li>
              <li><strong>Real Model Integrations:</strong> Directly powered by the server-side Gemini 3.8 Flash API.</li>
              <li><strong>Complete Autonomy:</strong> Comprehensive user dashboard, saved history, credit management, and full project exportability.</li>
            </ul>
            <h4 className="text-sm font-semibold text-white pt-2">Engineering Stack</h4>
            <p className="text-slate-400">
              Frontend built on React 19, TypeScript, and Tailwind CSS v4. Backend powered by Node.js Express with custom crypto PBKDF2 authentication, and persistent data storage.
            </p>
          </div>
        )}

        {/* Contact Us Form */}
        {activeModal === 'contact' && (
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-white">
              <Mail className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold">Contact Support & Inquiries</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Have questions about ZENVIX AI, custom enterprise plans, or partnership opportunities? Send our engineering team a message directly below.
            </p>

            {contactSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{contactSuccess}</span>
              </div>
            )}
            {contactError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-700/50 text-rose-300 text-xs">
                {contactError}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-purple-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-purple-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. Enterprise inquiry, feature request..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-purple-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can we help you today?"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-purple-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
