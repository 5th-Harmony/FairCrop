'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MarketTrendsChart from '@/components/MarketTrendsChart';
import MarketplaceTable from '@/components/MarketplaceTable';
import BiddingModal from '@/components/BiddingModal';
import { ProduceLot, useAppStore } from '@/lib/store';
import { Store, ShieldCheck, Truck, Coins, ArrowUpRight, Scale } from 'lucide-react';

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLotForBidding, setSelectedLotForBidding] = useState<ProduceLot | null>(null);

  // Mock produce lots for demonstration
  const mockLots: ProduceLot[] = [
    {
      id: 1001,
      farmer_id: 12,
      crop_name: 'Wheat',
      variety: 'PBW 550',
      quantity_kg: 5000,
      price_per_kg_expected: 22.5,
      grade: 'GRADE_A',
      harvest_date: '2026-08-20',
      storage_location: 'Karnal Warehouse #4, Haryana',
      state: 'Haryana',
      district: 'Karnal',
      status: 'AVAILABLE',
      match_score_percentage: 96,
      farmer: {
        id: 12,
        email: 'kisan.fpo@agri.in',
        full_name: 'Karnal Farmers Producer Co-op',
        role: 'FPO',
        verification_status: 'VERIFIED',
        state: 'Haryana',
        district: 'Karnal'
      }
    },
    {
      id: 1002,
      farmer_id: 14,
      crop_name: 'Tomato',
      variety: 'Hybrid Sona',
      quantity_kg: 2500,
      price_per_kg_expected: 18.0,
      grade: 'ORGANIC',
      harvest_date: '2026-08-22',
      storage_location: 'Lasalgaon Cold Storage, Nashik',
      state: 'Maharashtra',
      district: 'Nashik',
      status: 'AVAILABLE',
      match_score_percentage: 91,
      farmer: {
        id: 14,
        email: 'ramesh.farmer@agri.in',
        full_name: 'Ramesh Agro Farms',
        role: 'FARMER',
        verification_status: 'VERIFIED',
        state: 'Maharashtra',
        district: 'Nashik'
      }
    },
    {
      id: 1003,
      farmer_id: 19,
      crop_name: 'Rice',
      variety: 'Basmati 1121',
      quantity_kg: 10000,
      price_per_kg_expected: 34.0,
      grade: 'PREMIUM',
      harvest_date: '2026-08-18',
      storage_location: 'Amritsar Grain Storage, Punjab',
      state: 'Punjab',
      district: 'Amritsar',
      status: 'AVAILABLE',
      match_score_percentage: 88,
      farmer: {
        id: 19,
        email: 'pb.fpo@agri.in',
        full_name: 'Majha Agro Producers Org',
        role: 'FPO',
        verification_status: 'VERIFIED',
        state: 'Punjab',
        district: 'Amritsar'
      }
    },
    {
      id: 1004,
      farmer_id: 22,
      crop_name: 'Onion',
      variety: 'Red Nashik',
      quantity_kg: 8000,
      price_per_kg_expected: 24.0,
      grade: 'GRADE_A',
      harvest_date: '2026-08-21',
      storage_location: 'Pimpalgaon Storage, Nashik',
      state: 'Maharashtra',
      district: 'Nashik',
      status: 'AVAILABLE',
      match_score_percentage: 84,
      farmer: {
        id: 22,
        email: 'kisan.onion@agri.in',
        full_name: 'Nashik Agro Producer Co.',
        role: 'FPO',
        verification_status: 'VERIFIED',
        state: 'Maharashtra',
        district: 'Nashik'
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B]">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Produce Lots</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">1,420 Lots</h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +18.4% this week
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Store className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Escrow Contracts</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">₹42.8 Lakh</h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3" /> 100% Protected
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Coins className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Matched Buyers</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">94.2% Score</h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  AI Multi-Criteria Match
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Scale className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Post-Harvest Storage</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">8,450 Qtl</h3>
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                  Available in 42 Warehouses
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Truck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* ML Price Forecast Component */}
          <MarketTrendsChart />

          {/* Produce Marketplace Table */}
          <MarketplaceTable
            lots={mockLots}
            onSelectLot={(lot) => setSelectedLotForBidding(lot)}
          />

          {/* Bidding Modal */}
          <BiddingModal
            lot={selectedLotForBidding}
            onClose={() => setSelectedLotForBidding(null)}
            onSuccess={() => {
              setSelectedLotForBidding(null);
            }}
          />
        </main>
      </div>
    </div>
  );
}
