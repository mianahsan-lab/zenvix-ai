import React, { useState, useEffect } from 'react';
import { AIToolConfig, SavedResult } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { ToolIcon } from '../ToolIcon.tsx';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Bookmark,
  Share2,
  RefreshCw,
  Zap,
  Star,
  Eye,
  Code as CodeIcon,
  HelpCircle,
  Layers,
  AlertCircle,
  Sliders,
} from 'lucide-react';

interface ToolRunnerProps {
  tool: AIToolConfig;
  onBack: () => void;
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
}

export const ToolRunner: React.FC<ToolRunnerProps> = ({
  tool,
  onBack,
  onOpenCheckout,
  onOpenAuth,
}) => {
  const { user, token, refreshUser } = useAuth();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'raw'>('preview');

  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Interactive Flashcards state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Local Tool States
  // 1. Word counter metrics
  const [wordMetrics, setWordMetrics] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTimeMin: 0,
    speakingTimeMin: 0,
  });

  // 2. Password generator state
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'Weak' | 'Medium' | 'Strong' | 'Very Strong'>('Strong');

  // Initialize default form values
  useEffect(() => {
    const defaults: Record<string, any> = {};
    tool.fields.forEach((f) => {
      defaults[f.id] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    setFormValues(defaults);
    setOutput('');
    setErrorMessage(null);
    setSaved(false);
    setQuizAnswers({});
    setQuizScore(null);
    setActiveCardIndex(0);
    setIsFlipped(false);

    // Initial run for local tools
    if (tool.id === 'password-generator') {
      generateLocalPassword(defaults.length || 16, defaults.includeSymbols !== 'No', defaults.includeNumbers !== 'No');
    }
  }, [tool]);

  // Check if favorite
  useEffect(() => {
    if (!token) return;
    fetch('/api/user/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.favorites && data.favorites.includes(tool.id)) {
          setIsFavorite(true);
        }
      })
      .catch(() => {});
  }, [tool.id, token]);

  const handleInputChange = (fieldId: string, value: any) => {
    const newValues = { ...formValues, [fieldId]: value };
    setFormValues(newValues);

    // Live calculations for local tools
    if (tool.id === 'word-counter' && fieldId === 'text') {
      const text = String(value || '');
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      const sentences = text.split(/[.!?]+/).filter(Boolean).length;
      const paragraphs = text.split(/\n+/).filter(Boolean).length;
      const readingTimeMin = Math.ceil(words / 200);
      const speakingTimeMin = Math.ceil(words / 130);

      setWordMetrics({
        words,
        chars,
        charsNoSpaces,
        sentences,
        paragraphs,
        readingTimeMin,
        speakingTimeMin,
      });
    }

    if (tool.id === 'password-generator') {
      const len = Number(newValues.length || 16);
      const sym = newValues.includeSymbols !== 'No';
      const num = newValues.includeNumbers !== 'No';
      generateLocalPassword(len, sym, num);
    }
  };

  const generateLocalPassword = (length: number, sym: boolean, num: boolean) => {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (num) charset += '0123456789';
    if (sym) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setGeneratedPassword(result);

    if (length < 8) setPasswordStrength('Weak');
    else if (length < 12) setPasswordStrength('Medium');
    else if (length < 16) setPasswordStrength('Strong');
    else setPasswordStrength('Very Strong');
  };

  const handleToggleFavorite = async () => {
    if (!token) {
      onOpenAuth();
      return;
    }
    try {
      const res = await fetch('/api/user/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toolId: tool.id }),
      });
      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setCopied(false);
    setSaved(false);

    // If local tool only
    if (tool.isLocalOnly) {
      if (tool.id === 'password-generator') {
        const len = Number(formValues.length || 16);
        generateLocalPassword(len, formValues.includeSymbols !== 'No', formValues.includeNumbers !== 'No');
      }
      return;
    }

    // JSON Formatter local check
    if (tool.id === 'json-formatter' && formValues.action !== 'AI Repair Broken Syntax') {
      try {
        const parsed = JSON.parse(formValues.rawJson);
        if (formValues.action === 'Minify') {
          setOutput(JSON.stringify(parsed));
        } else {
          setOutput(JSON.stringify(parsed, null, 2));
        }
        return;
      } catch (err: any) {
        setErrorMessage(`JSON Syntax Error: ${err.message}. Switch to "AI Repair Broken Syntax" to fix automatically.`);
        return;
      }
    }

    // Check credits
    if (user && user.plan === 'free' && user.credits < tool.creditCost) {
      setErrorMessage('You have exhausted your daily free credits. Upgrade to ZENVIX Pro for unlimited generation.');
      onOpenCheckout();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          toolId: tool.id,
          inputValues: formValues,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content.');
      }

      setOutput(data.output);
      if (token) {
        await refreshUser();
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = tool.id === 'password-generator' ? generatedPassword : output;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = tool.id === 'password-generator' ? generatedPassword : output;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenvix-${tool.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToWorkspace = async () => {
    if (!token) {
      onOpenAuth();
      return;
    }
    if (!output) return;

    try {
      const title =
        formValues.topic ||
        formValues.title ||
        formValues.idea ||
        formValues.task ||
        `${tool.name} Result (${new Date().toLocaleDateString()})`;

      const res = await fetch('/api/user/saved-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toolId: tool.id,
          toolName: tool.name,
          title,
          inputPayload: formValues,
          outputContent: output,
          tags: [tool.category],
        }),
      });

      if (res.ok) {
        setSaved(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Helper for parsing interactive JSON
  let parsedQuiz: any[] = [];
  let parsedFlashcards: any[] = [];
  if (tool.outputFormat === 'quiz' && output) {
    try {
      const match = output.match(/\[[\s\S]*\]/);
      if (match) parsedQuiz = JSON.parse(match[0]);
    } catch (e) {}
  }
  if (tool.outputFormat === 'flashcards' && output) {
    try {
      const match = output.match(/\[[\s\S]*\]/);
      if (match) parsedFlashcards = JSON.parse(match[0]);
    } catch (e) {}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top breadcrumb & tool title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-purple-900/30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer text-xs"
          >
            ← Back
          </button>
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-300">
            <ToolIcon name={tool.icon} className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{tool.name}</h1>
              <span className="text-[11px] text-purple-400 capitalize bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/30">
                {tool.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{tool.description}</p>
          </div>
        </div>

        {/* Favorite & Credit Info */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs ${
              isFavorite
                ? 'bg-amber-950/40 border-amber-800/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isFavorite ? 'Saved to favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          {!tool.isLocalOnly && (
            <div className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Cost: {tool.creditCost} credit</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0c071e] border border-purple-900/40 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-900/20">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Tool Configuration</span>
            </h3>
            {tool.isLocalOnly && (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded">
                Instant Local Engine
              </span>
            )}
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            {tool.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-slate-300 font-medium mb-1.5">
                  {field.label} {field.required && <span className="text-rose-400">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={field.id === 'text' || field.id === 'content' || field.id === 'rawJson' ? 7 : 4}
                    required={field.required}
                    value={formValues[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-900/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans text-xs leading-relaxed"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formValues[field.id] || field.defaultValue || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-900/50 text-slate-100 focus:outline-none focus:border-purple-500 text-xs"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    value={formValues[field.id] !== undefined ? formValues[field.id] : ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-900/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-xs"
                  />
                )}
                {field.helperText && <p className="text-[11px] text-slate-500 mt-1">{field.helperText}</p>}
              </div>
            ))}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!tool.isLocalOnly && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Result</span>
                  </>
                )}
              </button>
            )}
          </form>

          {/* Quick preset topics */}
          <div className="mt-6 pt-4 border-t border-purple-900/20 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-400">Pro tip: </span>
            Provide clear context, goals, and constraints for highest fidelity outputs.
          </div>
        </div>

        {/* Right Column: Output / Live Metrics */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0c071e] border border-purple-900/40 p-5 sm:p-6 shadow-xl flex flex-col min-h-[500px]">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-900/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Generated Output</span>
              {loading && <span className="text-[11px] text-purple-400 animate-pulse">Processing...</span>}
            </div>

            {/* Actions */}
            {(output || generatedPassword || tool.isLocalOnly) && (
              <div className="flex items-center gap-2">
                {tool.outputFormat === 'html' && (
                  <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-purple-900/40 text-[11px]">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'preview' ? 'bg-purple-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Live Sandbox
                    </button>
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'code' ? 'bg-purple-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Raw Code
                    </button>
                  </div>
                )}

                <button
                  onClick={handleCopy}
                  className="p-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="p-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                  title="Download as file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {user && !tool.isLocalOnly && output && (
                  <button
                    onClick={handleSaveToWorkspace}
                    disabled={saved}
                    className={`p-1.5 px-2.5 rounded-lg border flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
                      saved
                        ? 'bg-emerald-950/50 border-emerald-700/50 text-emerald-300'
                        : 'bg-purple-950/50 border-purple-800/50 text-purple-300 hover:bg-purple-900/50'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved' : 'Save'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Content Area Based on Tool Type */}
          <div className="flex-1 overflow-y-auto">
            {/* 1. WORD COUNTER SPECIAL VIEW */}
            {tool.id === 'word-counter' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-center">
                    <span className="text-2xl font-bold text-white tabular-nums">{wordMetrics.words}</span>
                    <span className="block text-[11px] text-slate-400 mt-1">Total Words</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-center">
                    <span className="text-2xl font-bold text-white tabular-nums">{wordMetrics.chars}</span>
                    <span className="block text-[11px] text-slate-400 mt-1">Characters</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-center">
                    <span className="text-2xl font-bold text-white tabular-nums">{wordMetrics.charsNoSpaces}</span>
                    <span className="block text-[11px] text-slate-400 mt-1">Chars (no spaces)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-center">
                    <span className="text-2xl font-bold text-white tabular-nums">{wordMetrics.sentences}</span>
                    <span className="block text-[11px] text-slate-400 mt-1">Sentences</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-center">
                    <span className="text-2xl font-bold text-white tabular-nums">{wordMetrics.readingTimeMin} min</span>
                    <span className="block text-[11px] text-slate-400 mt-1">Est. Reading Time</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-center">
                    <span className="text-2xl font-bold text-white tabular-nums">{wordMetrics.speakingTimeMin} min</span>
                    <span className="block text-[11px] text-slate-400 mt-1">Est. Speaking Time</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 text-xs text-slate-300">
                  <h4 className="font-semibold text-slate-200 mb-2">Analysis Insight</h4>
                  <p className="text-slate-400 leading-relaxed">
                    {wordMetrics.words > 0
                      ? `At ${wordMetrics.words} words, your text is suitable for a ${
                          wordMetrics.words < 300
                            ? 'quick social media post or executive brief.'
                            : wordMetrics.words < 1000
                            ? 'standard thought-leadership article or newsletter edition.'
                            : 'comprehensive long-form guide or research paper.'
                        }`
                      : 'Type or paste content into the left panel to immediately view real-time metrics.'}
                  </p>
                </div>
              </div>
            ) : tool.id === 'password-generator' ? (
              /* 2. PASSWORD GENERATOR SPECIAL VIEW */
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-950 border border-purple-800/40 text-center space-y-4">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Generated Cryptographic Key</div>
                  <div className="font-mono text-xl sm:text-2xl text-purple-300 select-all break-all tracking-wider p-3 bg-purple-950/30 rounded-xl border border-purple-900/40">
                    {generatedPassword}
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <span className="text-xs text-slate-400">Entropy Strength:</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        passwordStrength === 'Very Strong'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : passwordStrength === 'Strong'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {passwordStrength}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied to Clipboard' : 'Copy Password'}</span>
                    </button>
                    <button
                      onClick={() => {
                        const len = Number(formValues.length || 16);
                        generateLocalPassword(len, formValues.includeSymbols !== 'No', formValues.includeNumbers !== 'No');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 text-xs text-slate-400">
                  <p>
                    Passwords are generated entirely inside your browser using cryptographic entropy (`window.crypto.getRandomValues`). They are never stored or transmitted over any network.
                  </p>
                </div>
              </div>
            ) : parsedQuiz.length > 0 ? (
              /* 3. INTERACTIVE QUIZ VIEW */
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-purple-900/20">
                  <h4 className="text-sm font-semibold text-white">Interactive Knowledge Test</h4>
                  {quizScore !== null && (
                    <span className="text-xs font-bold text-purple-300">
                      Score: {quizScore} / {parsedQuiz.length} (
                      {Math.round((quizScore / parsedQuiz.length) * 100)}%)
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {parsedQuiz.map((q, qIndex) => {
                    const answered = quizAnswers[qIndex] !== undefined;
                    const selected = quizAnswers[qIndex];
                    const isCorrect = selected === q.answerIndex;

                    return (
                      <div key={qIndex} className="p-4 rounded-xl bg-slate-950 border border-purple-900/30 text-xs">
                        <p className="font-semibold text-slate-200 mb-3">
                          {qIndex + 1}. {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt: string, optIndex: number) => {
                            let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-purple-600/50';

                            if (answered) {
                              if (optIndex === q.answerIndex) {
                                btnStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-200 font-semibold';
                              } else if (selected === optIndex) {
                                btnStyle = 'bg-rose-950/60 border-rose-600 text-rose-200';
                              } else {
                                btnStyle = 'opacity-50 border-slate-800';
                              }
                            }

                            return (
                              <button
                                key={optIndex}
                                disabled={answered}
                                onClick={() => {
                                  const updated = { ...quizAnswers, [qIndex]: optIndex };
                                  setQuizAnswers(updated);
                                  // Update score
                                  let correctCount = 0;
                                  Object.entries(updated).forEach(([idx, ans]) => {
                                    if (parsedQuiz[Number(idx)]?.answerIndex === ans) correctCount++;
                                  });
                                  setQuizScore(correctCount);
                                }}
                                className={`w-full p-2.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {answered && optIndex === q.answerIndex && (
                                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {answered && (
                          <div className={`mt-3 p-2.5 rounded-lg text-[11px] ${isCorrect ? 'bg-emerald-950/30 text-emerald-300' : 'bg-rose-950/30 text-rose-300'}`}>
                            <span className="font-semibold">{isCorrect ? 'Correct!' : 'Incorrect.'} </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : parsedFlashcards.length > 0 ? (
              /* 4. INTERACTIVE FLASHCARD VIEW */
              <div className="space-y-6 text-center">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Card {activeCardIndex + 1} of {parsedFlashcards.length}</span>
                  <span>Click card to reveal definition</span>
                </div>

                {parsedFlashcards[activeCardIndex] && (
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full min-h-[220px] p-8 rounded-2xl bg-gradient-to-br from-[#120a32] to-[#0c0620] border-2 border-purple-600/40 shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                  >
                    {!isFlipped ? (
                      <div className="space-y-3">
                        <span className="text-[11px] text-purple-400 uppercase tracking-wider font-semibold">Front / Term</span>
                        <h3 className="text-xl font-bold text-white">
                          {parsedFlashcards[activeCardIndex].front}
                        </h3>
                        {parsedFlashcards[activeCardIndex].hint && (
                          <p className="text-xs text-slate-400 italic">
                            Hint: {parsedFlashcards[activeCardIndex].hint}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">Back / Definition</span>
                        <p className="text-sm font-medium text-slate-200 leading-relaxed max-w-lg">
                          {parsedFlashcards[activeCardIndex].back}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-center gap-4">
                  <button
                    disabled={activeCardIndex === 0}
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveCardIndex((prev) => Math.max(0, prev - 1));
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs disabled:opacity-40 cursor-pointer"
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={activeCardIndex === parsedFlashcards.length - 1}
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveCardIndex((prev) => Math.min(parsedFlashcards.length - 1, prev + 1));
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs disabled:opacity-40 cursor-pointer"
                  >
                    Next Card →
                  </button>
                </div>
              </div>
            ) : tool.outputFormat === 'html' && activeTab === 'preview' && output ? (
              /* 5. LIVE HTML/CSS SANDBOX */
              <div className="w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-purple-900/40 bg-slate-950">
                <iframe
                  title="HTML/CSS Preview"
                  sandbox="allow-scripts"
                  srcDoc={`<!doctype html><html><head><meta charset="utf-8"/><script src="https://cdn.tailwindcss.com"></script><style>body { font-family: system-ui, sans-serif; padding: 1.5rem; background: #090514; color: #f8fafc; }</style></head><body>${output.replace(/```html|```/g, '')}</body></html>`}
                  className="w-full h-full min-h-[420px] border-0"
                />
              </div>
            ) : (
              /* 6. GENERAL MARKDOWN / TEXT / CODE OUTPUT */
              <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans selection:bg-purple-600/30">
                {output ? (
                  output
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center">
                    <Sparkles className="w-8 h-8 text-purple-600/40 mb-3" />
                    <p className="text-slate-400 font-medium">Ready to create</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Fill out the parameters on the left and click "Generate Result" to begin.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
