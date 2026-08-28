'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Calendar, Lightbulb } from 'lucide-react';

export default function MarketTrendsChart() {
  const chartData = [
    { date: 'Today', modalPrice: 2250, upperLimit: 2280, lowerLimit: 2220 },
    { date: 'Day 1', modalPrice: 2275, upperLimit: 2310, lowerLimit: 2240 },
    { date: 'Day 2', modalPrice: 2310, upperLimit: 2350, lowerLimit: 2270 },
    { date: 'Day 3', modalPrice: 2360, upperLimit: 2410, lowerLimit: 2310 },
    { date: 'Day 4', modalPrice: 2420, upperLimit: 2480, lowerLimit: 2360 },
    { date: 'Day 5', modalPrice: 2450, upperLimit: 2520, lowerLimit: 2380 },
    { date: 'Day 6', modalPrice: 2410, upperLimit: 2490, lowerLimit: 2340 },
    { date: 'Day 7', modalPrice: 2380, upperLimit: 2460, lowerLimit: 2300 },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              ML Price Discovery & Forecasting Engine
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-md">
                e-NAM Sync
              </span>
            </h3>
            <p className="text-xs text-slate-400">Wheat (Grade A) • Ludhiana Mandi, Punjab</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Forecast Window: Next 7 Days</span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={['dataMin - 50', 'dataMax + 50']} />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#F8FAFC',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`₹${value}/qtl`, '']}
            />

            <Area
              type="monotone"
              dataKey="upperLimit"
              stroke="transparent"
              fill="url(#confidenceGradient)"
              name="Upper Bound"
            />
            <Area
              type="monotone"
              dataKey="modalPrice"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#priceGradient)"
              name="Predicted Modal Price"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-emerald-500/20 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              ML Optimal Sale Window Advisory
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                +7.5% Upside Expected
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Wheat prices are projected to peak around <strong className="text-emerald-400">Day 4–5 (₹2,450/qtl)</strong>. Farmers are advised to lock contracts with buyers for delivery in 4 days to maximize harvest yields.
            </p>
          </div>
        </div>

        <button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-4 py-2 rounded-xl shrink-0 transition-colors">
          View Mandi Analytics
        </button>
      </div>
    </div>
  );
}
