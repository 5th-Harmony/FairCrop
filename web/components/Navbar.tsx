'use client';

import React from 'react';
import { Sprout, ShieldCheck, Bell, User as UserIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Navbar() {
  const { user } = useAppStore();

  return (
    <header className="h-16 border-b border-slate-800 glass-panel sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
            AgriLink<span className="text-emerald-400">360</span>
          </h1>
          <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">SIH 26132 Market Discovery</p>
        </div>
      </div>

      {/* Center Search / Status */}
      <div className="hidden md:flex items-center space-x-2 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800 text-xs text-slate-300">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="font-medium text-emerald-400">Live Mandi API Sync:</span>
        <span className="text-slate-400">6,500+ APMCs Connected</span>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
        </button>

        <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{user?.full_name || 'Institutional Buyer'}</p>
            <div className="flex items-center justify-end space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
                {user?.role || 'BUYER'} • {user?.verification_status || 'VERIFIED'}
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold">
            <UserIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
