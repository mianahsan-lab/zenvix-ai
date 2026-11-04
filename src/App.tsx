import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { LegalModals, LegalModalType } from './components/LegalModals.tsx';
import { HomeView } from './views/HomeView.tsx';
import { ToolsDirectoryView } from './views/ToolsDirectoryView.tsx';
import { ToolRunner } from './components/Tools/ToolRunner.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { AdminView } from './views/AdminView.tsx';
import { DocsView } from './views/DocsView.tsx';
import { TOOLS_REGISTRY } from './shared/toolsRegistry.ts';
import { AIToolConfig } from './types/index.ts';
import { Sparkles, AlertCircle, X } from 'lucide-react';

function AppContent() {
  const { user, openAuthModal, openCheckoutModal } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'tools' | 'tool' | 'dashboard' | 'admin' | 'docs' | 'pricing'>('home');
  const [selectedToolId, setSelectedToolId] = useState<string>('ai-writer');
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [announcement, setAnnouncement] = useState<string>('🚀 Welcome to ZENVIX AI — 24+ AI Power Tools Now Available! Free 50 Credits Daily.');
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  // Fetch admin settings for announcement banner
  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.announcementBanner) {
          setAnnouncement(data.settings.announcementBanner);
        }
      })
      .catch(() => {});
  }, []);

  const handleNavigate = (view: string, toolId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'pricing') {
      if (currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (view === 'tool' && toolId) {
      setSelectedToolId(toolId);
      setCurrentView('tool');
      return;
    }

    setCurrentView(view as any);
  };

  const handleSelectTool = (toolId: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedToolId(toolId);
    setCurrentView('tool');
  };

  const activeTool: AIToolConfig =
    TOOLS_REGISTRY.find((t) => t.id === selectedToolId) || TOOLS_REGISTRY[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#090514] text-slate-100">
      {/* Optional Announcement Banner */}
      {!announcementDismissed && announcement && (
        <div className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-900/90 px-4 py-2 text-center text-xs font-medium text-purple-100 flex items-center justify-center gap-2 border-b border-purple-700/40 relative">
          <span>{announcement}</span>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="absolute right-3 top-2 text-purple-300 hover:text-white cursor-pointer"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Header */}
      <Header currentView={currentView} onNavigate={handleNavigate} />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView onSelectTool={handleSelectTool} onNavigate={handleNavigate} />
        )}

        {currentView === 'tools' && (
          <ToolsDirectoryView onSelectTool={handleSelectTool} />
        )}

        {currentView === 'tool' && (
          <ToolRunner
            tool={activeTool}
            onBack={() => handleNavigate('tools')}
            onOpenCheckout={openCheckoutModal}
            onOpenAuth={() => openAuthModal('login')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView onSelectTool={handleSelectTool} onOpenCheckout={openCheckoutModal} />
        )}

        {currentView === 'admin' && <AdminView />}

        {currentView === 'docs' && <DocsView />}
      </main>

      {/* Modals */}
      <AuthModal />
      <CheckoutModal />
      <LegalModals activeModal={legalModal} onClose={() => setLegalModal(null)} />

      {/* Footer */}
      <Footer onOpenLegal={(type) => setLegalModal(type)} onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
