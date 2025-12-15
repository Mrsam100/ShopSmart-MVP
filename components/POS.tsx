
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, Sale, Customer, SaleItem } from '../types';

interface POSProps {
  products: Product[];
  customers: Customer[];
  onCompleteSale: (sale: Sale) => void;
  shopName: string;
  currency: string;
  categories: string[];
}

const POS: React.FC<POSProps> = ({ products, onCompleteSale, customers, shopName, currency, categories }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentType, setPaymentType] = useState<Sale['paymentType']>('cash');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [editingItemDiscount, setEditingItemDiscount] = useState<string | null>(null);
  const customerRef = useRef<HTMLDivElement>(null);
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [showReceipt, setShowReceipt] = useState<Sale | null>(null);
  const [showSummary, setShowSummary] = useState<Sale | null>(null);

  // Calculate subtotal considering per-item discounts
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
        const itemSubtotal = item.price * item.quantity;
        let itemDiscounted = itemSubtotal;
        if (item.discount) {
            if (item.discountType === 'percent') {
                itemDiscounted = itemSubtotal * (1 - item.discount / 100);
            } else {
                itemDiscounted = Math.max(0, itemSubtotal - item.discount);
            }
        }
        return acc + itemDiscounted;
    }, 0);
  }, [cart]);
  
  const discountAmount = useMemo(() => {
    if (discountType === 'percent') {
      return subtotal * (discountValue / 100);
    }
    return discountValue;
  }, [subtotal, discountValue, discountType]);

  const total = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerRef.current && !customerRef.current.contains(event.target as Node)) {
        setShowCustomerResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { 
        productId: product.id, name: product.name, price: product.price, quantity: 1, discount: 0, discountType: 'fixed'
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    const existing = cart.find(item => item.productId === id);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(item => item.productId === id ? { ...item, quantity: item.quantity - 1 } : item));
    } else {
      setCart(cart.filter(item => item.productId !== id));
    }
  };

  const clearItemFromCart = (id: string) => {
    setCart(cart.filter(item => item.productId !== id));
  };

  const updateItemDiscount = (id: string, value: number, type: 'fixed' | 'percent') => {
      setCart(cart.map(item => item.productId === id ? { ...item, discount: value, discountType: type } : item));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const sale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      items: cart,
      subtotal,
      discount: discountValue,
      discountType,
      total,
      paymentType,
      customerId: selectedCustomerId || undefined
    };
    onCompleteSale(sale);
    setShowReceipt(sale);
    setCart([]);
    setSelectedCustomerId('');
    setCustomerSearch('');
    setPaymentType('cash');
    setDiscountValue(0);
  };

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return [];
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
      c.phone.includes(customerSearch)
    ).slice(0, 5);
  }, [customers, customerSearch]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const shareReceipt = (saleToShare: Sale) => {
    const customer = customers.find(c => c.id === saleToShare.customerId);
    let phone = customer?.phone || '';
    
    if (!phone) {
      const manualPhone = window.prompt("Enter WhatsApp number (e.g., 919876543210):", "");
      if (manualPhone === null) return;
      phone = manualPhone.replace(/\D/g, '');
    }

    const itemString = saleToShare.items.map(i => {
        const lineTotal = i.price * i.quantity;
        let finalLineTotal = lineTotal;
        if (i.discount) {
            finalLineTotal = i.discountType === 'percent' ? lineTotal * (1 - i.discount / 100) : Math.max(0, lineTotal - i.discount);
        }
        return `• ${i.name} (x${i.quantity}) - ${currency}${finalLineTotal.toFixed(2)}`;
    }).join('%0A');
    
    const discountStr = saleToShare.discount > 0 ? `%0ADiscount: -${currency}${((saleToShare.subtotal - saleToShare.total)).toFixed(2)}` : '';
    const message = `*${shopName} - Digital Receipt*%0A---------------------------%0A${itemString}%0A---------------------------%0ASubtotal: ${currency}${saleToShare.subtotal.toFixed(2)}${discountStr}%0A*TOTAL: ${currency}${saleToShare.total.toFixed(2)}*%0APayment: ${saleToShare.paymentType.toUpperCase()}%0A%0AThank you for shopping with us!%0A_Powered by ShopSmart_`;
    
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = search.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory && p.status === 'active';
    });
  }, [products, search, selectedCategory]);

  const getItemTotal = (item: SaleItem) => {
      const lineTotal = item.price * item.quantity;
      if (!item.discount) return lineTotal;
      return item.discountType === 'percent' ? lineTotal * (1 - item.discount / 100) : Math.max(0, lineTotal - item.discount);
  };

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      
      {/* Detailed Sale Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
            <div className="clay-card p-10 max-w-lg w-full bg-white relative overflow-hidden border-4 border-white/80 shadow-2xl animate-slide-up-fade no-scrollbar overflow-y-auto max-h-[90vh]">
                <button onClick={() => setShowSummary(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black font-black text-2xl">×</button>
                <div className="text-center mb-8">
                    <div className="text-4xl mb-2">📋</div>
                    <h3 className="text-2xl font-black text-[#4A4A4A] uppercase tracking-widest">{shopName}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Transaction ID: {showSummary.id}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{new Date(showSummary.timestamp).toLocaleString()}</p>
                </div>
                
                <div className="space-y-4 mb-8">
                   <div className="text-[10px] font-black uppercase text-gray-400 border-b border-gray-100 pb-2 mb-2">Order Items</div>
                   {showSummary.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm font-bold">
                         <div className="text-[#4A4A4A]">
                             {item.name} <span className="text-gray-400 text-xs ml-2">x{item.quantity}</span>
                         </div>
                         <div className="text-[#6A4FBF]">{currency}{getItemTotal(item).toFixed(2)}</div>
                      </div>
                   ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
                    <div className="flex justify-between text-xs font-black text-gray-400 uppercase">
                        <span>Subtotal</span>
                        <span>{currency}{showSummary.subtotal.toFixed(2)}</span>
                    </div>
                    {showSummary.discount > 0 && (
                      <div className="flex justify-between text-xs font-black text-red-500 uppercase">
                        <span>Discount ({showSummary.discountType === 'percent' ? showSummary.discount + '%' : currency + showSummary.discount})</span>
                        <span>-{currency}{(showSummary.subtotal - showSummary.total).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-black text-[#4A4A4A] uppercase tracking-widest">Grand Total</span>
                        <span className="text-4xl font-black text-[#6A4FBF] tracking-tighter">{currency}{showSummary.total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                   <div className="text-center">
                       <div className="text-[9px] font-black uppercase text-gray-300">Method</div>
                       <div className="text-xs font-black text-[#4A4A4A] uppercase">{showSummary.paymentType}</div>
                   </div>
                   <div className="text-center">
                       <div className="text-[9px] font-black uppercase text-gray-300">Customer</div>
                       <div className="text-xs font-black text-[#4A4A4A] truncate">{customers.find(c => c.id === showSummary.customerId)?.name || "Guest"}</div>
                   </div>
                </div>

                <div className="mt-10 flex gap-4">
                    <button onClick={() => shareReceipt(showSummary)} className="flex-1 py-4 bg-[#25D366] text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg">Share Receipt</button>
                    <button onClick={() => window.print()} className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-400 font-black text-xs uppercase tracking-widest rounded-full">Print Slip</button>
                </div>
            </div>
        </div>
      )}

      {/* Checkout Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="clay-card p-6 bg-white/40 border-2 border-white/60 min-h-[600px] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <input 
                    type="text" placeholder="Search name or SKU..."
                    className="clay-pill-container px-6 py-3 outline-none font-bold text-sm bg-white/60 flex-1 w-full md:max-w-xs border-2 border-transparent focus:border-[#6A4FBF]/20 transition-all shadow-inner"
                    value={search} onChange={e => setSearch(e.target.value)}
                />
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                    <button 
                        onClick={() => setSelectedCategory('All')}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'All' ? 'bg-[#6A4FBF] text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-white/80'}`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[#6A4FBF] text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-white/80'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 overflow-y-auto no-scrollbar pb-10 flex-grow">
                {filtered.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => addToCart(p)} 
                      className="clay-card p-5 text-center hover:scale-[1.03] active:scale-95 transition-all bg-white group flex flex-col items-center justify-center gap-2 border-2 border-white/80 shadow-md relative h-44"
                    >
                        {p.stock < 10 && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-md z-10"></div>
                        )}
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden mb-2 bg-[#F8E9DD]/50 border border-white group-hover:scale-110 transition-transform">
                          {p.image ? (
                            <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                          ) : (
                            <span className="text-3xl">{p.category === 'Bakery' ? '🍞' : p.category === 'Dairy' ? '🧀' : p.category === 'Grocery' ? '🥛' : '📦'}</span>
                          )}
                        </div>
                        <div className="font-black text-xs text-[#4A4A4A] truncate w-full px-2 uppercase tracking-tighter">{p.name}</div>
                        <div className="text-[#6A4FBF] font-black text-lg">{currency}{p.price.toFixed(2)}</div>
                        <div className="text-[8px] text-gray-400 font-bold uppercase">{p.sku || 'No SKU'}</div>
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="space-y-6">
        <div className="clay-card p-8 bg-white shadow-2xl sticky top-32 border-4 border-white/80 flex flex-col min-h-[600px]">
            <h2 className="text-2xl font-black mb-8 flex items-center justify-between text-[#4A4A4A] uppercase tracking-tighter">
                <span>Bill Detail</span>
                <span className="bg-[#6A4FBF] text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-md">{cart.length} items</span>
            </h2>

            <div className="space-y-4 mb-6 overflow-y-auto no-scrollbar flex-grow pr-1">
                {cart.length === 0 ? (
                    <div className="text-center py-20 opacity-30 italic font-black text-gray-400 flex flex-col items-center">
                        <div className="text-5xl mb-6 grayscale">🛒</div>
                        <div className="uppercase tracking-[0.2em] text-sm">Cart is Empty</div>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.productId} className="flex flex-col bg-gray-50/50 p-4 rounded-[28px] border-2 border-white shadow-sm hover:shadow-md transition-shadow group gap-2">
                            <div className="flex justify-between items-center">
                                <div className="flex-1 min-w-0 pr-2">
                                    <div className="font-black text-sm text-[#4A4A4A] truncate uppercase tracking-tighter">{item.name}</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                                        {currency}{item.price.toFixed(2)} 
                                        {item.discount ? <span className="text-red-400 ml-1">(-{item.discountType === 'percent' ? item.discount + '%' : currency + item.discount})</span> : ''}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-white/80 rounded-full p-1.5 shadow-inner border border-white/40">
                                      <button onClick={() => removeFromCart(item.productId)} className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center font-black active:scale-90 text-xl shadow-sm border border-white hover:bg-red-500 hover:text-white transition-colors">-</button>
                                      <span className="font-black text-lg min-w-[28px] text-center text-[#4A4A4A]">{item.quantity}</span>
                                      <button onClick={() => {
                                        const p = products.find(prod => prod.id === item.productId);
                                        if(p) addToCart(p);
                                      }} className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black active:scale-90 text-xl shadow-sm border border-white hover:bg-green-500 hover:text-white transition-colors">+</button>
                                    </div>
                                    <button 
                                        onClick={() => clearItemFromCart(item.productId)} 
                                        className="text-gray-300 hover:text-red-500 transition-all p-1 active:scale-90"
                                        title="Remove item"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </div>
                            </div>
                            {/* Per-item Discount Tool */}
                            <div className="flex items-center justify-between gap-2 px-1">
                                {editingItemDiscount === item.productId ? (
                                    <div className="flex-1 flex items-center gap-1 animate-slide-up-fade">
                                        <input 
                                            type="number"
                                            className="flex-1 bg-white border border-white rounded-lg px-2 py-1 text-[10px] font-black outline-none shadow-inner"
                                            placeholder="Amt"
                                            value={item.discount || ''}
                                            onChange={(e) => updateItemDiscount(item.productId, Number(e.target.value), item.discountType || 'fixed')}
                                        />
                                        <div className="flex p-0.5 bg-white rounded-lg shadow-sm border border-gray-100">
                                            <button onClick={() => updateItemDiscount(item.productId, item.discount || 0, 'fixed')} className={`px-2 py-0.5 rounded-md text-[8px] font-black transition-all ${item.discountType === 'fixed' ? 'bg-[#6A4FBF] text-white shadow-md' : 'text-gray-400'}`}>{currency}</button>
                                            <button onClick={() => updateItemDiscount(item.productId, item.discount || 0, 'percent')} className={`px-2 py-0.5 rounded-md text-[8px] font-black transition-all ${item.discountType === 'percent' ? 'bg-[#6A4FBF] text-white shadow-md' : 'text-gray-400'}`}>%</button>
                                        </div>
                                        <button onClick={() => setEditingItemDiscount(null)} className="text-[10px] font-black text-gray-300 ml-1">OK</button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setEditingItemDiscount(item.productId)}
                                        className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-[#6A4FBF] transition-colors"
                                    >
                                        {item.discount ? `Disc Applied: -${item.discountType === 'percent' ? item.discount + '%' : currency + item.discount}` : 'Apply item discount +'}
                                    </button>
                                )}
                                <div className="text-xs font-black text-[#6A4FBF]">{currency}{getItemTotal(item).toFixed(2)}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-100 mt-auto">
                {/* Searchable Customer Dropdown */}
                <div className="relative" ref={customerRef}>
                    <div className="flex items-center clay-pill-container bg-[#F8E9DD]/30 border-2 border-white shadow-inner overflow-hidden">
                        <div className="pl-4 opacity-30">👤</div>
                        <input 
                            type="text" 
                            className="flex-1 px-4 py-4 text-xs font-black outline-none bg-transparent uppercase tracking-wider"
                            placeholder={selectedCustomerId ? selectedCustomer?.name : "Select Customer..."}
                            value={customerSearch}
                            onFocus={() => setShowCustomerResults(true)}
                            onChange={(e) => {
                                setCustomerSearch(e.target.value);
                                setShowCustomerResults(true);
                            }}
                        />
                        {selectedCustomerId && (
                            <button 
                                onClick={() => { setSelectedCustomerId(''); setCustomerSearch(''); }}
                                className="px-4 text-gray-300 hover:text-red-500 font-black text-lg"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {showCustomerResults && filteredCustomers.length > 0 && (
                        <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-[30px] shadow-2xl border-2 border-[#6A4FBF]/10 overflow-hidden z-20 animate-slide-up-fade">
                            {filteredCustomers.map(c => (
                                <button 
                                    key={c.id}
                                    onClick={() => {
                                        setSelectedCustomerId(c.id);
                                        setCustomerSearch('');
                                        setShowCustomerResults(false);
                                    }}
                                    className="w-full px-6 py-4 text-left hover:bg-[#6A4FBF]/5 transition-colors flex justify-between items-center border-b border-gray-50 last:border-0 group"
                                >
                                    <div>
                                        <div className="text-xs font-black text-[#4A4A4A] group-hover:text-[#6A4FBF]">{c.name}</div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{c.phone}</div>
                                    </div>
                                    <div className="text-[8px] font-black uppercase text-[#2AB9A9] opacity-0 group-hover:opacity-100 transition-opacity">Select</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Discount Tool */}
                <div className="p-4 bg-gray-50 rounded-[30px] border-2 border-white shadow-inner">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Global Discount</span>
                    <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-100">
                      <button onClick={() => setDiscountType('fixed')} className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${discountType === 'fixed' ? 'bg-[#6A4FBF] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{currency}</button>
                      <button onClick={() => setDiscountType('percent')} className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${discountType === 'percent' ? 'bg-[#6A4FBF] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>%</button>
                    </div>
                  </div>
                  <input 
                    type="number" 
                    className="w-full bg-white border-2 border-white rounded-[20px] px-5 py-3 text-lg font-black outline-none shadow-md focus:ring-4 focus:ring-[#6A4FBF]/5 transition-all text-center" 
                    placeholder="0.00"
                    value={discountValue || ''}
                    onChange={e => setDiscountValue(Math.max(0, Number(e.target.value)))}
                  />
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black text-gray-300 uppercase px-4 tracking-widest">
                      <span>Subtotal</span>
                      <span>{currency}{subtotal.toFixed(2)}</span>
                    </div>
                    {discountValue > 0 && (
                      <div className="flex justify-between text-xs font-black text-red-500 uppercase px-4 tracking-widest">
                        <span>Savings {discountType === 'percent' ? `(${discountValue}%)` : ''}</span>
                        <span>-{currency}{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end pt-3 px-4 border-t-2 border-gray-50 mt-1">
                        <span className="text-[13px] font-black uppercase tracking-[0.2em] text-[#4A4A4A] mb-1">Total Bill</span>
                        <span className="text-4xl font-black text-[#6A4FBF] tracking-tighter leading-none">{currency}{total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {['cash', 'card', 'wallet', 'pending'].map(t => (
                        <button 
                            key={t} onClick={() => setPaymentType(t as any)} 
                            className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm border-2 ${paymentType === t ? 'bg-[#6A4FBF] text-white border-[#6A4FBF] shadow-xl scale-105 z-10' : 'bg-[#F8E9DD]/50 text-[#4A4A4A] border-white'}`}
                        >
                            {t === 'wallet' ? 'Digi-Wallet' : t}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleCheckout} disabled={cart.length === 0} 
                    className="w-full py-6 clay-button-primary text-xl font-black uppercase tracking-widest rounded-full disabled:opacity-30 shadow-[0_25px_50px_-12px_rgba(106,79,191,0.5)] active:scale-95 transition-all mt-2"
                >
                    Record Sale
                </button>
            </div>
        </div>
      </div>

      {/* WhatsApp Receipt Integration */}
      {showReceipt && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div className="clay-card p-12 max-w-sm w-full bg-white text-center shadow-2xl relative overflow-hidden border-4 border-white/60 animate-pop">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#2AB9A9]"></div>
                <div className="text-6xl mb-6 animate-bounce">🛒</div>
                <h3 className="text-2xl font-black mb-1 text-[#4A4A4A] tracking-tight uppercase">Order Complete!</h3>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-8">Digital Record Saved</p>
                <div className="bg-[#e6fffa] text-[#2AB9A9] p-8 rounded-[40px] mb-10 font-black text-5xl shadow-inner border-2 border-white tracking-tighter">
                    {currency}{showReceipt.total.toFixed(2)}
                </div>
                <div className="space-y-4">
                    <button onClick={() => { setShowSummary(showReceipt); setShowReceipt(null); }} className="w-full py-5 bg-[#6A4FBF] text-white font-black text-sm uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-transform">
                        View Receipt Ledger
                    </button>
                    <button onClick={() => shareReceipt(showReceipt)} className="w-full py-5 bg-[#25D366] text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform">
                        <span className="text-xl">📲</span> WhatsApp Receipt
                    </button>
                    <button onClick={() => setShowReceipt(null)} className="w-full py-3 text-xs font-black uppercase tracking-widest text-gray-300 hover:text-gray-500 transition-colors">
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default POS;
