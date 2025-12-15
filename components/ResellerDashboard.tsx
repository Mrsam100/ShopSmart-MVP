
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface ResellerProps {
  currency: string;
}

const ResellerDashboard: React.FC<ResellerProps> = ({ currency }) => {
  const handleCopyLink = () => {
    let resellerId = localStorage.getItem('ss_reseller_id');
    if (!resellerId) {
      resellerId = Math.random().toString(36).substr(2, 6).toUpperCase();
      localStorage.setItem('ss_reseller_id', resellerId);
    }
    
    const referralLink = `${window.location.origin}/join?ref=${resellerId}`;
    
    navigator.clipboard.writeText(referralLink).then(() => {
        alert("Referral Link Copied to Clipboard!\n" + referralLink);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert("Referral ID: " + resellerId);
    });
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
        <div>
            <span className="clay-text-convex text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest mb-3">Partnership</span>
            <h1 className="text-5xl font-black text-[#4A4A4A]">Reseller Hub</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
            <button 
                onClick={handleCopyLink}
                className="px-10 py-5 clay-button-primary text-white font-black uppercase tracking-widest text-xs rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
                Copy Refer Link
            </button>
            <button className="px-10 py-5 bg-white text-[#6A4FBF] font-black uppercase tracking-widest text-xs rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-white">Payout Config</button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="clay-card p-10 bg-[#6A4FBF] text-white shadow-2xl scale-105 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-3 block">Total Commissions</span>
              <div className="text-4xl font-black tracking-tighter">{currency}1,245.00</div>
              <div className="mt-8 flex items-center gap-3">
                  <span className="bg-white/20 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">Diamond Tier</span>
              </div>
          </div>
          <div className="clay-card p-10 bg-white shadow-xl border-4 border-white">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-300 mb-3 block">Active Referrals</span>
              <div className="text-4xl font-black text-[#4A4A4A] tracking-tighter">18</div>
              <div className="mt-8 text-[10px] font-black text-[#2AB9A9] uppercase tracking-widest flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2AB9A9] animate-pulse"></span>
                Live Merchants
              </div>
          </div>
          <div className="clay-card p-10 bg-white shadow-xl border-4 border-white">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-300 mb-3 block">Avg. Store Sales</span>
              <div className="text-4xl font-black text-[#4A4A4A] tracking-tighter">{currency}840.20</div>
              <div className="mt-8 text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6A4FBF] opacity-50"></span>
                Last 30 Days
              </div>
          </div>
          <div className="clay-card p-10 bg-[#FFB673] text-white shadow-xl border-4 border-white">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-3 block">Reward Rate</span>
              <div className="text-4xl font-black tracking-tighter">20%</div>
              <div className="mt-8 text-[10px] font-black text-white/60 uppercase tracking-widest font-serif italic">Growth Leader Tier</div>
          </div>
      </div>

      <div className="clay-card p-12 bg-white/95 border-4 border-white shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
              <h3 className="text-3xl font-black text-[#4A4A4A] uppercase tracking-tighter">Onboarded Merchants</h3>
              <div className="clay-pill-container px-6 py-2 bg-gray-50 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Showing <span className="text-[#6A4FBF]">Last 4 Signups</span>
              </div>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left min-w-[800px]">
                  <thead>
                      <tr className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em] border-b-4 border-gray-50">
                          <th className="pb-8 px-6">Merchant Business</th>
                          <th className="pb-8 px-6">Signup Date</th>
                          <th className="pb-8 px-6">Access Status</th>
                          <th className="pb-8 px-6 text-right">Commission (Total)</th>
                      </tr>
                  </thead>
                  <tbody>
                      {[
                          { name: "Apex Grocery", type: "Retail", date: "2024-11-12", status: "Active", earned: 245.00, icon: "🛒", color: "#FFB673" },
                          { name: "Elite Salon", type: "Service", date: "2025-01-02", status: "Active", earned: 112.50, icon: "✂️", color: "#E6007A" },
                          { name: "Bridge Meds", type: "Pharma", date: "2024-12-15", status: "Expired", earned: 450.00, icon: "💊", color: "#6A4FBF" },
                          { name: "Fresh Produce", type: "Vendor", date: "2025-02-10", status: "Trial", earned: 0.00, icon: "🍎", color: "#2AB9A9" },
                      ].map((m, i) => (
                          <tr key={i} className="border-b-2 border-gray-50 group hover:bg-[#F8E9DD]/30 transition-all cursor-pointer">
                              <td className="py-10 px-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-[22px] bg-white shadow-lg border-2 border-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform" style={{ color: m.color }}>{m.icon}</div>
                                    <div>
                                        <div className="font-black text-2xl text-[#4A4A4A] group-hover:text-[#6A4FBF] transition-colors tracking-tight">{m.name}</div>
                                        <div className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.15em] mt-1">{m.type}</div>
                                    </div>
                                </div>
                              </td>
                              <td className="py-10 px-6">
                                  <div className="font-black text-gray-500 text-sm">{m.date}</div>
                                  <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">Verified Partner</div>
                              </td>
                              <td className="py-10 px-6">
                                  <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border-2 ${
                                      m.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 
                                      m.status === 'Trial' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' : 'bg-red-50 text-red-500 border-red-100 grayscale-[0.5]'
                                  }`}>
                                      {m.status}
                                  </span>
                              </td>
                              <td className="py-10 px-6 text-right">
                                  <div className="font-black text-3xl text-[#4A4A4A] tracking-tighter">{currency}{m.earned.toFixed(2)}</div>
                                  <div className="text-[9px] font-black text-[#2AB9A9] uppercase tracking-widest mt-1">Net Earnings</div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          
          <div className="mt-12 p-8 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                  <div className="text-3xl">💡</div>
                  <p className="text-sm font-medium text-gray-500 max-w-md">Help your trial merchants set up their first 10 products to increase conversion to Active by <span className="font-black text-[#6A4FBF]">60%</span>.</p>
              </div>
              <button className="px-8 py-3 bg-white text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-full hover:text-[#6A4FBF] transition-colors border border-white">Download Toolkit</button>
          </div>
      </div>
    </div>
  );
};

export default ResellerDashboard;
