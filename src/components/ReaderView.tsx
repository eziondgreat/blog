/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Share2, 
  Send, 
  ChevronRight, 
  ChevronLeft,
  ThumbsUp, 
  Moon, 
  Sun,
  AlertCircle,
  BellRing,
  Sparkles,
  Award,
  Search,
  Zap,
  Flame,
  Users
} from 'lucide-react';
import { BlogPost, Comment, SystemConfig, HeroSlide } from '../types';
import { api } from '../api';

interface ReaderViewProps {
  posts: BlogPost[];
  config: SystemConfig;
  activePostId: string;
  setActivePostId: (id: string) => void;
  onEnterAdmin: () => void;
  slides: HeroSlide[];
}

export default function ReaderView({
  posts,
  config,
  activePostId,
  setActivePostId,
  onEnterAdmin,
  slides
}: ReaderViewProps) {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!activePostId) return;
    const loadComments = async () => {
      try {
        const data = await api.getComments(activePostId);
        setComments(data);
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    };
    loadComments();
  }, [activePostId]);

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(24);
  const [hasLiked, setHasLiked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Reader Tab Switching (feed = Detailed view, explore = Grid hub)
  const [readerTab, setReaderTab] = useState<'feed' | 'explore'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filterTab, setFilterTab] = useState<'for_you' | 'audience'>('for_you');
  const [readerSearchTerm, setReaderSearchTerm] = useState<string>('');

  const categories = [
    'ALL',
    'TECH',
    'CULTURE',
    'FINANCE',
    'AI & FUTURE',
    'GAMING',
    'CREATOR ECONOMY',
    'WEB3'
  ];

  // Find currently active post
  const currentPost = posts.find(p => p.id === activePostId) || posts[0];

  // Filter other published posts for sidebar / trending list
  const publishedPosts = posts.filter(p => p.status === 'Published');

  // Dynamic Browser SEO Metadata side effects
  useEffect(() => {
    if (!currentPost) return;

    // A. Sync Document Tab Title
    const previousTitle = document.title;
    document.title = currentPost.seoTitle || `${currentPost.title} | Elizion Portal`;

    // B. Sync Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    const oldMetaContent = metaDesc ? metaDesc.getAttribute('content') : '';
    const newDescription = currentPost.seoDescription || (currentPost.content ? `${currentPost.content.substring(0, 155)}...` : '');
    
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', newDescription);

    // C. Sync Canonical Link Element
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const oldHref = canonicalLink ? canonicalLink.getAttribute('href') : '';
    const newHref = currentPost.canonicalUrl || window.location.href;

    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', newHref);

    // D. Sync OpenGraph discoverability tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', currentPost.seoTitle || currentPost.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', newDescription);

    return () => {
      // Revert states upon change/unmount
      document.title = previousTitle;
      if (metaDesc && oldMetaContent) {
        metaDesc.setAttribute('content', oldMetaContent);
      }
      if (canonicalLink && oldHref) {
        canonicalLink.setAttribute('href', oldHref);
      }
    };
  }, [currentPost]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activePostId) return;

    try {
      const formattedAuthor = newCommentName.trim()
        ? (newCommentName.trim().startsWith('@') ? newCommentName.trim() : `@${newCommentName.trim()}`)
        : '@ANONYMOUS_WRITER';

      const newCmt = await api.postComment(activePostId, formattedAuthor, newCommentText.trim());
      setComments([newCmt, ...comments]);
      setNewCommentText('');
      setNewCommentName('');
    } catch (err: any) {
      alert(`Failed to submit comment: ${err.message}`);
    }
  };

  const toggleLike = () => {
    if (hasLiked) {
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4fafe] text-[#161d1f] font-sans">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-[#00b4b2] rounded-full animate-spin"></div>
          <span className="font-mono text-[9px] uppercase font-bold text-gray-500 tracking-widest mt-1">
            SYNCHRONIZING PORTAL FEED...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 select-text ${
        isDarkMode ? 'bg-[#0f1416] text-[#dfebef]' : 'bg-[#f4fafe] text-[#161d1f]'
      }`}
      style={{ fontFamily: config.fontFamily === 'Literata' ? 'Literata, serif' : config.fontFamily === 'JetBrains Mono' ? 'JetBrains Mono, monospace' : 'Inter, sans-serif' }}
    >
      {/* Dynamic Theme Color Styles */}
      <style>{`
        :root {
          --primary-shadow: ${config.primaryColor};
          --secondary-shadow: ${config.secondaryColor};
          --tertiary-shadow: ${config.tertiaryColor};
        }
      `}</style>

      {/* Reader Public Header */}
      <header className={`sticky top-0 z-50 border-b-4 border-[#161d1f] py-4 px-6 md:px-12 flex justify-between items-center transition-colors ${
        isDarkMode ? 'bg-[#161d1f] border-b-white' : 'bg-white'
      }`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActivePostId(posts[0].id); setReaderTab('feed'); }}>
          <Award size={24} style={{ color: config.primaryColor }} />
          <h1 className="text-2xl font-[900] tracking-tighter hover:scale-105 duration-150 transition-transform">
            Elizion
          </h1>
        </div>

        {/* Navigation Links inside reader */}
        <nav className="flex items-center gap-4 sm:gap-8">
          <button 
            onClick={() => setReaderTab('feed')}
            className={`font-mono text-xs uppercase font-extrabold tracking-wider hover:text-cyan-500 transition-colors cursor-pointer block pb-1 border-b-3 ${
              readerTab === 'feed' ? 'border-[#161d1f] text-black' : 'border-transparent text-gray-400'
            }`}
          >
            Feed
          </button>
          <button 
            onClick={() => setReaderTab('explore')}
            className={`font-mono text-xs uppercase font-extrabold tracking-wider hover:text-magenta-500 transition-colors cursor-pointer block pb-1 border-b-3 ${
              readerTab === 'explore' ? 'border-[#161d1f] text-black' : 'border-transparent text-gray-400'
            }`}
          >
            Explore
          </button>
          
          <button 
            id="btn-goto-admin"
            onClick={onEnterAdmin}
            className="px-3.5 py-1.5 bg-[#161d1f] hover:bg-slate-800 text-white rounded-lg font-mono text-[10px] sm:text-xs uppercase tracking-wider font-semibold shadow-[2px_2px_0px_0px_rgba(33,150,243,1)] hover:shadow-none duration-100 transition-all cursor-pointer"
            style={{ boxShadow: `3px 3px 0px 0px ${config.secondaryColor}` }}
          >
            CMS Admin Panel
          </button>
        </nav>

        {/* Moon / Bell Quick Widget Items */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-lg border-2 border-[#161d1f] bg-stone-50 text-black hover:bg-amber-100 duration-150 transition-all cursor-pointer"
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Main Content Area: feed vs explore */}
      {readerTab === 'feed' ? (
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Main Blog Body (8 columns) */}
          <article className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Post Header */}
            <div className="flex flex-col gap-3">
              <span 
                className="w-fit px-4 py-1.5 text-white font-mono text-xs font-bold uppercase rounded-full border-2 border-black rotate-[-1deg]"
                style={{ backgroundColor: config.primaryColor }}
              >
                {currentPost.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-[900] tracking-tight text-balance leading-tight">
                {currentPost.title}
              </h1>

              {/* Author Info Panel details */}
              <div className={`p-4 rounded-xl border-2 border-black flex flex-wrap items-center justify-between gap-4 ${
                isDarkMode ? 'bg-[#1b2225]' : 'bg-white'
              }`} style={{ boxShadow: '4px 4px 0px 0px #161d1f' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-purple-200">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgFK0hArCoX0fjC4fdoOd9KFTAQSx5wnyOdbinc5uDSoUdsZimZ1kTeEU2FGWQErY7rWJC3cP-OAFOQmBHjZ7L1elCBK09K3JLtXcqFCqIdSOQbON5FoW7GVdzpVDZUHUYTQCZ5AOFiKXAfHg31w9FQbNzJJJ9AOWmdYgTXv50RWw7go6n7zhmBVEVdLIeppThak8M32wAzdgadipr6yfzj37sli4vG8j_3AFQ9N5jz9-FKJjWm8GCjPpbBJdxMlk03qQ3A47TPdw" alt="Author" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-sans font-bold text-xs">BY {currentPost.author.toUpperCase()}</p>
                    <p className="font-mono text-[10px] text-gray-500">{currentPost.date} &bull; {currentPost.readTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-2 rounded-lg border-2 border-black duration-150 transition-all cursor-pointer ${
                      bookmarked ? 'bg-amber-400' : 'bg-transparent'
                    }`}
                  >
                    <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 rounded-lg border-2 border-black hover:bg-stone-100 duration-150 transition-all cursor-pointer">
                    <Share2 size={15} />
                  </button>
                  <button 
                    onClick={toggleLike}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black font-mono text-xs font-bold duration-150 transition-all cursor-pointer ${
                      hasLiked ? 'bg-red-400' : 'bg-[#eaf4f8]'
                    }`}
                  >
                    <ThumbsUp size={13} fill={hasLiked ? 'currentColor' : 'none'} />
                    <span>{likesCount}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image Frame */}
            <div className="mt-4 bg-purple-100 border-3 border-black rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/10] relative hover:rotate-[0.5deg] duration-200 transition-transform shadow-[4px_4px_0px_0px_#161d1f]">
              <img 
                alt="Interlocking Brutalist Cubes" 
                src={currentPost.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCNZoHP6SAeJ0b__btm2KSt-fe2eGObSxX7xd3f5QC73wYdETwovc6xw1H7BBK_xZC7dFURXKda-CCtcxf7g8OcjywkNl8O2hrI-6DiYR2sdR6MgyH9y9nZHylXy7PynlSvmwQAK4mrDj-CEI4R3HeyVL0qFpKqsjp9P58LuqYQGVk8r_Fog731XxrB01Pb2I6_chIfciWQOFM7PnHE_741p7rvd-Bbq8n1o4s5is-LUM6vR4FYX7L2O2uLmbrzca7XSpTvhhbL46g"} 
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Article Styled Content Core */}
            <div className={`text-base md:text-lg leading-relaxed flex flex-col gap-6 selection:bg-amber-200 selection:text-black mt-4`}>
              
              {/* Main paragraph with custom Drop-Cap */}
              <p className="first-letter:text-5xl first-letter:font-[900] first-letter:float-left first-letter:mr-2.5 first-letter:px-3 first-letter:py-1 first-letter:bg-cyan-400 first-letter:border-2 first-letter:border-black first-letter:rounded-lg first-letter:rotate-[-2deg] first-letter:text-black">
                {currentPost.content.split('\n\n')[0] || 
                  "For years, the digital landscape was dominated by a singular, sterile aesthetic. Soft shadows, pastel gradients, and an obsession with rounded corners turned the web into a giant cushion. But as the generation born in the scroll comes of age, a new visual language is emerging—one that values authenticity over perfection and friction over flow."
                }
              </p>

              {/* Second paragraph */}
              {currentPost.content.split('\n\n')[1] ? (
                <p>{currentPost.content.split('\n\n')[1]}</p>
              ) : (
                <p>
                  Neo-Brutalist design is not just about harsh lines and bold primary colors; it is active defiance against the tech corporate "sameness" that has plagued modern visual interfaces for the last decade. It borrows the utilitarian, honest spirit of the architectural design movement—displaying the structural materials and the raw truth of the workspace directly to the user.
                </p>
              )}

              {/* MIDDLE SPONSORED UNIT: Toggle linked to system configurations */}
              {config.ads.inFeedUnits && (
                config.ads.googleAdSenseEnabled ? (
                  <div 
                    className="my-6 p-5 bg-[#fafcfb] border-2 border-dashed border-yellow-500 rounded-2xl flex flex-col gap-3 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.005] duration-150 transition-transform"
                  >
                    <div className="absolute top-0 right-0 py-1 px-3 bg-yellow-400 text-black border-l-2 border-b-2 border-black font-mono text-[8px] font-bold tracking-widest uppercase">
                      Google AdSense Responsive Unit
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-gray-500 uppercase mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                        <span>Client: {config.ads.publisherId} &bull; Slot: {config.ads.inFeedAdSlot}</span>
                      </div>
                      
                      {/* Interactive simulated AdSense banner container */}
                      <div className="w-full py-4 px-6 border-2 border-dashed border-neutral-300 rounded-xl bg-white flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-sans font-black text-xs text-stone-800 uppercase tracking-tight">Responsive Multi-Size In-Feed Ad Banner</span>
                          <span className="font-mono text-[9px] text-[#00677f]">googlesyndication.com/adsbygoogle.js loaded</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-mono text-[9px] text-gray-400">Preview Mode Active</span>
                          <button 
                            onClick={onEnterAdmin} 
                            className="bg-black text-white text-[10px] font-mono font-bold uppercase py-1 px-3 rounded border border-black hover:bg-neutral-800 cursor-pointer"
                          >
                            Manage Code
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Real actual Google AdSense tag markup! */}
                    <ins className="adsbygoogle text-center block"
                      style={{ display: 'block' }}
                      data-ad-client={config.ads.publisherId}
                      data-ad-slot={config.ads.inFeedAdSlot}
                      data-ad-format="fluid"
                      data-ad-layout-key="-gw-3+1f-3d+2z"
                    />
                  </div>
                ) : (
                  <div 
                    className="my-4 p-6 bg-white border-2 border-dashed border-[#161d1f] rounded-xl flex flex-col items-center text-center gap-3 relative overflow-hidden"
                    style={{
                      boxShadow: `4px 4px 0px 0px ${config.tertiaryColor}`
                    }}
                  >
                    <div className="absolute top-0 right-0 py-1 px-3 bg-amber-400 text-black border-l-2 border-b-2 border-black font-mono text-[9px] font-bold text-center tracking-wide uppercase">
                      Sponsored Content
                    </div>
                    <h4 className="font-serif italic font-bold text-xl md:text-2xl text-[#161d1f] mt-2">
                      Master Neo-Brutalism with Our Design Sprint
                    </h4>
                    <p className="text-xs text-gray-400 font-mono">ENROLL TODAY &bull; LIMITED AVAILABILITY</p>
                    <button 
                      onClick={onEnterAdmin}
                      className="px-6 py-2 bg-[#00d2ff] hover:bg-cyan-500 font-mono text-xs font-bold border-2 border-black rounded-full select-none hover:shadow-none duration-100 transition-all cursor-pointer shadow-[3px_3px_0px_0px_#161d1f] animate-pulse"
                    >
                      Enroll Now
                    </button>
                  </div>
                )
              )}

              {/* Subsection header */}
              <h3 className="text-2xl font-[900] tracking-tight mt-4 text-balance">
                The Architecture of Friction
              </h3>

              <p>
                Designers are now intentionally breaking the rigid layout grid. Subtle rotations (like -1deg), hard black shadows with zero blur, and a color palette that screams for attention are no longer considered amateur mistakes. Instead, they are valuable tools of active engagement to anchor visual hierarchy.
              </p>

              {/* INTERJECTOR MIDDLE ADS UNIT */}
              {config.ads.midArticleInjector && (
                config.ads.googleAdSenseEnabled ? (
                  <div className="p-4 bg-yellow-500/5 border-2 border-dashed border-yellow-500 rounded-xl flex flex-col gap-2 my-4">
                    <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 font-bold uppercase">
                      <span>⚡ Inline AdSense Match Unit</span>
                      <span>Slot: {config.ads.midArticleAdSlot || '9988776655'}</span>
                    </div>
                    <ins className="adsbygoogle block text-center"
                      style={{ display: 'block', textAlign: 'center' }}
                      data-ad-layout="in-article"
                      data-ad-format="fluid"
                      data-ad-client={config.ads.publisherId}
                      data-ad-slot={config.ads.midArticleAdSlot}
                    />
                    <div className="w-full text-center py-2 border border-neutral-300 bg-white rounded font-mono text-[9px] text-[#a95200]">
                      [Matched Content Dynamic point loaded via slot ID: {config.ads.midArticleAdSlot}]
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-800 rounded-xl font-mono text-xs flex items-center gap-3 rotate-[-0.5deg]">
                    <AlertCircle size={18} className="flex-shrink-0 text-emerald-600" />
                    <span><strong>Admin Telemetry Active:</strong> Mid-article injector has loaded this placement. Go to System Config to test visibility mechanics in real-time.</span>
                  </div>
                )
              )}

              {/* Styled Blockquote with dynamic colors */}
              <blockquote 
                className="p-6 bg-cyan-100/10 border-l-4 rounded-r-xl font-serif italic text-xl md:text-2xl font-bold my-4 leading-relaxed"
                style={{ 
                  borderColor: config.secondaryColor,
                  backgroundColor: config.secondaryColor + '08'
                }}
              >
                "The most beautiful interfaces are the ones that don't hide their logic. They celebrate the grid, the border, and the pixel."
              </blockquote>

              <p>
                But the challenge remains: how do we balance this "Intentional Chaos" with the clinical, functional needs of professional, high-density corporate applications? The answer lies in the hybrid. By using generous negative space, precise margins and strict typographic hierarchies, we can house expressive components within a fully reliable framework.
              </p>

              {/* Bottom Upgrade UI Panel */}
              <div className="mt-6 p-6 bg-slate-900 text-white border-2 border-black rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative shadow-[4px_4px_0px_0px_#161d1f]">
                <div>
                  <span className="font-mono text-[9px] tracking-widest text-cyan-400 font-bold uppercase block mb-1">Limited Offer</span>
                  <h4 className="text-xl md:text-2xl font-bold">Level up your UI game with Elizion Pro</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-md">Unlock full access to brutal design kits, Figma project templates, and interactive code sandboxes.</p>
                </div>
                <button 
                  onClick={onEnterAdmin}
                  className="w-full md:w-auto px-6 py-3 bg-[#00d2ff] hover:bg-cyan-400 text-black border-2 border-stone-200 hover:border-black font-semibold font-mono text-xs rounded-full cursor-pointer hover:rotate-1 duration-150 transition-all text-center flex-shrink-0"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>

            <hr className="my-8 border-t-2 border-dashed border-gray-400/40" />

            {/* COMMENTS COMPONENT ZONE */}
            <section className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-[900] tracking-tight">
                  Comments ({comments.length})
                </h3>
                <p className="font-mono text-xs text-gray-400">Post anonymously or with label</p>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handlePostComment} className="p-4 border-2 border-black bg-[#fafbfd] rounded-xl flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(22,29,31,1)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text"
                    placeholder="Your Name (e.g. @DESIGN_ENTHUSIAST)"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="p-3 bg-white border-2 border-black/10 focus:border-black rounded-lg text-xs font-mono outline-none"
                  />
                  <span className="text-[10px] text-gray-400 font-mono sm:self-center">Enter name to leave custom handle!</span>
                </div>
                
                <div className="flex gap-2">
                  <textarea
                    rows={3}
                    placeholder="Share your perspective on high-friction UI design..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 p-3 bg-white border-2 border-black/10 focus:border-black rounded-lg text-sm outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 bg-emerald-400 hover:bg-emerald-500 text-black border-2 border-black rounded-lg flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_rgba(22,29,31,1)] hover:shadow-none duration-150 active:scale-95 transition-all"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="flex flex-col gap-3.5 mt-2">
                {comments.map((cmt) => (
                  <div 
                    key={cmt.id} 
                    className={`p-4 rounded-xl border-2 border-black flex gap-3 transition-colors ${
                      isDarkMode ? 'bg-[#1b2225]' : 'bg-white'
                    }`}
                    style={{ boxShadow: '3px 3px 0px 0px #161d1f' }}
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden flex-shrink-0 bg-blue-100">
                      <img src={cmt.avatar} alt={cmt.author} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-xs font-bold leading-none" style={{ color: config.secondaryColor }}>
                          {cmt.author}
                        </span>
                        <span className="font-mono text-[9px] text-[#6c797f]">{cmt.time}</span>
                      </div>
                      <p className="text-xs text-balance mt-1.5">{cmt.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </article>

          {/* RIGHT COLUMN: Sidebar (4 columns, only shown fully on tablets/desktop) */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            
            {/* SIDE AD UNIT (Linked to config) */}
            {config.ads.sidebarGlobal && (
              config.ads.googleAdSenseEnabled ? (
                <div 
                  className="bg-[#fafafa] border-2 border-black p-4 rounded-xl relative select-none flex flex-col gap-3"
                  style={{
                    boxShadow: `4px 4px 0px 0px #e29000`
                  }}
                >
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black border-l-2 border-b-2 border-black px-2 py-0.5 font-mono text-[8px] tracking-wider uppercase font-bold">
                    AdSense Display Unit
                  </div>
                  
                  <div className="font-mono text-[8.5px] font-bold text-gray-400 uppercase mt-2 leading-snug">
                    Client: {config.ads.publisherId}<br/>
                    Slot ID: {config.ads.sidebarAdSlot}
                  </div>

                  <div className="w-full aspect-[4/3] border-2 border-dashed border-neutral-300 rounded-lg text-stone-800 font-mono text-[10px] flex flex-col items-center justify-center p-3 text-center gap-1.5 bg-yellow-400/5">
                    <span className="font-black tracking-widest text-[#a90097] text-[11px]">300×250 AD PLACE</span>
                    <span className="text-gray-400 text-[8px] uppercase">googlesyndication.com</span>
                  </div>

                  {/* Real actual AdSense tag injection */}
                  <ins className="adsbygoogle block text-center"
                    style={{ display: 'inline-block', width: '100%', height: '250px' }}
                    data-ad-client={config.ads.publisherId}
                    data-ad-slot={config.ads.sidebarAdSlot}
                  />

                  <p className="text-[9px] text-gray-400 text-center font-mono italic">
                    Adaptive Display Placement Active
                  </p>
                </div>
              ) : (
                <div 
                  className="bg-white border-2 border-black p-4 rounded-xl relative select-none"
                  style={{
                    boxShadow: `4px 4px 0px 0px #00d2ff`
                  }}
                >
                  <div className="absolute top-0 right-0 bg-red-500 text-white border-b-2 border-l-2 border-black px-2 py-0.5 font-mono text-[8px] tracking-widest uppercase">
                    Ad Unit
                  </div>
                  <div className="w-full h-32 bg-slate-900 rounded-lg overflow-hidden border border-black mb-3">
                    <img 
                      alt="Keycaps Ad" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhi4iwEdl7mO0cIzgy6_2Aun-u9nkjU3Pm5zwUWtNX5laoHaUlTdYGGIUjds8pGY8VVyncG4uy4WlId2zrAX4UZcMH5O1eQmO2j6MS_v-geOHaHz-iWEi-vwNIODjZeMmYdFlLpTxprQy1SLVn2m2lzA2ReoieSn6WC-542khzAUQkKPTQ85ki7cDSJIzyhJPhELn8CGP3jhwfN731DOz2IP7YmKV6bz8QctTwI3F8o0RF3wzuAYnt2kvrRajV3LKwzq98jRTpaFc" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <h5 className="font-sans font-black text-xs uppercase leading-tight">Retro-Future Keycaps Out Now</h5>
                  <p className="text-[10px] text-gray-500 leading-tight mt-1">Elevate your workspace mechanical keyboard with the custom premium neon-brutal keycap sets.</p>
                  <button 
                    onClick={onEnterAdmin}
                    className="w-full mt-3 py-2 bg-[#a90097] hover:bg-magenta-600 font-mono text-[10px] uppercase tracking-wider font-extrabold text-white border-2 border-black rounded-lg cursor-pointer"
                  >
                    Shop Now
                  </button>
                </div>
              )
            )}

            {/* SATELLITE FEED / TOP ARTICLES SELECTOR */}
            <div className={`p-4 rounded-xl border-2 border-black flex flex-col gap-4 ${
              isDarkMode ? 'bg-[#1b2225]' : 'bg-white'
            }`} style={{ boxShadow: '4px 4px 0px 0px #161d1f' }}>
              <h4 className="font-mono text-[10px] font-bold tracking-widest text-[#6c797f] uppercase block border-b-2 border-gray-400/20 pb-2">
                TRENDING READS
              </h4>
              
              <div className="flex flex-col gap-4">
                {publishedPosts.slice(0, 3).map((post, idx) => (
                  <div 
                    key={post.id} 
                    onClick={() => setActivePostId(post.id)}
                    className={`flex items-start gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg duration-150 transition-all ${
                      post.id === activePostId ? 'bg-[#eaf4f8]/50 ring-2 ring-black font-semibold' : ''
                    }`}
                  >
                    <span className="font-serif italic font-[900] text-3xl leading-none text-gray-400 select-none">
                      0{idx + 1}
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-sans hover:underline leading-snug line-clamp-2">
                        {post.title}
                      </p>
                      <span 
                        className="text-[9px] font-mono font-bold leading-none mt-1.5 inline-block uppercase tracking-wider"
                        style={{ color: config.primaryColor }}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CORE TAXONOMIES LIST */}
            <div className={`p-4 rounded-xl border-2 border-black flex flex-col gap-3 ${
              isDarkMode ? 'bg-[#1b2225]' : 'bg-white'
            }`} style={{ boxShadow: '4px 4px 0px 0px #161d1f' }}>
              <h4 className="font-mono text-[10px] font-bold tracking-widest text-[#6c797f] uppercase block border-b-2 border-gray-400/20 pb-2">
                CATEGORIES
              </h4>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3.5 py-1.5 bg-[#00d2ff]/20 text-[#00677f] border border-[#00d2ff] rounded-full font-mono text-[10px] font-bold tracking-wide cursor-pointer hover:bg-[#00d2ff]/35 transition-colors uppercase rotate-[1deg]">
                  Tech
                </span>
                <span className="px-3.5 py-1.5 bg-[#a90097]/10 text-[#a90097] border border-[#a90097] rounded-full font-mono text-[10px] font-bold tracking-wide cursor-pointer hover:bg-[#a90097]/20 transition-colors uppercase -rotate-[2deg]">
                  Culture
                </span>
                <span className="px-3.5 py-1.5 bg-[#506600]/10 text-[#506600] border border-[#506600] rounded-full font-mono text-[10px] font-bold tracking-wide cursor-pointer hover:bg-[#506600]/20 transition-colors uppercase rotate-[3deg]">
                  Finance
                </span>
                <span className="px-3.5 py-1.5 bg-gray-100 text-gray-700 border border-gray-400 rounded-full font-mono text-[10px] font-bold tracking-wide cursor-pointer hover:bg-gray-200 transition-colors uppercase">
                  Design
                </span>
                <span className="px-3.5 py-1.5 bg-gray-100 text-gray-700 border border-gray-400 rounded-full font-mono text-[10px] font-bold tracking-wide cursor-pointer hover:bg-gray-200 transition-colors uppercase rotate-1">
                  Crypto
                </span>
              </div>
            </div>

            {/* Quick Informational Widget */}
            <div className="p-4 bg-rose-50 border-2 border-[#161d1f] rounded-xl flex items-start gap-4 rotate-[-1.5deg]" style={{ boxShadow: '4px 4px 0px 0px #ba1a1a' }}>
              <AlertCircle className="text-red-700 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h5 className="font-sans font-bold text-xs text-red-900 leading-snug">Demo Navigation</h5>
                <p className="font-sans text-[11px] text-red-800 leading-normal mt-1">
                  You are currently exploring the live preview. Click the <strong>CMS Admin Panel</strong> button at the top to configure content or update fonts/colors immediately.
                </p>
              </div>
            </div>

          </aside>

        </div>
      ) : (
        /* EXPLORE HUB PANEL: Screenshot 2 layout */
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-8">
          
          {/* A. Hero/Header Banner (dynamic high contrast slide gallery) */}
          {(() => {
            const activeSlide = slides[currentSlideIdx] || slides[0] || {
              id: 'slide-fallback',
              badge: 'Trending Now',
              headline: 'REDEFINING THE DIGITAL NARRATIVE.',
              highlightWord: 'DIGITAL',
              description: 'Explore the intersection of high-velocity Gen-Z aesthetics and deep-dive technical analysis.',
              buttonText: 'Start Reading',
              gradientFrom: '#00b4b2',
              gradientVia: '#05c484',
              gradientTo: '#7dd749',
              linkPostId: '1'
            };

            return (
              <div 
                className="w-full relative p-8 md:p-12 text-white border-4 border-black rounded-3xl flex flex-col gap-6 select-none overflow-hidden"
                style={{ 
                  boxShadow: '8px 8px 0px 0px #161d1f',
                  background: `linear-gradient(to right, ${activeSlide.gradientFrom || '#00b4b2'}, ${activeSlide.gradientVia || '#05c484'}, ${activeSlide.gradientTo || '#7dd749'})`
                }}
              >
                {/* Ambient Background Grid Pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-start gap-4 max-w-3xl">
                  <span className="px-3.5 py-1.5 bg-white text-black border-2 border-black font-semibold font-mono text-[9px] md:text-[10px] uppercase rounded-lg tracking-wider">
                    {activeSlide.badge}
                  </span>
                  
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] tracking-tight text-white leading-[1.05] uppercase block">
                    {(() => {
                      const headline = activeSlide.headline || "REDEFINING THE DIGITAL NARRATIVE.";
                      const hWord = activeSlide.highlightWord;
                      if (!hWord || !headline.toUpperCase().includes(hWord.toUpperCase())) {
                        return headline;
                      }
                      const parts = headline.toUpperCase().split(hWord.toUpperCase());
                      return (
                        <>
                          {parts[0]}
                          <span className="inline-block bg-[#161d1f] text-white px-4 py-1 border-2 border-white mx-1 my-1 rotate-[-1deg]">
                            {hWord.toUpperCase()}
                          </span>
                          {parts[1]}
                        </>
                      );
                    })()}
                  </h2>
                  
                  <p className="text-sm md:text-md text-white/90 font-medium max-w-xl leading-relaxed mt-2">
                    {activeSlide.description}
                  </p>

                  <button 
                    onClick={() => {
                      setActivePostId(activeSlide.linkPostId || '1'); // Go to bound slide post ID
                      setReaderTab('feed');
                    }}
                    className="mt-4 px-6 py-3.5 bg-[#00d2ff] hover:bg-cyan-300 text-black border-2 border-black rounded-xl cursor-pointer duration-150 transition-all font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(22,29,31,1)] hover:shadow-none active:translate-y-1"
                  >
                    <span>{activeSlide.buttonText}</span>
                    <ChevronRight size={14} className="stroke-[3]" />
                  </button>
                </div>

                {/* Left and Right Carousel Control Swappers */}
                {slides.length > 1 && (
                  <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlideIdx(prev => (prev - 1 + slides.length) % slides.length);
                      }}
                      className="p-1.5 px-3 bg-white text-black border-2 border-black rounded-xl cursor-pointer font-bold hover:bg-stone-100 transition-colors shadow-[2px_2px_0px_0px_#000]"
                      title="Previous Slide"
                    >
                      <ChevronLeft size={14} strokeWidth={3} className="inline-block" />
                    </button>
                    <span className="font-mono text-[10px] text-white font-extrabold px-3 py-1.5 bg-black rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                      {currentSlideIdx + 1} / {slides.length}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlideIdx(prev => (prev + 1) % slides.length);
                      }}
                      className="p-1.5 px-3 bg-white text-black border-2 border-black rounded-xl cursor-pointer font-bold hover:bg-stone-100 transition-colors shadow-[2px_2px_0px_0px_#000]"
                      title="Next Slide"
                    >
                      <ChevronRight size={14} strokeWidth={3} className="inline-block" />
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* B. Controls / Search Controls Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-black/10 pb-4 mt-4">
            
            {/* Switch state slider */}
            <div className="flex flex-col gap-3">
              <div className="flex border-3 border-black rounded-full p-1 bg-white shadow-[3px_3px_0px_0px_#161d1f] w-fit">
                <button 
                  onClick={() => setFilterTab('for_you')} 
                  className={`px-5 py-2 rounded-full font-mono text-[11px] uppercase tracking-wide cursor-pointer duration-150 ${filterTab === 'for_you' ? 'bg-[#161d1f] text-white font-[900]' : 'text-gray-500 hover:text-black font-semibold'}`}
                >
                  For You
                </button>
                <button 
                  onClick={() => setFilterTab('audience')} 
                  className={`px-5 py-2 rounded-full font-mono text-[11px] uppercase tracking-wide cursor-pointer duration-150 ${filterTab === 'audience' ? 'bg-[#161d1f] text-white font-[900]' : 'text-gray-500 hover:text-black font-semibold'}`}
                >
                  Audience
                </button>
              </div>
            </div>

            {/* Right Search Input Box */}
            <div className="w-full md:w-auto flex items-center gap-3">
              <div className="w-full md:w-72 flex items-center bg-white border-3 border-black rounded-full px-4 py-2 shadow-[3px_3px_0px_0px_#161d1f] group focus-within:ring-2 focus-within:ring-[#00b4b2]">
                <input 
                  type="text"
                  placeholder="Search insights..."
                  value={readerSearchTerm}
                  onChange={(e) => setReaderSearchTerm(e.target.value)}
                  className="bg-transparent text-xs font-mono text-[#161d1f] placeholder:text-gray-400 w-full outline-none"
                />
                <Search size={16} className="text-[#161d1f] flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Category Pills subrow */}
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat, idx) => {
              const isActive = selectedCategory === cat;
              // Make colorful rotated active tabs matching layout
              const rotateVal = idx % 3 === 0 ? 'rotate-[1deg]' : idx % 3 === 1 ? '-rotate-[1.5deg]' : 'rotate-[0.5deg]';
              
              let activeColor = 'bg-[#00d2ff]';
              if (cat === 'CULTURE') activeColor = 'bg-[#a90097]/10 text-[#a90097] border-[#a90097]';
              else if (cat === 'FINANCE') activeColor = 'bg-[#506600]/10 text-[#506600] border-[#506600]';
              else if (cat === 'TECH') activeColor = 'bg-[#00d2ff]/10 text-[#00677f] border-[#00d2ff]';

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 font-mono text-[10px] font-bold tracking-wider rounded-xl border-2 uppercase duration-150 transition-all cursor-pointer ${
                    isActive 
                      ? `${cat === 'ALL' ? 'bg-black text-white border-black' : activeColor + ' border-black scale-105'} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]` 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black hover:bg-stone-50'
                  } ${rotateVal}`}
                >
                  {cat === 'ALL' ? '🚨 All' : cat}
                </button>
              );
            })}
          </div>

          {/* C. The Bento Grid of Articles & Sponsored slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 items-stretch">
            
            {/* CARD 1: Post 2 ("The Algorithmic Mirror: How AI Shapes Our Identity") */}
            {(() => {
              const p2 = posts.find(p => p.id === '2') || posts[1] || posts[0];
              const matchesFilter = selectedCategory === 'ALL' || selectedCategory === 'TECH' || (selectedCategory === 'AI & FUTURE' && p2.tags.includes('AI'));
              const matchesSearch = !readerSearchTerm.trim() || p2.title.toLowerCase().includes(readerSearchTerm.toLowerCase());
              if (!matchesFilter || !matchesSearch) return null;

              return (
                <div 
                  onClick={() => {
                    setActivePostId(p2.id);
                    setReaderTab('feed');
                  }}
                  className={`bg-white hover:scale-[1.02] duration-200 transition-all border-4 border-black rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer shadow-[5px_5px_0px_0px_#00d2ff] relative group`}
                >
                  <div className="h-48 overflow-hidden bg-slate-900 border-b-3 border-black relative">
                    <img 
                      src={p2.image} 
                      alt={p2.title} 
                      className="w-full h-full object-cover group-hover:scale-105 duration-300" 
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-black text-cyan-400 border border-black font-mono text-[8px] font-extrabold uppercase rounded-md">
                      Tech
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-center text-gray-500 font-mono text-[9px] font-bold uppercase mb-2">
                        <span>BY {p2.author.toUpperCase()}</span>
                        <span>{p2.readTime}</span>
                      </div>
                      <h3 className="text-xl font-[900] tracking-tight group-hover:underline text-balance leading-snug">
                        {p2.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 mt-2 font-medium leading-relaxed">
                        {p2.content.split('\n\n')[0]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CARD 2: Post 3 ("Retro-Tech: Why Gen-Z is Buying Wired Headphones Again") */}
            {(() => {
              const p3 = posts.find(p => p.id === '3') || posts[2] || posts[0];
              const matchesFilter = selectedCategory === 'ALL' || selectedCategory === 'CULTURE';
              const matchesSearch = !readerSearchTerm.trim() || p3.title.toLowerCase().includes(readerSearchTerm.toLowerCase());
              if (!matchesFilter || !matchesSearch) return null;

              return (
                <div 
                  onClick={() => {
                    setActivePostId(p3.id);
                    setReaderTab('feed');
                  }}
                  className={`bg-white hover:scale-[1.02] duration-200 transition-all border-4 border-black rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer shadow-[5px_5px_0px_0px_#a90097] relative group`}
                >
                  <div className="h-48 overflow-hidden bg-slate-900 border-b-3 border-black relative">
                    <img 
                      src={p3.image} 
                      alt={p3.title} 
                      className="w-full h-full object-cover group-hover:scale-105 duration-300" 
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-black text-pink-400 border border-black font-mono text-[8px] font-extrabold uppercase rounded-md">
                      Culture
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-center text-gray-500 font-mono text-[9px] font-bold uppercase mb-2">
                        <span>BY {p3.author.toUpperCase()}</span>
                        <span>{p3.readTime}</span>
                      </div>
                      <h3 className="text-xl font-[900] tracking-tight group-hover:underline text-balance leading-snug">
                        {p3.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 mt-2 font-medium leading-relaxed">
                        {p3.content.split('\n\n')[0]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CARD 3: Custom Sponsored slot - "HyperSpeed Cloud" */}
            <div className="border-4 border-dashed border-slate-300 bg-[#edf3f6]/50 p-6 rounded-3xl flex flex-col justify-between items-start relative select-none">
              
              {/* Circular plus emblem in top right */}
              <button 
                onClick={onEnterAdmin}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#00d2ff] border-2 border-black flex items-center justify-center font-extrabold text-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0.5 active:translate-y-1 transition-all"
              >
                +
              </button>

              <div className="w-full flex flex-col items-center text-center py-6">
                <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-4">
                  SPONSORED
                </span>

                {/* Zap Icon circular box */}
                <div 
                  className="w-16 h-16 rounded-full border-3 border-black bg-white flex items-center justify-center mb-4 text-[#00b2be]"
                  style={{ boxShadow: '3px 3px 0px 0px #161d1f' }}
                >
                  <Zap size={28} className="animate-pulse" />
                </div>

                <h4 className="text-lg md:text-xl font-[900] tracking-tight text-[#161d1f]">
                  HyperSpeed Cloud
                </h4>
                <p className="text-xs text-slate-500 text-center max-w-xs mt-2 leading-relaxed">
                  Deploy your next dApp in 15 seconds. High throughput, low latency.
                </p>
              </div>

              <button 
                onClick={onEnterAdmin}
                className="w-full py-2.5 bg-black hover:bg-slate-800 text-white font-mono text-[10px] tracking-wide font-extrabold text-center rounded-lg uppercase border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,180,178,1)] active:translate-y-0.5"
              >
                Learn More
              </button>
            </div>

            {/* CARD 4: Post 4 ("The Invisible Economy of Memecoins") - Spans two columns on larger viewports */}
            {(() => {
              const p4 = posts.find(p => p.id === '4') || posts[3] || posts[0];
              const matchesFilter = selectedCategory === 'ALL' || selectedCategory === 'FINANCE';
              const matchesSearch = !readerSearchTerm.trim() || p4.title.toLowerCase().includes(readerSearchTerm.toLowerCase());
              if (!matchesFilter || !matchesSearch) return null;

              return (
                <div 
                  onClick={() => {
                    setActivePostId(p4.id);
                    setReaderTab('feed');
                  }}
                  className={`bg-white hover:scale-[1.01] duration-200 transition-all border-4 border-black rounded-3xl overflow-hidden flex flex-col lg:flex-row lg:col-span-2 cursor-pointer shadow-[6px_6px_0px_0px_#506600] group`}
                >
                  {/* Left Column Gemstone Image */}
                  <div className="lg:w-[45%] h-56 lg:h-auto bg-stone-950 border-b-3 lg:border-b-0 lg:border-r-3 border-black overflow-hidden relative">
                    <img 
                      src={p4.image} 
                      alt={p4.title} 
                      className="w-full h-full object-cover group-hover:scale-105 duration-500 filter brightness-110" 
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-black text-lime-400 border border-black font-mono text-[8px] font-extrabold uppercase rounded-lg">
                      Finance
                    </span>
                  </div>
                  
                  {/* Right Column text */}
                  <div className="lg:w-[55%] p-6 flex flex-col justify-between gap-6">
                    <div>
                      <div className="flex justify-between items-center text-gray-500 font-mono text-[9px] font-bold uppercase mb-2">
                        <span>BY {p4.author.toUpperCase()}</span>
                        <span>{p4.readTime}</span>
                      </div>
                      <h3 className="text-2xl font-[900] tracking-tight group-hover:underline leading-snug">
                        {p4.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-4 mt-2 font-medium leading-relaxed">
                        {p4.content.split('\n\n')[0]}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 border-t border-black/10 pt-4">
                      <div className="w-8 h-8 rounded-full border border-black overflow-hidden bg-emerald-100 flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" 
                          alt="Marcus Sterling" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="font-mono text-[10px] font-extrabold text-[#161d1f]">
                        {p4.author}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CARD 5: Post 5 ("Designing for the Dopamine Loop") */}
            {(() => {
              const p5 = posts.find(p => p.id === '5') || posts[4] || posts[0];
              const matchesFilter = selectedCategory === 'ALL' || selectedCategory === 'TECH' || (selectedCategory === 'AI & FUTURE' && p5.tags.includes('AI'));
              const matchesSearch = !readerSearchTerm.trim() || p5.title.toLowerCase().includes(readerSearchTerm.toLowerCase());
              if (!matchesFilter || !matchesSearch) return null;

              return (
                <div 
                  onClick={() => {
                    setActivePostId(p5.id);
                    setReaderTab('feed');
                  }}
                  className={`bg-white hover:scale-[1.02] duration-200 transition-all border-4 border-black rounded-3xl overflow-hidden flex flex-col cursor-pointer shadow-[5px_5px_0px_0px_#161d1f] group`}
                >
                  <div className="h-44 bg-[#0f1416] border-b-3 border-black relative overflow-hidden flex items-center justify-center p-4">
                    <img 
                      src={p5.image} 
                      alt={p5.title} 
                      className="w-[90%] h-full object-cover rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.5)] border border-stone-800 rotate-[-2deg] group-hover:rotate-0 duration-200" 
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-black text-amber-400 border border-black font-mono text-[8px] font-extrabold uppercase rounded-lg">
                      Tech & UX
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-center text-gray-500 font-mono text-[9px] font-bold uppercase mb-2">
                        <span>{p5.author.toUpperCase()}</span>
                        <span>{p5.readTime}</span>
                      </div>
                      <h3 className="text-xl font-[900] tracking-tight group-hover:underline text-balance leading-snug">
                        {p5.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 mt-2 font-medium leading-relaxed">
                        {p5.content.split('\n\n')[0]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CARD 6: Elizion DAO Community Card */}
            <div className="border-4 border-dotted border-gray-400 bg-white p-6 rounded-3xl flex flex-col justify-between items-start select-none shadow-[2px_2px_0px_0px_rgba(33,150,243,0.1)]">
              <div className="w-full flex flex-col items-center text-center py-4">
                <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-4">
                  COMMUNITY
                </span>

                {/* Purple round badge containing group people icon */}
                <div 
                  className="w-14 h-14 rounded-full border-3 border-black bg-purple-100 text-purple-700 flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Users size={24} />
                </div>

                <h4 className="text-lg font-[900] tracking-tight text-[#161d1f]">
                  Elizion DAO
                </h4>
                <p className="text-xs text-slate-500 text-center max-w-xs mt-2 leading-relaxed">
                  Join the core contributors and vote on future topics. Power to the readers.
                </p>
              </div>

              <button 
                onClick={onEnterAdmin}
                className="w-full py-2.5 bg-[#161d1f] hover:bg-slate-800 text-white font-mono text-[10px] tracking-wide font-extrabold text-center rounded-lg uppercase border-2 border-black cursor-pointer shadow-[3px_3px_0px_0px_rgba(156,39,176,1)] active:translate-y-0.5"
              >
                Join Discord
              </button>
            </div>

            {/* CARD 7: Post 6 ("The Sound of the Future: AI Vocals") */}
            {(() => {
              const p6 = posts.find(p => p.id === '6') || posts[5] || posts[0];
              const matchesFilter = selectedCategory === 'ALL' || selectedCategory === 'CULTURE' || (selectedCategory === 'AI & FUTURE' && p6.tags.includes('AI'));
              const matchesSearch = !readerSearchTerm.trim() || p6.title.toLowerCase().includes(readerSearchTerm.toLowerCase());
              if (!matchesFilter || !matchesSearch) return null;

              return (
                <div 
                  onClick={() => {
                    setActivePostId(p6.id);
                    setReaderTab('feed');
                  }}
                  className={`bg-white hover:scale-[1.02] duration-200 transition-all border-4 border-black rounded-3xl overflow-hidden flex flex-col cursor-pointer shadow-[5px_5px_0px_0px_#a90097] group`}
                >
                  <div className="h-44 bg-slate-955 border-b-3 border-black relative overflow-hidden">
                    <img 
                      src={p6.image} 
                      alt={p6.title} 
                      className="w-full h-full object-cover group-hover:scale-110 duration-500" 
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-black text-[#a90097] border border-black font-mono text-[8px] font-extrabold uppercase rounded-lg">
                      AI & Culture
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-center text-gray-500 font-mono text-[9px] font-bold uppercase mb-2">
                        <span>BY {p6.author.toUpperCase()}</span>
                        <span>{p6.readTime}</span>
                      </div>
                      <h3 className="text-xl font-[900] tracking-tight group-hover:underline text-balance leading-snug">
                        {p6.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 mt-2 font-medium leading-relaxed">
                        {p6.content.split('\n\n')[0]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ADDITIONAL USER CREATED POSTS MAP */}
            {posts.filter(p => !['1', '2', '3', '4', '5', '6'].includes(p.id) && p.status === 'Published').map((userPost) => {
              const matchesFilter = selectedCategory === 'ALL' || userPost.category.toUpperCase() === selectedCategory;
              const matchesSearch = !readerSearchTerm.trim() || userPost.title.toLowerCase().includes(readerSearchTerm.toLowerCase());
              if (!matchesFilter || !matchesSearch) return null;

              return (
                <div 
                  key={userPost.id}
                  onClick={() => {
                    setActivePostId(userPost.id);
                    setReaderTab('feed');
                  }}
                  className={`bg-white hover:scale-[1.02] duration-200 transition-all border-4 border-black rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer shadow-[5px_5px_0px_0px_#161d1f] relative group`}
                >
                  <div className="h-48 overflow-hidden bg-slate-100 border-b-3 border-black relative">
                    <img 
                      src={userPost.image} 
                      alt={userPost.title} 
                      className="w-full h-full object-cover group-hover:scale-105 duration-300" 
                    />
                    <span 
                      className="absolute top-3 left-3 px-3 py-1 text-white border border-black font-mono text-[8px] font-extrabold uppercase rounded-md"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      {userPost.category}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-center text-gray-500 font-mono text-[9px] font-bold uppercase mb-2">
                        <span>BY {userPost.author.toUpperCase()}</span>
                        <span>{userPost.readTime}</span>
                      </div>
                      <h3 className="text-xl font-[900] tracking-tight group-hover:underline leading-snug">
                        {userPost.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 mt-2 font-medium leading-relaxed">
                        {userPost.content.split('\n\n')[0]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          {/* D. Additional interactive metrics banner or subtle stats inside Explore */}
          <div className="mt-8 p-6 bg-amber-100 border-4 border-black rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_#161d1f]">
            <div className="flex items-center gap-3">
              <Flame size={28} className="text-[#a90097]" />
              <div>
                <h5 className="font-sans font-[900] text-sm text-[#161d1f]">Become a Resident Writer</h5>
                <p className="text-xs text-gray-650 mt-1">Want to contribute essays about the future of digital art? Access the CMS Admin Panel to publish.</p>
              </div>
            </div>
            <button 
              onClick={onEnterAdmin}
              className="px-5 py-2.5 bg-[#161d1f] hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase rounded-lg border-2 border-black tracking-wide cursor-pointer flex-shrink-0"
            >
              Enter CMS
            </button>
          </div>

        </div>
      )}

      {/* Reader Footer details */}
      <footer className="mt-16 py-8 px-6 border-t-4 border-[#161d1f] bg-[#eef5f8] select-none text-center">
        <p className="font-mono text-xs text-gray-500">
          Elizion &copy; 2026 &bull; Designed under Neo-Brutalist guidelines. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
