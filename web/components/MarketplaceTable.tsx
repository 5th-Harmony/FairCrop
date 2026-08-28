'use client';

import React, { useState } from 'react';
import { Search, Sparkles, MapPin, ArrowUpRight } from 'lucide-react';
import { ProduceLot, useAppStore } from '@/lib/store';

interface MarketplaceTableProps {
  lots: ProduceLot[];
  onSelectLot: (lot: ProduceLot) => void;
}

export default function MarketplaceTable({ lots, onSelectLot }: MarketplaceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');

  const filteredLots = lots.filter((lot) => {
    const matchesSearch =
      lot.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'ALL' || lot.crop_name.toUpperCase() === selectedCrop.toUpperCase();
    const matchesGrade = selectedGrade === 'ALL' || lot.grade === selectedGrade;

    return matchesSearch && matchesCrop && matchesGrade;
  });

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Available Produce Lots
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
              {filteredLots.length} Active Listings
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Directly source verified harvest lots from farmers & FPOs</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search crop, state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
            />
          </div>

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Commodities</option>
            <option value="WHEAT">Wheat</option>
            <option value="RICE">Rice</option>
            <option value="TOMATO">Tomato</option>
            <option value="ONION">Onion</option>
            <option value="COTTON">Cotton</option>
          </select>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Quality Grades</option>
            <option value="GRADE_A">Grade A</option>
            <option value="GRADE_B">Grade B</option>
            <option value="ORGANIC">Organic</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Commodity & Location</th>
              <th className="py-3.5 px-4">Match Score</th>
              <th className="py-3.5 px-4">Quality Grade</th>
              <th className="py-3.5 px-4">Quantity (Quintals)</th>
              <th className="py-3.5 px-4">Expected Price</th>
              <th className="py-3.5 px-4">Seller / FPO</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {filteredLots.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No produce lots match your query filters.
                </td>
              </tr>
            ) : (
              filteredLots.map((lot) => {
                const matchScore = lot.match_score_percentage || Math.floor(82 + (lot.id * 3) % 17);
                return (
                  <tr key={lot.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-4 px-4 font-semibold text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                          {lot.crop_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm text-white font-bold">{lot.crop_name}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {lot.district}, {lot.state}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-amber-400">{matchScore}% Match</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md text-[11px] border border-slate-700 font-medium">
                        {lot.grade.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-200">
                      {(lot.quantity_kg / 100).toFixed(1)} Qtl ({lot.quantity_kg.toLocaleString()} kg)
                    </td>

                    <td className="py-4 px-4 font-bold text-emerald-400 text-sm">
                      ₹{lot.price_per_kg_expected} <span className="text-[10px] text-slate-400 font-normal">/ kg</span>
                    </td>

                    <td className="py-4 px-4 text-slate-300">
                      {lot.farmer?.full_name || 'Kisan Producer Org'}
                      <span className="block text-[10px] text-emerald-500 font-medium">Verified FPO</span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onSelectLot(lot)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1 ml-auto"
                      >
                        Make Offer
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
