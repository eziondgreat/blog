/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Smartphone, 
  Laptop, 
  Eye, 
  HelpCircle, 
  Activity, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SystemConfig } from '../types';

interface AudienceViewProps {
  config: SystemConfig;
}

export default function AudienceView({ config }: AudienceViewProps) {
  const [selectedCell, setSelectedCell] = useState<{ day: string; hour: string; value: number } | null>({
    day: 'Wednesday',
    hour: '6PM - 9PM',
    value: 94
  });

  const personas = [
    {
      role: 'The Industry Pro',
      type: 'PRO',
      activeCount: '2.4K readers',
      rate: 78,
      traits: ['Prefers Mono fonts for code snippets', 'Filters by #Performance, #UI', 'Scrolls mostly on high DPI screens']
    },
    {
      role: 'The Executive Decision',
      type: 'EXEC',
      activeCount: '1.2K readers',
      rate: 82,
      traits: ['Clicks on sponsorship design courses', 'Skims headlines before opening', 'Scrolls mostly during morning hours']
    },
    {
      role: 'The Aspirant Student',
      type: 'STUDENT',
      activeCount: '942 readers',
      rate: 42,
      traits: ['Copies code blocks directly from feed', 'Highly active on Mobile touch screens', 'Bookmarks multiple drafts']
    }
  ];

  // Grid datasets for interactive heatmap
  const days = ['Monday', 'Wednesday', 'Friday', 'Sunday'];
  const hours = ['9AM - 12PM', '12PM - 3PM', '3PM - 6PM', '6PM - 9PM'];
  
  // Static heatmap values grid
  const engagementValues: Record<string, Record<string, number>> = {
    'Monday': { '9AM - 12PM': 82, '12PM - 3PM': 74, '3PM - 6PM': 68, '6PM - 9PM': 85 },
    'Wednesday': { '9AM - 12PM': 77, '12PM - 3PM': 83, '3PM - 6PM': 70, '6PM - 9PM': 94 },
    'Friday': { '9AM - 12PM': 69, '12PM - 3PM': 62, '3PM - 6PM': 81, '6PM - 9PM': 78 },
    'Sunday': { '9AM - 12PM': 40, '12PM - 3PM': 55, '3PM - 6PM': 63, '6PM - 9PM': 72 }
  };

  const getHeatmapBgColor = (val: number) => {
    if (val >= 85) return { bg: 'bg-emerald-500 text-black', opacity: '1.0' };
    if (val >= 70) return { bg: 'bg-emerald-300 text-black', opacity: '0.85' };
    if (val >= 55) return { bg: 'bg-emerald-100 text-[#1e6600]', opacity: '0.7' };
    return { bg: 'bg-stone-50 text-gray-400 border-dashed', opacity: '0.5' };
  };

  return (
    <div className="flex flex-col gap-8 select-none">
      
      {/* Upper Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ROW COLUMN LEFT Personas Index List (7 columns) */}
        <div className="md:col-span-1 lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(22,29,31,1)]">
            <div className="flex justify-between items-center border-b-2 border-black/10 pb-4 mb-4">
              <div>
                <h4 className="text-xl font-bold tracking-tight">Elizion Target Personas</h4>
                <p className="font-mono text-[9px] text-[#6c797f] uppercase">Segment engagement characteristics</p>
              </div>
              <Users size={20} style={{ color: config.secondaryColor }} />
            </div>

            <div className="flex flex-col gap-5">
              {personas.map((persona, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl border-2 border-black/80 hover:bg-[#f4fafe]/45 duration-150 transition-colors flex flex-col sm:flex-row justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans font-black text-sm text-[#161d1f]">{persona.role}</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[8px] font-black border uppercase ${
                        persona.type === 'PRO' 
                          ? 'bg-blue-50 text-blue-800 border-blue-600' 
                          : persona.type === 'EXEC'
                          ? 'bg-purple-50 text-purple-800 border-purple-600'
                          : 'bg-amber-50 text-amber-800 border-amber-600'
                      }`}>
                        {persona.type}
                      </span>
                    </div>

                    <p className="font-mono text-[9px] text-gray-400 font-bold mb-3">{persona.activeCount}</p>
                    
                    <ul className="flex flex-col gap-1.5 pl-1">
                      {persona.traits.map((trait, t_idx) => (
                        <li key={t_idx} className="flex items-baseline gap-2 text-xs text-gray-500 leading-snug">
                          <span className="text-[12px] leading-none" style={{ color: config.primaryColor }}>&raquo;</span>
                          <span className="font-sans font-medium">{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sm:text-right flex flex-col justify-between items-start sm:items-end w-full sm:w-28 flex-shrink-0">
                    <div>
                      <span className="font-mono text-[8.5px] text-gray-400 uppercase font-black">Retention</span>
                      <h5 className="text-2xl font-[900] tracking-tight text-black leading-none mt-1">{persona.rate}%</h5>
                    </div>
                    {/* Progress Bar indicator */}
                    <div className="w-full h-2.5 bg-slate-100 border border-black/10 rounded-full mt-2 overflow-hidden flex items-center">
                      <div className="h-full rounded-full" style={{ width: `${persona.rate}%`, backgroundColor: config.primaryColor }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW COLUMN RIGHT peak hours heatmap (5 columns) */}
        <div className="md:col-span-1 lg:col-span-5 bg-white p-6 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-6">
          <div className="border-b-2 border-black/10 pb-4">
            <h4 className="text-xl font-bold tracking-tight">Peak Reading Hours</h4>
            <p className="font-mono text-[9px] text-[#6c797f] uppercase">Click grid cells to inspect heat data</p>
          </div>

          {/* Grid interactive heat elements */}
          <div className="flex flex-col gap-4">
            <div className="overflow-x-auto no-scrollbar pb-1">
              <div className="min-w-72 flex flex-col gap-2">
                {/* Hours column titles header */}
                <div className="grid grid-cols-5 gap-2 items-center text-center font-mono text-[8px] font-bold text-gray-400 uppercase tracking-widest pl-14">
                  {hours.map((hr, idx) => (
                    <span key={idx} className="truncate">{hr.split(' ')[0]}</span>
                  ))}
                </div>

                {/* Day Rows */}
                {days.map((day) => (
                  <div key={day} className="grid grid-cols-5 gap-2 items-center">
                    {/* Day name labels */}
                    <span className="font-mono text-[9px] font-bold text-gray-500 text-left w-14 truncate">{day}</span>
                    
                    {hours.map((hour) => {
                      const val = engagementValues[day][hour];
                      const { bg, opacity } = getHeatmapBgColor(val);
                      const isSelected = selectedCell?.day === day && selectedCell?.hour === hour;

                      return (
                        <button
                          key={hour}
                          onClick={() => setSelectedCell({ day, hour, value: val })}
                          className={`h-9 rounded-lg border-2 border-black flex items-center justify-center font-mono text-xs font-black transition-all hover:scale-110 active:scale-95 duration-100 cursor-pointer ${bg} ${
                            isSelected ? 'ring-4 ring-black ring-offset-2 scale-105' : ''
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected stats box results */}
            {selectedCell ? (
              <div 
                className="p-4 rounded-xl border-2 border-[#161d1f] bg-slate-50 flex items-start gap-4 transition-all duration-300"
                style={{
                  borderLeftWidth: '6px',
                  borderLeftColor: config.primaryColor
                }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full border border-black/10 bg-white flex items-center justify-center">
                  <Clock size={15} style={{ color: config.primaryColor }} />
                </div>
                <div>
                  <h6 className="font-mono text-[9.5px] text-gray-400 font-extrabold pb-0.5 uppercase">
                    {selectedCell.day.toUpperCase()} @ {selectedCell.hour}
                  </h6>
                  <p className="font-sans font-black text-xs text-black">Active Audience Engagement Index: <strong style={{ color: config.secondaryColor }}>{selectedCell.value}%</strong></p>
                  <p className="font-sans text-[11px] text-[#6c797f] mt-1">Excellent reading threshold. Reach is stabilized with optimal engagement. High viral likelihood.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center rounded-xl bg-slate-50 border border-black/15 text-xs text-gray-400 font-semibold uppercase">
                Select cell to preview metrics
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Ticker logs device summary stats block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Device breakdown */}
        <div className="p-4 bg-white border-2 border-black rounded-xl" style={{ boxShadow: '2px 2px 0px 0px #101010' }}>
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={15} style={{ color: config.primaryColor }} />
            <span className="font-mono text-[9.5px] font-extrabold uppercase text-gray-400">TOUCH DISP DEVS</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h5 className="text-2.5xl font-black font-sans leading-none">64.2%</h5>
            <span className="text-xs text-emerald-600 font-mono font-bold">+2.8%</span>
          </div>
          <p className="font-sans text-[10px] text-gray-500 mt-2.5 leading-normal">Responsive touch screens dictate readability priorities. Bold headers perform well.</p>
        </div>

        {/* Desktop breakdown */}
        <div className="p-4 bg-white border-2 border-black rounded-xl" style={{ boxShadow: '2px 2px 0px 0px #101010' }}>
          <div className="flex items-center gap-2 mb-3">
            <Laptop size={15} style={{ color: config.secondaryColor }} />
            <span className="font-mono text-[9.5px] font-extrabold uppercase text-gray-400">DESKTOP MOUSE DEVS</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h5 className="text-2.5xl font-black font-sans leading-none">35.8%</h5>
            <span className="text-xs text-red-500 font-mono font-bold">-1.4%</span>
          </div>
          <p className="font-sans text-[10px] text-gray-500 mt-2.5 leading-normal">High priority reading rates on standard desktop viewport layouts. Sidemount ad visible.</p>
        </div>

        {/* Live Audience Activity state */}
        <div className="p-4 bg-stone-900 border-2 border-black rounded-xl text-white relative flex flex-col justify-between" style={{ boxShadow: '2px 2px 0px 0px #101010' }}>
          <div className="absolute top-2 right-2 bg-[#96f200]/25 text-[#96f200] font-mono text-[7px] p-0.5 px-1 rounded uppercase font-bold tracking-widest border border-[#96f200]/40">
            Synced
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 bg-[#96f200] border-2 border-white rounded-full animate-pulse" />
            <span className="font-mono text-[9.5px] font-extrabold uppercase text-gray-400">TELEMETRY SEED FEED</span>
          </div>
          <div className="flex flex-col gap-1.5 mt-2 overflow-hidden max-h-16">
            <p className="font-mono text-[9px] text-[#6c797f] truncate">User @pro_dev scrolled #performance &bull; Safari</p>
            <p className="font-mono text-[9px] text-[#6c797f] truncate">User @anonymous liked article &bull; Brave Mobile</p>
            <p className="font-mono text-[9px] text-[#6c797f] truncate">User @exec_hq posted comment &bull; Firefox</p>
          </div>
        </div>

      </div>

    </div>
  );
}
