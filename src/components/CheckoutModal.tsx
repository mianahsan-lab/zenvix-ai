import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { X, Check, Zap, Sparkles, Shield, CreditCard, ArrowRight } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { user, token, checkoutModalOpen, closeCheckoutModal, refreshUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedProvider, setSelectedProvider] = useState<'stripe' | 'paypal'>('stripe');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!checkoutModalOpen) return null;

  const handleUpgrade = async () => {
    if (!token) {
      setErrorMessage('Please sign in or create an account first to upgrade.');
      return;
    }

    setProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/user/upgrade-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: 'pro',
          billingCycle,
          provider: selectedProvider === 'stripe' ? 'Stripe Checkout (Sandbox)' : 'PayPal Sandbox',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process upgrade');

      setSuccessMessage(data.message);
      await refreshUser();
      setTimeout(() => {
        closeCheckoutModal();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const isAlreadyPro = user?.plan === 'pro';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0e0824] border border-purple-800/50 shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeCheckoutModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-purple-950/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>ZENVIX PRO WORKSPACE</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white">Unlock Limitless AI Power</h3>
          <p className="text-xs text-slate-400 mt-1">
            Supercharge your workflow with instant generations, priority Gemini model access, and zero daily caps.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-950 border border-purple-900/50 mt-4 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Yearly (Save 20%)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">2 Mo Free</span>
            </button>
          </div>
        </div>

        {/* Status messages */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-700/50 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Pricing Card Details */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Free Plan */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200">Free Tier</span>
                <span className="text-[11px] text-slate-400">Basic</span>
              </div>
              <div className="text-2xl font-bold text-white mb-3">
                $0 <span className="text-xs text-slate-400 font-normal">/ forever</span>
              </div>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>50 Daily AI Credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Access to all 24 tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Standard queue latency</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              {user?.plan === 'free' ? 'Currently Active Plan' : 'Free Downgrade available anytime'}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-purple-950/60 to-[#0e0824] border-2 border-purple-500/60 text-slate-200 text-xs relative flex flex-col justify-between shadow-xl shadow-purple-950/40">
            <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-purple-200">ZENVIX Pro</span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-3">
                {billingCycle === 'yearly' ? '$15.83' : '$19.00'}
                <span className="text-xs text-slate-400 font-normal"> / mo</span>
              </div>
              <p className="text-[11px] text-purple-300 mb-3">
                {billingCycle === 'yearly' ? 'Billed annually as $190/year' : 'Billed monthly, cancel anytime'}
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="font-medium text-white">5,000 High-Speed Monthly Credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Priority Gemini 3.8 Flash pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Unlimited saved generation history</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Direct Export to TXT, MD, & JSON</span>
                </li>
              </ul>
            </div>

            {/* Provider Selector */}
            <div className="mt-4 pt-3 border-t border-purple-900/40">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span>Payment Gateway:</span>
                <span className="text-purple-300 font-medium">Instant Test Sandbox</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setSelectedProvider('stripe')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedProvider === 'stripe'
                      ? 'border-purple-500 bg-purple-950/60 text-white font-medium'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Stripe Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProvider('paypal')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedProvider === 'paypal'
                      ? 'border-purple-500 bg-purple-950/60 text-white font-medium'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>PayPal</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleUpgrade}
                disabled={processing || isAlreadyPro}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{processing ? 'Processing Sandbox Transaction...' : isAlreadyPro ? 'Plan Already Active (Pro)' : `Activate Pro (${billingCycle === 'yearly' ? '$190/yr' : '$19/mo'})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          <p>
            Secure 256-bit SSL encrypted. 30-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
};
