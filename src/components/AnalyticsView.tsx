/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Calendar, 
  Users, 
  Flame, 
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { SystemConfig } from '../types';

interface AnalyticsViewProps {
  config: SystemConfig;
}

export default function AnalyticsView({ config }: AnalyticsViewProps) {
  const [dataWindow, setDataWindow] = useState<'7d' | '30d' | '3mo'>('30d');
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);

  // Growth analytics depending on date-window selections
  const analyticsDataMap = {
    '7d': {
      values: [1200, 1800, 1400, 2100, 1950, 2400, 2800],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      peak: '2.8K',
      ctr: '6.4%',
      engagement: '74%',
      engagementRateValues: [85, 74, 62, 48],
    },
    '30d': {
      values: [1100, 1300, 1250, 1600, 1850, 1720, 1950, 2250, 2420, 2842],
      labels: ['D3', 'D6', 'D9', 'D12', 'D15', 'D18', 'D21', 'D24', 'D27', 'D30'],
      peak: '3.1K',
      ctr: '5.8%',
      engagement: '68%',
      engagementRateValues: [92, 81, 74, 55],
    },
    '3mo': {
      values: [6800, 7500, 8100, 7900, 9400, 11200, 10800, 12400, 13100, 14800],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      peak: '14.8K',
      ctr: '4.9%',
      engagement: '52%',
      engagementRateValues: [78, 65, 50, 42],
    }
  };

  const chartInfo = analyticsDataMap[dataWindow];

  // Max value calculation for scaling graphics
  const maxVal = Math.max(...chartInfo.values);
  const minVal = Math.min(...chartInfo.values);

  // Formulate responsive SVG line chart coordinate strings
  const svgWidth = 500;
  const svgHeight = 150;
  const paddingY = 20;

  const points = chartInfo.values.map((val, idx) => {
    const x = (idx / (chartInfo.values.length - 1)) * svgWidth;
    // scale y between padding and height
    const y = svgHeight - (((val - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2) + paddingY);
    return { x, y, val, label: chartInfo.labels[idx] };
  });

  // SVG Line path string construction
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  // Categories data shares for Circular donut
  const topCategories = [
    { name: 'Culture', percentage: 38, count: 582, color: config.secondaryColor },
    { name: 'Tech', percentage: 28, count: 420, color: config.primaryColor },
    { name: 'Design', percentage: 18, count: 271, color: config.tertiaryColor },
    { name: 'Finance', percentage: 16, count: 247, color: '#f59e0b' },
  ];

  return (
    <div className="flex flex-col gap-8 select-none">
      
      {/* Date Window Controller Selector */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border-2 border-black">
        <div className="flex items-center gap-2">
          <Calendar size={18} style={{ color: config.primaryColor }} />
          <span className="font-mono text-xs font-black uppercase text-gray-500">Telemetry Sampling Window</span>
        </div>

        <div className="flex items-center gap-2 bg-[#eaf4f8] p-1 border-2 border-black/10 rounded-lg">
          {(['7d', '30d', '3mo'] as const).map((win) => (
            <button
              key={win}
              onClick={() => {
                setDataWindow(win);
                setHoveredPointIdx(null);
              }}
              className={`px-3 py-1 font-mono text-[10px] uppercase font-bold rounded-md duration-100 cursor-pointer ${
                dataWindow === win 
                  ? 'bg-black text-white' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {win === '7d' ? '7 Days' : win === '30d' ? '30 Days' : '3 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Analytics Section layout grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ROW COLUMN LEFT Area chart (7 columns) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-6">
          <div className="flex justify-between items-center border-b-2 border-dashed border-gray-100 pb-4">
            <div>
              <h4 className="text-xl font-bold tracking-tight">Active Readers Analytics</h4>
              <p className="font-mono text-[9px] text-[#6c797f] uppercase">Unique Visitor Sessions Tracker</p>
            </div>
            
            <span className="font-mono text-xs text-stone-500 font-semibold bg-stone-50 p-1 px-2.5 rounded border border-black/10">
              Peak: <strong className="text-black">{chartInfo.peak}</strong>
            </span>
          </div>

          {/* SVG Plotting container */}
          <div className="relative py-2 bg-slate-50 border-2 border-black rounded-xl overflow-hidden p-4">
            {/* Legend Labels & Grid Y-grid lines */}
            <div className="absolute top-2 left-4 flex gap-4 font-mono text-[9px] text-gray-400">
              <span className="inline-flex items-center gap-1.5 font-bold uppercase"><span className="w-2.5 h-2.5 bg-black rounded-sm inline-block"></span> Trend line</span>
              <span className="inline-flex items-center gap-1.5 font-bold uppercase" style={{ color: config.primaryColor }}><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: config.primaryColor }}></span> Engagement Area</span>
            </div>

            <svg 
              className="w-full h-44 mt-4 overflow-visible" 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              preserveAspectRatio="none"
            >
              {/* Reference Grid lines */}
              <line x1="0" y1="20" x2={svgWidth} y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2={svgWidth} y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2={svgWidth} y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Graphical Paths */}
              <path d={areaPath} fill={config.primaryColor + '15'} />
              <path d={linePath} fill="none" stroke="#161d1f" strokeWidth="3" />
              <path d={linePath} fill="none" stroke={config.primaryColor} strokeWidth="1.5" />

              {/* Data Node Interactive Hotspots */}
              {points.map((pt, idx) => (
                <g key={idx} onMouseEnter={() => setHoveredPointIdx(idx)} onMouseLeave={() => setHoveredPointIdx(null)}>
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r={hoveredPointIdx === idx ? "7" : "4.5"} 
                    fill={hoveredPointIdx === idx ? config.secondaryColor : "white"} 
                    stroke="#161d1f" 
                    strokeWidth="2.5" 
                    className="cursor-pointer transition-all duration-100" 
                  />
                </g>
              ))}
            </svg>

            {/* Custom Interactive Floating Tooltip details */}
            {hoveredPointIdx !== null && (
              <div 
                className="absolute bg-[#161d1f] text-white p-2 px-3 rounded-lg border-2 border-white font-mono text-xs z-20 pointer-events-none"
                style={{
                  left: `${(points[hoveredPointIdx].x / svgWidth) * 85}%`,
                  top: `${(points[hoveredPointIdx].y / svgHeight) * 45}%`
                }}
              >
                <p className="text-[10px] text-gray-400 uppercase font-black">{points[hoveredPointIdx].label}</p>
                <p className="font-bold text-sm tracking-tight">{points[hoveredPointIdx].val.toLocaleString()} reads</p>
              </div>
            )}
          </div>

          {/* X Axis Tick Labels Row */}
          <div className="flex justify-between px-2 font-mono text-[9px] font-bold text-gray-400 pr-5">
            {chartInfo.labels.map((lbl, idx) => (
              <span key={idx}>{lbl}</span>
            ))}
          </div>
        </div>

        {/* ROW COLUMN RIGHT shares Donut SVG (5 columns) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-6">
          <div>
            <h4 className="text-xl font-bold tracking-tight">Top Categories</h4>
            <p className="font-mono text-[9px] text-[#6c797f] uppercase">Reader Popularity shares breakdown</p>
          </div>

          {/* SVG Donut Illustration */}
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <div className="relative w-36 h-36 flex-shrink-0 animate-spin-slow">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                {/* Sector paths represented dynamically using stroke-dasharray */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f1f5f9" strokeWidth="3.2" />
                
                {/* Culture 38% */}
                <circle 
                  cx="18" cy="18" r="15.91" 
                  fill="none" 
                  stroke={config.secondaryColor} 
                  strokeWidth="3.2" 
                  strokeDasharray="38 62" 
                  strokeDashoffset="25" 
                />
                {/* Tech 28% */}
                <circle 
                  cx="18" cy="18" r="15.91" 
                  fill="none" 
                  stroke={config.primaryColor} 
                  strokeWidth="3.2" 
                  strokeDasharray="28 72" 
                  strokeDashoffset="87" 
                />
                {/* Design 18% */}
                <circle 
                  cx="18" cy="18" r="15.91" 
                  fill="none" 
                  stroke={config.tertiaryColor} 
                  strokeWidth="3.2" 
                  strokeDasharray="18 82" 
                  strokeDashoffset="115" 
                />
                {/* Finance 16% */}
                <circle 
                  cx="18" cy="18" r="15.91" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="3.2" 
                  strokeDasharray="16 84" 
                  strokeDashoffset="133" 
                />
              </svg>

              {/* Center Overlay Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="font-sans font-[900] text-lg text-black">1.5K</span>
                <span className="font-mono text-[8px] text-gray-400 font-extrabold uppercase leading-none">Total Reads</span>
              </div>
            </div>

            {/* Keys legend index */}
            <div className="flex flex-col gap-2.5 w-full">
              {topCategories.map((cat) => (
                <div key={cat.name} className="flex justify-between items-center text-xs p-1 px-2 border border-black/5 rounded hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }}></span>
                    <span className="font-sans font-bold text-gray-700">{cat.name}</span>
                  </div>
                  <div className="font-mono font-semibold text-right">
                    <span>{cat.percentage}%</span>
                    <span className="text-[9px] text-gray-400 ml-1.5 block leading-none">{cat.count} reads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* SECONDARY GRAPHIC ROW: Engagement bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Engagement horiz stats bars */}
        <div className="bg-white p-6 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-4">
          <div>
            <h4 className="text-lg font-bold">Audience Resonance Rate</h4>
            <p className="font-mono text-[9px] text-[#6c797f] uppercase">Average content attention metrics values</p>
          </div>

          <div className="flex flex-col gap-3.5 mt-2">
            {[
              { id: '1', name: 'Average Read-Time Retention', val: chartInfo.engagementRateValues[0], color: config.primaryColor, lead: '8.4m' },
              { id: '2', name: 'Interactive CTR Click-Through', val: chartInfo.engagementRateValues[1], color: config.secondaryColor, lead: chartInfo.ctr },
              { id: '3', name: 'Average Comment Ratio', val: chartInfo.engagementRateValues[2], color: config.tertiaryColor, lead: '4.8%' },
              { id: '4', name: 'Instant Headline Share Trigger', val: chartInfo.engagementRateValues[3], color: '#f59e0b', lead: '3.1%' },
            ].map((bar) => (
              <div key={bar.id} className="flex flex-col gap-1 pr-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans font-bold text-[#161d1f]/80 leading-none">{bar.name}</span>
                  <span className="font-mono font-black font-semibold text-black">{bar.lead}</span>
                </div>
                {/* Horizontal bar outer box */}
                <div className="w-full h-3 border-2 border-black rounded-full overflow-hidden bg-slate-100 flex items-center">
                  <div 
                    className="h-full rounded-full border-r-2 border-black transition-all duration-300"
                    style={{ 
                      width: `${bar.val}%`,
                      backgroundColor: bar.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viral Hot Index telemetry */}
        <div className="bg-white p-6 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(22,29,31,1)] flex flex-col gap-4">
          <div>
            <h4 className="text-lg font-bold">Content Viral Indexes</h4>
            <p className="font-mono text-[9px] text-[#6c797f] uppercase">Predictive performance recommendations</p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { title: 'The Neo-Brutalist Revival', score: '9.8', text: 'Highly visual thumbnail driving clicks.', type: 'critical' },
              { title: 'Why Speed is the New Luxury', score: '8.4', text: 'Excellent retention with dev community.', type: 'stable' },
              { title: 'Analyzing Future UI Layouts', score: '4.2', text: 'Recommended action: add visual graphics.', type: 'improvement' },
            ].map((index, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 border border-black/10 rounded-lg hover:bg-[#f4fafe]">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-extrabold text-[#161d1f] text-xs pb-0.5">{index.title}</span>
                    <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-extrabold tracking-tight ${
                      index.type === 'critical' ? 'bg-red-100 text-red-800' : index.type === 'stable' ? 'bg-[#96f200]/25 text-[#1e6600]' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {index.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-sans text-[10px] text-gray-500">{index.text}</p>
                </div>

                <div className="text-right flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-[#101010]">{index.score}</span>
                  <Sparkles size={11} className={index.type === 'critical' ? 'text-red-600 animate-pulse' : 'text-slate-400'} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
