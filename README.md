# ZENVIX AI — Complete AI Tools Platform

> **Your All-in-One AI Workspace**  
> Production-ready AI tools platform featuring 24+ professional generation tools, PBKDF2 cryptographic authentication, user dashboard, credit management, subscription upgrades, and an administrative control console. Powered by Google Gemini 3.8 Flash.

---

## 🚀 Live Demo & Immediate Testing

The platform is pre-seeded with two ready-to-test accounts:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@zenvix.ai` | `admin123` | Full access to Admin Console, user credit editor, platform settings, Pro plan |
| **Standard User** | `user@zenvix.ai` | `password123` | Free Plan, 45/50 credits, saved documents, favorites, usage history |

---

## 🛠️ Included 24 AI Tools

1. **AI Writer**: Versatile long-form and short-form copy with tone & audience controls.
2. **AI Article Generator**: SEO-optimized articles with H2/H3 headings and outline structure.
3. **AI Story Generator**: Genre-based creative storytelling with narrative twists.
4. **AI Paragraph Rewriter**: Rephrasing, simplification, and tone adjustments.
5. **Grammar Checker**: Deep grammatical audits, correction breakdowns, and readability scoring.
6. **Text Summarizer**: TL;DR bullet points and executive briefings.
7. **Email Writer**: Cold outreach, investor pitches, and professional follow-ups.
8. **YouTube Script Generator**: Complete video scripts with hooks, visual cues, and CTAs.
9. **YouTube Title Generator**: 15+ high-CTR titles categorized by curiosity gap and SEO.
10. **Social Media Caption Generator**: Native formatting for Instagram, LinkedIn, X, and TikTok.
11. **Hashtag Generator**: High, medium, and low competition tag grouping.
12. **AI Business Name Generator**: Brandable names with domain suggestions and rationale.
13. **AI Study Notes**: Cornell-format notes with key terms, mnemonics, and review queries.
14. **AI Quiz Generator**: Interactive multiple-choice tests with real-time scoring and explanations.
15. **AI Flashcard Generator**: Interactive flipping cards for spaced repetition study.
16. **AI Translator**: Multi-language translations with phonetic guides and cultural nuances.
17. **AI Code Assistant**: Production-grade code generation, debugging, and refactoring.
18. **HTML/CSS Generator**: Responsive component creation with a live iframe sandbox preview.
19. **JSON Formatter & AI Fixer**: Local beautifier/minifier plus Gemini auto-repair for broken syntax.
20. **Word & Character Counter**: Real-time client-side word, character, sentence, and reading time metrics.
21. **Secure Password Generator**: Cryptographic client-side random entropy with strength rating.
22. **Resume Assistant**: Google XYZ formula bullet point rewriter with power verbs.
23. **Cover Letter Generator**: Tailored company-specific cover letters.
24. **AI Prompt Generator**: Master mega-prompts for ChatGPT, Claude, and Midjourney.

---

## 🏗️ Architecture & Directory Structure

```text
zenvix-ai/
├── database/
│   └── schema.sql                # Complete PostgreSQL/Supabase DDL migration script
├── data/
│   └── zenvix_db.json            # Persistent JSON file database with auto-seeding
├── src/
│   ├── components/
│   │   ├── Header.tsx            # One-row Top Bar Contract navigation
│   │   ├── Footer.tsx            # Brand footer, compliance disclosures, legal links
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
└── .env.example                  # Environment variable reference
```

---

## 💻 Installation & Local Development

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Google Gemini API Key

### Steps

1. **Clone or Extract the Project Archive:**
   ```bash
   git clone <repo-url> zenvix-ai
   cd zenvix-ai
   ```
   *(Or download the full ZIP directly from `/api/download-zip`)*

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and configure:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   PORT=3000
   NODE_ENV="development"
   ```

4. **Start the Full-Stack Application:**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000`.

---

## 🗄️ Database Setup (PostgreSQL / Supabase)

ZENVIX AI operates immediately out-of-the-box using the local persistent database (`data/zenvix_db.json`).

To transition to an external relational PostgreSQL or Supabase database:
1. Open your Supabase SQL Editor or PostgreSQL client (e.g., psql / pgAdmin).
2. Copy the contents of `database/schema.sql` and run the script.
3. The schema includes all necessary tables:
   - `users` (PBKDF2 password hashes, salts, credits, plans)
   - `user_profiles` (avatars, bio, preferences)
   - `ai_usage_logs` (tool name, tokens, duration, status)
   - `saved_results` (user outputs, inputs, tags)
   - `user_favorites` (starred tools)
   - `subscriptions` & `payment_transactions`
   - `site_settings` (global configuration JSON)

---

## 🤖 AI API Configuration (Gemini 3.8 Flash)

- The backend invokes `@google/genai` on the server in `server.ts`.
- The client communicates through `/api/ai/generate`.
- The browser never receives or exposes the `GEMINI_API_KEY`.
- Models are configured to `gemini-3.8-flash` with system instruction prompts.
- Telemetry header `User-Agent: aistudio-build` is set in HTTP options.

---

## 🌐 Production Deployment

### 1. Build the Static Assets:
```bash
npm run build
```

### 2. Run the Production Server:
```bash
npm start
```
`server.ts` automatically serves API endpoints on `/api/*` and static production bundle assets from the `dist/` directory on all other routes.

### 3. Deploying to Cloud Run / Docker:
Set environment variables:
- `GEMINI_API_KEY`: Your Gemini API Key
- `NODE_ENV`: `production`
- `PORT`: `3000` (or injected by Cloud Run)

---

## ✅ Testing Checklist

- [x] Sign in using the Admin account (`admin@zenvix.ai` / `admin123`)
- [x] Verify access to the Admin Panel and ability to adjust user credits
- [x] Sign in using the Demo User (`user@zenvix.ai` / `password123`)
- [x] Run AI generation tools (AI Writer, Code Assistant, YouTube Script, Cornell Notes)
- [x] Verify local tools without API calls (Word Counter, Secure Password Generator)
- [x] Test the Interactive Quiz with answer selection and scoring
- [x] Test Interactive Flashcards with 3D flip animation
- [x] Test HTML/CSS Generator with live iframe preview sandbox
- [x] Test saving a result to the user dashboard and verifying persistence
- [x] Test the Sandbox Upgrade flow (Free -> Pro) and observe instant credit refresh
- [x] Test 1-click Project ZIP download via `/api/download-zip`
- [x] Verify responsive layout across mobile, tablet, and desktop viewports
