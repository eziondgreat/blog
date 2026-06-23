/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Send, 
  AlertCircle, 
  Sparkles, 
  Image, 
  Eye, 
  Tag as TagIcon,
  ChevronRight,
  Globe,
  Users,
  Search,
  Plus,
  Trash2,
  BookOpen,
  Clock,
  Sparkle,
  Check,
  RefreshCw,
  TrendingUp,
  PenTool,
  HelpCircle,
  FileText
} from 'lucide-react';
import { BlogPost, SystemConfig } from '../types';

interface ContentViewProps {
  config: SystemConfig;
  posts: BlogPost[];
  editingPost: BlogPost | null;
  onSavePost: (post: BlogPost) => void;
  onCancelEdit: () => void;
}

export default function ContentView({
  config,
  posts,
  editingPost,
  onSavePost,
  onCancelEdit
}: ContentViewProps) {
  // Main form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tech');
  const [audience, setAudience] = useState<'EXEC' | 'PRO' | 'STUDENT'>('PRO');
  const [status, setStatus] = useState<'Published' | 'Scheduled' | 'Draft'>('Published');
  const [readTime, setReadTime] = useState('5 min read');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('Marcus Vibe');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Editing state coordinator (to support picking posts directly in the Content Tab!)
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);

  // Active view layout inside Content Composer: 'edit' or 'split-preview' or 'full-preview'
  const [workspaceLayout, setWorkspaceLayout] = useState<'edit' | 'split'>('split');

  // Search filter for inner Catalog column
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('ALL');

  // AI assistant tools states
  const [showAiTitleOptimizer, setShowAiTitleOptimizer] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);

  // Synchronize when editingPost prop changes from parent (e.g., from Dashboard edit clicks)
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setCategory(editingPost.category);
      setAudience(editingPost.audience);
      setStatus(editingPost.status);
      setReadTime(editingPost.readTime);
      setTags(editingPost.tags || []);
      setImage(editingPost.image || '');
      setAuthor(editingPost.author || 'Marcus Vibe');
      setSeoTitle(editingPost.seoTitle || '');
      setSeoDescription(editingPost.seoDescription || '');
      setCanonicalUrl(editingPost.canonicalUrl || '');
      setCurrentEditingId(editingPost.id);
      triggerNotification('Active article loaded in editor Workspace', 'info');
    } else {
      resetFormToBlank();
    }
  }, [editingPost]);

  // Local storage auto-saver system to prevent loss of long drafts
  useEffect(() => {
    if (!title && !content) return;
    const backupTimer = setTimeout(() => {
      const draftState = {
        title,
        content,
        category,
        audience,
        status,
        readTime,
        tags,
        image,
        author,
        seoTitle,
        seoDescription,
        canonicalUrl,
        currentEditingId,
        savedAt: new Date().toLocaleTimeString()
      };
      localStorage.setItem('elizion_unsaved_draft', JSON.stringify(draftState));
      
      const now = new Date();
      setLastAutoSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1500);

    return () => clearTimeout(backupTimer);
  }, [title, content, category, audience, status, readTime, tags, image, author, seoTitle, seoDescription, canonicalUrl, currentEditingId]);

  // Check if there is an existing backup draft on boot
  const [hasBackupToRestore, setHasBackupToRestore] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('elizion_unsaved_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only show if different or if form is empty
        if ((parsed.title && !title) || (parsed.content && !content)) {
          setHasBackupToRestore(true);
        }
      } catch (err) {
        console.error("Backup parse error", err);
      }
    }
  }, []);

  const restoreFromBackup = () => {
    const saved = localStorage.getItem('elizion_unsaved_draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTitle(data.title || '');
        setContent(data.content || '');
        setCategory(data.category || 'Tech');
        setAudience(data.audience || 'PRO');
        setStatus(data.status || 'Published');
        setReadTime(data.readTime || '5 min read');
        setTags(data.tags || []);
        setImage(data.image || '');
        setAuthor(data.author || 'Marcus Vibe');
        setSeoTitle(data.seoTitle || '');
        setSeoDescription(data.seoDescription || '');
        setCanonicalUrl(data.canonicalUrl || '');
        setCurrentEditingId(data.currentEditingId || null);
        setHasBackupToRestore(false);
        triggerNotification('Draft backup state successfully restored!', 'success');
      } catch (err) {
        triggerNotification('Failed to restore corrupted backup.', 'warning');
      }
    }
  };

  const clearBackup = () => {
    localStorage.removeItem('elizion_unsaved_draft');
    setHasBackupToRestore(false);
    triggerNotification('Local draft cache cleared.', 'info');
  };

  const triggerNotification = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification((prev) => prev?.text === text ? null : prev);
    }, 4500);
  };

  const resetFormToBlank = () => {
    setTitle('');
    setContent('');
    setCategory('Tech');
    setAudience('PRO');
    setStatus('Published');
    setReadTime('5 min read');
    setTags(['Tech', 'Invention']);
    setImage('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80');
    setAuthor('Marcus Vibe');
    setSeoTitle('');
    setSeoDescription('');
    setCanonicalUrl('');
    setCurrentEditingId(null);
    onCancelEdit(); // trigger cancel callback in parent state
  };

  // Switch workspace to compose a specific post from our mini Catalog
  const handleSelectCatalogPost = (post: BlogPost) => {
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setAudience(post.audience);
    setStatus(post.status);
    setReadTime(post.readTime);
    setTags(post.tags || []);
    setImage(post.image || '');
    setAuthor(post.author || 'Marcus Vibe');
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setCanonicalUrl(post.canonicalUrl || '');
    setCurrentEditingId(post.id);
    triggerNotification(`Switched editor to: "${post.title.substring(0, 30)}..."`, 'info');
  };

  // Add taxonomy tags
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/#/g, '');
    if (!tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToKill: string) => {
    setTags(tags.filter(t => t !== tagToKill));
  };

  // Pre-calculate statistics
  const wordCount = content ? content.trim().split(/\s+/).length : 0;
  const charCount = content ? content.length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 180)); // ~180 wpm speaking pace

  // Dynamically update readTime input if modified
  useEffect(() => {
    if (wordCount > 5) {
      setReadTime(`${estimatedReadTime} min read`);
    }
  }, [wordCount]);

  // Form submit (Write to database/parent state)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      triggerNotification('Please specify an article Title!', 'warning');
      return;
    }
    if (!content.trim()) {
      triggerNotification('Please insert the Article Body content!', 'warning');
      return;
    }

    const savedPost: BlogPost = {
      id: currentEditingId || String(Date.now()),
      title: title.trim(),
      content: content.trim(),
      category,
      audience,
      status,
      readTime,
      tags,
      image: image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      author: author.trim() || 'Marcus Vibe',
      date: currentEditingId ? (posts.find(p => p.id === currentEditingId)?.date || 'June 3, 2026') : 'June 3, 2026',
      views: currentEditingId ? (posts.find(p => p.id === currentEditingId)?.views || 105) : 0,
      adClicks: currentEditingId ? (posts.find(p => p.id === currentEditingId)?.adClicks || 0) : 0,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      canonicalUrl: canonicalUrl.trim()
    };

    onSavePost(savedPost);
    localStorage.removeItem('elizion_unsaved_draft'); // clean draft since published successfully
    
    triggerNotification(
      currentEditingId 
        ? 'Successfully synchronized changes to the live reader catalog!' 
        : 'Success! New essay published live to feed category!', 
      'success'
    );

    // If it was a new post, reset form or set to newly created post
    if (!currentEditingId) {
      setTimeout(() => {
        resetFormToBlank();
      }, 2000);
    }
  };

  // Mock template options based on different tech trends
  const fillDraftTemplate = (styleType: 'brutalist' | 'crypto' | 'creator') => {
    if (styleType === 'brutalist') {
      setTitle('The Neo-Brutalist Aesthetic: Reclaiming the Raw Material of the Web');
      setCategory('Design');
      setImage('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
      setTags(['Design', 'Brutalist', 'Web3', 'Philosophy']);
      setContent(
        "For too long, the web has suffered under the tyrannical rule of clean, non-threatening corporate grids. We have optimized away our personality under the guise of 'user-centric minimalism.' Neon buttons have been replaced with quiet grays. Loud headers are now whisper-quiet sans-serif lines.\n\nNeo-Brutalism is a digital acts of defiance. It says: let the grid be visible. Let our colors scream. We combine high-saturation yellow and cyan borders with heavy 4px black geometric shadows to forge interfaces that are impossible to ignore. This design language doesn't try to blend into the background. It asserts its own physical presence.\n\nIn this framework, elements do not float elegantly over blurred frosted surfaces. They sit firmly on flat, solid planes, framed by thick black strokes. It is responsive, highly legible, accessible, and holds absolute respect for the raw materials of browser rendering: HTML blocks, high-contrast borders, and system-default typography."
      );
    } else if (styleType === 'crypto') {
      setTitle('Sovereign Compute: Decentralized Nodes and Local LLMs');
      setCategory('Tech');
      setImage('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80');
      setTags(['AI', 'Hardware', 'Tech', 'Sovereignty']);
      setContent(
        "The shift from cloud-everything to local-first computing is accelerating at record speed. As machine intelligence becomes cheap and ubiquitous, the bottleneck is no longer processing chips—it is secure ownership of the execution nodes.\n\nWhy send query telemetry back to massive server farms when a consumer-grade graphic card can run optimized 8B parameters models instantly? Running models on your personal silicon isn't just about offline privacy. It represents a paradigm shift where you own the output outright.\n\nBy leveraging localized token pipelines, we eliminate subscription toll bridges and maintain full computational autonomy. The next decade belongs to the sovereign individual who runs their own stack, orchestrates their own agent loops, and refuses to rent their digital prefrontal cortex from central SaaS platforms."
      );
    } else {
      setTitle('Micro-Audiences: Why 500 Dedicated Readers Beat 100k Passive Views');
      setCategory('Culture');
      setImage('https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80');
      setTags(['Culture', 'Audience', 'Media', 'Indie']);
      setContent(
        "Modern analytics dashboards are obsessed with scale. Creator tools focus on maximizing impressions, click-rates, and funnel conversions. But they leave out a crucial variable: cognitive commitment.\n\nAn impression of 0.3 seconds on a social timeline is functionally useless. It represents zero transaction of value or intellectual currency. A micro-audience of 500 readers who spend 10 minutes reading your essays on custom-designed portals generates multiple magnitudes more influence.\n\nThey bookmark your work, share your code schemas, and support your infrastructure. They are co-conspirators in your creative efforts, not passive eyeballs to be sold to ad networks. Designing your content portal to speak directly to this specific tribe—excluding generic tourists with sharp design and highly specific prose—is the most under-explored cheat code of modern media."
      );
    }
    triggerNotification('Loaded essay template. Customize the properties inside!', 'success');
  };

  // AI Headlines Generator (Custom heuristics engine that acts as intelligent prompt filler)
  const runAiHeadlineOptimizer = () => {
    if (!title.trim()) {
      triggerNotification('Please write a basic title draft first so the AI can analyze and upgrade it!', 'warning');
      return;
    }

    setShowAiTitleOptimizer(true);
    triggerNotification('Generating cognitive headline variations...', 'info');

    // Simulate different editorial angles based on title text
    const draftTitle = title.trim();
    setTimeout(() => {
      setGeneratedTitles([
        `🔥 CRITIC: ${draftTitle.replace(/the|a|an/gi, '')} is Broken. Here is Why.`,
        `💡 INSIDER: Decoding ${draftTitle} — The 2026 Developer Blueprint`,
        `📈 PROVOCATIVE: Stop Designing Like It is 2012: The Case For ${draftTitle}`,
        `💻 BRUTALIST MONO: 0x${Math.floor(Math.random() * 9000 + 1000)} // RECONSTRUCTING_LAYOUT: ${draftTitle.toUpperCase()}`,
        `🎯 ACADEMIC: On "${draftTitle}": Cultural Vectors and Engineering Reality`
      ]);
    }, 600);
  };

  // Extract keywords for Tag Auto-Suggest
  const getAutoSuggestedTags = () => {
    const rawContent = (title + ' ' + content).toLowerCase();
    const suggestions: string[] = [];
    
    const kwMap: { [key: string]: string } = {
      'react': 'React',
      'typescript': 'TS',
      'design': 'Design',
      'brutalist': 'Brutalism',
      'crypto': 'Sovereign',
      'ai': 'AI',
      'llm': 'Intelligence',
      'hardware': 'Hardware',
      'css': 'Tailwind',
      'performance': 'Metrics',
      'speed': 'Speed',
      'audience': 'Audience',
      'finance': 'Finance'
    };

    Object.keys(kwMap).forEach(kw => {
      if (rawContent.includes(kw) && !tags.includes(kwMap[kw])) {
        suggestions.push(kwMap[kw]);
      }
    });

    return suggestions.slice(0, 4);
  };

  const autofillTags = getAutoSuggestedTags();

  // Filtered post catalog inside left switcher
  const filteredCatalogPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                          post.author.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCat = catalogCategoryFilter === 'ALL' || post.category === catalogCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Header Command Workspace Panel */}
      <div 
        className="bg-[#161d1f] text-white p-5 border-4 border-black rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        style={{ boxShadow: '5px 5px 0px 0px #00d2ff' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center text-black font-extrabold rotate-3 text-lg relative flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
            <PenTool size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-widest bg-cyan-400 text-black px-2 py-0.5 rounded font-black">
                {currentEditingId ? 'EDITING MODE' : 'DRAFT BUILDER'}
              </span>
              {lastAutoSaved && (
                <span className="font-mono text-[9px] text-gray-400 italic">
                  &bull; Auto-saved: {lastAutoSaved}
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-[900] tracking-tight uppercase leading-tight mt-0.5">
              {currentEditingId ? 'Synchronize Article' : 'Draft New Masterpiece'}
            </h2>
          </div>
        </div>

        {/* Workspace Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Layout switcher buttons */}
          <div className="bg-black/50 border border-white/20 p-1 rounded-lg flex items-center gap-1 w-full md:w-auto">
            <button
              onClick={() => setWorkspaceLayout('edit')}
              className={`flex-1 md:flex-initial py-1 px-3 text-xs font-mono rounded font-bold transition-all cursor-pointer ${
                workspaceLayout === 'edit' ? 'bg-[#00d2ff] text-black font-extrabold' : 'text-gray-405 hover:text-white'
              }`}
            >
              Pure Compose
            </button>
            <button
              onClick={() => setWorkspaceLayout('split')}
              className={`flex-1 md:flex-initial py-1 px-3 text-xs font-mono rounded font-bold transition-all cursor-pointer ${
                workspaceLayout === 'split' ? 'bg-[#00d2ff] text-black font-extrabold' : 'text-gray-405 hover:text-white'
              }`}
            >
              Split View
            </button>
          </div>

          {/* New article creator */}
          {currentEditingId && (
            <button
              onClick={resetFormToBlank}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 border-2 border-black text-black rounded-lg font-mono text-[10px] uppercase font-black transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={13} className="stroke-[3]" />
              New Blank
            </button>
          )}
        </div>
      </div>

      {/* Backup notification restore option */}
      {hasBackupToRestore && (
        <div className="p-4 bg-indigo-50 border-3 border-dashed border-[#161d1f] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={20} className="text-indigo-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs text-[#161d1f]">Emergency Backup Found</p>
              <p className="text-[11px] text-gray-500 font-mono leading-tight mt-0.5">The local storage contains an unsaved session backup from earlier.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto self-end">
            <button 
              onClick={restoreFromBackup}
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[9px] uppercase font-bold rounded-md cursor-pointer"
            >
              Restore Saved Session
            </button>
            <button 
              onClick={clearBackup}
              className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-600 font-mono text-[9px] uppercase font-bold rounded-md cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Notifications banner */}
      {notification && (
        <div 
          className={`p-3.5 border-3 border-black text-black rounded-xl font-mono text-xs flex items-center justify-between gap-3 shadow-[4px_4px_0px_0px_#161d1f] transition-all transform duration-200 ${
            notification.type === 'success' ? 'bg-[#98ff98]' : notification.type === 'warning' ? 'bg-rose-150' : 'bg-[#eef5f8]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sparkle size={15} className="animate-spin-slow" />
            <span><strong>CMS Notice:</strong> {notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="font-bold border-b border-black text-[10px] uppercase hover:opacity-75">OK</button>
        </div>
      )}

      {/* 2. Main High-Density Workspace Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* PANEL A: INNER CATALOG SIDEBAR PICKER (3 columns)       */}
        {/* ========================================================= */}
        <div className="xl:col-span-3 bg-white p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-4">
          <div className="border-b-2 border-black/10 pb-3">
            <h3 className="font-mono text-xs font-black uppercase text-black/60 flex items-center gap-1.5">
              <FileText size={14} />
              Quick Article Catalog
            </h3>
            <p className="text-[9px] text-gray-400 font-sans mt-0.5">Click to switch or edit articles instantly.</p>
          </div>

          {/* Quick inline search inside Catalog items */}
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={12} />
            </span>
            <input
              type="text"
              placeholder="Search catalog essays..."
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              className="w-full bg-[#f4fafe] border-2 border-black rounded-lg py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Categories Selector list for micro filtering */}
          <div className="flex flex-wrap gap-1 border-t border-b border-gray-100 py-2">
            {['ALL', 'Tech', 'Design', 'Culture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCatalogCategoryFilter(cat)}
                className={`py-0.5 px-2 font-mono text-[8px] uppercase font-bold rounded cursor-pointer ${
                  catalogCategoryFilter === cat
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Essay Scroll List */}
          <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredCatalogPosts.length === 0 ? (
              <div className="p-4 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 text-center font-mono text-[9px] text-gray-400 uppercase">
                No articles match filters
              </div>
            ) : (
              filteredCatalogPosts.map((post) => {
                const isActive = currentEditingId === post.id;
                return (
                  <div
                    key={post.id}
                    onClick={() => handleSelectCatalogPost(post)}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-cyan-50 border-[#00d2ff] shadow-[2px_2px_0px_0px_#161d1f]' 
                        : 'bg-white border-black hover:bg-stone-50 hover:translate-x-0.5'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-1 mb-1">
                      <span 
                        className="font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded text-white"
                        style={{ 
                          backgroundColor: post.category === 'Tech' ? '#00677f' : post.category === 'Design' ? '#a90097' : '#506600'
                        }}
                      >
                        {post.category}
                      </span>
                      <span className={`font-mono text-[83%] tracking-tight ${
                        post.status === 'Published' ? 'text-green-600 font-bold' : post.status === 'Draft' ? 'text-amber-600' : 'text-indigo-600'
                      }`}>
                        {post.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-xs text-[#161d1f] hover:text-black line-clamp-2 leading-tight">
                      {post.title}
                    </h4>

                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-black/5 font-mono text-[8px] text-gray-400">
                      <span>{post.readTime}</span>
                      <span>By {post.author.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Create new placard helper button */}
          <button
            onClick={resetFormToBlank}
            className="w-full mt-1.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border-2 border-dashed border-indigo-400 rounded-xl font-mono text-[10px] uppercase font-bold flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(99,102,241,0.15)] hover:shadow-none transition-all cursor-pointer"
          >
            <Plus size={12} className="stroke-[2.5]" />
            Compose New Essay
          </button>
        </div>

        {/* ========================================================= */}
        {/* PANEL B: THE COMPOSER (Form entries)                     */}
        {/* ========================================================= */}
        <div className={`${workspaceLayout === 'split' ? 'xl:col-span-5' : 'xl:col-span-9'} bg-white p-5 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-4 transition-all duration-200`}>
          
          <div className="flex justify-between items-center border-b-2 border-black/10 pb-3">
            <div>
              <h3 className="font-sans font-[900] text-sm text-[#161d1f] uppercase tracking-wide">
                1. Article Content Compose
              </h3>
              <p className="font-mono text-[9px] text-[#6c797f] uppercase">Set raw prose parameters</p>
            </div>

            {/* Template select dropdown */}
            <div className="flex items-center gap-1 bg-violet-50 border border-violet-200 p-1 rounded-lg">
              <span className="font-mono text-[8px] text-violet-800 font-bold uppercase px-1">Templates:</span>
              <button
                onClick={() => fillDraftTemplate('brutalist')}
                className="px-1.5 py-0.5 bg-white text-[8px] font-mono rounded border border-violet-200 hover:bg-violet-100 cursor-pointer text-violet-950 font-bold"
              >
                Design
              </button>
              <button
                onClick={() => fillDraftTemplate('crypto')}
                className="px-1.5 py-0.5 bg-white text-[8px] font-mono rounded border border-violet-200 hover:bg-violet-100 cursor-pointer text-violet-950 font-bold"
              >
                Compute
              </button>
              <button
                onClick={() => fillDraftTemplate('creator')}
                className="px-1.5 py-0.5 bg-white text-[8px] font-mono rounded border border-violet-200 hover:bg-violet-100 cursor-pointer text-violet-950 font-bold"
              >
                Indie
              </button>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            
            {/* Title Input Grid with AI Optimizer trigger option */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Article Headline Title</label>
                <button
                  type="button"
                  onClick={runAiHeadlineOptimizer}
                  className="font-mono text-[8.5px] uppercase font-bold text-[#a90097] hover:underline flex items-center gap-1 cursor-pointer"
                  style={{ color: config.secondaryColor }}
                >
                  <Sparkles size={11} fill="currentColor" />
                  Upgrade with AI Editor
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter bold title (e.g. The Brutalist Revival in Interactive Apps)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#f4fafe] border-2 border-black rounded-xl p-3 font-sans font-[800] text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#00d2ff] transition-all"
                required
              />
            </div>

            {/* AI Optimizer options drawer */}
            {showAiTitleOptimizer && generatedTitles.length > 0 && (
              <div 
                className="p-4 bg-indigo-50 border-2 border-[#161d1f] rounded-xl flex flex-col gap-2 shadow-[2px_2px_0px_0px_#161d1f] animate-fade-in"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] uppercase font-black text-indigo-900 flex items-center gap-1">
                    <Sparkles size={11} fill="currentColor" />
                    AI Headline Suggestions Portfolio:
                  </span>
                  <button 
                    type="button"
                    onClick={() => setShowAiTitleOptimizer(false)}
                    className="text-[8.5px] font-mono text-gray-400 hover:text-black hover:underline"
                  >
                    Hide
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">These titles leverage deep copywriting frameworks optimized for readers. Click any option to choose it instantly:</p>
                
                <div className="flex flex-col gap-1.5 mt-1">
                  {generatedTitles.map((candidate, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        // Extract title text without prefix category
                        const selectedPart = candidate.includes('Inside') || candidate.includes('//') || candidate.includes(':') 
                          ? candidate.substring(candidate.indexOf(':') + 1 || candidate.indexOf('//') + 2).trim()
                          : candidate;
                        setTitle(selectedPart);
                        setShowAiTitleOptimizer(false);
                        triggerNotification('Successfully updated title draft with AI suggestion!', 'success');
                      }}
                      className="text-left py-2 px-3 bg-white hover:bg-cyan-50 border border-gray-300 rounded font-mono text-[10px] text-gray-800 leading-tight hover:border-[#161d1f] cursor-pointer transition-colors"
                    >
                      {candidate}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Author and Read-time indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-gray-400 font-bold uppercase">Article Author</label>
                <input
                  type="text"
                  placeholder="Marcus Vibe"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-[#f4fafe] border-2 border-black rounded-lg p-2 font-sans text-xs outline-none focus:ring-1 focus:ring-black font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[9px] text-gray-400 font-bold uppercase">Estimated Read Time</label>
                  <span className="font-mono text-[8px] text-gray-450 uppercase font-black">Calculated</span>
                </div>
                <input
                  type="text"
                  placeholder="5 min read"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-full bg-[#f4fafe] border-2 border-black rounded-lg p-2 font-sans text-xs outline-none focus:ring-1 focus:ring-black font-semibold text-stone-500"
                />
              </div>
            </div>

            {/* Thumbnail Asset Link */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] text-gray-450 font-bold uppercase">Featured Image Hotlink URL</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Image size={12} />
                </span>
                <input
                  type="text"
                  placeholder="Paste digital art image preview address (HTTPS)..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#f4fafe] border-2 border-black rounded-lg py-2 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-black font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Category / Target profiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#eef5f8]/50 p-3 rounded-xl border-2 border-dashed border-gray-200">
              {/* Category selector */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[8.5px] font-bold text-gray-400 uppercase">CATEGORY CLASSIFIER</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border-2 border-black p-1.5 rounded-lg font-mono text-[10.5px] font-semibold cursor-pointer outline-none"
                >
                  <option value="Tech">Tech / Engineering</option>
                  <option value="Culture">Culture / Media</option>
                  <option value="Design">Design / Creative</option>
                  <option value="Finance">Finance / Startup</option>
                </select>
              </div>

              {/* Audience selective badge button */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[8.5px] font-bold text-gray-400 uppercase">AUDIENCE SECTOR</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['STUDENT', 'PRO', 'EXEC'] as const).map((aud) => (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => setAudience(aud)}
                      className={`py-1.5 border rounded font-mono text-[9px] font-bold transition-all cursor-pointer ${
                        audience === aud
                          ? 'bg-black text-white border-black shadow-[1px_1px_0px_0px_rgba(255,255,255,0.7)]'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-black'
                      }`}
                    >
                      {aud}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Paragraph Textarea for Article body draft */}
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Article Main Essay Body (Prose)</label>
                <span className="font-mono text-[8.5px] text-gray-400">Section breaks: use double enters</span>
              </div>
              <textarea
                rows={workspaceLayout === 'split' ? 14 : 18}
                placeholder="Compose essay blocks using rich words! Start paragraphs clean, break topics with a double enter. The system auto-renders exquisite drop-caps for the first character of each paragraph..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#f4fafe] border-2 border-black rounded-xl p-3 font-sans text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#00d2ff] transition-all leading-relaxed"
                required
              />
            </div>

            {/* Quick Keyword AI Tags Auto-suggest tool panel */}
            {content && autofillTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-[#f4fafe] border-2 border-gray-200 p-2 rounded-lg text-xs leading-none">
                <span className="font-mono text-[8.5px] font-bold text-[#6c797f] uppercase flex items-center gap-1">
                  <Sparkle size={10} className="text-purple-600" />
                  Suggested Category Tags:
                </span>
                <div className="flex flex-wrap gap-1">
                  {autofillTags.map(tg => (
                    <button
                      key={tg}
                      type="button"
                      onClick={() => {
                        if (!tags.includes(tg)) {
                          setTags([...tags, tg]);
                          triggerNotification(`Added tag #${tg.toUpperCase()}`, 'success');
                        }
                      }}
                      className="px-2 py-0.5 bg-white text-cyan-900 border border-black/10 rounded font-mono text-[8.5px] font-bold uppercase hover:bg-[#00d2ff] hover:text-black transition-colors flex items-center gap-0.5 cursor-pointer"
                    >
                      +{tg}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags builder UI section */}
            <div className="bg-stone-50 border-2 border-black p-3.5 rounded-xl flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-black/5 pb-1.5">
                <label className="font-mono text-[9px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <TagIcon size={11} />
                  Article Taxonomy Tags
                </label>
                <span className="font-mono text-[8px] text-gray-400">Press ENTER to add</span>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type tag (e.g. brutalism, react, startup) & press enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 p-2 bg-white border border-black/40 rounded-lg text-xs outline-none focus:border-black font-mono uppercase text-[9.5px]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="p-1 px-3 bg-[#a6d000] border-2 border-black rounded-lg font-mono text-xs uppercase font-extrabold cursor-pointer hover:translate-x-0.5 hover:shadow-none duration-150 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: config.tertiaryColor === '#506600' ? '#a6d000' : config.tertiaryColor }}
                >
                  Add Tag
                </button>
              </div>

              {/* Interactive Tag chips with removal support */}
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {tags.map((tg) => (
                    <span 
                      key={tg}
                      onClick={() => handleRemoveTag(tg)}
                      className="inline-flex items-center gap-1.5 p-1 px-2.5 bg-white text-[#161d1f] hover:bg-rose-50 hover:text-red-700 duration-100 rounded-md border-2 border-black font-mono text-[9.5px] font-bold cursor-pointer select-none uppercase hover:scale-[0.98] transition-transform"
                      title="Click icon to delete"
                    >
                      #{tg.toUpperCase()}
                      <span className="text-[7px] bg-gray-100 px-1 border rounded text-gray-400 hover:text-red-600 font-extrabold">✕</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-[8.5px] italic text-gray-400 uppercase mt-0.5">No tags assigned yet. Feed algorithm relies on tag classification.</p>
              )}
            </div>

            {/* SEO SEARCH ENGINE OPTIMIZATION METADATA */}
            <div className="bg-[#fffdf5] border-4 border-black p-4 rounded-xl flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(22,29,31,1)]">
              <div className="border-b-2 border-black pb-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-amber-500 stroke-[3]" />
                  <span className="font-mono text-[10px] font-black text-black tracking-wider uppercase">
                    🔎 SEO DISCOVERABILITY &amp; METADATA
                  </span>
                </div>
                <span className="bg-amber-400 text-black border-2 border-black text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  SERP INDEXING
                </span>
              </div>

              <p className="font-sans text-[10.5px] text-stone-500 leading-normal -mt-1 select-none">
                Customize explicit meta parameters to improve click-through rates (CTR) and guarantee correct ranking signals for crawlers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inputs Left side */}
                <div className="flex flex-col gap-3.5">
                  {/* A. SEO META TITLE */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <label className="font-mono text-[9px] font-black text-stone-700 uppercase flex items-center gap-1">
                        Meta Title
                      </label>
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded font-black border ${
                        seoTitle.length >= 50 && seoTitle.length <= 60 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}>
                        {seoTitle.length} / 60 Chars {seoTitle.length >= 50 && seoTitle.length <= 60 ? '✓ Match' : ''}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={title || 'Search engine optimized header...'}
                      className="w-full bg-[#fcfdfe] border-2 border-black rounded-lg p-2 font-sans text-xs outline-none focus:border-stone-800 font-bold text-stone-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                    />
                    <span className="font-sans text-[8px] text-gray-400 leading-none">
                      Fallback to primary article title if left blank.
                    </span>
                  </div>

                  {/* B. SEO META DESCRIPTION */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <label className="font-mono text-[9px] font-black text-stone-700 uppercase">
                        Meta Description
                      </label>
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded font-black border ${
                        seoDescription.length >= 120 && seoDescription.length <= 160 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}>
                        {seoDescription.length} / 160 Chars {seoDescription.length >= 120 && seoDescription.length <= 160 ? '✓ Match' : ''}
                      </span>
                    </div>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      rows={3}
                      placeholder="Enter details summarizing your essay topic..."
                      className="w-full bg-[#fcfdfe] border-2 border-black rounded-lg p-2 font-sans text-xs outline-none focus:border-stone-800 font-medium text-stone-800 leading-normal shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                    />
                    <span className="font-sans text-[8px] text-gray-400 leading-none">
                      Provides organic synopsis card representation on search networks.
                    </span>
                  </div>

                  {/* C. SEO CANONICAL URL */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <label className="font-mono text-[9px] font-black text-stone-700 uppercase">
                        Canonical Routing Link
                      </label>
                      {canonicalUrl && (
                        <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded font-black border ${
                          canonicalUrl.startsWith('http://') || canonicalUrl.startsWith('https://')
                            ? 'bg-emerald-150 text-emerald-800 border-emerald-300 font-bold'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {canonicalUrl.startsWith('http://') || canonicalUrl.startsWith('https://') ? 'ACTIVE LINK ✓' : 'FORMAT ERROR ✕'}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder="https://elizion-portal.net/blog/sample-post"
                      className="w-full bg-[#fcfdfe] border-2 border-black rounded-lg p-2 font-mono text-[10.5px] outline-none focus:border-stone-800 font-bold text-stone-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                    />
                    <span className="font-sans text-[8px] text-gray-400 leading-none">
                      Prevents crawl errors if cross-posting from Substack or Medium.
                    </span>
                  </div>
                </div>

                {/* Live Google Search Card Result Simulation */}
                <div className="border-t md:border-t-0 md:border-l-2 border-dashed border-gray-300 pt-3 md:pt-0 md:pl-4 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[8.5px] font-[900] text-stone-500 uppercase tracking-widest block mb-2">
                      Live Google SERP Snippet Preview:
                    </span>
                    
                    <div className="bg-white p-3.5 border-2 border-black rounded-xl flex flex-col gap-1.5 shadow-[2px_2px_0px_0px_rgba(22,29,31,0.07)] select-none">
                      {/* Search Breadcrumbs */}
                      <div className="flex items-center gap-2 text-xs font-sans text-stone-800">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-black/10 flex items-center justify-center text-[8px] font-mono text-emerald-800 font-black shrink-0 uppercase">
                          EZ
                        </div>
                        <div className="flex flex-col leading-none">
                          <span className="text-[10.5px] font-extrabold text-stone-900 font-sans tracking-tight">Elizion Web</span>
                          <span className="text-[8px] text-stone-400 truncate max-w-[180px] sm:max-w-xs font-mono lowercase">
                            {canonicalUrl || `https://elizion-portal.net/blog/${category.toLowerCase()}/${(title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                          </span>
                        </div>
                      </div>
                      
                      {/* Clickable Blue link */}
                      <h4 className="text-[#1a0dab] font-sans font-medium text-sm leading-snug hover:underline truncate mt-1">
                        {seoTitle.trim() || title.trim() || 'Untitled Article Title - Elizion'}
                      </h4>

                      {/* Decriptive snippet */}
                      <p className="text-[#4d5156] font-sans text-[10.5px] leading-relaxed break-words line-clamp-2">
                        <span className="text-stone-400 mr-1">Jun 3, 2026 —</span>
                        {seoDescription.trim() || (content ? `${content.replace(/\n/g, ' ').substring(0, 145)}...` : 'Give this article a customized meta description in the left field to see your Google search listing representation change live here...')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-[#e0f4ff]/40 border border-[#00d2ff]/30 rounded-lg text-[9px] font-sans text-[#0060cf] leading-snug">
                    ⭐️ <strong>Pro-Tip:</strong> Search engines reward snippets matching exact queries. Aim for clear value propositions over technical slang in your seo tag labels.
                  </div>
                </div>
              </div>
            </div>

            {/* Live Release configuration choices */}
            <div className="bg-[#f4fafe] border-2 border-black p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col gap-0.5">
                <label className="font-mono text-[8.5px] font-bold text-gray-500 uppercase">Release Schedule Channel</label>
                <p className="text-[9.5px] text-gray-400 font-sans mt-0.5 select-none leading-none">Drafts are hidden from subscribers. Published is immediately live.</p>
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-white border-2 border-black p-1.5 rounded-lg font-mono text-xs font-bold cursor-pointer outline-none w-full sm:w-auto"
              >
                <option value="Published">PUBLISHED (Instant Live)</option>
                <option value="Scheduled">SCHEDULED (Upcoming List)</option>
                <option value="Draft">DRAFT STAFF ONLY</option>
              </select>
            </div>

            {/* SEO and Analytics Health Check widgets */}
            <div className="bg-[#161d1f] text-white p-3.5 rounded-xl font-mono text-[9.5px] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[#00d2ff] font-extrabold flex items-center gap-1">
                  <TrendingUp size={11} />
                  COMPILER PRE-HEALTH METRICS:
                </span>
                <span>Words: <strong className="text-green-400 font-extrabold">{wordCount}</strong></span>
                <span>Characters: <strong className="text-green-400 font-extrabold">{charCount}</strong></span>
                <span>
                  SEO Score: <strong className="text-amber-400 font-extrabold">
                    {(() => {
                      let baseScore = Math.ceil(
                        (title.length >= 20 ? 25 : 10) + 
                        (tags.length >= 1 ? 20 : 10) + 
                        (content.length >= 400 ? 35 : 15)
                      );
                      // Bonus for custom SEO title
                      if (seoTitle.trim()) {
                        baseScore += (seoTitle.length >= 50 && seoTitle.length <= 60) ? 10 : 5;
                      }
                      // Bonus for custom SEO description
                      if (seoDescription.trim()) {
                        baseScore += (seoDescription.length >= 120 && seoDescription.length <= 160) ? 10 : 5;
                      }
                      // Bonus for canonical URL
                      if (canonicalUrl.trim() && (canonicalUrl.startsWith('http://') || canonicalUrl.startsWith('https://'))) {
                        baseScore += 5;
                      }
                      return Math.min(100, baseScore);
                    })()}
                    /100
                  </strong>
                </span>
              </div>
              <span className="text-gray-400 text-[8.5px]">Compliant with Elizion CMS specs.</span>
            </div>

            {/* Bottom Form Action Commands */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-2.5 pt-4 border-t border-black/10">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400 uppercase font-black">
                <Globe size={11} className="text-green-600" />
                <span>Local Session Database Sync Enabled &bull; SSL Channel Active</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {currentEditingId && (
                  <button
                    type="button"
                    onClick={resetFormToBlank}
                    className="flex-1 sm:flex-initial py-3 px-4 bg-gray-100 hover:bg-gray-200 text-black border-2 border-black rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Discard Changes
                  </button>
                )}

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-8 bg-[#a90097] hover:bg-magenta-650 font-mono text-xs font-black uppercase text-white border-2 border-black rounded-xl cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none duration-150 transition-all shadow-[4px_4px_0px_0px_#161d1f]"
                  style={{
                    backgroundColor: config.primaryColor,
                  }}
                >
                  <Send size={15} fill="white" className="stroke-[2.5]" />
                  <span>{currentEditingId ? 'Synchronize Live' : 'Publish to Feed'}</span>
                </button>
              </div>
            </div>

          </form>

        </div>

        {/* ========================================================= */}
        {/* PANEL C: REAL-TIME DYNAMIC LIVE HTML PREVIEW (4 columns) */}
        {/* ========================================================= */}
        {workspaceLayout === 'split' && (
          <div className="xl:col-span-4 bg-[#eef5f8] border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-4 self-stretch overflow-hidden">
            
            {/* Split Preview Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2 select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></div>
                <h4 className="font-mono text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1">
                  <Eye size={12} />
                  Live Reader Preview Screen
                </h4>
              </div>
              <span className="font-mono text-[8px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase">RENDERER v3.2</span>
            </div>

            <p className="text-[10px] font-sans text-gray-500 leading-tight">This visual simulated panel mirrors precisely how your article appears to blog readers. Every typography spacing block respects active system color presets.</p>

            {/* Simulated Live Mobile View Device Container Wrapper */}
            <div 
              className="flex-1 bg-white border-3 border-black rounded-xl overflow-y-auto max-h-[780px] min-h-[500px] flex flex-col p-4 relative"
              style={{
                fontFamily: config.fontFamily === 'Inter' ? 'sans-serif' : config.fontFamily === 'JetBrains Mono' ? 'monospace' : 'serif'
              }}
            >
              {/* Back button model placeholder */}
              <div className="pb-3 border-b border-gray-100 flex items-center gap-1 font-mono text-[9px] text-gray-400 select-none">
                <ChevronRight size={10} className="rotate-180" />
                <span>Return to Essays Feed</span>
              </div>

              {/* Title Section rendering */}
              <div className="pt-4 flex flex-col gap-2">
                
                {/* Meta category indicators with custom configured colors */}
                <div className="flex items-center gap-2">
                  <span 
                    className="font-mono text-[9px] font-extrabold uppercase px-2 py-0.5 text-white rounded"
                    style={{ 
                      backgroundColor: category === 'Tech' ? '#00677f' : category === 'Design' ? '#a90097' : '#506600'
                    }}
                  >
                    {category}
                  </span>
                  
                  {/* Estimated or pre-specified read duration badges */}
                  <span className="font-mono text-[9px] text-gray-400 flex items-center gap-1">
                    <Clock size={10} />
                    {readTime || '5 min read'}
                  </span>
                </div>

                {/* Main Heading title styled with large fluid neo-brutalist typography */}
                <h1 className="text-xl md:text-2xl font-[900] tracking-tighter text-[#161d1f] mt-1 leading-tight select-text selection:bg-[#00d2ff]">
                  {title || 'Headline Placeholder Draft'}
                </h1>

                {/* Author detail block and dates */}
                <div className="flex items-center gap-2 pt-1 border-t border-b border-gray-100 py-2 mt-1 select-none">
                  {/* Miniature abstract initials avatar avatar block */}
                  <div 
                    className="w-6 h-6 rounded-full border border-black flex items-center justify-center font-mono font-bold text-[9px] uppercase text-white"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {author ? author.split(' ').map(n=>n[0]).join('') : 'MV'}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-sans font-extrabold text-[10px] text-black leading-none">{author || 'Marcus Vibe'}</p>
                    <p className="font-mono text-[8px] text-gray-400 leading-none mt-1">Published &bull; June 3, 2026</p>
                  </div>
                </div>

              </div>

              {/* Body Cover Image Container rendering */}
              <div className="my-4 border-2 border-black rounded-lg overflow-hidden h-36 bg-gray-50 flex items-center justify-center relative select-none">
                {image ? (
                  <img 
                    src={image} 
                    alt="Active Featured Header Banner" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 p-2 text-center text-gray-400">
                    <Image size={18} />
                    <p className="font-mono text-[8px] uppercase font-bold">No hotlink illustration provided</p>
                  </div>
                )}
              </div>

              {/* Dynamic taxonomy tag arrays */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 select-none my-1 pb-2">
                  {tags.map(tg => (
                    <span key={tg} className="text-[9px] font-mono text-gray-500 font-bold bg-[#eef5f8] px-2 py-0.5 rounded border border-black/5 uppercase">
                      #{tg}
                    </span>
                  ))}
                </div>
              )}

              {/* Rendered Prose Content with drop-cap rules and line-break dividers */}
              <div className="text-xs text-gray-800 leading-relaxed space-y-4 pt-3 select-text selection:bg-[#00d2ff]">
                {content ? (
                  content.split('\n\n').map((paragraph, index) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    
                    // Exquisite Drop-cap simulation style for the very first letter of the article
                    if (index === 0 && trimmed.length > 1) {
                      const firstLetter = trimmed[0];
                      const restText = trimmed.substring(1);
                      return (
                        <p key={index} className="relative">
                          <span 
                            className="float-left text-3xl font-[900] leading-[0.8] mt-1 mr-1.5 p-1 px-1.5 border-2 border-black rounded-md text-white select-none rotate-3 rotate"
                            style={{ 
                              backgroundColor: config.secondaryColor,
                              fontFamily: 'sans-serif'
                            }}
                          >
                            {firstLetter}
                          </span>
                          {restText}
                        </p>
                      );
                    }
                    
                    return (
                      <p key={index} className="text-gray-700">
                        {trimmed}
                      </p>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center gap-1 font-mono uppercase bg-stone-50 border-2 border-dashed border-gray-200 rounded-lg">
                    <FileText size={20} />
                    <span className="text-[9px] font-bold mt-1">PROSE BLANK</span>
                    <span className="text-[7.5px] leading-tight text-gray-400">Draft paragraphs on the left and see real-time updates instantly.</span>
                  </div>
                )}
              </div>

              {/* Mid-Article Configuration Placement Indicator */}
              <div className="mt-8 pt-4 border-t-2 border-dashed border-gray-200 select-none">
                <div className="p-3 bg-[#eef5f8] border-2 border-[#161d1f] rounded-lg font-mono text-[9px] text-gray-500 text-center uppercase">
                  <strong>END OF ESSAY CANVAS</strong>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
