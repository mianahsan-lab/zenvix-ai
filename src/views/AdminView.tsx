import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { User, UsageLog, AdminSettings } from '../types/index.ts';
import {
  Shield,
  Users,
  CreditCard,
  Activity,
  Sliders,
  Download,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Search,
  Save,
  Lock,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'settings'>('overview');
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editCredits, setEditCredits] = useState<number>(50);
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [editPlan, setEditPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || user?.role !== 'admin') return;

    async function loadAdminData() {
      try {
        setLoading(true);
        // Overview
        const resOverview = await fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resOverview.ok) {
          const data = await resOverview.json();
          setOverview(data);
          setSettings(data.settings);
        }

        // Users
        const resUsers = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resUsers.ok) {
          const data = await resUsers.json();
          setUsers(data.users || []);
        }

        // Logs
        const resLogs = await fetch('/api/admin/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resLogs.ok) {
          const data = await resLogs.json();
          setLogs(data.logs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [token, user]);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-[#0c071e] border border-rose-900/40 text-center space-y-4">
        <Lock className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-xs text-slate-400">
          Administrator privileges are required to view this panel.
        </p>
      </div>
    );
  }

  const handleSaveUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          credits: editCredits,
          role: editRole,
          plan: editPlan,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
        setEditingUserId(null);
        setStatusMessage(`User ${data.user.email} updated successfully.`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data.settings);
        setStatusMessage('Platform settings saved successfully.');
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0d0724] to-[#090516] border border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">ZENVIX Admin Console</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Authorized Superuser
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live user database, quota management, telemetry, and platform configurations
            </p>
          </div>
        </div>

        {/* 1-Click Source Code ZIP Download */}
        <a
          href="/api/download-zip"
          download="zenvix-ai-production-platform.zip"
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Project ZIP</span>
        </a>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-700/50 text-purple-200 text-xs flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-900/30 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Analytics Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'logs' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit Logs ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Platform Settings</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0c071e] border border-purple-900/30">
              <span className="text-[11px] text-slate-400 block mb-1">Total Registered Users</span>
              <span className="text-2xl font-bold text-white tabular-nums">{overview.totalUsers}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c071e] border border-purple-900/30">
              <span className="text-[11px] text-slate-400 block mb-1">Active Pro Subscribers</span>
              <span className="text-2xl font-bold text-purple-300 tabular-nums">{overview.proUsers}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c071e] border border-purple-900/30">
              <span className="text-[11px] text-slate-400 block mb-1">Total System Runs</span>
              <span className="text-2xl font-bold text-white tabular-nums">{overview.totalGenerations}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c071e] border border-purple-900/30">
              <span className="text-[11px] text-slate-400 block mb-1">Estimated Monthly MRR</span>
              <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                ${overview.estimatedRevenue}
              </span>
            </div>
          </div>

          {/* Top Tools Chart */}
          <div className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30">
            <h3 className="text-sm font-semibold text-white mb-4">Tool Utilization Distribution</h3>
            <div className="space-y-3">
              {overview.topTools?.map((t: any, i: number) => {
                const max = Math.max(...overview.topTools.map((x: any) => x.count), 1);
                const pct = Math.round((t.count / max) * 100);

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{t.name}</span>
                      <span className="text-purple-300 tabular-nums">{t.count} runs</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Registered Users</h2>
              <p className="text-xs text-slate-400">Manage user plans, credit balances, and security roles</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#0c071e] border border-purple-900/30 overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-900/30 bg-slate-950/60 text-slate-400 font-semibold text-[11px]">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Credits</th>
                    <th className="py-3 px-4">Verified</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20 text-slate-300">
                  {filteredUsers.map((u) => {
                    const isEditing = editingUserId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-purple-950/20 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                        </td>

                        <td className="py-3 px-4">
                          {isEditing ? (
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value as any)}
                              className="px-2 py-1 rounded bg-slate-950 border border-purple-900 text-white text-xs"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          ) : (
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                u.role === 'admin'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {u.role}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {isEditing ? (
                            <select
                              value={editPlan}
                              onChange={(e) => setEditPlan(e.target.value as any)}
                              className="px-2 py-1 rounded bg-slate-950 border border-purple-900 text-white text-xs"
                            >
                              <option value="free">free</option>
                              <option value="pro">pro</option>
                              <option value="enterprise">enterprise</option>
                            </select>
                          ) : (
                            <span className="capitalize font-medium text-slate-200">{u.plan}</span>
                          )}
                        </td>

                        <td className="py-3 px-4 tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editCredits}
                              onChange={(e) => setEditCredits(Number(e.target.value))}
                              className="w-20 px-2 py-1 rounded bg-slate-950 border border-purple-900 text-white text-xs"
                            />
                          ) : (
                            <span className="font-semibold text-purple-300">{u.credits} creds</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {u.emailVerified ? (
                            <span className="text-emerald-400 text-xs">Yes</span>
                          ) : (
                            <span className="text-amber-400 text-xs">Pending</span>
                          )}
                        </td>

                        <td className="py-3 px-4 tabular-nums text-slate-500 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSaveUser(u.id)}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingUserId(u.id);
                                setEditCredits(u.credits);
                                setEditRole(u.role);
                                setEditPlan(u.plan);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 hover:text-white text-xs cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">System Audit Logs</h2>
            <p className="text-xs text-slate-400">Live feed of all AI tool executions</p>
          </div>

          <div className="rounded-2xl bg-[#0c071e] border border-purple-900/30 overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-900/30 bg-slate-950/60 text-slate-400 font-semibold text-[11px]">
                    <th className="py-3 px-4">User Email</th>
                    <th className="py-3 px-4">Tool</th>
                    <th className="py-3 px-4">Snippet</th>
                    <th className="py-3 px-4">Charged</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20 text-slate-300">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-purple-300">{log.userEmail}</td>
                      <td className="py-3 px-4 font-medium text-white">{log.toolName}</td>
                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{log.inputSnippet || '-'}</td>
                      <td className="py-3 px-4 tabular-nums">{log.creditsCharged} cred</td>
                      <td className="py-3 px-4 tabular-nums">{log.durationMs}ms</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            log.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PLATFORM SETTINGS */}
      {activeTab === 'settings' && settings && (
        <div className="max-w-2xl space-y-6 text-xs">
          <div>
            <h2 className="text-lg font-bold text-white">Platform Settings</h2>
            <p className="text-slate-400">Configure global website parameters, announcements, and defaults</p>
          </div>

          <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Site Title</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-900/50 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Announcement Banner Message</label>
              <input
                type="text"
                value={settings.announcementBanner}
                onChange={(e) => setSettings({ ...settings, announcementBanner: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-900/50 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Default Daily Free Credits</label>
                <input
                  type="number"
                  value={settings.defaultFreeCredits}
                  onChange={(e) => setSettings({ ...settings, defaultFreeCredits: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-900/50 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Pro Monthly Credits</label>
                <input
                  type="number"
                  value={settings.proCreditsMonthly}
                  onChange={(e) => setSettings({ ...settings, proCreditsMonthly: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-900/50 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-purple-900/20">
              <label className="text-slate-300 font-medium">Allow New User Registrations</label>
              <input
                type="checkbox"
                checked={settings.allowSignups}
                onChange={(e) => setSettings({ ...settings, allowSignups: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-950 border-purple-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-purple-900/20 pt-2">
              <label className="text-slate-300 font-medium">Maintenance Mode (Block generations)</label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-950 border-purple-900 cursor-pointer"
              />
            </div>

            <div className="pt-4 border-t border-purple-900/20">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Platform Configurations</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
