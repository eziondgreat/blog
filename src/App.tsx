/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  X, 
  Menu, 
  LayoutDashboard, 
  LineChart, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Eye, 
  Radio,
  Award
} from 'lucide-react';
import { BlogPost, Comment, SystemConfig, AdminTab, HeroSlide } from './types';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ReaderView from './components/ReaderView';
import DashboardView from './components/DashboardView';
import AnalyticsView from './components/AnalyticsView';
import ContentView from './components/ContentView';
import AudienceView from './components/AudienceView';
import SettingsView from './components/SettingsView';
import AdminLogin from './components/AdminLogin';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'reader' | 'admin'>('reader');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return api.isAuthenticated();
  });

  const handleLogout = () => {
    api.logout();
    setIsAdminAuthenticated(false);
    setActiveScreen('reader');
  };

  // Global styled configuration variables
  const [config, setConfig] = useState<SystemConfig>({
    primaryColor: '#00677f',
    secondaryColor: '#a90097',
    tertiaryColor: '#506600',
    fontFamily: 'Inter',
    ads: {
      sidebarGlobal: true,
      inFeedUnits: true,
      midArticleInjector: true,
      publisherId: 'ca-pub-9876543210987654',
      googleAdSenseEnabled: false,
      sidebarAdSlot: '8877665544',
      inFeedAdSlot: '1122334455',
      midArticleAdSlot: '9988776655'
    },
    accessKey: 'ELIZION_SEC_F97BA2'
  });

  const handleUpdateConfig = async (newConfig: SystemConfig) => {
    try {
      const savedConfig = await api.saveConfig(newConfig);
      setConfig(savedConfig);
    } catch (e: any) {
      alert(`Failed to save configuration: ${e.message}`);
    }
  };

  // Slide state configuration
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  const handleSaveSlide = async (savedSlide: HeroSlide) => {
    try {
      const saved = await api.saveSlide(savedSlide);
      const exists = slides.some(s => s.id === saved.id);
      if (exists) {
        setSlides(slides.map(s => s.id === saved.id ? saved : s));
      } else {
        setSlides([saved, ...slides]);
      }
    } catch (e: any) {
      alert(`Failed to save slide: ${e.message}`);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (confirm('Are you absolutely sure you want to delete this Hero Slide?')) {
      try {
        await api.deleteSlide(id);
        setSlides(slides.filter(s => s.id !== id));
      } catch (e: any) {
        alert(`Failed to delete slide: ${e.message}`);
      }
    }
  };

  // Articles database state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activePostId, setActivePostId] = useState<string>('');

  // Fetch all initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const liveConfig = await api.getConfig();
        setConfig(liveConfig);
      } catch (e) {
        console.error("Failed to load config", e);
      }

      try {
        const liveSlides = await api.getSlides();
        setSlides(liveSlides);
      } catch (e) {
        console.error("Failed to load slides", e);
      }

      try {
        const livePosts = await api.getPosts();
        setPosts(livePosts);
        if (livePosts.length > 0) {
          // Keep active post or set to first
          if (!activePostId || !livePosts.some(p => p.id === activePostId)) {
            setActivePostId(livePosts[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to load posts", e);
      }
    };
    loadData();
  }, [isAdminAuthenticated]);

  // Handle post creations and updates
  const handleSavePost = async (savedPost: BlogPost) => {
    try {
      let saved: BlogPost;
      const isNew = !posts.some(p => p.id === savedPost.id);
      
      if (isNew) {
        // Strip temporary client ID/views for creation
        const { id, views, adClicks, ...createPayload } = savedPost as any;
        saved = await api.createPost(createPayload);
        setPosts([saved, ...posts]);
        setActivePostId(saved.id);
      } else {
        saved = await api.updatePost(savedPost.id, savedPost);
        setPosts(posts.map(p => p.id === saved.id ? saved : p));
      }
      setEditingPost(null);
      setActiveTab('dashboard');
    } catch (e: any) {
      alert(`Failed to save article: ${e.message}`);
    }
  };

  // Delete article completely
  const handleDeletePost = async (id: string) => {
    if (confirm('Are you absolutely sure you want to delete this article?')) {
      try {
        await api.deletePost(id);
        const remaining = posts.filter(p => p.id !== id);
        setPosts(remaining);
        if (activePostId === id) {
          if (remaining.length > 0) setActivePostId(remaining[0].id);
        }
      } catch (e: any) {
        alert(`Failed to delete article: ${e.message}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setActiveTab('dashboard');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setActiveTab('content');
  };

  // Render Admin Panels depending on activeTab selector
  const renderAdminPanel = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            posts={posts}
            onDeletePost={handleDeletePost}
            onEditPost={handleEditPost}
            setActiveTab={setActiveTab}
            config={config}
            searchTerm={searchTerm}
            slides={slides}
            onSaveSlide={handleSaveSlide}
            onDeleteSlide={handleDeleteSlide}
          />
        );
      case 'analytics':
        return <AnalyticsView config={config} />;
      case 'content':
        return (
          <ContentView
            config={config}
            posts={posts}
            editingPost={editingPost}
            onSavePost={handleSavePost}
            onCancelEdit={handleCancelEdit}
          />
        );
      case 'audience':
        return <AudienceView config={config} />;
      case 'settings':
        return (
          <SettingsView
            config={config}
            onUpdateConfig={handleUpdateConfig}
          />
        );
      default:
        return null;
    }
  };

  // Render main system: Reader vs Admin CMS Portal layout
  if (activeScreen === 'reader') {
    return (
      <ReaderView
        posts={posts}
        config={config}
        activePostId={activePostId}
        setActivePostId={setActivePostId}
        onEnterAdmin={() => setActiveScreen('admin')}
        slides={slides}
      />
    );
  }

  // If trying to access admin CMS but not authenticated, render login interface
  if (!isAdminAuthenticated) {
    return (
      <AdminLogin
        config={config}
        onLoginSuccess={(rememberMe) => {
          setIsAdminAuthenticated(true);
          if (rememberMe) {
            localStorage.setItem('elizion_admin_session', 'true');
          } else {
            sessionStorage.setItem('elizion_admin_session', 'true');
          }
        }}
        onCancel={() => {
          setActiveScreen('reader');
        }}
      />
    );
  }

  // Admin Side Menu List Items for mobile menus
  const adminMenuItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: LineChart },
    { id: 'content' as AdminTab, label: 'Content', icon: FileText },
    { id: 'audience' as AdminTab, label: 'Audience', icon: Users },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f4fafe] text-[#161d1f] font-sans flex flex-col xl:flex-row relative">
      
      {/* 1. Left Sidebar Navigation (Desktop viewports only) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExitAdmin={() => setActiveScreen('reader')}
        onLogout={handleLogout}
        onCreatePost={() => {
          setEditingPost(null);
          setActiveTab('content');
        }}
        config={config}
      />

      {/* 2. Main Admin Workspace containing right scroll columns */}
      <div className="flex-1 flex flex-col xl:pl-64 min-w-0 pb-16">
        
        {/* Top Header navbar with search */}
        <Header
          activeTab={activeTab}
          config={config}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        {/* Central interactive body viewport panel */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderAdminPanel()}
        </main>
      </div>

      {/* 3. Mobile Footer Switcher (Visible on small screens / touch displays) */}
      <nav id="mobile-nav-bar" className="xl:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#eaf4f8] border-t-3 border-[#161d1f] flex items-center justify-around z-40 px-2 select-none shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {adminMenuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${
                isActive ? 'text-black scale-110 font-bold' : 'text-[#6c797f] hover:text-black'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? config.primaryColor : 'currentColor' }} />
              <span className="font-mono text-[8px] uppercase tracking-wide mt-1">{item.label}</span>
            </button>
          );
        })}

          {/* Return Feed Link button in mobile footer bar */}
          <button
            onClick={() => setActiveScreen('reader')}
            className="flex flex-col items-center justify-center p-1.5 text-red-600 font-bold hover:scale-110"
          >
            <Eye size={18} />
            <span className="font-mono text-[8.5px] uppercase mt-1">Exit</span>
          </button>
      </nav>

      {/* 4. Slide-over Mobile Side Sheet Menu Drawer overlay */}
      {mobileMenuOpen && (
        <div id="backdrop-mobile-drawer" className="xl:hidden fixed inset-0 bg-black/50 z-50 flex items-start justify-start animate-fade-in duration-150">
          <div className="bg-[#eaf4f8] w-64 h-full p-6 border-r-3 border-black relative flex flex-col gap-6 animate-slide-in-left duration-200 shadow-[6px_0px_0px_0px_rgba(22,29,31,0.1)]">
            
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-white border border-gray-300 rounded-lg"
            >
              <X size={15} />
            </button>

            <div>
              <h1 className="text-2.5xl font-[900] tracking-tighter" style={{ color: config.secondaryColor }}>
                ELIZION
              </h1>
              <span className="font-mono text-[8.5px] uppercase font-bold text-gray-400">ADMIN TERMINAL</span>
            </div>

            <div className="flex flex-col gap-2.5 mt-4">
              {adminMenuItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border font-mono text-xs uppercase font-extrabold transition-all ${
                      isActive 
                        ? 'bg-white border-black text-black shadow-[3px_3px_0px_0px_#101010]' 
                        : 'border-transparent text-gray-500 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={14} style={{ color: isActive ? config.primaryColor : 'currentColor' }} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto border-t border-black/10 pt-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveScreen('reader');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-white border-2 border-black rounded-lg font-mono text-xs uppercase font-bold text-center duration-150 shadow-[3px_3px_0px_0px_#101010] active:translate-y-0.5"
              >
                View Live Feed
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full text-center font-mono text-[10px] uppercase text-red-600 hover:underline py-2 cursor-pointer"
              >
                Disconnect Session
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
