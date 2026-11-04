import { AIToolConfig } from '../types/index.ts';

export const TOOLS_REGISTRY: AIToolConfig[] = [
  // =================== WRITING TOOLS ===================
  {
    id: 'ai-writer',
    name: 'AI Writer',
    category: 'writing',
    description: 'Generate high-impact articles, essays, and creative copy with customizable tone and depth.',
    icon: 'PenTool',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'topic', label: 'Topic or Prompt', type: 'textarea', placeholder: 'e.g. The future of quantum computing in everyday finance...', required: true },
      { id: 'tone', label: 'Tone of Voice', type: 'select', defaultValue: 'Professional', options: [
        { label: 'Professional & Authoritative', value: 'Professional & Authoritative' },
        { label: 'Conversational & Engaging', value: 'Conversational & Engaging' },
        { label: 'Persuasive & Sales-oriented', value: 'Persuasive & Sales-oriented' },
        { label: 'Academic & Analytical', value: 'Academic & Analytical' },
        { label: 'Casual & Friendly', value: 'Casual & Friendly' },
      ]},
      { id: 'length', label: 'Target Length', type: 'select', defaultValue: 'Medium (approx 400 words)', options: [
        { label: 'Short (~200 words)', value: 'Short (~200 words)' },
        { label: 'Medium (~400 words)', value: 'Medium (~400 words)' },
        { label: 'In-Depth (~750 words)', value: 'In-Depth (~750 words)' },
      ]},
    ],
    systemPrompt: 'You are an elite copywriter and essayist. Write compelling, structured, and insightful copy with markdown headings, clear paragraphs, and key takeaways.',
    userPromptTemplate: (v) => `Write comprehensive content about: "${v.topic}".
Tone: ${v.tone}
Length: ${v.length}.
Format with clean markdown headings, paragraphs, and a memorable concluding takeaway.`
  },
  {
    id: 'article-generator',
    name: 'AI Article Generator',
    category: 'writing',
    description: 'Create SEO-optimized long-form blog posts and comprehensive articles with outlines.',
    icon: 'FileText',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'title', label: 'Article Title or Primary Keyword', type: 'text', placeholder: 'e.g. 10 Proven Productivity Habits for Remote Teams', required: true },
      { id: 'keywords', label: 'Secondary Keywords (comma separated)', type: 'text', placeholder: 'e.g. remote work, time blocking, async communication' },
      { id: 'audience', label: 'Target Audience', type: 'select', defaultValue: 'Professionals & Entrepreneurs', options: [
        { label: 'General Public', value: 'General Public' },
        { label: 'Professionals & Entrepreneurs', value: 'Professionals & Entrepreneurs' },
        { label: 'Developers & Technologists', value: 'Developers & Technologists' },
        { label: 'Students & Learners', value: 'Students & Learners' },
      ]},
    ],
    systemPrompt: 'You are an SEO content specialist and journalist. Produce structured articles with an introduction, H2 and H3 sections, actionable bullet points, and an FAQ or conclusion.',
    userPromptTemplate: (v) => `Generate a complete SEO-optimized article for: "${v.title}".
Keywords to naturally weave in: ${v.keywords || 'industry standards'}.
Audience: ${v.audience}.
Include: Introduction with a strong hook, 3-4 structured body sections with H2/H3 headings, actionable advice, and a concise summary.`
  },
  {
    id: 'story-generator',
    name: 'AI Story Generator',
    category: 'writing',
    description: 'Craft immersive fictional stories, screenplays, and narrative arcs across diverse genres.',
    icon: 'BookOpen',
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'premise', label: 'Story Premise / Logline', type: 'textarea', placeholder: 'e.g. A botanist on a distant moon discovers a plant that remembers past human memories...', required: true },
      { id: 'genre', label: 'Genre', type: 'select', defaultValue: 'Sci-Fi', options: [
        { label: 'Science Fiction', value: 'Science Fiction' },
        { label: 'Fantasy & Mythic', value: 'Fantasy & Mythic' },
        { label: 'Mystery & Thriller', value: 'Mystery & Thriller' },
        { label: 'Cyberpunk & Noir', value: 'Cyberpunk & Noir' },
        { label: 'Historical Drama', value: 'Historical Drama' },
      ]},
      { id: 'twist', label: 'Include Plot Twist?', type: 'select', defaultValue: 'Yes, surprising twist', options: [
        { label: 'Yes, surprising twist', value: 'Yes, surprising twist' },
        { label: 'No, classic resolution', value: 'No, classic resolution' },
      ]},
    ],
    systemPrompt: 'You are an acclaimed fiction writer. Create vivid sensory imagery, realistic dialogue, emotional pacing, and strong story arcs.',
    userPromptTemplate: (v) => `Write a compelling narrative story based on this premise: "${v.premise}".
Genre: ${v.genre}.
Twist requirement: ${v.twist}.
Focus on immersive worldbuilding, tension, character motivation, and a gripping climax.`
  },
  {
    id: 'paragraph-rewriter',
    name: 'AI Paragraph Rewriter',
    category: 'writing',
    description: 'Paraphrase and elevate existing text for clarity, conciseness, or higher impact.',
    icon: 'RefreshCw',
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'text', label: 'Original Paragraph(s)', type: 'textarea', placeholder: 'Paste the text you want to rewrite or improve...', required: true },
      { id: 'mode', label: 'Rewrite Goal', type: 'select', defaultValue: 'Make more concise & professional', options: [
        { label: 'Make more concise & professional', value: 'Make more concise & professional' },
        { label: 'Simplify (ELI5 / Plain English)', value: 'Simplify (ELI5 / Plain English)' },
        { label: 'Expand with vivid elaboration', value: 'Expand with vivid elaboration' },
        { label: 'Punchy & marketing-driven', value: 'Punchy & marketing-driven' },
        { label: 'Fix academic tone', value: 'Fix academic tone' },
      ]},
    ],
    systemPrompt: 'You are a master line editor. Provide 3 distinct rewritten variations of the input text followed by key improvements explained.',
    userPromptTemplate: (v) => `Rewrite the following text with the goal: "${v.mode}".
Original Text:
"${v.text}"

Provide 3 variations:
1. Version A (Polished & Balanced)
2. Version B (High Impact & Concise)
3. Version C (Creative & Engaging)
Then briefly list the key editorial improvements made.`
  },
  {
    id: 'grammar-checker',
    name: 'Grammar Checker',
    category: 'writing',
    description: 'Detect grammatical flaws, spelling slips, punctuation bugs, and style inconsistencies.',
    icon: 'CheckCircle',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'text', label: 'Text to Check', type: 'textarea', placeholder: 'Paste text with potential typos or grammatical issues...', required: true },
    ],
    systemPrompt: 'You are a meticulous proofreader and linguist. Output: 1) Fully corrected version, 2) Itemized breakdown of errors with explanations, 3) Readability score & suggestions.',
    userPromptTemplate: (v) => `Proofread and audit the following text:
"${v.text}"

Provide:
### 1. Corrected Version
[The clean, flawless text]

### 2. Corrections Breakdown
- **Original:** ... -> **Fixed:** ... (Explanation)

### 3. Readability & Style Notes
[Quick feedback on voice and sentence variety]`
  },
  {
    id: 'text-summarizer',
    name: 'Text Summarizer',
    category: 'writing',
    description: 'Condense long articles, reports, or transcripts into punchy executive summaries.',
    icon: 'FileMinus',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'content', label: 'Long-Form Content', type: 'textarea', placeholder: 'Paste article, report, meeting transcript, or research text...', required: true },
      { id: 'format', label: 'Summary Style', type: 'select', defaultValue: 'Executive TL;DR + Bullet Points', options: [
        { label: 'Executive TL;DR + Bullet Points', value: 'Executive TL;DR + Bullet Points' },
        { label: 'Single Powerful Paragraph', value: 'Single Powerful Paragraph' },
        { label: 'Key Action Items & Takeaways', value: 'Key Action Items & Takeaways' },
      ]},
    ],
    systemPrompt: 'You are an executive chief of staff. Synthesize complex information into clear, high-signal summaries without losing critical details.',
    userPromptTemplate: (v) => `Summarize the following content in this format: ${v.format}.
Content:
"""
${v.content}
"""`
  },
  {
    id: 'email-writer',
    name: 'Email Writer',
    category: 'writing',
    description: 'Generate high-converting cold emails, polite follow-ups, and corporate correspondence.',
    icon: 'Mail',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'purpose', label: 'Email Goal / Purpose', type: 'textarea', placeholder: 'e.g. Pitch our SaaS analytics tool to a VP of Engineering, offering a 10-minute demo...', required: true },
      { id: 'recipient', label: 'Recipient Type', type: 'text', placeholder: 'e.g. Prospective Client, Manager, Team Member, Investor' },
      { id: 'tone', label: 'Tone', type: 'select', defaultValue: 'Professional & Direct', options: [
        { label: 'Professional & Direct', value: 'Professional & Direct' },
        { label: 'Warm & Friendly', value: 'Warm & Friendly' },
        { label: 'Polite Follow-up', value: 'Polite Follow-up' },
        { label: 'Urgent & Time-Sensitive', value: 'Urgent & Time-Sensitive' },
      ]},
    ],
    systemPrompt: 'You are an executive communications specialist. Provide 2 email variations with compelling subject lines and clear calls to action.',
    userPromptTemplate: (v) => `Draft professional email communications:
Purpose: ${v.purpose}
Recipient: ${v.recipient || 'Business Contact'}
Tone: ${v.tone}

Provide:
- 3 subject line options (high open rate)
- Email Option 1 (Direct & Action-Oriented)
- Email Option 2 (Warm & Value-First)`
  },

  // =================== MARKETING TOOLS ===================
  {
    id: 'youtube-script',
    name: 'YouTube Script Generator',
    category: 'marketing',
    description: 'Generate complete YouTube video scripts with hooks, visual cues, timestamps, and CTAs.',
    icon: 'Video',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'topic', label: 'Video Topic', type: 'text', placeholder: 'e.g. How to Build a Micro-SaaS in 30 Days using AI', required: true },
      { id: 'duration', label: 'Estimated Video Length', type: 'select', defaultValue: '8-10 Minutes (Standard long-form)', options: [
        { label: 'Short Form / Reel (60 seconds)', value: 'Short Form / Reel (60 seconds)' },
        { label: '5 Minutes (Concise tutorial)', value: '5 Minutes (Concise tutorial)' },
        { label: '8-10 Minutes (Standard long-form)', value: '8-10 Minutes (Standard long-form)' },
        { label: '15+ Minutes (Deep dive)', value: '15+ Minutes (Deep dive)' },
      ]},
      { id: 'style', label: 'Creator Style', type: 'select', defaultValue: 'Informative & Fast-Paced', options: [
        { label: 'Informative & Fast-Paced', value: 'Informative & Fast-Paced' },
        { label: 'Storytelling & Documentary', value: 'Storytelling & Documentary' },
        { label: 'Humorous & Relatable', value: 'Humorous & Relatable' },
      ]},
    ],
    systemPrompt: 'You are a veteran YouTube scriptwriter and retention strategist. Include [Visual Cues / B-roll notes] alongside spoken audio.',
    userPromptTemplate: (v) => `Write a YouTube video script about: "${v.topic}".
Length: ${v.duration}.
Style: ${v.style}.
Include:
1. High-retention 5-second Hook
2. Intro & Thesis
3. Section-by-section breakdown with [B-Roll / On-Screen Text directions]
4. High-conversion Call to Action & Outro`
  },
  {
    id: 'youtube-title',
    name: 'YouTube Title Generator',
    category: 'marketing',
    description: 'Generate 15+ high-CTR, algorithm-friendly titles tested for curiosity and SEO.',
    icon: 'Sparkles',
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'topic', label: 'Video Content Summary', type: 'textarea', placeholder: 'e.g. I tested 10 different mechanical keyboards to find the ultimate quiet typing switch...', required: true },
    ],
    systemPrompt: 'You are a YouTube algorithm and thumbnail strategist. Provide diverse title categories: Curiosity Gap, How-To/Authority, Negativity/Fear-of-Missing-Out, and Extreme Contrast.',
    userPromptTemplate: (v) => `Generate 15 high-CTR YouTube titles for this video idea:
"${v.topic}"

Group them into categories:
1. High Curiosity / Intrigue
2. SEO & Search Authority
3. Extreme Contrast / Challenge
4. Fear of Missing Out / What NOT to do
Include an estimated CTR score (out of 10) for each.`
  },
  {
    id: 'social-caption',
    name: 'Social Media Caption Generator',
    category: 'marketing',
    description: 'Generate tailored captions for Instagram, LinkedIn, X (Twitter), and TikTok with hashtags.',
    icon: 'Share2',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'topic', label: 'Post Topic / Message', type: 'textarea', placeholder: 'e.g. Announcing our new productivity workspace release...', required: true },
      { id: 'platform', label: 'Target Platform', type: 'select', defaultValue: 'All Platforms (Multi-post pack)', options: [
        { label: 'All Platforms (Multi-post pack)', value: 'All Platforms (Multi-post pack)' },
        { label: 'LinkedIn (Thought Leadership)', value: 'LinkedIn' },
        { label: 'Instagram (Visual & Engaging)', value: 'Instagram' },
        { label: 'X / Twitter (Punchy Thread Hook)', value: 'X / Twitter' },
        { label: 'TikTok / Shorts (Trendy Description)', value: 'TikTok' },
      ]},
    ],
    systemPrompt: 'You are a world-class social media strategist. Format outputs natively with line breaks, hooks, and platform-specific formatting.',
    userPromptTemplate: (v) => `Craft social media captions for: "${v.topic}".
Target: ${v.platform}.
Provide tailored copy with strong opening hooks, formatting with white space, engaging call-to-actions, and curated hashtags.`
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    category: 'marketing',
    description: 'Discover trending, high-volume, and niche tags to maximize discoverability.',
    icon: 'Hash',
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'topic', label: 'Niche or Content Topic', type: 'text', placeholder: 'e.g. Minimalist Home Office Setup', required: true },
      { id: 'network', label: 'Platform', type: 'select', defaultValue: 'Instagram & TikTok', options: [
        { label: 'Instagram & TikTok', value: 'Instagram & TikTok' },
        { label: 'LinkedIn', value: 'LinkedIn' },
        { label: 'YouTube Shorts', value: 'YouTube Shorts' },
      ]},
    ],
    systemPrompt: 'You are a social SEO analyst. Group hashtags into High Volume (Broad), Medium Volume (Targeted), and Low Competition (Niche) for optimal ranking.',
    userPromptTemplate: (v) => `Generate strategic hashtags for: "${v.topic}" on ${v.network}.
Provide:
1. High-Volume / Global Tags (Broad reach)
2. Medium-Volume Tags (Targeted community)
3. Low-Competition / Niche Tags (High ranking chance)
4. Recommended ready-to-copy batch of 25 hashtags`
  },
  {
    id: 'business-name',
    name: 'AI Business Name Generator',
    category: 'marketing',
    description: 'Brainstorm memorable brand names, available domain concepts, and brand positioning.',
    icon: 'Briefcase',
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'idea', label: 'Product / Business Concept', type: 'textarea', placeholder: 'e.g. An AI-powered financial copilot for freelance graphic designers...', required: true },
      { id: 'vibe', label: 'Brand Archetype', type: 'select', defaultValue: 'Modern & Futuristic', options: [
        { label: 'Modern & Futuristic', value: 'Modern & Futuristic' },
        { label: 'Minimalist & Clean', value: 'Minimalist & Clean' },
        { label: 'Playful & Creative', value: 'Playful & Creative' },
        { label: 'Prestigious & Trustworthy', value: 'Prestigious & Trustworthy' },
      ]},
    ],
    systemPrompt: 'You are a brand naming strategist. Create unique names (invented, compound, evocative, metaphorical) with domain suggestions and branding rationale.',
    userPromptTemplate: (v) => `Generate 15 creative, brandable business names for: "${v.idea}".
Style: ${v.vibe}.
For each name, provide:
- The Name
- Etymology / Meaning
- Available domain structure ideas (.com / .ai / .io / .app)
- 1-line brand tagline`
  },

  // =================== STUDY & LEARNING TOOLS ===================
  {
    id: 'study-notes',
    name: 'AI Study Notes',
    category: 'study',
    description: 'Transform lectures, textbook chapters, and articles into Cornell-style study sheets.',
    icon: 'GraduationCap',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'material', label: 'Study Material or Subject', type: 'textarea', placeholder: 'Paste lecture notes, topic description, or textbook excerpt...', required: true },
      { id: 'depth', label: 'Study Level', type: 'select', defaultValue: 'Undergraduate / College Level', options: [
        { label: 'High School / AP Level', value: 'High School' },
        { label: 'Undergraduate / College Level', value: 'College Level' },
        { label: 'Graduate / Professional Level', value: 'Graduate Level' },
      ]},
    ],
    systemPrompt: 'You are an elite academic tutor. Structure notes using the Cornell Note-Taking method with Key Concepts, Detailed Notes, Mnemonics, and Quick Quiz Questions.',
    userPromptTemplate: (v) => `Generate comprehensive Cornell-style study notes for:
"""
${v.material}
"""
Target Level: ${v.depth}.
Include:
- 📌 Key Concept Definitions
- 📝 Core Detailed Notes & Formulas/Principles
- 🧠 Memory Tricks / Mnemonics
- ❓ 3 Self-Test Reflection Questions`
  },
  {
    id: 'quiz-generator',
    name: 'AI Quiz Generator',
    category: 'study',
    description: 'Create interactive multiple-choice tests with answer keys and detailed explanations.',
    icon: 'HelpCircle',
    enabled: true,
    creditCost: 1,
    outputFormat: 'quiz',
    fields: [
      { id: 'topic', label: 'Quiz Subject or Passage', type: 'textarea', placeholder: 'e.g. World War II European Theater or React Hooks & State Management...', required: true },
      { id: 'count', label: 'Number of Questions', type: 'select', defaultValue: '5 Questions', options: [
        { label: '3 Questions', value: '3 Questions' },
        { label: '5 Questions', value: '5 Questions' },
        { label: '8 Questions', value: '8 Questions' },
      ]},
      { id: 'difficulty', label: 'Difficulty', type: 'select', defaultValue: 'Medium', options: [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Advanced', value: 'Advanced' },
      ]},
    ],
    systemPrompt: 'You are a curriculum developer. Return the quiz strictly in valid JSON format: [{"question": string, "options": string[], "answerIndex": number, "explanation": string}] so it can render as an interactive test.',
    userPromptTemplate: (v) => `Create a ${v.count} multiple-choice quiz on "${v.topic}" at ${v.difficulty} difficulty.
Return ONLY valid JSON matching this schema:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0,
    "explanation": "Why this answer is correct."
  }
]`
  },
  {
    id: 'flashcard-generator',
    name: 'AI Flashcard Generator',
    category: 'study',
    description: 'Generate flip flashcards for spaced repetition study and memory mastery.',
    icon: 'Layers',
    enabled: true,
    creditCost: 1,
    outputFormat: 'flashcards',
    fields: [
      { id: 'topic', label: 'Subject or Chapter Text', type: 'textarea', placeholder: 'e.g. Medical Terminology: Cardiovascular system or Python Data Structures...', required: true },
      { id: 'cardCount', label: 'Number of Cards', type: 'select', defaultValue: '6 Flashcards', options: [
        { label: '4 Flashcards', value: '4 Flashcards' },
        { label: '6 Flashcards', value: '6 Flashcards' },
        { label: '10 Flashcards', value: '10 Flashcards' },
      ]},
    ],
    systemPrompt: 'You are an expert in spaced repetition (Anki). Return flashcards strictly in JSON format: [{"front": string, "back": string, "hint": string}].',
    userPromptTemplate: (v) => `Create ${v.cardCount} study flashcards for: "${v.topic}".
Return ONLY a valid JSON array:
[
  {
    "front": "Term / Question",
    "back": "Clear, concise definition or answer",
    "hint": "Helpful mnemonic or memory clue"
  }
]`
  },
  {
    id: 'ai-translator',
    name: 'AI Translator',
    category: 'study',
    description: 'Translate between 50+ languages with regional nuance, idioms, and phonetic aids.',
    icon: 'Globe',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'text', label: 'Source Text', type: 'textarea', placeholder: 'Enter text to translate...', required: true },
      { id: 'targetLang', label: 'Target Language', type: 'select', defaultValue: 'Spanish', options: [
        { label: 'Spanish', value: 'Spanish' },
        { label: 'French', value: 'French' },
        { label: 'German', value: 'German' },
        { label: 'Japanese', value: 'Japanese' },
        { label: 'Mandarin Chinese', value: 'Mandarin Chinese' },
        { label: 'Arabic', value: 'Arabic' },
        { label: 'Portuguese', value: 'Portuguese' },
        { label: 'Italian', value: 'Italian' },
        { label: 'Hindi', value: 'Hindi' },
        { label: 'Russian', value: 'Russian' },
      ]},
      { id: 'formality', label: 'Register / Formality', type: 'select', defaultValue: 'Natural & Colloquial', options: [
        { label: 'Natural & Colloquial', value: 'Natural & Colloquial' },
        { label: 'Formal & Business', value: 'Formal & Business' },
        { label: 'Casual & Slang', value: 'Casual & Slang' },
      ]},
    ],
    systemPrompt: 'You are a certified master polyglot translator. Provide the accurate translation, phonetic pronunciation guide (if non-Latin or complex), and cultural nuance notes.',
    userPromptTemplate: (v) => `Translate the following text to ${v.targetLang} (${v.formality}):
"${v.text}"

Provide:
### Translation
[Target translation]

### Phonetic / Pronunciation Aid
[How to pronounce]

### Cultural Context & Nuance Notes
[Any regional or idiomatic considerations]`
  },

  // =================== CODING & DEV TOOLS ===================
  {
    id: 'code-assistant',
    name: 'AI Code Assistant',
    category: 'coding',
    description: 'Generate, debug, refactor, and explain clean code in any language with best practices.',
    icon: 'Code',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'task', label: 'Coding Task / Question / Bug', type: 'textarea', placeholder: 'e.g. Write a TypeScript debounce function with immediate execution option and cancel method...', required: true },
      { id: 'language', label: 'Programming Language', type: 'select', defaultValue: 'TypeScript / JavaScript', options: [
        { label: 'TypeScript / JavaScript', value: 'TypeScript' },
        { label: 'Python', value: 'Python' },
        { label: 'Rust', value: 'Rust' },
        { label: 'Go', value: 'Go' },
        { label: 'SQL (Postgres)', value: 'PostgreSQL' },
        { label: 'C# / .NET', value: 'C#' },
        { label: 'Java', value: 'Java' },
      ]},
      { id: 'action', label: 'Action Needed', type: 'select', defaultValue: 'Write New Code', options: [
        { label: 'Write New Code', value: 'Write New Code' },
        { label: 'Debug & Fix Errors', value: 'Debug & Fix Errors' },
        { label: 'Refactor for Performance', value: 'Refactor for Performance' },
        { label: 'Explain Code Step-by-Step', value: 'Explain Code' },
      ]},
    ],
    systemPrompt: 'You are a principal software architect. Deliver production-ready code with type annotations, edge case handling, and concise architectural explanations.',
    userPromptTemplate: (v) => `Action: ${v.action}
Language: ${v.language}
Task Details:
"""
${v.task}
"""
Provide clean, commented, production-grade code followed by explanations of trade-offs and usage examples.`
  },
  {
    id: 'html-css-generator',
    name: 'HTML/CSS Generator',
    category: 'coding',
    description: 'Generate modern responsive UI components using Tailwind CSS with live rendering.',
    icon: 'Layout',
    enabled: true,
    creditCost: 1,
    outputFormat: 'html',
    fields: [
      { id: 'component', label: 'Component Description', type: 'textarea', placeholder: 'e.g. A modern pricing card with glassmorphism, highlighted popular badge, and animated button...', required: true },
      { id: 'framework', label: 'CSS Framework', type: 'select', defaultValue: 'Tailwind CSS', options: [
        { label: 'Tailwind CSS classes', value: 'Tailwind CSS' },
        { label: 'Standard Clean CSS (scoped)', value: 'Standard Clean CSS' },
      ]},
    ],
    systemPrompt: 'You are a senior UI frontend designer. Return clean, self-contained HTML/CSS code snippet that can be rendered directly in an iframe sandbox preview.',
    userPromptTemplate: (v) => `Create a stunning modern UI component for: "${v.component}".
Styling system: ${v.framework}.
Provide clean HTML markup with responsive styles. Do not include markdown wraps around the code if possible or format inside clean html block.`
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & AI Fixer',
    category: 'coding',
    description: 'Format, validate, minify, and automatically repair broken or malformed JSON payloads.',
    icon: 'Braces',
    enabled: true,
    creditCost: 1,
    outputFormat: 'json',
    fields: [
      { id: 'rawJson', label: 'Raw / Broken JSON', type: 'textarea', placeholder: 'Paste JSON or unquoted javascript object to format or repair...', required: true },
      { id: 'action', label: 'Action', type: 'select', defaultValue: 'Format & Pretty Print', options: [
        { label: 'Format & Pretty Print', value: 'Format & Pretty Print' },
        { label: 'Minify (Compact single line)', value: 'Minify' },
        { label: 'AI Repair Broken Syntax', value: 'AI Repair Broken Syntax' },
      ]},
    ],
    systemPrompt: 'You are a strict data engineer. Parse and output pure, perfectly valid JSON without trailing commas, bad quotes, or markdown wrappers.',
    userPromptTemplate: (v) => `Task: ${v.action}.
Analyze and fix this data into valid JSON:
${v.rawJson}
Output ONLY the raw JSON string.`
  },

  // =================== PRODUCTIVITY TOOLS ===================
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    category: 'productivity',
    description: 'Calculate real-time word count, characters, reading time, speaking time, and density.',
    icon: 'AlignLeft',
    isLocalOnly: true,
    enabled: true,
    creditCost: 0,
    outputFormat: 'text',
    fields: [
      { id: 'text', label: 'Paste or Type Text Here', type: 'textarea', placeholder: 'Start typing or paste your document text here...', required: true },
    ],
    systemPrompt: '',
    userPromptTemplate: () => ''
  },
  {
    id: 'password-generator',
    name: 'Secure Password Generator',
    category: 'productivity',
    description: 'Generate cryptographic passwords with strength analysis, symbols, and memorability.',
    icon: 'Key',
    isLocalOnly: true,
    enabled: true,
    creditCost: 0,
    outputFormat: 'text',
    fields: [
      { id: 'length', label: 'Password Length', type: 'number', defaultValue: 16 },
      { id: 'includeSymbols', label: 'Include Special Symbols (!@#$%)', type: 'select', defaultValue: 'Yes', options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ]},
      { id: 'includeNumbers', label: 'Include Numbers (0-9)', type: 'select', defaultValue: 'Yes', options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ]},
    ],
    systemPrompt: '',
    userPromptTemplate: () => ''
  },
  {
    id: 'resume-assistant',
    name: 'Resume Assistant',
    category: 'productivity',
    description: 'Elevate resume bullet points into metric-driven accomplishments using the Google XYZ formula.',
    icon: 'UserCheck',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'bullets', label: 'Current Experience / Bullet Points', type: 'textarea', placeholder: 'e.g. Worked on frontend development for user dashboards and fixed bugs...', required: true },
      { id: 'targetRole', label: 'Target Job Title', type: 'text', placeholder: 'e.g. Senior Frontend Engineer' },
    ],
    systemPrompt: 'You are an executive tech recruiter. Rewrite bullets using "Accomplished [X] as measured by [Y], by doing [Z]" with strong action verbs and metrics.',
    userPromptTemplate: (v) => `Elevate these resume bullet points for the role of ${v.targetRole || 'Target Role'}:
"""
${v.bullets}
"""
Provide:
1. Enhanced Bullet Points (Google XYZ Formula with strong power verbs)
2. Suggested Impact Metrics to plug in (%, $, time saved)
3. Essential Keywords for ATS (Applicant Tracking System) optimization`
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter Generator',
    category: 'productivity',
    description: 'Write tailored, non-generic cover letters matching company culture and job requirements.',
    icon: 'FileCheck',
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'jobTitle', label: 'Target Job Title', type: 'text', placeholder: 'e.g. Product Marketing Manager', required: true },
      { id: 'company', label: 'Company Name', type: 'text', placeholder: 'e.g. Stripe, Linear, Airbnb', required: true },
      { id: 'highlights', label: 'Your Key Skills / Accomplishments', type: 'textarea', placeholder: 'Summarize 2-3 of your top achievements or career highlights...', required: true },
    ],
    systemPrompt: 'You are a career strategist. Write a persuasive, concise, 3-paragraph cover letter that hooks the hiring manager immediately without clichés like "I am writing to express my interest".',
    userPromptTemplate: (v) => `Draft a tailored cover letter:
Role: ${v.jobTitle}
Company: ${v.company}
Candidate Highlights: ${v.highlights}

Structure:
- Compelling opening hook focused on the company's mission and how candidate solves their problems
- Evidence-backed middle paragraph detailing tangible past impact
- Confident, professional close with call to interview.`
  },
  {
    id: 'prompt-generator',
    name: 'AI Prompt Generator',
    category: 'productivity',
    description: 'Engineer optimized, multi-layer mega-prompts for ChatGPT, Claude, Midjourney, and Gemini.',
    icon: 'Terminal',
    popular: true,
    enabled: true,
    creditCost: 1,
    outputFormat: 'markdown',
    fields: [
      { id: 'goal', label: 'What do you want the AI to do?', type: 'textarea', placeholder: 'e.g. Act as a venture capitalist and evaluate my B2B SaaS pitch deck...', required: true },
      { id: 'model', label: 'Target AI Model', type: 'select', defaultValue: 'General LLM (ChatGPT / Claude / Gemini)', options: [
        { label: 'General LLM (ChatGPT / Claude / Gemini)', value: 'General LLM' },
        { label: 'Midjourney / Image Generation', value: 'Midjourney' },
        { label: 'Coding Copilot / Cursor', value: 'Coding Copilot' },
      ]},
    ],
    systemPrompt: 'You are a master prompt engineer. Create a prompt structure featuring Role, Context, Task, Constraints, Examples, and Step-by-Step execution.',
    userPromptTemplate: (v) => `Create a high-performing mega-prompt for this objective: "${v.goal}".
Target Model: ${v.model}.
Provide:
1. The Complete Master Prompt (inside a copyable code block)
2. Recommended Parameters / Settings
3. Tips on how to iterate or chain follow-ups for best results.`
  },
];
