import React, { useState, useEffect } from 'react';
import { TOOLS_REGISTRY } from '../shared/toolsRegistry.ts';
import { ToolCategory } from '../types/index.ts';
import { ToolIcon } from '../components/ToolIcon.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Search, Star, Zap, ArrowRight, Filter, Sparkles, X } from 'lucide-react';

interface ToolsDirectoryViewProps {
  onSelectTool: (toolId: string) => void;
}

export const ToolsDirectoryView: React.FC<ToolsDirectoryViewProps> = ({ onSelectTool }) => {
  const { token, openAuthModal } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'name'>('popular');

  // Load user favorites
  useEffect(() => {
    if (!token) return;
    fetch('/api/user/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.favorites) setFavorites(data.favorites);
      })
      .catch(() => {});
  }, [token]);

  const toggleFavorite = async (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    if (!token) {
      openAuthModal();
      return;
    }
    try {
      const res = await fetch('/api/user/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toolId }),
      });
      const data = await res.json();
      if (data.favorites) {
        setFavorites(data.favorites);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories: { id: ToolCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All 24 Tools' },
    { id: 'writing', label: 'Writing & Articles' },
    { id: 'marketing', label: 'Marketing & SEO' },
    { id: 'study', label: 'Study & Learning' },
    { id: 'coding', label: 'Coding & Development' },
    { id: 'productivity', label: 'Productivity' },
  ];

  let filtered = TOOLS_REGISTRY.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesFav = !favoritesOnly || favorites.includes(tool.id);
    return matchesCat && matchesSearch && matchesFav;
  });

  if (sortBy === 'popular') {
    filtered = [...filtered].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  } else {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Directory Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/40 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Full AI Suite</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Tools Directory</h1>
        <p className="text-xs text-slate-400">
          Discover all 24 working AI tools. Filter by workflow domain, search by keyword, or mark favorites for quick access.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0c071e] border border-purple-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-purple-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools by name, topic, or capability..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950 border border-purple-900/50 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                favoritesOnly
                  ? 'bg-amber-950/50 border-amber-800 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Favorites ({favorites.length})</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-purple-500 cursor-pointer shrink-0"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-purple-900/20">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((tool) => {
          const isFav = favorites.includes(tool.id);
          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group p-4 rounded-xl bg-[#0c071e] hover:bg-[#120a2e] border border-purple-900/30 hover:border-purple-600/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-700/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                    <ToolIcon name={tool.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tool.popular && (
                      <span className="text-[10px] text-purple-300 bg-purple-950/70 border border-purple-800/40 px-1.5 py-0.5 rounded">
                        Popular
                      </span>
                    )}
                    <button
                      onClick={(e) => toggleFavorite(e, tool.id)}
                      className="p-1 text-slate-500 hover:text-amber-400 cursor-pointer"
                      title={isFav ? 'Remove favorite' : 'Add to favorites'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-white text-xs group-hover:text-purple-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-purple-900/20 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-400" />
                  <span>{tool.isLocalOnly ? 'Local (0 credits)' : `${tool.creditCost} credit`}</span>
                </span>
                <span className="text-purple-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#0c071e] border border-purple-900/30">
          <p className="text-sm font-semibold text-white">No tools found matching your criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search query or category filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setFavoritesOnly(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
