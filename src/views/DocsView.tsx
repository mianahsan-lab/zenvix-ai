import React, { useState } from 'react';
import { Download, Terminal, Database, Server, Key, CheckCircle2, Copy, Check } from 'lucide-react';

export const DocsView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlSchemaSnippet = `-- PostgreSQL / Supabase Migration
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  plan VARCHAR(20) DEFAULT 'free',
  credits INT DEFAULT 50,
  max_credits INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tool_id VARCHAR(50) NOT NULL,
  tool_name VARCHAR(100) NOT NULL,
  credits_charged INT DEFAULT 1,
  duration_ms INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saved_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tool_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  output_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-xs">
      {/* Title & Quick ZIP Download */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0e0828] to-indigo-950/60 border border-purple-600/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/50 text-purple-300 text-[11px] font-semibold">
            <span>Production Deployment & Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ZENVIX AI Engineering Guide
          </h1>
          <p className="text-slate-300 max-w-xl">
            Complete architectural documentation, database configuration, server deployment instructions, and test checklist.
          </p>
        </div>

        <a
          href="/api/download-zip"
          download="zenvix-ai-production-platform.zip"
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Project ZIP</span>
        </a>
      </div>

      {/* 1. ARCHITECTURE & FOLDER STRUCTURE */}
      <section className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            <span>1. Project Architecture & Directory Structure</span>
          </h2>
        </div>
        <p className="text-slate-400 leading-relaxed">
          ZENVIX AI uses a full-stack modular architecture combining an Express Node.js API runtime with a high-performance React 19 single-page application.
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 font-mono text-[11px] text-purple-200 overflow-x-auto leading-relaxed">
{`zenvix-ai/
├── database/
│   └── schema.sql                # Complete PostgreSQL/Supabase DDL migrations
├── data/
│   └── zenvix_db.json            # Persistent JSON file database with auto-seeding
├── src/
│   ├── components/
│   │   ├── Header.tsx            # One-row Top Bar Contract navigation
│   │   ├── Footer.tsx            # Footers, brand disclosures, legal links
│   │   ├── AdSenseBanner.tsx     # Google AdSense compliant sponsor placement
│   │   ├── AuthModal.tsx         # Login, Sign Up, Forgot Password with quick demo
│   │   ├── CheckoutModal.tsx     # Pro Upgrade modal (Monthly/Yearly + Stripe/PayPal)
│   │   ├── LegalModals.tsx       # Privacy, Terms, Disclaimer, Contact Us Form
│   │   ├── ToolIcon.tsx          # Dynamic Lucide icon router
│   │   └── Tools/
│   │       └── ToolRunner.tsx    # Interactive runner for all 24 tools
│   ├── context/
│   │   └── AuthContext.tsx       # User session state, JWT tokens, credit sync
│   ├── server/
│   │   └── db.ts                 # PBKDF2 cryptography, users, usage & persistence
│   ├── shared/
│   │   └── toolsRegistry.ts      # Complete specifications for all 24 tools
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces for users, logs, settings
│   ├── views/
│   │   ├── HomeView.tsx          # Homepage: Hero, Popular, Categories, FAQ, Pricing
│   │   ├── ToolsDirectoryView.tsx# Searchable directory of all 24 tools
│   │   ├── DashboardView.tsx     # User workspace, 7-day usage chart, saved files
│   │   ├── AdminView.tsx         # Admin analytics, credit editing, settings
│   │   └── DocsView.tsx          # Interactive architecture & deployment guide
│   ├── App.tsx                   # Main layout and view routing orchestrator
│   ├── index.css                 # Tailwind CSS v4 directives & font styles
│   └── main.tsx                  # Client mount entry point
├── server.ts                     # Full-stack Express server + Gemini AI pipeline
├── package.json                  # Dependencies & scripts ("dev": "tsx server.ts")
├── vite.config.ts                # Vite build & bundler configuration
├── tsconfig.json                 # TypeScript compiler configurations
├── README.md                     # Comprehensive project documentation
└── .env.example                  # Environment variable reference`}
        </div>
      </section>

      {/* 2. LOCAL SETUP & INSTALLATION */}
      <section className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>2. Quick Start & Installation</span>
        </h2>
        <div className="space-y-3 text-slate-300">
          <p>Run the following steps in your terminal to boot up ZENVIX AI locally:</p>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-900/30 font-mono text-[11px] text-purple-300 space-y-1">
            <p># 1. Install all dependencies</p>
            <p className="text-white">npm install</p>
            <p className="pt-2"># 2. Configure your Gemini API Key in .env</p>
            <p className="text-white">cp .env.example .env</p>
            <p className="pt-2"># 3. Launch full-stack dev server (port 3000)</p>
            <p className="text-white">npm run dev</p>
          </div>
        </div>
      </section>

      {/* 3. GEMINI API CONFIGURATION */}
      <section className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-purple-400" />
          <span>3. AI API Configuration (Gemini 3.8 Flash)</span>
        </h2>
        <p className="text-slate-400 leading-relaxed">
          ZENVIX AI utilizes the official Google GenAI SDK (<code className="text-purple-300">@google/genai</code>) on the backend server. The client never accesses or exposes the API key.
        </p>
        <ul className="space-y-2 text-slate-300 list-disc pl-4">
          <li><strong>API Key Variable:</strong> <code className="text-purple-300">GEMINI_API_KEY</code></li>
          <li><strong>Model Utilized:</strong> <code className="text-purple-300">gemini-3.8-flash</code> (balanced reasoning, low latency)</li>
          <li><strong>Telemetry Header:</strong> <code className="text-purple-300">'User-Agent': 'aistudio-build'</code></li>
        </ul>
      </section>

      {/* 4. DATABASE SETUP (POSTGRESQL / SUPABASE) */}
      <section className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span>4. Database Setup & Supabase Migration</span>
          </h2>
          <button
            onClick={() => copyToClipboard(sqlSchemaSnippet, 'sql')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer text-[11px]"
          >
            {copiedSection === 'sql' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedSection === 'sql' ? 'Copied' : 'Copy SQL'}</span>
          </button>
        </div>
        <p className="text-slate-400 leading-relaxed">
          The application runs out of the box with persistent file storage (<code className="text-purple-300">data/zenvix_db.json</code>). When migrating to PostgreSQL or Supabase, execute the generated schema found in <code className="text-purple-300">database/schema.sql</code>.
        </p>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-900/30 font-mono text-[10px] text-purple-200 overflow-x-auto max-h-48 leading-relaxed">
          <pre>{sqlSchemaSnippet}</pre>
        </div>
      </section>

      {/* 5. DEPLOYMENT INSTRUCTIONS */}
      <section className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-purple-400" />
          <span>5. Production Deployment (Cloud Run / Render / Railway / Vercel)</span>
        </h2>
        <div className="space-y-3 text-slate-300 leading-relaxed">
          <p><strong>Cloud Run / Railway / Docker / Node:</strong></p>
          <div className="p-3 rounded-xl bg-slate-950 border border-purple-900/30 font-mono text-[11px] text-purple-300 space-y-1">
            <p>npm run build</p>
            <p>npm start  # Runs server.ts serving both API and static dist assets on PORT 3000</p>
          </div>
          <p className="text-slate-400">
            Ensure <code className="text-purple-300">GEMINI_API_KEY</code> and <code className="text-purple-300">NODE_ENV=production</code> are configured in your hosting service's environment variables.
          </p>
        </div>
      </section>

      {/* 6. PRE-SEEDED TEST CREDENTIALS */}
      <section className="p-6 rounded-2xl bg-[#0c071e] border border-purple-900/30 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>6. Pre-Seeded Accounts for Testing</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/40">
            <span className="font-semibold text-amber-300 block mb-1">Superuser Admin Account</span>
            <p className="text-slate-400">Email: <strong className="text-white">admin@zenvix.ai</strong></p>
            <p className="text-slate-400">Password: <strong className="text-white">admin123</strong></p>
            <p className="text-[10px] text-slate-500 mt-2">Has Pro unlimited credits, access to Admin console and user editor.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/40">
            <span className="font-semibold text-purple-300 block mb-1">Standard Free User Account</span>
            <p className="text-slate-400">Email: <strong className="text-white">user@zenvix.ai</strong></p>
            <p className="text-slate-400">Password: <strong className="text-white">password123</strong></p>
            <p className="text-[10px] text-slate-500 mt-2">Has 45/50 free credits, saved results, and upgrade flows.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
