/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Bell, Menu, ShieldAlert, Award, FileText } from 'lucide-react';
import { AdminTab, SystemConfig } from '../types';
import { useState } from 'react';

interface HeaderProps {
  activeTab: AdminTab;
  config: SystemConfig;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onMenuToggle?: () => void;
}

export default function Header({
  activeTab,
  config,
  searchTerm,
  setSearchTerm,
  onMenuToggle,
}: HeaderProps) {
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic Page titles
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'System Pulse';
      case 'analytics':
        return 'Growth Telemetry';
      case 'content':
        return 'Draft Workspace';
      case 'audience':
        return 'Audience Genome';
      case 'settings':
        return 'System Config';
      default:
        return 'ELIZION Terminal';
    }
  };

  const getPageLabel = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'ADMIN DASHBOARD';
      case 'analytics':
        return 'VITAL ANALYTICS';
      case 'content':
        return 'CONTENT EDITOR';
      case 'audience':
        return 'AUDIENCE INTEL';
      case 'settings':
        return 'SYSTEM OPTIONS';
      default:
        return 'TERMINAL';
    }
  };

  const mockNotifications = [
    { id: 1, title: 'Growth Peak', text: '"The Industry Pro" traffic is up 14.2% today.', type: 'growth' },
    { id: 2, title: 'Ad Click Alert', text: 'Daily revenue estimator reached 70% threshold.', type: 'ad' },
    { id: 3, title: 'System Security', text: 'API security tokens have rotated successfully.', type: 'security' },
  ];

  return (
    <header className="sticky top-0 z-30 flex justify-between items-center px-6 py-4 w-full bg-[#f4fafe]/90 backdrop-blur-md border-b-4 border-[#161d1f] lg:pl-6 xl:pl-[280px] select-none">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="xl:hidden p-2 bg-white border-2 border-[#161d1f] rounded-lg shadow-[2px_2px_0px_0px_rgba(22,29,31,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none duration-100 transition-all cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Dynamic Big Page Titles */}
        <div className="hidden md:block">
          <span 
            className="text-[10px] font-mono tracking-widest uppercase font-black"
            style={{ color: config.secondaryColor }}
          >
            {getPageLabel()}
          </span>
          <h2 className="text-2xl font-[900] tracking-tight text-[#161d1f] -mt-0.5">
            {getPageTitle()}
          </h2>
        </div>

        {/* Global Search Bar (Only shown for certain dashboard tabs) */}
        {['dashboard', 'content', 'analytics'].includes(activeTab) && (
          <div className="relative w-full max-w-xs ml-4 hidden sm:block">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6c797f]">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#e8eff2] border-2 border-[#161d1f]/40 rounded-full py-2 pl-10 pr-4 font-mono text-xs focus:outline-none focus:border-black focus:border-2 transition-all placeholder:text-[#6c797f]/60"
              placeholder={`Search ${activeTab === 'content' ? 'assets...' : 'posts...'}`}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon (Neo-Brutalist Bell) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowNotificationBadge(false);
            }}
            className="p-2.5 bg-white border-2 border-[#161d1f] rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer shadow-[3px_3px_0px_0px_rgba(22,29,31,1)] hover:shadow-none duration-150 active:scale-95 transition-all outline-none"
          >
            <Bell size={18} className="text-[#161d1f]" />
            {showNotificationBadge && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {/* Quick Notification Drawer dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border-3 border-black p-4 rounded-xl shadow-[6px_6px_0px_0px_rgba(22,29,31,1)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex justify-between items-center pb-2 border-b-2 border-black/10">
                <span className="font-mono text-xs font-bold uppercase text-black">Active Alerts</span>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="font-mono text-[10px] uppercase text-gray-400 hover:text-black"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="p-2 border border-black/10 rounded-lg hover:bg-[#f4fafe]">
                    <p className="font-mono text-xs font-bold leading-tight" style={{ color: config.primaryColor }}>{notif.title}</p>
                    <p className="font-sans text-[11px] text-gray-500 leading-tight mt-0.5">{notif.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger (Styled precisely like references) */}
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-full border-2 border-[#161d1f] bg-sky-100 overflow-hidden ring-4 ring-offset-2 hover:ring-2 transition-all"
            style={{ 
              borderColor: '#161d1f',
              boxShadow: '2px 2px 0px 0px #161d1f',
              backgroundColor: config.primaryColor + '10'
            }}
          >
            <img
              alt="Admin Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsYpAX6TrmyxGhjmS3K_8johEhWEPIcjJQrbI2Ypf3RVpsm7s4DOSHuJBDorjXNnfwRJ2zOpvR3abbBDx5bscVjQEors2UbSrcznttm6hFPeajYnM731AjQmawIP8ZyAEAMwNn8_LRjOr3xMRFVKxDDPl62hlSALn_tb4BLOT8iNPKM1EuXALh9dc4IB_Je-dLYCaaAhx6HBHDRRJOUwKqXaW3AANj0URz-tlL-y-g3g5LGiuG2495PNjUmWhuJSPIodJCVKLdGVg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden lg:block">
            <p className="font-sans font-bold text-xs leading-none text-black">Elizion Admin</p>
            <p className="text-[9px] font-mono text-[#6c797f] leading-none mt-1">SUPER_USER_OK</p>
          </div>
        </div>
      </div>
    </header>
  );
}
