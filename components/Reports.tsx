
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { Sale, Product } from '../types';

interface ReportsProps {
  sales: Sale[];
  products: Product[];
  currency: string;
  shopName: string;
}

const Reports: React.FC<ReportsProps> = ({ sales, products, currency, shopName }) => {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentType, setPaymentType] = useState<string>('all');

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const saleDate = new Date(s.timestamp).toISOString().split('T')[0];
      const matchesDate = saleDate >= startDate && saleDate <= endDate;
      const matchesPayment = paymentType === 'all' || s.paymentType === paymentType;
      return matchesDate && matchesPayment;
    });
  }, [sales, startDate, endDate, paymentType]);
  
  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.total, 0);
  const totalOrders = filteredSales.length;
  
  const paymentBreakdown = filteredSales.reduce((acc, s) => {
    acc[s.paymentType] = (acc[s.paymentType] || 0) + s.total;
    return acc;
  }, {} as Record<string, number>);

  const allTimePending = sales.filter(s => s.paymentType === 'pending').reduce((acc, s) => acc + s.total, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in print:pt-0">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 print:hidden">
        <div>
          <span className="clay-text-convex text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest mb-3">Insights</span>
          <h1 className="text-5xl font-black text-[#4A4A4A] tracking-tighter">Business Stats</h1>
        </div>
        <div className="flex gap-4">
            <button onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setStartDate(today);
                setEndDate(today);
            }} className="px-6 py-4 bg-white text-[#4A4A4A] font-black uppercase tracking-widest text-[10px] rounded-full shadow-sm hover:shadow-md transition-all border border-white">Today</button>
            <button onClick={handlePrint} className="clay-button px-10 py-4 font-black uppercase tracking-widest text-xs bg-white border-2 border-white">Export Snapshot</button>
        </div>
      </div>

      {/* Enhanced Report Filtering Controls */}
      <div className="clay-card p-8 mb-16 bg-white/60 border-4 border-white/80 flex flex-wrap items-end gap-8 print:hidden shadow-2xl">
          <div className="flex-1 min-w-[240px]">
              <label className="text-[11px] font-black uppercase text-gray-400 ml-5 mb-2 block tracking-widest">Start Date</label>
              <div className="relative">
                  <input 
                    type="date" 
                    className="w-full clay-pill-container px-8 py-4 outline-none font-bold text-sm bg-white border-2 border-transparent focus:border-[#6A4FBF]/20 transition-all shadow-lg"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
              </div>
          </div>
          <div className="flex-1 min-w-[240px]">
              <label className="text-[11px] font-black uppercase text-gray-400 ml-5 mb-2 block tracking-widest">End Date</label>
              <div className="relative">
                  <input 
                    type="date" 
                    className="w-full clay-pill-container px-8 py-4 outline-none font-bold text-sm bg-white border-2 border-transparent focus:border-[#6A4FBF]/20 transition-all shadow-lg"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
              </div>
          </div>
          <div className="flex-1 min-w-[240px]">
              <label className="text-[11px] font-black uppercase text-gray-400 ml-5 mb-2 block tracking-widest">Payment Method</label>
              <div className="relative">
                  <select 
                    className="w-full clay-pill-container px-8 py-4 outline-none font-bold text-sm bg-white appearance-none cursor-pointer border-2 border-transparent focus:border-[#6A4FBF]/20 transition-all shadow-lg"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                      <option value="all">All Methods</option>
                      <option value="cash">Cash Only</option>
                      <option value="card">Card Only</option>
                      <option value="wallet">Digital Wallet</option>
                      <option value="pending">Due/Credit</option>
                  </select>
                  <div className="absolute right-6 top-4 opacity-30 pointer-events-none">▼</div>
              </div>
          </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block text-center mb-12 border-b-4 border-black pb-8">
          <h1 className="text-5xl font-black mb-2 uppercase tracking-tighter">{shopName}</h1>
          <p className="text-sm font-bold tracking-[0.5em] uppercase text-gray-500">Sales Performance Summary</p>
          <div className="w-16 h-1 bg-black mx-auto mt-6 mb-4"></div>
          <p className="text-xs font-medium uppercase tracking-widest">Range: {startDate} — {endDate}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
          <div className="clay-card p-12 bg-[#6A4FBF] text-white shadow-2xl scale-105 print:shadow-none print:scale-100 print:text-black print:bg-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
              <span className="text-[11px] font-black uppercase text-white/50 mb-4 block print:text-black tracking-[0.2em]">Period Revenue</span>
              <div className="text-5xl font-black tracking-tighter">{currency}{totalRevenue.toFixed(2)}</div>
              <div className="mt-6 text-[10px] font-black text-white/30 uppercase tracking-[0.1em] print:hidden">Reflecting Active Filters</div>
          </div>
          <div className="clay-card p-12 bg-white shadow-xl print:shadow-none print:bg-gray-50 border-4 border-white">
              <span className="text-[11px] font-black uppercase text-gray-300 mb-4 block tracking-[0.2em]">Orders Count</span>
              <div className="text-5xl font-black text-[#4A4A4A] tracking-tighter">{totalOrders}</div>
              <div className="mt-6 text-[10px] font-black text-gray-200 uppercase tracking-[0.1em] print:hidden">Unique Transactions</div>
          </div>
          <div className="clay-card p-12 bg-[#FFD447] text-[#1c1917] shadow-xl print:shadow-none print:bg-gray-100 border-4 border-white">
              <span className="text-[11px] font-black uppercase text-black/40 mb-4 block tracking-[0.2em]">Outstanding Dues</span>
              <div className="text-5xl font-black tracking-tighter">{currency}{allTimePending.toFixed(2)}</div>
              <div className="mt-6 text-[10px] font-black text-black/20 uppercase tracking-[0.1em] print:hidden">Global Balances</div>
          </div>
          <div className="clay-card p-12 bg-[#2AB9A9] text-white shadow-xl print:shadow-none print:text-black print:bg-gray-50 border-4 border-white">
              <span className="text-[11px] font-black uppercase text-white/50 mb-4 block print:text-black tracking-[0.2em]">Cash In Hand</span>
              <div className="text-5xl font-black tracking-tighter">{currency}{(paymentBreakdown['cash'] || 0).toFixed(2)}</div>
              <div className="mt-6 text-[10px] font-black text-white/30 uppercase tracking-[0.1em] print:hidden">Period Cashflow</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 clay-card p-14 bg-white/95 border-4 border-white shadow-2xl print:shadow-none print:border-none print:p-0 backdrop-blur-md">
              <div className="flex justify-between items-center mb-14">
                  <h3 className="text-3xl font-black text-[#4A4A4A] print:text-xl uppercase tracking-tighter">Transaction Ledger</h3>
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Live Audit</div>
              </div>
              <div className="space-y-8 print:space-y-6">
                  {filteredSales.length === 0 ? (
                      <div className="text-center py-24 text-gray-300 italic opacity-50 flex flex-col items-center">
                          <div className="text-7xl mb-6">🔍</div>
                          <div className="font-black uppercase tracking-[0.3em]">No data found for current filters.</div>
                      </div>
                  ) : (
                    filteredSales.map(sale => (
                        <div key={sale.id} className="flex justify-between items-center p-8 bg-[#F8E9DD]/20 rounded-[45px] border-2 border-white shadow-sm hover:shadow-lg transition-all group print:border-none print:bg-gray-50 print:p-6 print:rounded-2xl">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 rounded-[22px] bg-white flex items-center justify-center text-2xl shadow-md border border-gray-50 group-hover:scale-110 transition-transform print:hidden">🧾</div>
                                <div>
                                    <div className="font-black text-[#4A4A4A] text-xl print:text-lg tracking-tight">
                                        {new Date(sale.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <div className="text-[10px] text-[#6A4FBF] uppercase font-black tracking-widest bg-white px-3 py-1 rounded-full shadow-sm print:text-gray-400">
                                            {sale.paymentType}
                                        </div>
                                        <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                                            {sale.items.length} items • {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-[#6A4FBF] tracking-tighter print:text-2xl print:text-black group-hover:scale-105 transition-transform">{currency}{sale.total.toFixed(2)}</div>
                                <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">Order Total</div>
                            </div>
                        </div>
                    ))
                  )}
              </div>
          </div>

          <div className="space-y-10 print:hidden">
              <div className="clay-card p-12 bg-[#6A4FBF] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="text-5xl mb-8 group-hover:rotate-12 transition-transform inline-block">📊</div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Generate Audit</h3>
                  <p className="text-white/60 text-sm mb-10 leading-relaxed">Download a structured PDF statement based on your selected date range and filters.</p>
                  <button onClick={handlePrint} className="w-full py-6 bg-white text-[#6A4FBF] font-black uppercase tracking-[0.25em] text-xs rounded-full shadow-xl hover:scale-[1.03] active:scale-95 transition-all">
                      Export Ledger
                  </button>
              </div>
              
              <div className="clay-card p-12 bg-white border-4 border-white shadow-xl">
                 <h3 className="text-xl font-black mb-10 text-[#4A4A4A] uppercase tracking-[0.25em] border-b-2 border-gray-50 pb-4">Revenue Mix</h3>
                 <div className="space-y-6">
                    {['cash', 'card', 'wallet', 'pending'].map(type => {
                       const amount = paymentBreakdown[type] || 0;
                       const percentage = totalRevenue > 0 ? (amount / totalRevenue * 100) : 0;
                       return (
                           <div key={type} className="group">
                              <div className="flex justify-between items-center mb-2">
                                 <span className="text-[11px] font-black uppercase text-gray-300 tracking-[0.2em] group-hover:text-[#6A4FBF] transition-colors">{type}</span>
                                 <span className="font-black text-[#4A4A4A] text-lg">{currency}{amount.toFixed(2)}</span>
                              </div>
                              <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                                  <div 
                                    className={`h-full transition-all duration-1000 ${type === 'cash' ? 'bg-[#2AB9A9]' : type === 'card' ? 'bg-[#6A4FBF]' : type === 'wallet' ? 'bg-[#FFB673]' : 'bg-[#FFD447]'}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                              </div>
                           </div>
                       );
                    })}
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Reports;
