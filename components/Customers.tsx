
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Customer, Sale } from '../types';

interface CustomersProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onRepayment: (customerId: string, amount: number) => void;
  sales: Sale[];
  currency: string;
}

const Customers: React.FC<CustomersProps> = ({ customers, onAddCustomer, onRepayment, sales, currency }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newCust, setNewCust] = useState<Partial<Customer>>({ name: '', phone: '' });
  const [selectedHistoryCustomer, setSelectedHistoryCustomer] = useState<Customer | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState<number>(0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name || !newCust.phone) return;
    
    onAddCustomer({
      id: Math.random().toString(36).substr(2, 9),
      name: newCust.name!,
      phone: newCust.phone!,
      address: '',
      notes: '',
      totalSpent: 0,
      pendingBalance: 0
    });
    setNewCust({ name: '', phone: '' });
    setShowAdd(false);
  };

  const handleRepayment = () => {
    if (!selectedHistoryCustomer || repaymentAmount <= 0) return;
    onRepayment(selectedHistoryCustomer.id, repaymentAmount);
    setRepaymentAmount(0);
    setSelectedHistoryCustomer(null);
  };

  const getCustomerSales = (id: string) => sales.filter(s => s.customerId === id);

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
        <div>
            <span className="clay-text-convex text-[10px] font-black text-[#2AB9A9] uppercase tracking-widest mb-3">Merchant Ledger</span>
            <h1 className="text-5xl font-black text-[#4A4A4A]">Client Base</h1>
        </div>
        <button 
            onClick={() => setShowAdd(!showAdd)}
            className={`px-14 py-6 bg-[#2AB9A9] text-white font-black uppercase tracking-widest text-lg rounded-full shadow-2xl transition-all ${showAdd ? 'bg-red-50 scale-95' : 'hover:scale-105 active:scale-95'}`}
        >
            {showAdd ? 'Close' : 'Add Client +'}
        </button>
      </div>

      {showAdd && (
        <div className="clay-card p-12 mb-16 bg-white shadow-2xl animate-slide-up-fade border-4 border-white/60">
            <h3 className="text-3xl font-black mb-10 text-[#4A4A4A] uppercase tracking-tighter">Register Customer</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-gray-400 ml-4 mb-1 block">Name</label>
                    <input type="text" required className="w-full clay-pill-container px-8 py-4 text-lg font-bold outline-none" placeholder="Full Name" value={newCust.name} onChange={(e) => setNewCust({...newCust, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-gray-400 ml-4 mb-1 block">Phone / WhatsApp</label>
                    <input type="tel" required className="w-full clay-pill-container px-8 py-4 text-lg font-bold outline-none" placeholder="e.g. 919876543210" value={newCust.phone} onChange={(e) => setNewCust({...newCust, phone: e.target.value})} />
                </div>
                <div className="md:col-span-2 flex justify-end mt-6">
                    <button type="submit" className="px-16 py-5 clay-button-primary bg-[#2AB9A9] border-none text-white font-black uppercase tracking-widest rounded-full shadow-2xl">
                        Save Client
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* Customer History Modal */}
      {selectedHistoryCustomer && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/50 backdrop-blur-md">
              <div className="clay-card p-8 md:p-12 max-w-2xl w-full bg-white max-h-[90vh] overflow-y-auto no-scrollbar relative border-4 border-white/60 animate-pop">
                  <button onClick={() => setSelectedHistoryCustomer(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-black text-2xl hover:bg-gray-200 transition-colors">×</button>
                  
                  <div className="mb-10">
                      <h2 className="text-4xl font-black text-[#4A4A4A] tracking-tight">{selectedHistoryCustomer.name}</h2>
                      <p className="text-[#2AB9A9] font-black text-xl mb-6 uppercase tracking-widest">{selectedHistoryCustomer.phone}</p>
                      
                      <div className={`p-8 rounded-[40px] border-2 border-dashed flex flex-col items-center text-center ${selectedHistoryCustomer.pendingBalance > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                          <div className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Debt Balance</div>
                          <div className={`text-5xl font-black mb-6 ${selectedHistoryCustomer.pendingBalance > 0 ? 'text-red-500' : 'text-green-500'}`}>{currency}{selectedHistoryCustomer.pendingBalance.toFixed(2)}</div>
                          
                          {selectedHistoryCustomer.pendingBalance > 0 && (
                              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-sm">
                                  <input 
                                      type="number" placeholder="Amt"
                                      className="w-full px-6 py-4 rounded-3xl border-2 border-white shadow-inner text-lg font-black outline-none bg-white/60"
                                      value={repaymentAmount || ''} onChange={e => setRepaymentAmount(Number(e.target.value))}
                                  />
                                  <button onClick={handleRepayment} className="w-full sm:w-auto clay-button-primary bg-[#2AB9A9] border-none text-white px-10 py-4 rounded-3xl text-sm font-black uppercase shadow-lg transition-all">Settle Dues</button>
                              </div>
                          )}
                      </div>
                  </div>
                  
                  <div className="space-y-6">
                      <h4 className="text-[12px] font-black uppercase text-gray-300 tracking-[0.2em] mb-4 border-b pb-2">Purchase History</h4>
                      {getCustomerSales(selectedHistoryCustomer.id).length === 0 ? (
                        <p className="text-center py-20 text-gray-400 italic font-black uppercase tracking-widest opacity-30">No Transactions Found</p>
                      ) : (
                        getCustomerSales(selectedHistoryCustomer.id).sort((a,b) => b.timestamp - a.timestamp).map(sale => (
                          <div key={sale.id} className="p-6 bg-gray-50 rounded-[35px] border-2 border-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:shadow-md transition-shadow">
                              <div className="flex-1">
                                <div className="flex items-center justify-between md:justify-start gap-4 mb-2">
                                  <span className="font-black text-sm text-[#4A4A4A]">{new Date(sale.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                  <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${sale.paymentType === 'pending' ? 'bg-red-100 text-red-500' : 'bg-white text-gray-400 shadow-sm'}`}>{sale.paymentType}</span>
                                </div>
                                <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider truncate max-w-[300px]">
                                  {sale.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-3xl font-black text-[#6A4FBF] tracking-tighter">{currency}{sale.total.toFixed(2)}</span>
                              </div>
                          </div>
                        ))
                      )}
                  </div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {customers.map(customer => {
              const custSales = getCustomerSales(customer.id);
              const lastVisit = custSales.length > 0 ? new Date(Math.max(...custSales.map(s => s.timestamp))).toLocaleDateString() : 'Never';
              return (
                  <div 
                    key={customer.id} 
                    onClick={() => { setSelectedHistoryCustomer(customer); setRepaymentAmount(0); }}
                    className="clay-card p-10 bg-white flex flex-col gap-8 border-2 border-white hover:border-[#2AB9A9]/30 transition-all cursor-pointer group active:scale-95"
                  >
                      <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-[30px] bg-[#2AB9A9]/10 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">👤</div>
                          <div>
                              <h3 className="font-black text-2xl text-[#4A4A4A] uppercase tracking-tighter">{customer.name}</h3>
                              <p className="text-[#2AB9A9] font-black text-sm uppercase tracking-widest">{customer.phone}</p>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div className={`p-5 rounded-[30px] border-2 border-dashed ${customer.pendingBalance > 0 ? 'bg-red-50 border-red-300 animate-pulse' : 'bg-gray-50 border-gray-100'}`}>
                              <div className="text-[9px] font-black uppercase text-gray-400 mb-1 tracking-widest">Dues</div>
                              <div className={`text-xl font-black ${customer.pendingBalance > 0 ? 'text-red-500' : 'text-gray-300'}`}>{currency}{customer.pendingBalance.toFixed(2)}</div>
                          </div>
                          <div className="p-5 rounded-[30px] border-2 border-dashed bg-[#F8E9DD]/20 border-white">
                              <div className="text-[9px] font-black uppercase text-gray-400 mb-1 tracking-widest">Spent</div>
                              <div className="text-xl font-black text-[#4A4A4A]">{currency}{customer.totalSpent.toFixed(2)}</div>
                          </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-[#2AB9A9] text-[11px] font-black uppercase tracking-widest">
                          Last Sale: {lastVisit}
                          <span className="bg-[#2AB9A9]/10 p-2 rounded-full group-hover:translate-x-1 transition-transform">➔</span>
                      </div>
                  </div>
              );
          })}
          {customers.length === 0 && (
              <div className="col-span-full py-40 text-center opacity-30 text-gray-400 font-black flex flex-col items-center">
                  <div className="text-9xl mb-8 grayscale">👥</div>
                  <div className="text-2xl uppercase tracking-[0.2em]">No Clients Onboarded</div>
              </div>
          )}
      </div>
    </div>
  );
};

export default Customers;
