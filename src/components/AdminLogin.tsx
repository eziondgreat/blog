import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Key, 
  ArrowLeft, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  HelpCircle,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { SystemConfig } from '../types';
import { api } from '../api';

interface AdminLoginProps {
  config: SystemConfig;
  onLoginSuccess: (rememberMe: boolean) => void;
  onCancel: () => void;
}

export default function AdminLogin({ config, onLoginSuccess, onCancel }: AdminLoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setErrorMessage('Security Access Token is required.');
      setIsLoading(false);
      return;
    }

    try {
      const email = username.includes('@') ? username.trim() : `${username.trim()}@elizion.com`;
      await api.login(email, trimmedPassword, rememberMe);
      onLoginSuccess(rememberMe);
    } catch (err: any) {
      setErrorMessage(err.message || 'Access Denied. Invalid Administrative Token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fafe] text-[#161d1f] font-sans flex items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Decorative architectural background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161d1f0d_1px,transparent_1px),linear-gradient(to_bottom,#161d1f0d_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      
      {/* Dynamic colorful decorative shapes */}
      <div className="hidden sm:block absolute top-[10%] left-[15%] w-24 h-24 bg-[#00d2ff] border-3 border-black rounded-xl rotate-12 shadow-[4px_4px_0px_0px_#161d1f] -z-10 animate-pulse"></div>
      <div className="hidden sm:block absolute bottom-[15%] right-[12%] w-32 h-12 bg-amber-400 border-3 border-black rounded-lg -rotate-6 shadow-[5px_5px_0px_0px_#161d1f] -z-10"></div>
      <div className="hidden sm:block absolute top-[25%] right-[18%] w-16 h-16 rounded-full border-3 border-black -rotate-12 shadow-[4px_4px_0px_0px_#161d1f] -z-10" style={{ backgroundColor: config.secondaryColor }}></div>

      {/* Main Login Card container */}
      <div 
        className="w-full max-w-md bg-white border-4 border-black rounded-3xl p-6 md:p-8 relative transition-transform duration-200"
        style={{ 
          boxShadow: '10px 10px 0px 0px #161d1f',
        }}
      >
        
        {/* Card Header Label Badge */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#161d1f] text-white border-2 border-white px-4 py-1 font-mono text-[10px] tracking-widest uppercase font-extrabold rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)]">
          SECURE CHANNEL ID: ELZ-26
        </div>

        {/* Back navigation option */}
        <button 
          onClick={onCancel}
          className="flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-black font-semibold mb-6 transition-colors duration-150 cursor-pointer"
        >
          <ArrowLeft size={14} className="stroke-[2.5]" />
          <span>Exit to Feed</span>
        </button>

        {/* Central Brand Identity */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-[900] tracking-tighter uppercase inline-block mb-1">
            ELIZION <span className="text-[#a90097] inline-block hover:scale-105 duration-100" style={{ color: config.secondaryColor }}>CMS</span>
          </h2>
          <p className="font-mono text-[10px] tracking-wider text-gray-400 font-bold uppercase">
            ADMINISTRATIVE CONSOLE AUTHORIZATION
          </p>
        </div>

        {/* Alert Zone for error handling */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border-3 border-red-700 rounded-xl text-red-900 text-xs flex items-start gap-2.5 animate-bounce-short">
            <AlertOctagon size={18} className="text-red-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Access Warning</p>
              <p className="mt-0.5 text-red-800 font-mono text-[11px] leading-tight">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* The Credential Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Username Grid */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] font-bold uppercase text-[#161d1f]">
              Operator Identifier
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/50">
                <User size={16} />
              </span>
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Operator profile (e.g. admin)"
                className="w-full bg-stone-50 border-3 border-black rounded-xl py-3 pl-10 pr-4 font-sans text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Security key input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[10px] font-bold uppercase text-[#161d1f]">
                Administrative Access Key
              </label>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="font-mono text-[9px] uppercase font-bold text-[#00677f] hover:underline flex items-center gap-0.5"
                style={{ color: config.primaryColor }}
              >
                <HelpCircle size={10} />
                <span>Show Token</span>
              </button>
            </div>
            
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/50">
                <Key size={16} />
              </span>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Paste ELIZION_SEC_ token"
                className="w-full bg-stone-50 border-3 border-black rounded-xl py-3 pl-10 pr-11 font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Active token hint placard */}
          {showHint && (
            <div 
              className="p-3 bg-indigo-50 border-2 border-dashed border-[#161d1f] rounded-xl font-mono text-[10px] leading-tight flex flex-col gap-1.5 relative overflow-hidden"
              style={{ borderColor: config.primaryColor }}
            >
              <span className="text-indigo-800 font-bold uppercase">System Security Placard:</span>
              <p className="text-gray-600">The portal validates against the active security token inside Config. Use this token below:</p>
              <div className="flex gap-2 items-center mt-1">
                <code className="bg-[#161d1f] text-green-400 px-2 py-1 text-xs rounded-md select-all font-bold tracking-wide">
                  {config.accessKey}
                </code>
                <span className="text-[8px] text-gray-400 uppercase italic">Click/Hold to copy</span>
              </div>
            </div>
          )}

          {/* Session Duration Choice check */}
          <div className="flex items-center gap-2.5 my-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs relative select-none">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 bg-white border-2.5 border-black rounded-md flex items-center justify-center peer-checked:bg-[#00d2ff] transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] peer-checked:shadow-none duration-100">
                {rememberMe && <CheckCircle2 size={12} className="text-[#161d1f] stroke-[3]" />}
              </div>
              <span className="font-sans font-semibold text-[#161d1f] hover:text-black">
                Keep session open on this device (Remember Me)
              </span>
            </label>
          </div>

          {/* Action Sign-In */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-4 bg-[#00d2ff] text-black border-3 border-black rounded-xl font-mono text-xs uppercase tracking-wider font-extrabold shadow-[4px_4px_0px_0px_#161d1f] hover:shadow-none hover:translate-x-1 hover:translate-y-1 duration-150 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
            style={{ 
              backgroundColor: config.primaryColor === '#00677f' ? '#00d2ff' : config.primaryColor,
              color: config.primaryColor === '#00677f' ? 'black' : 'white'
            }}
          >
            {isLoading ? (
              <span className="animate-pulse">VERIFYING OPERATOR ACCESS...</span>
            ) : (
              <>
                <Lock size={14} className="stroke-[2.5]" />
                <span>Initialize Console</span>
              </>
            )}
          </button>
        </form>

        {/* Console Footnote telemetry details */}
        <div className="mt-6 pt-4 border-t-2 border-[#161d1f]/10 text-center font-mono text-[9px] text-gray-400">
          <p>AUTHORIZED PORT: 3000 &bull; SSL CHANNEL ACTIVATED</p>
          <p className="mt-0.5">ELIZION SECURITY MODULE VERSION 9.04 &copy; 2026</p>
        </div>

      </div>

    </div>
  );
}
