import React, { useState } from 'react';
import { TOOLS_REGISTRY } from '../shared/toolsRegistry.ts';
import { ToolCategory } from '../types/index.ts';
import { ToolIcon } from '../components/ToolIcon.tsx';
import { AdSenseBanner } from '../components/AdSenseBanner.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Sparkles,
  Search,
  ArrowRight,
  Zap,
  Check,
  ShieldCheck,
  Code,
  GraduationCap,
  PenTool,
  Download,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';

interface HomeViewProps {
  onSelectTool: (toolId: string) => void;
  onNavigate: (view: string, toolId?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTool, onNavigate }) => {
  const { user, openAuthModal, openCheckoutModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Filter tools based on search and category
  const filteredTools = TOOLS_REGISTRY.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularTools = TOOLS_REGISTRY.filter((t) => t.popular);

  const categories: { id: ToolCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Tools (24)' },
    { id: 'writing', label: 'Writing & Essays' },
    { id: 'marketing', label: 'Marketing & SEO' },
    { id: 'study', label: 'Study & Learning' },
    { id: 'coding', label: 'Coding & Dev' },
    { id: 'productivity', label: 'Productivity' },
  ];

  const faqs = [
    {
      q: 'How does the ZENVIX AI credit system work?',
      a: 'Free accounts automatically receive 50 complimentary credits daily. Each AI generation typically consumes 1 credit. Local tools (such as Word Counter and Secure Password Generator) are 100% free and consume zero credits. Upgrading to ZENVIX Pro grants 5,000 monthly credits with priority model queuing.',
    },
    {
      q: 'Which AI models power the ZENVIX tools?',
      a: 'ZENVIX AI connects directly to Google Gemini 3.8 Flash through a secured server-side backend. This ensures lightning-fast responses, high reasoning capabilities, and maximum token efficiency without exposing credentials to the client.',
    },
    {
      q: 'Can I export my generated results and code?',
      a: 'Yes! Every tool includes 1-click clipboard copy, plain text/markdown download, and direct saving to your private User Workspace dashboard.',
    },
    {
      q: 'Is my data and prompt history private?',
      a: 'Absolutely. We enforce PBKDF2 cryptographic hashing for credentials and do not sell prompt data to third parties. You can delete saved items and history from your dashboard at any time.',
    },
    {
      q: 'Can I cancel or upgrade my subscription whenever I want?',
      a: 'Yes, subscription plans can be upgraded, switched between monthly and yearly billing, or cancelled instantly with no questions asked.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* ============================================================== */}
      {/* HERO SECTION */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-800/40 text-purple-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Powering Next-Gen Creators & Engineers</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Your All-in-One <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-200">
              AI Workspace
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Supercharge your workflow with 24+ professional AI tools for writing, coding, marketing, studying, and content generation. Powered by real Gemini models.
          </p>

          {/* Interactive Search Bar */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. Writer, Python code, YouTube, Cornell notes)..."
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-[#0f0924]/90 border border-purple-700/50 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-400 shadow-xl shadow-purple-950/30 transition-all"
              />
              <button
                onClick={() => onNavigate('tools')}
                className="absolute right-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Explore
              </button>
            </div>

            {/* Quick autocomplete dropdown preview if search typed */}
            {searchQuery && (
              <div className="mt-2 rounded-xl bg-[#0f0924] border border-purple-800/40 p-2 shadow-2xl text-left max-h-56 overflow-y-auto text-xs">
                {filteredTools.slice(0, 5).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTool(t.id);
                      setSearchQuery('');
                    }}
                    className="w-full p-2 rounded-lg hover:bg-purple-950/60 flex items-center justify-between text-slate-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ToolIcon name={t.icon} className="w-4 h-4 text-purple-400" />
                      <span className="font-medium">{t.name}</span>
                    </div>
                    <span className="text-[10px] text-purple-400 capitalize">{t.category}</span>
                  </button>
                ))}
                {filteredTools.length === 0 && (
                  <div className="p-3 text-slate-500 text-center">No tools matching "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('tools')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
            >
              <span>Browse All 24 Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!user ? (
              <button
                onClick={() => openAuthModal('register')}
                className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-purple-800/40 text-slate-200 hover:text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Claim 50 Free Credits
              </button>
            ) : (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/50 text-purple-200 font-semibold text-sm transition-all cursor-pointer"
              >
                Open Workspace Dashboard
              </button>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-400" />
              <span>24 Dedicated AI Tools</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-400" />
              <span>Gemini 3.8 Flash Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-400" />
              <span>No Card Required to Start</span>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Placement 1 */}
      <AdSenseBanner slotId="zenvix-home-top" />

      {/* ============================================================== */}
      {/* POPULAR AI TOOLS */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-1">Curated Selection</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Most Popular Tools</h2>
            <p className="text-xs text-slate-400 mt-1">Frequently used by researchers, content strategists, and engineers</p>
          </div>
          <button
            onClick={() => onNavigate('tools')}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View all 24 tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group p-5 rounded-2xl bg-[#0c071e] hover:bg-[#120a2e] border border-purple-900/30 hover:border-purple-600/50 shadow-lg hover:shadow-purple-950/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-700/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                    <ToolIcon name={tool.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] text-purple-400 capitalize px-2 py-0.5 rounded bg-purple-950/40 border border-purple-900/30">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-purple-900/20 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-[11px]">
                  <Zap className="w-3 h-3 text-purple-400" />
                  <span>{tool.creditCost} credit / run</span>
                </span>
                <span className="text-purple-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                  Launch Tool →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* CATEGORIES DIRECTORY SECTION */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-1">Explore by Domain</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Browse All 24 AI Solutions</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
            Organized across 5 high-impact workflows with zero fluff. Click any category tab to inspect available tools.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-purple-900/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="p-4 rounded-xl bg-[#0b061a] hover:bg-[#110928] border border-purple-900/30 hover:border-purple-600/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300 shrink-0">
                    <ToolIcon name={tool.icon} className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-white text-xs truncate">{tool.name}</h4>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-purple-900/20 flex items-center justify-between text-[10px] text-slate-500">
                <span className="capitalize">{tool.category}</span>
                <span className="text-purple-400 font-medium">Use Tool →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* FEATURES & BENEFITS */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#0f0828] via-[#090514] to-[#080414] border border-purple-800/30 p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">Engineered For Quality</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Why Teams Choose ZENVIX AI
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Unlike single-prompt wrappers, ZENVIX AI gives you dedicated interfaces, structured schemas, and integrated workspace memory.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-300">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-base font-semibold text-white">Sub-Second Generation Speed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct Gemini 3.8 Flash pipeline delivers deep reasoning with minimal latency, eliminating waiting queues.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-300">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-base font-semibold text-white">PBKDF2 Cryptographic Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Salted credential hashing and secure server-only API token isolation ensure your account is protected.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-300">
                <Download className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-base font-semibold text-white">Workspace History & 1-Click ZIP</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save outputs to your persistent cloud dashboard, or export the entire platform source code as a ZIP archive anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PRICING PLANS */}
      {/* ============================================================== */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-1">Simple & Transparent</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Choose Your Workspace Tier</h2>
          <p className="text-xs text-slate-400 mt-1">Start free with daily credits, or unlock unlimited productivity with Pro</p>

          {/* Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-950 border border-purple-900/50 mt-4 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Yearly (Save 20%)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">2 Mo Free</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Plan 1: Free */}
          <div className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 flex flex-col justify-between text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200 text-sm">Free Starter</span>
                <span className="text-[11px] text-slate-400">Casual Use</span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-4">
                $0 <span className="text-xs font-normal text-slate-400">/ forever</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Ideal for individuals testing out AI tools and running quick tasks.
              </p>
              <ul className="space-y-3 text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>50 Daily AI Credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Access to all 24 tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Standard queue priority</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <Check className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Limited history retention</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => (user ? onNavigate('tools') : openAuthModal('register'))}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold transition-colors cursor-pointer"
            >
              {user ? 'Current Active Tier' : 'Get Started Free'}
            </button>
          </div>

          {/* Plan 2: Pro */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/60 to-[#0c071e] border-2 border-purple-500/70 flex flex-col justify-between text-xs relative shadow-2xl shadow-purple-950/50">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider">
              Recommended
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-purple-200 text-sm">ZENVIX Pro</span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-white mb-4">
                {billingCycle === 'yearly' ? '$15.83' : '$19.00'}
                <span className="text-xs font-normal text-slate-400"> / mo</span>
              </div>
              <p className="text-purple-300 mb-6 leading-relaxed">
                For power creators, developers, and marketers demanding unlimited speed.
              </p>
              <ul className="space-y-3 text-slate-200 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="font-medium text-white">5,000 High-Speed Monthly Credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Priority Gemini 3.8 Flash pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Unlimited Saved History & Tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Export to TXT, MD, and JSON</span>
                </li>
              </ul>
            </div>
            <button
              onClick={openCheckoutModal}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
            >
              {user?.plan === 'pro' ? 'Manage Pro Subscription' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 flex flex-col justify-between text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200 text-sm">Enterprise</span>
                <span className="text-[11px] text-slate-400">Teams</span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-4">
                $49.00 <span className="text-xs font-normal text-slate-400">/ mo</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Dedicated infrastructure, custom prompt rules, and centralized team billing.
              </p>
              <ul className="space-y-3 text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>50,000 Monthly Credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>5 Team Member Seats</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Custom API endpoint proxy</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Dedicated Slack support channel</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold transition-colors cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* TESTIMONIALS (With sample verification notice) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 mb-2">
            <span>[Sample User Reviews & Industry Benchmark Feedback]</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Trusted by High-Velocity Creators</h2>
          <p className="text-xs text-slate-400 mt-1">See how professionals accelerate their daily content and code output</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#0c071e] border border-purple-900/30 text-xs flex flex-col justify-between">
            <p className="text-slate-300 leading-relaxed italic mb-4">
              "The AI Code Assistant and HTML/CSS generator have completely cut down my component prototyping time from 2 hours to 10 minutes. The code output is actually clean."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-purple-900/20">
              <div className="w-8 h-8 rounded-full bg-purple-600/30 text-purple-300 font-bold flex items-center justify-center text-xs">
                DK
              </div>
              <div>
                <p className="font-semibold text-white">David Kim</p>
                <p className="text-[11px] text-slate-500">Full-Stack Engineer &middot; DevFlow</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c071e] border border-purple-900/30 text-xs flex flex-col justify-between">
            <p className="text-slate-300 leading-relaxed italic mb-4">
              "The YouTube Script and Title Generator has boosted our channel CTR significantly. It understands curiosity gaps without producing spammy clickbait."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-purple-900/20">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs">
                MR
              </div>
              <div>
                <p className="font-semibold text-white">Maya Rodriguez</p>
                <p className="text-[11px] text-slate-500">Content Lead &middot; StudioScale</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c071e] border border-purple-900/30 text-xs flex flex-col justify-between">
            <p className="text-slate-300 leading-relaxed italic mb-4">
              "Cornell Study Notes and the interactive Quiz Generator are game changers for reviewing academic chapters. The instant self-testing format is unmatched."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-purple-900/20">
              <div className="w-8 h-8 rounded-full bg-amber-600/30 text-amber-300 font-bold flex items-center justify-center text-xs">
                JL
              </div>
              <div>
                <p className="font-semibold text-white">Julian Lee</p>
                <p className="text-[11px] text-slate-500">Graduate Researcher &middot; BioTech Labs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FAQ ACCORDION */}
      {/* ============================================================== */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-1">Answers & Details</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-[#0c071e] border border-purple-900/30 overflow-hidden text-xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-slate-400 leading-relaxed border-t border-purple-900/20 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* DOWNLOAD COMPLETE SOURCE CODE ZIP CTA */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0e0828] to-indigo-950/60 border border-purple-600/40 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/50 text-purple-300 text-xs font-semibold">
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Full Source Code Export</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to Launch ZENVIX AI On Your Domain?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Download the complete full-stack codebase as a ready-to-deploy ZIP archive including React frontend, Express server, database schema, and Gemini configuration.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/api/download-zip"
                download="zenvix-ai-production-platform.zip"
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Complete Project (ZIP)</span>
              </a>
              <button
                onClick={() => onNavigate('docs')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                View Deployment Guide
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
