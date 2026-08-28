'use client';

import React from 'react';
import { LayoutDashboard, Store, TrendingUp, FileText, AlertTriangle, ArrowLeftRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Buyer Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Produce Marketplace', icon: Store },
    { id: 'intelligence', label: 'Price Intelligence', icon: TrendingUp },
    { id: 'contracts', label: 'Contracts & Escrow', icon: FileText },
    { id: 'disputes', label: 'Grievance Hub', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 glass-panel min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800/80">
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <ArrowLeftRight className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Escrow Security</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            100% Funds protected in Smart Escrow until quality inspect & delivery signoff.
          </p>
        </div>
      </div>
    </aside>
  );
}
