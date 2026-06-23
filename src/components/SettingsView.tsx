/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  ShieldAlert, 
  Layers, 
  Trash2, 
  Plus, 
  X, 
  Check, 
  Sparkles,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { SystemConfig } from '../types';

interface SettingsViewProps {
  config: SystemConfig;
  onUpdateConfig: (newConfig: SystemConfig) => void;
}

export default function SettingsView({ config, onUpdateConfig }: SettingsViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([
    { name: 'Tech', count: 4, desc: 'Digital innovation and engineering systems' },
    { name: 'Culture', count: 3, desc: 'Sociological trends and aesthetics scroll' },
    { name: 'Design', count: 2, desc: 'Expressive wireframes and neo-brutalist grids' },
    { name: 'Finance', count: 1, desc: 'Structural capital flows and micro-incentives' }
  ]);
  
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [secureToken, setSecureToken] = useState(config.accessKey);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Dynamic brand color changes
  const handleColorChange = (key: 'primaryColor' | 'secondaryColor' | 'tertiaryColor', value: string) => {
    onUpdateConfig({
      ...config,
      [key]: value
    });
  };

  // Font family update helper
  const handleFontChange = (font: 'Inter' | 'JetBrains Mono' | 'Literata') => {
    onUpdateConfig({
      ...config,
      fontFamily: font
    });
  };

  // Ad parameter updater helper
  const handleAdConfigChange = (key: keyof SystemConfig['ads'], value: any) => {
    onUpdateConfig({
      ...config,
      ads: {
        ...config.ads,
        [key]: value
      }
    });
  };

  // Security Key rotation simulation
  const rotateSecurityKey = () => {
    setTokenLoading(true);
    setTimeout(() => {
      const chars = 'abcdef0123456789';
      let rHash = '';
      for (let i = 0; i < 8; i++) {
        rHash += chars[Math.floor(Math.random() * chars.length)];
      }
      const newKey = `ELIZION_SEC_${rHash.toUpperCase()}`;
      setSecureToken(newKey);
      onUpdateConfig({
        ...config,
        accessKey: newKey
      });
      setTokenLoading(false);
    }, 1200);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setCategories([
      ...categories,
      {
        name: newCatName.trim(),
        count: 0,
        desc: newCatDesc.trim() || 'Custom taxonomy'
      }
    ]);
    setNewCatName('');
    setNewCatDesc('');
    setModalOpen(false);
  };

  const handleDeleteCategory = (name: string) => {
    setCategories(categories.filter(c => c.name !== name));
  };

  // Color preset options (Classic Neo-Brutalist palettes)
  const presets = [
    { label: 'Royal Teal', primary: '#00677f', secondary: '#a90097', tertiary: '#506600' },
    { label: 'Sunset Cyber', primary: '#f43f5e', secondary: '#10b981', tertiary: '#8b5cf6' },
    { label: 'Lego Classic', primary: '#ef4444', secondary: '#3b82f6', tertiary: '#eab308' },
  ];

  return (
    <div className="flex flex-col gap-8 select-none">
      
      {/* Dynamic style node to update live layout colors on preview */}
      <style>{`
        :root {
          --primary-color: ${config.primaryColor};
          --secondary-color: ${config.secondaryColor};
          --tertiary-color: ${config.tertiaryColor};
        }
      `}</style>

      {/* Primary Split View (Customizers on Left, Toggles/Actions on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Override configuration modules (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(22,29,31,1)]">
            <div className="border-b-2 border-black/10 pb-4 mb-5">
              <h4 className="text-xl font-[900] tracking-tight">System Brand Customization</h4>
              <p className="font-mono text-[9px] text-[#6c797f] uppercase">Dynamic triadic overrides color customization</p>
            </div>

            {/* Triadic Slot Colors selection */}
            <div className="flex flex-col gap-6">
              
              {/* Primary overriding */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-mono text-[10px] text-[#161d1f] font-black uppercase">Slot Primary Override Color</label>
                  <span className="font-mono text-[10px] font-bold text-gray-400">{config.primaryColor}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_#101010]" 
                    style={{ backgroundColor: config.primaryColor }}
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    className="hidden" 
                  />
                  {/* Dynamic Color Palette Slider pickers represented as clickable presets */}
                  <div className="flex flex-wrap gap-2.5">
                    {['#00677f', '#ef4444', '#f43f5e', '#a855f7', '#06b6d4', '#10b981'].map((c_hex) => (
                      <button
                        key={c_hex}
                        onClick={() => handleColorChange('primaryColor', c_hex)}
                        className={`w-7 h-7 rounded-full border-2 border-black cursor-pointer transition-transform hover:scale-115 ${
                          config.primaryColor === c_hex ? 'ring-2 ring-black ring-offset-2 scale-110' : ''
                        }`}
                        style={{ backgroundColor: c_hex }}
                      />
                    ))}
                    {/* Native Color Picker Trigger */}
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-7 h-7 rounded-xl border-2 border-black cursor-pointer overflow-hidden p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Overriding */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-mono text-[10px] text-[#161d1f] font-black uppercase">Slot Secondary Override Color</label>
                  <span className="font-mono text-[10px] font-bold text-gray-400">{config.secondaryColor}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_#101010]" 
                    style={{ backgroundColor: config.secondaryColor }}
                  />
                  <div className="flex flex-wrap gap-2.5">
                    {['#a90097', '#3b82f6', '#10b981', '#fb7185', '#0ea5e9', '#ec4899'].map((c_hex) => (
                      <button
                        key={c_hex}
                        onClick={() => handleColorChange('secondaryColor', c_hex)}
                        className={`w-7 h-7 rounded-full border-2 border-black cursor-pointer transition-transform hover:scale-115 ${
                          config.secondaryColor === c_hex ? 'ring-2 ring-black ring-offset-2 scale-110' : ''
                        }`}
                        style={{ backgroundColor: c_hex }}
                      />
                    ))}
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="w-7 h-7 rounded-xl border-2 border-black cursor-pointer overflow-hidden p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Tertiary Overriding */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-mono text-[10px] text-[#161d1f] font-black uppercase">Slot Tertiary Override Color</label>
                  <span className="font-mono text-[10px] font-bold text-gray-400">{config.tertiaryColor}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_#101010]" 
                    style={{ backgroundColor: config.tertiaryColor }}
                  />
                  <div className="flex flex-wrap gap-2.5">
                    {['#506600', '#eab308', '#8b5cf6', '#d946ef', '#14b8a6', '#f97316'].map((c_hex) => (
                      <button
                        key={c_hex}
                        onClick={() => handleColorChange('tertiaryColor', c_hex)}
                        className={`w-7 h-7 rounded-full border-2 border-black cursor-pointer transition-transform hover:scale-115 ${
                          config.tertiaryColor === c_hex ? 'ring-2 ring-black ring-offset-2 scale-110' : ''
                        }`}
                        style={{ backgroundColor: c_hex }}
                      />
                    ))}
                    <input
                      type="color"
                      value={config.tertiaryColor}
                      onChange={(e) => handleColorChange('tertiaryColor', e.target.value)}
                      className="w-7 h-7 rounded-xl border-2 border-black cursor-pointer overflow-hidden p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Presets Theme Selection */}
              <div className="border-t border-black/10 pt-4 mt-2">
                <span className="font-mono text-[8.5px] text-gray-400 font-black uppercase block mb-2.5">Quick Brand Presets</span>
                <div className="flex flex-wrap gap-3">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        onUpdateConfig({
                          ...config,
                          primaryColor: preset.primary,
                          secondaryColor: preset.secondary,
                          tertiaryColor: preset.tertiary
                        });
                      }}
                      className="px-3 py-2 bg-[#f4fafe] hover:bg-slate-100 border-2 border-black rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer duration-150 active:scale-95 transition-all text-[#101010]"
                    >
                      <span className="flex gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: preset.primary }} />
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: preset.secondary }} />
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: preset.tertiary }} />
                      </span>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family Selector config */}
              <div className="border-t border-black/10 pt-4">
                <label className="font-mono text-[10px] text-[#161d1f] font-black uppercase block mb-2.5">TYPOGRAPHY OVERRIDE FAMILY</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { font: 'Inter' as const, d_name: 'Inter Sans (Aesthetic UI)' },
                    { font: 'JetBrains Mono' as const, d_name: 'Fira Code (Brutalist)' },
                    { font: 'Literata' as const, d_name: 'Literata (Editorial Serif)' }
                  ].map((family) => (
                    <button
                      key={family.font}
                      onClick={() => handleFontChange(family.font)}
                      className={`p-3 border-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                        config.fontFamily === family.font
                          ? 'bg-neutral-900 text-white border-black font-extrabold shadow-[2px_2px_0px_0px_#00d2ff]'
                          : 'bg-transparent text-gray-500 border-stone-200 hover:border-black'
                      }`}
                    >
                      <h6 className="font-sans text-xs font-black">{family.font}</h6>
                      <p className="font-mono text-[8.5px] leading-tight text-gray-400 mt-1">{family.d_name}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Checkboxes & Rotated Tokens (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Ad preference & AdSense management details */}
          <div className="bg-white p-5 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-5">
            <h5 className="font-mono text-[10px] font-bold tracking-widest text-[#6c797f] uppercase block border-b-2 border-gray-400/10 pb-2 flex justify-between items-center">
              <span>💰 GOOGLE ADSENSE &amp; PLACEMENTS</span>
              <span className="bg-amber-400 text-black text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-black">AdSense Console</span>
            </h5>

            {/* A. MASTERSWITCH FOR GOOGLE ADSENSE CODE INJECTION */}
            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-500/10 to-transparent border-2 border-dashed border-amber-400 rounded-xl">
              <button
                type="button"
                onClick={() => handleAdConfigChange('googleAdSenseEnabled', !config.ads.googleAdSenseEnabled)}
                className={`w-5 h-5 flex-shrink-0 border-2 border-black rounded flex items-center justify-center cursor-pointer transition-colors ${
                  config.ads.googleAdSenseEnabled ? 'bg-amber-400' : 'bg-transparent'
                }`}
                title="Toggle Google AdSense Service Mode"
              >
                {config.ads.googleAdSenseEnabled && <Check size={12} strokeWidth={3} />}
              </button>
              <div>
                <span className="font-sans font-black text-xs block leading-tight text-black">Active Google AdSense Mode</span>
                <span className="font-sans text-[10px] text-gray-500 leading-snug block mt-0.5">
                  Interchange default aesthetic mockup slots with fully active Google AdSense tag injections.
                </span>
              </div>
            </div>

            {/* B. PUBLISHER ID CLIENT TAG */}
            <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-xl border border-black/10">
              <label className="font-mono text-[9px] font-bold uppercase tracking-wider text-gray-600">AdSense Publisher ID (data-ad-client)</label>
              <input
                type="text"
                value={config.ads.publisherId}
                onChange={(e) => handleAdConfigChange('publisherId', e.target.value)}
                className="w-full border-2 border-black p-2 rounded-lg bg-white font-mono text-xs outline-none focus:border-cyan-500 font-black text-stone-800"
                placeholder="ca-pub-9876543210987654"
              />
              <span className="font-sans text-[9px] text-gray-400">Insert your authenticated AdSense client value to bind dynamic scripts.</span>
            </div>

            {/* C. INDIVIDUAL PLACEMENTS AND THEIR DATA-AD-SLOTS */}
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-wider">UNIT PLACEMENTS &amp; LOCATIONS:</span>
              
              {/* Placement 1: Sidebar Unit */}
              <div className="border border-neutral-200 rounded-xl p-3 bg-slate-50">
                <div className="flex justify-between items-center mb-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdConfigChange('sidebarGlobal', !config.ads.sidebarGlobal)}
                      className={`w-4.5 h-4.5 border-2 border-black rounded flex items-center justify-center cursor-pointer transition-colors ${
                        config.ads.sidebarGlobal ? 'bg-emerald-400' : 'bg-transparent'
                      }`}
                      title="Toggle Sidebar Ad Unit"
                    >
                      {config.ads.sidebarGlobal && <Check size={10} strokeWidth={3} />}
                    </button>
                    <span className="font-sans font-black text-xs text-black">Sidebar Unit Location</span>
                  </div>
                  <span className="font-mono text-[8px] bg-red-100 text-red-800 border border-red-200 px-1.5 py-0.5 rounded font-extrabold uppercase">300x250 Box</span>
                </div>
                {config.ads.sidebarGlobal && (
                  <div className="flex flex-col gap-1 pl-6">
                    <label className="font-mono text-[8.5px] font-bold text-gray-400 uppercase">Ad Slot Value (data-ad-slot)</label>
                    <input
                      type="text"
                      value={config.ads.sidebarAdSlot}
                      onChange={(e) => handleAdConfigChange('sidebarAdSlot', e.target.value)}
                      className="border-2 border-black/40 p-2 rounded bg-[#fcfdfe] font-mono text-xs outline-none font-bold text-stone-800 focus:border-black"
                      placeholder="e.g. 8877665544"
                    />
                  </div>
                )}
              </div>

              {/* Placement 2: In Feed Unit */}
              <div className="border border-neutral-200 rounded-xl p-3 bg-slate-50">
                <div className="flex justify-between items-center mb-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdConfigChange('inFeedUnits', !config.ads.inFeedUnits)}
                      className={`w-4.5 h-4.5 border-2 border-black rounded flex items-center justify-center cursor-pointer transition-colors ${
                        config.ads.inFeedUnits ? 'bg-emerald-400' : 'bg-transparent'
                      }`}
                      title="Toggle In-Feed Ad Unit"
                    >
                      {config.ads.inFeedUnits && <Check size={10} strokeWidth={3} />}
                    </button>
                    <span className="font-sans font-black text-xs text-black">In-Feed Unit Location</span>
                  </div>
                  <span className="font-mono text-[8px] bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-extrabold uppercase">Responsive horizontal</span>
                </div>
                {config.ads.inFeedUnits && (
                  <div className="flex flex-col gap-1 pl-6">
                    <label className="font-mono text-[8.5px] font-bold text-gray-400 uppercase">Ad Slot Value (data-ad-slot)</label>
                    <input
                      type="text"
                      value={config.ads.inFeedAdSlot}
                      onChange={(e) => handleAdConfigChange('inFeedAdSlot', e.target.value)}
                      className="border-2 border-black/40 p-2 rounded bg-[#fcfdfe] font-mono text-xs outline-none font-bold text-stone-800 focus:border-black"
                      placeholder="e.g. 1122334455"
                    />
                  </div>
                )}
              </div>

              {/* Placement 3: Mid Article */}
              <div className="border border-neutral-200 rounded-xl p-3 bg-slate-50">
                <div className="flex justify-between items-center mb-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdConfigChange('midArticleInjector', !config.ads.midArticleInjector)}
                      className={`w-4.5 h-4.5 border-2 border-black rounded flex items-center justify-center cursor-pointer transition-colors ${
                        config.ads.midArticleInjector ? 'bg-emerald-400' : 'bg-transparent'
                      }`}
                      title="Toggle Mid-Article Ad Unit"
                    >
                      {config.ads.midArticleInjector && <Check size={10} strokeWidth={3} />}
                    </button>
                    <span className="font-sans font-black text-xs text-black">Mid-Article Injection Point</span>
                  </div>
                  <span className="font-mono text-[8px] bg-purple-100 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded font-extrabold uppercase">Matched inline</span>
                </div>
                {config.ads.midArticleInjector && (
                  <div className="flex flex-col gap-1 pl-6">
                    <label className="font-mono text-[8.5px] font-bold text-gray-400 uppercase">Ad Slot Value (data-ad-slot)</label>
                    <input
                      type="text"
                      value={config.ads.midArticleAdSlot}
                      onChange={(e) => handleAdConfigChange('midArticleAdSlot', e.target.value)}
                      className="border-2 border-black/40 p-2 rounded bg-[#fcfdfe] font-mono text-xs outline-none font-bold text-stone-800 focus:border-black"
                      placeholder="e.g. 9988776655"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* D. INTEGRATION SNIPPET COPYSHELF */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Google Header Snippet Code:</span>
              <div className="p-3 bg-stone-900 border-2 border-black rounded-xl text-white font-mono text-[10px] relative leading-normal">
                <div className="flex justify-between items-center mb-2 text-gray-400 border-b border-gray-800 pb-1.5 text-[8.5px]">
                  <span>GENERIC HEADER INJECTION</span>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.ads.publisherId || 'ca-pub-9876543210987654'}" crossorigin="anonymous"></script>`);
                      setCopiedNotification(true);
                      setTimeout(() => setCopiedNotification(false), 2000);
                    }}
                    className="text-cyan-400 hover:text-white cursor-pointer font-bold text-[8.5px] bg-[#161d1f] border border-black/40 px-2 py-0.5 rounded uppercase"
                  >
                    {copiedNotification ? 'COPIED ✓' : 'COPY'}
                  </button>
                </div>
                <code className="text-gray-300 break-all select-all leading-normal inline-block">
                  &lt;script async src=&quot;https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={config.ads.publisherId || 'ca-pub-9876543210987654'}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;
                </code>
              </div>
            </div>
          </div>

          {/* Secure Rotate Token key component */}
          <div className="bg-white p-5 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-4">
            <h5 className="font-mono text-[10px] font-bold tracking-widest text-[#6c797f] uppercase block border-b-2 border-gray-400/10 pb-2">
              ADMINISTRATIVE TOKEN SECURITY
            </h5>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-[9px] text-[#6c797f] uppercase font-bold leading-normal">ROTATIONAL PRIVATE ACCESS KEY:</span>
              
              <div className="p-2.5 bg-stone-50 border border-black/10 rounded-lg font-mono text-xs select-text break-all flex justify-between items-center bg-slate-100 font-semibold relative">
                <span>{secureToken}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-2 animate-ping" />
              </div>

              <button
                onClick={rotateSecurityKey}
                disabled={tokenLoading}
                className="w-full mt-1.5 py-3 bg-[#161d1f] hover:bg-slate-800 text-white font-mono text-xs uppercase font-bold border-2 border-black rounded-xl duration-150 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#00d2ff]"
              >
                <RefreshCw size={14} className={tokenLoading ? 'animate-spin' : ''} />
                <span>{tokenLoading ? 'Rotating Key Tokens...' : 'Rotate Security Tokens'}</span>
              </button>
            </div>
          </div>

          {/* CATEGORIES / TAXONOMY CONTROL OR OVERLAY TRIGGER */}
          <div className="bg-white p-5 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-4 mb-4">
            <div className="flex justify-between items-center border-b-2 border-gray-400/10 pb-2">
              <h5 className="font-mono text-[10px] font-bold tracking-widest text-[#6c797f] uppercase block">
                CATEGORY TAXONOMIES
              </h5>
              <button 
                onClick={() => setModalOpen(true)}
                className="p-1 bg-[#a6d000] border-2 border-black hover:scale-105 duration-100 rounded cursor-pointer"
              >
                <Plus size={11} strokeWidth={3} />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div key={cat.name} className="flex justify-between items-center p-2 bg-[#f4fafe] border-2 border-black/10 rounded hover:border-black transition-colors group">
                  <div>
                    <span className="font-mono text-xs font-black uppercase tracking-tight block text-black">{cat.name}</span>
                    <span className="font-sans text-[9px] text-gray-500 leading-normal block mt-0.5">{cat.desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-[#6c797f] font-semibold">{cat.count} items</span>
                    <button 
                      onClick={() => handleDeleteCategory(cat.name)}
                      className="p-1 hover:bg-red-50 text-red-700 rounded cursor-pointer opacity-30 group-hover:opacity-100 duration-100"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* POPUP MODAL OVERLAY (Portal taxonomy creator centered precisely over UI screen options) */}
      {modalOpen && (
        <div id="modal-container-category" className="fixed inset-0 min-h-screen bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-xl border-4 border-black p-5 relative shadow-[6px_6px_0px_0px_rgba(22,29,31,1)] animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg border border-gray-300 hover:bg-stone-50 cursor-pointer"
            >
              <X size={14} />
            </button>

            <h5 className="font-sans font-black text-sm tracking-tight mb-4 text-[#161d1f] flex items-center gap-1">
              <Layers size={15} style={{ color: config.primaryColor }} />
              Create Category Taxonomy
            </h5>

            <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase font-bold text-gray-400">Taxonomy Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Crypto, Art" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="p-2 bg-[#f4fafe] border-2 border-black rounded-lg text-xs outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase font-bold text-gray-400">Brief Overview Description</label>
                <input 
                  type="text" 
                  placeholder="Focusing on decentralized ledgers..." 
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="p-2 bg-[#f4fafe] border-2 border-black rounded-lg text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 justify-end mt-2.5 border-t border-black/10 pt-3">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 border-2 border-transparent hover:border-black font-mono text-[10.5px] font-bold rounded-lg uppercase cursor-pointer text-gray-400 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#a6d000] border-2 border-black rounded-lg font-mono text-[10.5px] font-extrabold uppercase shadow-[2.5px_2.5px_0px_0px_rgba(22,29,31,1)] hover:shadow-none duration-100 transition-all cursor-pointer text-black"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
