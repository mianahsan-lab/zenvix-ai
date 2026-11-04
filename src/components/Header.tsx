import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Sparkles, User as UserIcon, LogOut, LayoutDashboard, Shield, Menu, X, Zap } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, toolId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, logout, openAuthModal, openCheckoutModal } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-900/30 bg-[#090514]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left cursor-pointer group whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-purple-900/30 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0d0722] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 text-lg">Z</span>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            ZENVIX <span className="text-purple-400 font-extrabold">AI</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links (Single line, 4-5 links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('tools')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'tools' ? 'text-purple-400 font-semibold' : 'hover:text-white'
            }`}
          >
            All 24 Tools
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="cursor-pointer hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Capabilities
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'pricing' ? 'text-purple-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Pricing & Plans
          </button>
          <button
            onClick={() => onNavigate('docs')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'docs' ? 'text-purple-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Architecture & Docs
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`cursor-pointer flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'admin' ? 'text-amber-400 font-semibold' : 'text-amber-300/80 hover:text-amber-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Credit Indicator */}
              <button
                onClick={openCheckoutModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-xs font-medium text-purple-200 hover:border-purple-600/60 transition-colors cursor-pointer"
                title="Click to upgrade credits"
              >
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span className="tabular-nums">
                  {user.plan === 'pro' ? 'Pro (Unlimited)' : `${user.credits} credits`}
                </span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-md bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.slice(0, 1)}
                  </div>
                  <span className="max-w-[100px] truncate hidden md:inline">{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0f0924] border border-purple-900/40 shadow-2xl p-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-purple-900/20 mb-1">
                      <p className="font-semibold text-slate-100 truncate">{user.name}</p>
                      <p className="text-slate-400 truncate text-[11px]">{user.email}</p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-purple-300">
                        <span>Plan: <strong className="uppercase">{user.plan}</strong></span>
                        <span className="tabular-nums">{user.credits} creds</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:bg-purple-950/60 hover:text-white transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-purple-400" />
                      <span>User Dashboard</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-amber-300 hover:bg-amber-950/30 transition-colors cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        openCheckoutModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-950/60 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Upgrade Subscription</span>
                    </button>

                    <div className="border-t border-purple-900/20 my-1" />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-purple-900/30 bg-[#0d0722] px-4 pt-2 pb-4 space-y-2 text-sm">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('tools');
            }}
            className="block w-full text-left py-2 text-slate-200 hover:text-purple-400"
          >
            All 24 Tools
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('pricing');
            }}
            className="block w-full text-left py-2 text-slate-200 hover:text-purple-400"
          >
            Pricing & Plans
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('docs');
            }}
            className="block w-full text-left py-2 text-slate-200 hover:text-purple-400"
          >
            Architecture & Docs
          </button>
          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('dashboard');
              }}
              className="block w-full text-left py-2 text-purple-300 font-medium"
            >
              Dashboard
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('admin');
              }}
              className="block w-full text-left py-2 text-amber-300 font-medium"
            >
              Admin Console
            </button>
          )}
        </div>
      )}
    </header>
  );
};
