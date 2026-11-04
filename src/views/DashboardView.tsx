import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { SavedResult, UsageLog } from '../types/index.ts';
import { TOOLS_REGISTRY } from '../shared/toolsRegistry.ts';
import { ToolIcon } from '../components/ToolIcon.tsx';
import {
  LayoutDashboard,
  Zap,
  Bookmark,
  Clock,
  Settings,
  Star,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  User,
  ArrowRight,
  TrendingUp,
  Search,
} from 'lucide-react';

interface DashboardViewProps {
  onSelectTool: (toolId: string) => void;
  onOpenCheckout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTool, onOpenCheckout }) => {
  const { user, token, updateUser, refreshUser, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'favorites' | 'history' | 'settings'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [historyLogs, setHistoryLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings form states
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);
  const [savedSearch, setSavedSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchDashboard() {
      try {
        setLoading(true);
        // Stats
        const resStats = await fetch('/api/user/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resStats.ok) {
          const s = await resStats.json();
          setStats(s);
        }

        // Saved results
        const resSaved = await fetch('/api/user/saved-results', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resSaved.ok) {
          const s = await resSaved.json();
          setSavedResults(s.results || []);
        }

        // Favorites
        const resFav = await fetch('/api/user/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resFav.ok) {
          const f = await resFav.json();
          setFavorites(f.favorites || []);
        }

        // History
        const resHist = await fetch('/api/user/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resHist.ok) {
          const h = await resHist.json();
          setHistoryLogs(h.logs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-[#0c071e] border border-purple-900/40 text-center space-y-4">
        <LayoutDashboard className="w-10 h-10 text-purple-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Sign In to Access Workspace</h2>
        <p className="text-xs text-slate-400">
          Your workspace stores your credit usage, saved results, favorite tools, and account settings.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleDeleteSaved = async (id: string) => {
    try {
      const res = await fetch(`/api/user/saved-results/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSavedResults((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopySaved = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsNotice(null);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: displayName }),
      });
      const data = await res.json();
      if (res.ok) {
        updateUser({ name: displayName });
        setSettingsNotice('Profile display name updated successfully.');
      } else {
        setSettingsNotice(data.error || 'Failed to update name');
      }
    } catch (e: any) {
      setSettingsNotice(e.message);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        updateUser({ emailVerified: true });
        setSettingsNotice('Email verified successfully!');
      }
    } catch (e: any) {
      setSettingsNotice(e.message);
    }
  };

  const handleCancelSub = async () => {
    if (!confirm('Are you sure you want to cancel your Pro subscription? Your plan will revert to Free.')) return;
    try {
      const res = await fetch('/api/user/cancel-subscription', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        updateUser({ plan: 'free', credits: 50, maxCredits: 50 });
        setSettingsNotice(data.message);
        refreshUser();
      }
    } catch (e: any) {
      setSettingsNotice(e.message);
    }
  };

  const favoriteTools = TOOLS_REGISTRY.filter((t) => favorites.includes(t.id));

  const filteredSaved = savedResults.filter((r) =>
    r.title.toLowerCase().includes(savedSearch.toLowerCase()) ||
    r.toolName.toLowerCase().includes(savedSearch.toLowerCase()) ||
    r.outputContent.toLowerCase().includes(savedSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Account Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#120a30] via-[#0d0724] to-[#090516] border border-purple-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 font-extrabold text-2xl flex items-center justify-center uppercase shadow-inner">
            {user.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{user.name}</h1>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  user.plan === 'pro'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {user.plan} Plan
              </span>
              {user.emailVerified ? (
                <span className="text-emerald-400 text-xs flex items-center gap-1" title="Email Verified">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span className="text-amber-400 text-xs flex items-center gap-1" title="Email Unverified">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Upgrade / Credit Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 px-4 rounded-xl bg-slate-950/80 border border-purple-900/40 text-xs">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Remaining Balance</span>
            <span className="text-base font-extrabold text-white tabular-nums flex items-center gap-1.5 mt-0.5">
              <Zap className="w-4 h-4 text-purple-400" />
              {user.plan === 'pro' ? 'Unlimited / 5,000' : `${user.credits} / ${user.maxCredits} credits`}
            </span>
          </div>

          {user.plan !== 'pro' ? (
            <button
              onClick={onOpenCheckout}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Upgrade to Pro</span>
            </button>
          ) : (
            <button
              onClick={onOpenCheckout}
              className="px-4 py-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Manage Subscription
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-purple-900/30 pb-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Results ({savedResults.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Favorite Tools ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Usage History</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0c071e] border border-purple-900/30">
              <span className="text-[11px] text-slate-400 block mb-1">Total AI Runs</span>
              <span className="text-2xl font-bold text-white tabular-nums">
                {stats?.totalGenerations || historyLogs.length}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c071e] border border-purple-900/30">
              <span className="text-[11px] text-slate-400 block mb-1">Saved Documents</span>
              <span className="text-2xl font-bold text-white tabular-nums">
                {savedResults.length}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c071e] border border-purple-900/30">
              <span className="text-[11px] text-slate-400 block mb-1">Favorite Tools</span>
              <span className="text-2xl font-bold text-white tabular-nums">
                {favorites.length}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c071e] border border-purple-900/30">
              <span className="text-[11px] text-slate-400 block mb-1">Current Tier</span>
              <span className="text-2xl font-bold text-purple-300 uppercase">
                {user.plan}
              </span>
            </div>
          </div>

          {/* 7-Day Usage Activity Visual */}
          <div className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span>7-Day Generation Activity</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Execution volume across past week</p>
              </div>
              <span className="text-xs text-purple-300 font-medium">Daily resets at 00:00 UTC</span>
            </div>

            {stats?.last7DaysUsage ? (
              <div className="flex items-end justify-between gap-3 h-36 pt-6">
                {stats.last7DaysUsage.map((day: any, i: number) => {
                  const maxVal = Math.max(...stats.last7DaysUsage.map((d: any) => d.count), 5);
                  const heightPct = Math.max(12, Math.round((day.count / maxVal) * 100));

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] text-slate-400 tabular-nums">{day.count}</span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-purple-800 to-indigo-500 hover:from-purple-600 hover:to-indigo-400 transition-all cursor-pointer shadow-md shadow-purple-950/40"
                      />
                      <span className="text-[10px] text-slate-500 font-medium">{day.date}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-28 flex items-center justify-center text-xs text-slate-500">
                Activity data will appear here as you run tools.
              </div>
            )}
          </div>

          {/* Recent Saved Results Preview */}
          <div className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Saved Documents</h3>
              <button
                onClick={() => setActiveTab('saved')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
              >
                View all ({savedResults.length}) →
              </button>
            </div>

            {savedResults.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {savedResults.slice(0, 4).map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-purple-400 font-medium">{r.toolName}</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-white line-clamp-1">{r.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {r.outputContent}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-purple-900/20 flex items-center justify-between">
                      <button
                        onClick={() => handleCopySaved(r.outputContent, r.id)}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === r.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === r.id ? 'Copied' : 'Copy Text'}</span>
                      </button>
                      <button
                        onClick={() => onSelectTool(r.toolId)}
                        className="text-[10px] text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                      >
                        Open Tool →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No saved documents yet. Use any tool and click "Save" to keep results here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SAVED RESULTS */}
      {/* ========================================================= */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Your Saved Results</h2>
              <p className="text-xs text-slate-400">Search and manage generated content saved from your runs</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={savedSearch}
                onChange={(e) => setSavedSearch(e.target.value)}
                placeholder="Search saved results..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredSaved.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-[#0c071e] border border-purple-900/30 flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-purple-400 font-semibold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/30">
                      {r.toolName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-sm mb-2">{r.title}</h3>

                  <div className="p-3 rounded-xl bg-slate-950 border border-purple-900/20 max-h-40 overflow-y-auto text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed font-sans mb-3">
                    {r.outputContent}
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-900/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopySaved(r.outputContent, r.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
                    >
                      {copiedId === r.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === r.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => onSelectTool(r.toolId)}
                      className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-800/40 text-purple-300 text-[11px] transition-colors cursor-pointer"
                    >
                      Open in Tool
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteSaved(r.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete saved document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSaved.length === 0 && (
            <div className="text-center py-12 rounded-2xl bg-[#0c071e] border border-purple-900/30 text-xs text-slate-500">
              No saved results found matching your search.
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: FAVORITE TOOLS */}
      {/* ========================================================= */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Your Starred AI Tools</h2>
            <p className="text-xs text-slate-400">Quickly launch your most-used tools</p>
          </div>

          {favoriteTools.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="p-5 rounded-2xl bg-[#0c071e] hover:bg-[#120a2e] border border-purple-900/30 hover:border-purple-600/50 transition-all cursor-pointer flex flex-col justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-700/40 flex items-center justify-center text-purple-300">
                        <ToolIcon name={tool.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{tool.name}</h3>
                        <span className="text-[10px] text-purple-400 capitalize">{tool.category}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed line-clamp-2 text-[11px]">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-900/20 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{tool.creditCost} credit / run</span>
                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                      Launch Tool →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-[#0c071e] border border-purple-900/30 text-xs text-slate-500">
              No favorite tools yet. Click the star icon on any tool card to pin it here.
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: USAGE HISTORY */}
      {/* ========================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Execution Logs & Activity</h2>
            <p className="text-xs text-slate-400">Detailed historical record of your AI generations</p>
          </div>

          <div className="rounded-2xl bg-[#0c071e] border border-purple-900/30 overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-900/30 bg-slate-950/60 text-slate-400 font-semibold text-[11px]">
                    <th className="py-3 px-4">Tool</th>
                    <th className="py-3 px-4">Input Snippet</th>
                    <th className="py-3 px-4">Credits</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20 text-slate-300">
                  {historyLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="py-3 px-4 font-medium text-white whitespace-nowrap">{log.toolName}</td>
                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{log.inputSnippet || '-'}</td>
                      <td className="py-3 px-4 tabular-nums font-semibold text-purple-300">
                        {log.creditsCharged} cred
                      </td>
                      <td className="py-3 px-4 tabular-nums text-slate-400">{log.durationMs}ms</td>
                      <td className="py-3 px-4 tabular-nums text-slate-500 text-[11px] whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectTool(log.toolId)}
                          className="text-[11px] text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                        >
                          Run Again
                        </button>
                      </td>
                    </tr>
                  ))}
                  {historyLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No history records logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: ACCOUNT SETTINGS */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6 text-xs">
          <div>
            <h2 className="text-lg font-bold text-white">Account Settings</h2>
            <p className="text-slate-400">Manage your profile, security, and subscription billing</p>
          </div>

          {settingsNotice && (
            <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-700/50 text-purple-300">
              {settingsNotice}
            </div>
          )}

          {/* Profile Details */}
          <div className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 space-y-4">
            <h3 className="font-semibold text-white text-sm">Personal Information</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors cursor-pointer"
                >
                  Save Profile
                </button>

                {!user.emailVerified && (
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/50 transition-colors cursor-pointer"
                  >
                    Verify Email Address
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Subscription Management */}
          <div className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 space-y-4">
            <h3 className="font-semibold text-white text-sm">Subscription & Billing</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-purple-900/30">
              <div>
                <span className="font-semibold text-white block uppercase">{user.plan} Tier</span>
                <span className="text-[11px] text-slate-400">
                  {user.plan === 'pro'
                    ? '5,000 monthly high-speed credits active'
                    : '50 free daily credits active'}
                </span>
              </div>
              <button
                onClick={onOpenCheckout}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors cursor-pointer"
              >
                {user.plan === 'pro' ? 'Manage' : 'Upgrade'}
              </button>
            </div>

            {user.plan === 'pro' && (
              <button
                type="button"
                onClick={handleCancelSub}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                Cancel Pro Subscription
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
