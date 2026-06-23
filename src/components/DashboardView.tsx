/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  FileText, 
  MousePointer, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import { BlogPost, SystemConfig, AdminTab, HeroSlide } from '../types';

interface DashboardViewProps {
  posts: BlogPost[];
  onDeletePost: (id: string) => void;
  onEditPost: (post: BlogPost) => void;
  setActiveTab: (tab: AdminTab) => void;
  config: SystemConfig;
  searchTerm: string;
  slides: HeroSlide[];
  onSaveSlide: (slide: HeroSlide) => void;
  onDeleteSlide: (id: string) => void;
}

export default function DashboardView({
  posts,
  onDeletePost,
  onEditPost,
  setActiveTab,
  config,
  searchTerm,
  slides,
  onSaveSlide,
  onDeleteSlide
}: DashboardViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'All' | 'Published' | 'Scheduled' | 'Draft'>('All');
  const [liveReaders, setLiveReaders] = useState(84);
  const [cmsModule, setCmsModule] = useState<'articles' | 'slides'>('articles');

  // Slide CRUD form states
  const [isSlideFormOpen, setIsSlideFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideBadge, setSlideBadge] = useState('Trending Now');
  const [slideHeadline, setSlideHeadline] = useState('REDEFINING THE DIGITAL NARRATIVE.');
  const [slideHighlightWord, setSlideHighlightWord] = useState('DIGITAL');
  const [slideDescription, setSlideDescription] = useState('Explore the intersection of high-velocity Gen-Z aesthetics and deep-dive technical analysis.');
  const [slideButtonText, setSlideButtonText] = useState('Start Reading');
  const [slideGradientFrom, setSlideGradientFrom] = useState('#00b4b2');
  const [slideGradientVia, setSlideGradientVia] = useState('#05c484');
  const [slideGradientTo, setSlideGradientTo] = useState('#7dd749');
  const [slideLinkPostId, setSlideLinkPostId] = useState('1');

  // Trigger form opening for adding
  const handleOpenNewSlideForm = () => {
    setEditingSlide(null);
    setSlideBadge('Trending Now');
    setSlideHeadline('REDEFINING THE DIGITAL NARRATIVE.');
    setSlideHighlightWord('DIGITAL');
    setSlideDescription('Explore the intersection of high-velocity Gen-Z aesthetics.');
    setSlideButtonText('Start Reading');
    setSlideGradientFrom('#00b4b2');
    setSlideGradientVia('#05c484');
    setSlideGradientTo('#7dd749');
    setSlideLinkPostId(posts[0]?.id || '1');
    setIsSlideFormOpen(true);
  };

  // Trigger form opening for editing
  const handleOpenEditSlideForm = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideBadge(slide.badge);
    setSlideHeadline(slide.headline);
    setSlideHighlightWord(slide.highlightWord);
    setSlideDescription(slide.description);
    setSlideButtonText(slide.buttonText);
    setSlideGradientFrom(slide.gradientFrom);
    setSlideGradientVia(slide.gradientVia);
    setSlideGradientTo(slide.gradientTo);
    setSlideLinkPostId(slide.linkPostId);
    setIsSlideFormOpen(true);
  };

  const handleSaveSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slideToSave: HeroSlide = {
      id: editingSlide ? editingSlide.id : `slide-${Date.now()}`,
      badge: slideBadge,
      headline: slideHeadline,
      highlightWord: slideHighlightWord,
      description: slideDescription,
      buttonText: slideButtonText,
      gradientFrom: slideGradientFrom,
      gradientVia: slideGradientVia,
      gradientTo: slideGradientTo,
      linkPostId: slideLinkPostId
    };
    onSaveSlide(slideToSave);
    setIsSlideFormOpen(false);
    setEditingSlide(null);
  };

  // Simulated live pulse updates
  useEffect(() => {
    const pulse = setInterval(() => {
      setLiveReaders(prev => {
        const offset = Math.floor(Math.random() * 5) - 2;
        const nextValue = prev + offset;
        return nextValue > 60 && nextValue < 120 ? nextValue : 84;
      });
    }, 4000);
    return () => clearInterval(pulse);
  }, []);

  // Filter posts based on searches and sub-tabs
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeSubTab === 'All' || post.status === activeSubTab;
    return matchesSearch && matchesTab;
  });

  // Dynamic statistics calculations
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalAdClicks = posts.reduce((sum, p) => sum + (p.adClicks || 0), 0);
  const liveCount = posts.filter(p => p.status === 'Published').length;

  return (
    <div className="flex flex-col gap-8 select-none">
      
      {/* SECTION 1: Metrics Grid with Mini Sparkline Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Metric 1: Views Count */}
        <div 
          className="p-5 bg-white border-2 border-black rounded-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none duration-150 transition-all cursor-pointer relative"
          style={{ boxShadow: '4px 4px 0px 0px #161d1f' }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] font-black tracking-wider text-gray-400 uppercase">
              CUMULATIVE VIEWS
            </span>
            <span className="p-1 px-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-2 border-emerald-800 rounded-full font-mono text-[10px] font-bold flex items-center gap-1">
              <TrendingUp size={10} />
              +14.2%
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-4xl font-[900] tracking-tight">{(totalViews / 1000).toFixed(1)}K</h3>
            <span className="text-xs text-gray-500 font-mono">sessions</span>
          </div>

          {/* Simple Vector Sparkline in Box */}
          <div className="w-full h-12 mt-4 bg-slate-50 border border-black/10 rounded-lg overflow-hidden flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path 
                d="M 0 15 Q 15 12 30 18 T 60 8 T 90 2" 
                fill="none" 
                stroke={config.primaryColor} 
                strokeWidth="2.5" 
              />
              <path 
                d="M 0 15 Q 15 12 30 18 T 60 8 T 90 2 L 100 20 L 0 20 Z" 
                fill={config.primaryColor + '10'} 
              />
            </svg>
          </div>
        </div>

        {/* Metric 2: Live Articles */}
        <div 
          className="p-5 bg-white border-2 border-black rounded-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none duration-150 transition-all cursor-pointer relative"
          style={{ boxShadow: '4px 4px 0px 0px #161d1f' }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] font-black tracking-wider text-gray-400 uppercase">
              LIVE ARTICLES
            </span>
            <span className="p-1 px-2.5 bg-cyan-100 text-cyan-800 border-2 border-cyan-800 rounded-full font-mono text-[10px] font-bold">
              98% UP
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-4xl font-[900] tracking-tight">{liveCount}</h3>
            <span className="text-xs text-gray-500 font-mono">active posts</span>
          </div>

          <div className="w-full h-12 mt-4 bg-slate-50 border border-black/10 rounded-lg overflow-hidden flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <rect x="2" y="10" width="8" height="10" rx="1" fill="#bbc9cf" />
              <rect x="15" y="12" width="8" height="8" rx="1" fill="#bbc9cf" />
              <rect x="28" y="7" width="8" height="13" rx="1" fill="#bbc9cf" />
              <rect x="41" y="14" width="8" height="6" rx="1" fill={config.secondaryColor} />
              <rect x="54" y="6" width="8" height="14" rx="1" fill={config.secondaryColor} />
              <rect x="67" y="15" width="8" height="5" rx="1" fill={config.secondaryColor} />
              <rect x="80" y="3" width="8" height="17" rx="1" fill={config.secondaryColor} />
            </svg>
          </div>
        </div>

        {/* Metric 3: Ad CTR clicks */}
        <div 
          className="p-5 bg-white border-2 border-black rounded-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none duration-150 transition-all cursor-pointer relative md:col-span-2 lg:col-span-1"
          style={{ boxShadow: '4px 4px 0px 0px #161d1f' }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] font-black tracking-wider text-gray-400 uppercase">
              AD CTR PERF
            </span>
            <span className="p-1 px-2.5 bg-yellow-100 text-yellow-800 border-2 border-yellow-800 rounded-full font-mono text-[10px] font-bold">
              REVENUE
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-4xl font-[900] tracking-tight">{totalAdClicks}</h3>
            <span className="text-xs text-gray-500 font-mono">clicks recorded</span>
          </div>

          <div className="w-full h-12 mt-4 bg-slate-50 border border-black/10 rounded-lg overflow-hidden flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path 
                d="M 10 18 C 30 18, 40 4, 90 2" 
                fill="none" 
                stroke={config.tertiaryColor} 
                strokeWidth="2.5" 
              />
              <path 
                d="M 10 18 C 30 18, 40 4, 90 2 L 90 20 L 10 20 Z" 
                fill={config.tertiaryColor + '10'} 
              />
            </svg>
          </div>
        </div>

      </div>

      {/* SECTION 2: Interactive Real-time Activity Bar */}
      <div 
        className="p-4 bg-lime-100 border-2 border-black rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 rotate-[0.5deg]"
        style={{ boxShadow: '4px 4px 0px 0px #161d1f' }}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-black"></span>
          </span>
          <div>
            <p className="font-mono text-xs font-black text-lime-900 uppercase leading-none">Global Pulse Synchronized</p>
            <p className="font-sans text-[11px] text-lime-800 leading-none mt-1">
              Active readers currently scrolling: <strong>{liveReaders}</strong> &bull; Updating live data
            </p>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('analytics')}
          className="px-4 py-2 bg-white text-black border-2 border-black rounded-lg font-mono text-xs uppercase font-extrabold shadow-[2px_2px_0px_0px_rgba(22,29,31,1)] hover:shadow-none duration-150 transition-all cursor-pointer"
        >
          Launch Detailed Telemetry
        </button>
      </div>

      {/* SECTION 3: Content Tabbed Grid Manager */}
      <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(22,29,31,1)]">
        
        {/* Module Switcher: Articles vs Slides */}
        <div className="flex border-3 border-black w-fit rounded-xl overflow-hidden mb-6 bg-slate-50 shadow-[3px_3px_0px_0px_#000]">
          <button
            onClick={() => setCmsModule('articles')}
            className={`px-5 py-2.5 font-mono text-xs uppercase tracking-wide cursor-pointer duration-150 transition-all font-bold ${
              cmsModule === 'articles' ? 'bg-black text-white' : 'bg-transparent text-gray-500 hover:text-black'
            }`}
          >
            📰 Articles &amp; Insights
          </button>
          <button
            onClick={() => setCmsModule('slides')}
            className={`px-5 py-2.5 font-mono text-xs uppercase tracking-wide cursor-pointer duration-150 transition-all font-bold ${
              cmsModule === 'slides' ? 'bg-black text-white' : 'bg-transparent text-gray-500 hover:text-black'
            }`}
          >
            ✨ Explore Hero Slides
          </button>
        </div>

        {cmsModule === 'articles' ? (
          <>
            {/* Subheader and Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b-2 border-black/10 pb-4">
              <div>
                <h4 className="text-xl font-[900] tracking-tight text-[#161d1f]">Content Inventory</h4>
                <p className="font-mono text-[10px] text-gray-400 mt-0.5 uppercase">MANAGE DRAFTS &amp; LIVE RELEASES</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(['All', 'Published', 'Scheduled', 'Draft'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={`py-1.5 px-3.5 rounded-lg border-2 font-mono text-[11px] uppercase font-bold duration-150 transition-all cursor-pointer ${
                      activeSubTab === tab 
                        ? 'bg-black text-white border-black rotate-[-1deg]' 
                        : 'bg-transparent text-[#6c797f] border-transparent hover:bg-slate-50 hover:text-black'
                    }`}
                  >
                    {tab}
                  </button>
                ))}

                <button
                  onClick={() => setActiveTab('content')}
                  className="ml-2 flex items-center gap-1 bg-amber-400 text-black border-2 border-black font-mono text-xs font-bold uppercase py-2 px-3.5 rounded-lg hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer shadow-[3.5px_3.5px_0px_0px_#101010]"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  New Post
                </button>
              </div>
            </div>

            {/* Tabular Posts Table List */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-black font-mono text-[10px] tracking-wider uppercase text-gray-500">
                    <th className="pb-3 text-left w-3/5">Article Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-center">Audience</th>
                    <th className="pb-3 text-center">Views</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-[#f4fafe]/40 transition-colors group">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg border-2 border-black bg-blue-100 overflow-hidden flex-shrink-0 relative">
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-sans font-extrabold text-[#161d1f] leading-snug hover:underline cursor-pointer" onClick={() => { onEditPost(post); setActiveTab('content'); }}>
                                {post.title}
                              </p>
                              <span className="font-mono text-[9px] text-gray-400">By {post.author} &bull; {post.date}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4">
                          <span className="px-2.5 py-1 bg-slate-100 border border-slate-300 font-mono text-[10px] font-bold tracking-wide uppercase rounded">
                            {post.category}
                          </span>
                        </td>

                        <td className="py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 font-mono text-[9px] font-bold uppercase ${
                            post.status === 'Published' 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-600' 
                              : post.status === 'Scheduled'
                              ? 'bg-cyan-50 text-cyan-800 border-cyan-600'
                              : 'bg-amber-50 text-amber-800 border-amber-600'
                          }`}>
                            {post.status === 'Published' && <CheckCircle size={10} />}
                            {post.status === 'Scheduled' && <Clock size={10} />}
                            {post.status === 'Draft' && <Clock size={10} />}
                            {post.status}
                          </span>
                        </td>

                        <td className="py-4 text-center">
                          <span className="font-mono font-[950] text-xs text-black border border-stone-200 p-1 px-1.5 rounded uppercase">
                            {post.audience}
                          </span>
                        </td>

                        <td className="py-4 text-center font-mono text-xs font-bold text-gray-600">
                          {post.views.toLocaleString()}
                        </td>

                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              title="Edit post draft"
                              onClick={() => { onEditPost(post); setActiveTab('content'); }}
                              className="p-1.5 bg-white border border-black hover:bg-slate-50 hover:translate-x-0.5 duration-100 rounded-lg cursor-pointer text-[#101010]"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              title="Delete draft completely"
                              onClick={() => onDeletePost(post.id)}
                              className="p-1.5 bg-red-100 border border-red-700 hover:bg-red-200 hover:translate-x-0.5 duration-100 rounded-lg cursor-pointer text-red-700"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-[#6c797f] py-4">
                          <Search size={32} className="stroke-1" />
                          <p className="font-sans text-xs font-bold uppercase mt-2">Zero Matching Assets Found</p>
                          <p className="font-mono text-[10px] text-gray-400">Clear filter queries or insert a brand new article.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            {isSlideFormOpen ? (
              /* THE CRUD HERO SLIDE COMPOSER FORM */
              <form onSubmit={handleSaveSlideSubmit} className="bg-[#fbfcff] border-3 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_#000] flex flex-col gap-5">
                <div>
                  <h5 className="font-sans font-[900] text-lg text-black">
                    {editingSlide ? '✏️ Edit Explore Hero Slide' : '✨ Create New Explore Hero Slide'}
                  </h5>
                  <p className="font-mono text-[10px] text-gray-500 uppercase">Define the banner layout for your explore discovery feed</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Badge and Button Text */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] font-bold uppercase text-gray-700">Banner Badge (e.g., TRENDING NOW)</label>
                    <input 
                      type="text" 
                      value={slideBadge} 
                      onChange={(e) => setSlideBadge(e.target.value)} 
                      className="border-2 border-black p-2.5 rounded-lg bg-white text-xs font-sans font-bold outline-none" 
                      required 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] font-bold uppercase text-gray-700">Button Call-to-Action Text</label>
                    <input 
                      type="text" 
                      value={slideButtonText} 
                      onChange={(e) => setSlideButtonText(e.target.value)} 
                      className="border-2 border-black p-2.5 rounded-lg bg-white text-xs font-sans font-bold outline-none" 
                      required 
                    />
                  </div>

                  {/* Headline & Highlight Word */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-mono text-[10px] font-bold uppercase text-gray-700">Banner Title (uppercase recommended)</label>
                    <input 
                      type="text" 
                      value={slideHeadline} 
                      onChange={(e) => setSlideHeadline(e.target.value)} 
                      className="border-2 border-black p-2.5 rounded-lg bg-white text-sm font-sans font-black uppercase outline-none" 
                      placeholder="REDEFINING THE DIGITAL NARRATIVE." 
                      required 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] font-bold uppercase text-gray-700">Target Word to Highlight (e.g. DIGITAL)</label>
                    <input 
                      type="text" 
                      value={slideHighlightWord} 
                      onChange={(e) => setSlideHighlightWord(e.target.value)} 
                      className="border-2 border-black p-2.5 rounded-lg bg-white text-xs font-sans font-bold outline-none" 
                      placeholder="DIGITAL" 
                    />
                    <p className="font-sans text-[10px] text-gray-500">Will be framed with a dark rotated card theme for Gen-Z style pop!</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] font-bold uppercase text-gray-700">Destination Link (Bound Article)</label>
                    <select 
                      value={slideLinkPostId} 
                      onChange={(e) => setSlideLinkPostId(e.target.value)} 
                      className="border-2 border-black p-2.5 rounded-lg bg-white text-xs font-mono font-bold outline-none"
                    >
                      {posts.map(post => (
                        <option key={post.id} value={post.id}>{post.title} (By {post.author})</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-mono text-[10px] font-bold uppercase text-gray-700">Short Sub-headline description</label>
                    <textarea 
                      rows={2}
                      value={slideDescription} 
                      onChange={(e) => setSlideDescription(e.target.value)} 
                      className="border-2 border-black p-2.5 rounded-lg bg-white text-xs font-sans font-medium outline-none resize-none" 
                      required 
                    />
                  </div>

                  {/* Gradient inputs */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] font-bold uppercase text-gray-700">Gradient Start Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={slideGradientFrom} 
                        onChange={(e) => setSlideGradientFrom(e.target.value)} 
                        className="w-10 h-10 border-2 border-black rounded cursor-pointer p-0 bg-transparent" 
                      />
                      <input 
                        type="text" 
                        value={slideGradientFrom} 
                        onChange={(e) => setSlideGradientFrom(e.target.value)} 
                        className="border-2 border-black p-2 rounded-lg bg-white text-xs font-mono w-full" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] font-bold uppercase text-gray-700">Gradient Via Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={slideGradientVia} 
                        onChange={(e) => setSlideGradientVia(e.target.value)} 
                        className="w-10 h-10 border-2 border-black rounded cursor-pointer p-0 bg-transparent" 
                      />
                      <input 
                        type="text" 
                        value={slideGradientVia} 
                        onChange={(e) => setSlideGradientVia(e.target.value)} 
                        className="border-2 border-black p-2 rounded-lg bg-white text-xs font-mono w-full" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] font-bold uppercase text-gray-700">Gradient End Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={slideGradientTo} 
                        onChange={(e) => setSlideGradientTo(e.target.value)} 
                        className="w-10 h-10 border-2 border-black rounded cursor-pointer p-0 bg-transparent" 
                      />
                      <input 
                        type="text" 
                        value={slideGradientTo} 
                        onChange={(e) => setSlideGradientTo(e.target.value)} 
                        className="border-2 border-black p-2 rounded-lg bg-white text-xs font-mono w-full" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Quick Theme Presets */}
                  <div className="flex flex-col justify-end gap-1 pb-1">
                    <span className="font-mono text-[9px] text-gray-400 font-bold uppercase">Or Choose a Theme Preset</span>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        type="button" 
                        onClick={() => { setSlideGradientFrom('#00b4b2'); setSlideGradientVia('#05c484'); setSlideGradientTo('#7dd749'); }}
                        className="px-2.5 py-1.5 rounded-lg border-2 border-black bg-gradient-to-r from-[#00b4b2] to-[#7dd749] text-white font-mono text-[9px] font-bold cursor-pointer"
                      >
                        Teal-Green
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setSlideGradientFrom('#a90097'); setSlideGradientVia('#7928ca'); setSlideGradientTo('#00d2ff'); }}
                        className="px-2.5 py-1.5 rounded-lg border-2 border-black bg-gradient-to-r from-[#a90097] to-[#00d2ff] text-white font-mono text-[9px] font-bold cursor-pointer"
                      >
                        Iris-Cyan
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setSlideGradientFrom('#ff007f'); setSlideGradientVia('#a90097'); setSlideGradientTo('#ffe600'); }}
                        className="px-2.5 py-1.5 rounded-lg border-2 border-black bg-gradient-to-r from-[#ff007f] to-[#ffe600] text-black font-mono text-[9px] font-bold cursor-pointer"
                      >
                        Sunset-Cyber
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview card inside the editor */}
                <div className="border-2 border-black rounded-xl p-4 bg-white">
                  <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Live Preview of Slide Header</span>
                  <div 
                    className="relative p-6 text-white border-2 border-black rounded-lg overflow-hidden flex flex-col items-start gap-3"
                    style={{ background: `linear-gradient(to right, ${slideGradientFrom}, ${slideGradientVia}, ${slideGradientTo})` }}
                  >
                    <span className="px-2.5 py-1 bg-white text-black border border-black font-semibold font-mono text-[8px] uppercase rounded">
                      {slideBadge || 'PREVIEW BADGE'}
                    </span>
                    <h4 className="text-xl md:text-2xl font-[900] tracking-tight uppercase leading-[1.1]">
                      {(() => {
                        if (!slideHeadline) return 'YOUR LANDING HEADLINE TITLE';
                        if (!slideHighlightWord || !slideHeadline.toUpperCase().includes(slideHighlightWord.toUpperCase())) {
                          return slideHeadline;
                        }
                        const parts = slideHeadline.toUpperCase().split(slideHighlightWord.toUpperCase());
                        return (
                          <>
                            {parts[0]}
                            <span className="inline-block bg-[#161d1f] text-white px-2 py-0.5 border border-white mx-0.5 rotate-[-1deg]">
                              {slideHighlightWord.toUpperCase()}
                            </span>
                            {parts[1]}
                          </>
                        );
                      })()}
                    </h4>
                    <p className="text-[11px] text-white/90 font-medium max-w-md">
                      {slideDescription || 'Slide description preview.'}
                    </p>
                    <span className="px-3.5 py-1.5 bg-[#00d2ff] text-black border border-black rounded-md font-mono text-[9px] font-bold uppercase tracking-wider">
                      {slideButtonText || 'Button CTA'}
                    </span>
                  </div>
                </div>

                {/* Buttons row */}
                <div className="flex justify-end gap-2.5 mt-2 border-t border-black/10 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsSlideFormOpen(false); setEditingSlide(null); }}
                    className="px-4 py-2 bg-white text-stone-700 border-2 border-black rounded-lg font-mono text-xs font-bold uppercase hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-emerald-400 text-black border-2 border-black rounded-lg font-mono text-xs font-extrabold uppercase hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all shadow-[2px_2px_0px_0px_#101010] cursor-pointer"
                  >
                    {editingSlide ? 'Update Slide' : 'Publish Slide'}
                  </button>
                </div>
              </form>
            ) : (
              /* THE SLIDES MANAGER CARD VIEW LIST */
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b-2 border-black/10 pb-4">
                  <div>
                    <h4 className="text-xl font-[900] tracking-tight text-[#161d1f]">Explore Hero Slides</h4>
                    <p className="font-mono text-[10px] text-gray-400 mt-0.5 uppercase">MANAGE PAGE CAROUSEL &amp; BANNER DIRECTORY</p>
                  </div>

                  <button
                    onClick={handleOpenNewSlideForm}
                    className="flex items-center gap-1 bg-amber-400 text-black border-2 border-black font-mono text-xs font-bold uppercase py-2 px-3.5 rounded-lg hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer shadow-[3.5px_3.5px_0px_0px_#101010]"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    New Explore Slide
                  </button>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black font-mono text-[10px] tracking-wider uppercase text-gray-500">
                        <th className="pb-3 text-left w-2/5">Badge &amp; Headline</th>
                        <th className="pb-3 text-left">Description</th>
                        <th className="pb-3 text-center">Gradient Theme</th>
                        <th className="pb-3 text-center">Bound Article</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {slides.map((slide) => {
                        const boundPost = posts.find(p => p.id === slide.linkPostId) || posts[0];
                        return (
                          <tr key={slide.id} className="hover:bg-[#f4fafe]/40 transition-colors group">
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                {/* Miniature gradient representation */}
                                <div 
                                  className="w-10 h-10 rounded-lg border-2 border-black flex-shrink-0" 
                                  style={{ background: `linear-gradient(135deg, ${slide.gradientFrom}, ${slide.gradientTo})` }}
                                />
                                <div>
                                  <span className="font-mono text-[8px] bg-black text-white px-1.5 py-0.5 rounded font-extrabold uppercase">
                                    {slide.badge}
                                  </span>
                                  <p className="font-sans font-extrabold text-[#161d1f] line-clamp-1 leading-snug mt-1 uppercase text-xs">
                                    {slide.headline}
                                  </p>
                                  <span className="font-mono text-[9px] text-[#00677f]">Highlight: {slide.highlightWord || 'None'}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 max-w-xs">
                              <p className="text-xs text-stone-600 line-clamp-2 font-medium">
                                {slide.description}
                              </p>
                            </td>

                            <td className="py-4 text-center">
                              <div className="inline-flex gap-1 items-center justify-center">
                                <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: slide.gradientFrom }} title={`From ${slide.gradientFrom}`} />
                                <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: slide.gradientVia }} title={`Via ${slide.gradientVia}`} />
                                <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: slide.gradientTo }} title={`To ${slide.gradientTo}`} />
                              </div>
                            </td>

                            <td className="py-4 text-center">
                              <span className="px-2 py-1 bg-stone-100 border border-stone-200 rounded text-stone-700 line-clamp-1 max-w-[140px] text-center inline-block text-[11px] font-sans font-bold">
                                {boundPost ? boundPost.title : 'First Featured'}
                              </span>
                            </td>

                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <button
                                  title="Edit hero slide content"
                                  onClick={() => handleOpenEditSlideForm(slide)}
                                  className="p-1.5 bg-white border border-black hover:bg-slate-50 hover:translate-x-0.5 duration-100 rounded-lg cursor-pointer text-[#101010]"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  title="Delete hero slide completely"
                                  onClick={() => onDeleteSlide(slide.id)}
                                  className="p-1.5 bg-red-100 border border-red-700 hover:bg-red-200 hover:translate-x-0.5 duration-100 rounded-lg cursor-pointer text-red-700"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {slides.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 text-[#6c797f] py-4">
                              <Sparkles size={32} className="stroke-1 text-yellow-500" />
                              <p className="font-sans text-xs font-bold uppercase mt-2">No Custom Slides Configured</p>
                              <p className="font-mono text-[10px] text-gray-400">Click &quot;New Explore Slide&quot; to customize your discovery showcase.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
