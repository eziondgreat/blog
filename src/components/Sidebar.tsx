/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  LineChart, 
  FileText, 
  Users, 
  Settings, 
  Plus, 
  LogOut, 
  Eye, 
  Radio 
} from 'lucide-react';
import { AdminTab, SystemConfig } from '../types';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  onLogout: () => void;
  onCreatePost: () => void;
  config: SystemConfig;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onExitAdmin, 
  onLogout,
  onCreatePost,
  config 
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: LineChart },
    { id: 'content' as AdminTab, label: 'Content', icon: FileText },
    { id: 'audience' as AdminTab, label: 'Audience', icon: Users },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 hidden xl:flex flex-col bg-[#eaf4f8] border-r-4 border-[#161d1f] py-8 px-4 gap-6 z-40 select-none">
      {/* Brand Header */}
      <div className="px-3 mb-4">
        <h1 
          className="text-3xl font-[900] tracking-tighter transition-all"
          style={{ color: config.secondaryColor }}
        >
          ELIZION
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-3.5 w-3.5">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: config.primaryColor }}
            ></span>
            <span 
              className="relative inline-flex rounded-full h-3.5 w-3.5 border border-black"
              style={{ backgroundColor: config.primaryColor }}
            ></span>
          </span>
          <p className="font-mono text-xs text-[#3c494e] font-semibold tracking-wide uppercase">
            SUPER ADMIN LIVE
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2.5">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              id={`nav-link-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border-2 font-mono text-sm uppercase transition-all duration-250 cursor-pointer ${
                isActive
                  ? 'bg-white font-bold rotate-[-1.5deg] translate-x-1.5'
                  : 'text-[#3c494e] border-transparent hover:bg-[#dde3e7] hover:text-[#161d1f]'
              }`}
              style={{
                borderColor: isActive ? '#101010' : 'transparent',
                boxShadow: isActive ? '4px 4px 0px 0px #161d1f' : 'none',
              }}
            >
              <Icon 
                size={18} 
                strokeWidth={ isActive ? 2.5 : 2 } 
                style={{ color: isActive ? config.primaryColor : '#4d5c64' }} 
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Action Button */}
      <div className="mt-8 px-2 flex flex-col gap-3">
        <button
          id="btn-sidebar-create-post"
          onClick={onCreatePost}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-amber-400 text-black border-2 border-black rounded-xl font-mono text-xs tracking-wider uppercase font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none duration-150 active:scale-95 transition-all text-center"
          style={{
            backgroundColor: config.primaryColor === '#00677f' ? '#00d2ff' : config.primaryColor,
            boxShadow: '4px 4px 0px 0px #161d1f',
          }}
        >
          <Plus size={16} strokeWidth={3} />
          Create Post
        </button>

        <button
          id="btn-sidebar-view-blog"
          onClick={onExitAdmin}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-white text-black border-2 border-black rounded-xl font-mono text-xs tracking-wider uppercase font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none duration-150 active:scale-95 transition-all text-center shadow-[4px_4px_0px_0px_#161d1f]"
        >
          <Eye size={16} />
          View Live Feed
        </button>
      </div>

      {/* Footer Info / Admin Status */}
      <div className="mt-auto px-3 border-t-2 border-[#161d1f]/10 pt-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full border-2 border-[#161d1f] flex items-center justify-center font-mono font-bold text-sm bg-white"
            style={{ 
              backgroundColor: config.secondaryColor + '15',
              color: config.secondaryColor
            }}
          >
            AD
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-xs leading-none text-[#161d1f] font-sans">Active Terminal</p>
            <p className="font-mono text-[9px] text-[#6c797f] leading-none mt-1 truncate">CYAN_ACTIVE_SEC</p>
          </div>
        </div>

        <button
          id="btn-sidebar-logout"
          onClick={onLogout}
          className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-red-600 hover:text-red-700 transition-colors w-full py-2 hover:bg-red-50 px-2 rounded-lg cursor-pointer"
        >
          <LogOut size={14} />
          Session Logout
        </button>
      </div>
    </nav>
  );
}
