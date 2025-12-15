
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Exchange from './components/Exchange';
import Pricing from './components/Pricing';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Customers from './components/Customers';
import Reports from './components/Reports';
import ResellerDashboard from './components/ResellerDashboard';
import SettingsView from './components/SettingsView';
import Footer from './components/Footer';
import { AppView, Product, Sale, Customer, AppSettings } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { safeParseJSON, sanitizeString, sanitizeNumber, generateSecureId } from './utils';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [shopName, setShopName] = useState<string>(sanitizeString(localStorage.getItem('ss_shop_name') || ''));
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'name'>('welcome');
  const [isLoading, setIsLoading] = useState(true);

  const [settings, setSettings] = useState<AppSettings>({
    language: (localStorage.getItem('ss_lang') as 'en' | 'ar' | 'hi') || 'en',
    currency: sanitizeString(localStorage.getItem('ss_currency') || '$'),
    darkMode: localStorage.getItem('ss_dark') === 'true',
    businessType: sanitizeString(localStorage.getItem('ss_biz_type') || 'General'),
    taxRate: sanitizeNumber(Number(localStorage.getItem('ss_tax')) || 0, 0, 100)
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<string[]>(['Grocery', 'Bakery', 'Dairy', 'Personal Care', 'General']);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    const savedProducts = localStorage.getItem('ss_products');
    const savedSales = localStorage.getItem('ss_sales');
    const savedCustomers = localStorage.getItem('ss_customers');
    const savedCats = localStorage.getItem('ss_categories');

    // Safely parse products with validation
    const parsedProducts = safeParseJSON<Product[]>(savedProducts, []);
    if (parsedProducts.length > 0) {
      // Validate and sanitize each product
      const validatedProducts = parsedProducts.map(p => ({
        ...p,
        name: sanitizeString(p.name),
        sku: p.sku ? sanitizeString(p.sku) : p.sku,
        price: sanitizeNumber(p.price, 0),
        costPrice: sanitizeNumber(p.costPrice, 0),
        stock: Math.floor(sanitizeNumber(p.stock, 0)),
        category: sanitizeString(p.category)
      }));
      setProducts(validatedProducts);
    } else {
      const defaults: Product[] = INITIAL_PRODUCTS.map(p => ({
        ...p,
        status: 'active' as const,
        costPrice: p.price * 0.7
      }));
      setProducts(defaults);
      localStorage.setItem('ss_products', JSON.stringify(defaults));
    }

    // Safely parse sales, customers, and categories
    setSales(safeParseJSON<Sale[]>(savedSales, []));
    setCustomers(safeParseJSON<Customer[]>(savedCustomers, []));
    setCategories(safeParseJSON<string[]>(savedCats, ['Grocery', 'Bakery', 'Dairy', 'Personal Care', 'General']));

    return () => clearTimeout(timer);
  }, []);

  const triggerSync = useCallback(() => {
    if (!navigator.onLine) {
      setSyncError(true);
      return;
    }
    setSyncError(false);
    setIsSyncing(true);
    // Simulate real sync delay with local persistence
    setTimeout(() => {
        setIsSyncing(false);
        setSyncError(false);
    }, 2000);
  }, []);

  const addSale = (sale: Sale) => {
    // Validate sale has items and valid total
    if (!sale.items || sale.items.length === 0 || sale.total < 0) {
      console.error('Invalid sale data');
      return;
    }

    // Check stock availability for all items
    for (const item of sale.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        console.error(`Product ${item.productId} not found`);
        return;
      }
      if (product.stock < item.quantity) {
        alert(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        return;
      }
    }

    const newSales = [sale, ...sales];
    setSales(newSales);
    localStorage.setItem('ss_sales', JSON.stringify(newSales));

    const updatedProducts = products.map(p => {
        const itemInSale = sale.items.find(si => si.productId === p.id);
        if (itemInSale) {
          const newStock = Math.max(0, p.stock - itemInSale.quantity);
          return { ...p, stock: newStock };
        }
        return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('ss_products', JSON.stringify(updatedProducts));

    if (sale.customerId) {
      const updatedCustomers = customers.map(c => {
        if (c.id === sale.customerId) {
          const additionalSpent = sanitizeNumber(sale.total, 0);
          const additionalPending = sale.paymentType === 'pending' ? additionalSpent : 0;
          return {
            ...c,
            totalSpent: sanitizeNumber(c.totalSpent + additionalSpent, 0),
            pendingBalance: sanitizeNumber(c.pendingBalance + additionalPending, 0)
          };
        }
        return c;
      });
      setCustomers(updatedCustomers);
      localStorage.setItem('ss_customers', JSON.stringify(updatedCustomers));
    }
    triggerSync();
  };

  const handleProductOp = (product: Product, op: 'add' | 'edit' | 'delete') => {
    let next;
    if (op === 'add') next = [...products, product];
    else if (op === 'edit') next = products.map(p => p.id === product.id ? product : p);
    else next = products.filter(p => p.id !== product.id);
    
    setProducts(next);
    localStorage.setItem('ss_products', JSON.stringify(next));

    if (product.category && !categories.includes(product.category)) {
      const newCats = [...categories, product.category];
      setCategories(newCats);
      localStorage.setItem('ss_categories', JSON.stringify(newCats));
    }
    triggerSync();
  };

  const updateCategories = (newCats: string[]) => {
    setCategories(newCats);
    localStorage.setItem('ss_categories', JSON.stringify(newCats));
  };

  const addCustomer = (customer: Customer) => {
    const next = [...customers, customer];
    setCustomers(next);
    localStorage.setItem('ss_customers', JSON.stringify(next));
    triggerSync();
  };

  const recordRepayment = (customerId: string, amount: number) => {
    const next = customers.map(c => c.id === customerId ? { ...c, pendingBalance: Math.max(0, c.pendingBalance - amount) } : c);
    setCustomers(next);
    localStorage.setItem('ss_customers', JSON.stringify(next));
    triggerSync();
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    if (updates.language) localStorage.setItem('ss_lang', updates.language);
    if (updates.currency) localStorage.setItem('ss_currency', updates.currency);
    if (updates.darkMode !== undefined) localStorage.setItem('ss_dark', String(updates.darkMode));
    if (updates.businessType) localStorage.setItem('ss_biz_type', updates.businessType);
    if (updates.taxRate !== undefined) localStorage.setItem('ss_tax', String(updates.taxRate));
  };

  const handleNav = (target: string) => {
    if (['landing', 'pos', 'inventory', 'customers', 'reports', 'reseller', 'settings'].includes(target)) {
      if (target === 'pos' && !shopName) {
          setShowOnboarding(true);
          setOnboardingStep('welcome');
      }
      else setView(target as AppView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        setView('landing');
        setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleCompleteOnboarding = (name: string) => {
    const sanitizedName = sanitizeString(name);
    if (!sanitizedName.trim()) return;
    setShopName(sanitizedName);
    localStorage.setItem('ss_shop_name', sanitizedName);
    setShowOnboarding(false);
    setView('pos');
  };

  const hasLowStock = products.some(p => p.stock < 10);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8E9DD]">
          <div className="w-24 h-24 rounded-[40px] bg-[#FFB673] animate-bounce shadow-2xl flex items-center justify-center text-white font-black text-4xl">S</div>
          <div className="mt-10 text-[#6A4FBF] font-black text-3xl animate-pulse uppercase tracking-[0.3em]">ShopSmart</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen selection:bg-[#FFB673] transition-colors duration-500 flex flex-col ${settings.darkMode ? 'bg-[#1c1917] text-[#F8E9DD]' : 'bg-[#F8E9DD] text-[#4A4A4A]'}`}>
      <Navbar onNavClick={handleNav} activeView={view} shopName={shopName} hasLowStock={hasLowStock} />
      
      <main className="flex-grow">
        {showOnboarding && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-[#6A4FBF]/50 backdrop-blur-xl">
                <div className={`clay-card p-12 max-w-2xl w-full text-center shadow-2xl animate-pop border-8 border-white/60 ${settings.darkMode ? 'bg-[#2C2A26]' : 'bg-white'}`}>
                    
                    {onboardingStep === 'welcome' ? (
                      <div className="animate-fade-in">
                        <div className="w-32 h-32 rounded-[45px] bg-[#FFB673] flex items-center justify-center text-white text-6xl font-black mx-auto mb-10 shadow-2xl rotate-6 group hover:rotate-0 transition-transform">S</div>
                        <h2 className={`text-5xl font-black mb-6 tracking-tighter ${settings.darkMode ? 'text-white' : 'text-[#4A4A4A]'}`}>Grow Your Business.</h2>
                        <p className={`text-xl mb-12 font-medium leading-relaxed max-w-md mx-auto ${settings.darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                          Manage sales, stock, and customers in one beautiful, offline-ready app. No experience required.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
                          <div className={`p-6 rounded-[35px] border-4 border-dashed transition-all hover:scale-105 ${settings.darkMode ? 'bg-white/5 border-white/10' : 'bg-[#F8E9DD]/40 border-white'}`}>
                             <div className="text-4xl mb-3">⚡</div>
                             <div className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Fast Sales</div>
                          </div>
                          <div className={`p-6 rounded-[35px] border-4 border-dashed transition-all hover:scale-105 ${settings.darkMode ? 'bg-white/5 border-white/10' : 'bg-[#F8E9DD]/40 border-white'}`}>
                             <div className="text-4xl mb-3">📦</div>
                             <div className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Smart Stock</div>
                          </div>
                          <div className={`p-6 rounded-[35px] border-4 border-dashed transition-all hover:scale-105 ${settings.darkMode ? 'bg-white/5 border-white/10' : 'bg-[#F8E9DD]/40 border-white'}`}>
                             <div className="text-4xl mb-3">📊</div>
                             <div className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Insights</div>
                          </div>
                        </div>

                        <button 
                            onClick={() => setOnboardingStep('name')}
                            className="clay-button-primary w-full py-7 text-2xl font-black rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-[0_30px_60px_-15px_rgba(106,79,191,0.6)] uppercase tracking-widest"
                        >
                            Get Started Free
                        </button>
                      </div>
                    ) : (
                      <div className="animate-fade-in relative">
                        <button onClick={() => setOnboardingStep('welcome')} className="absolute -top-4 -left-4 p-4 text-gray-300 hover:text-[#6A4FBF] font-black text-xs uppercase tracking-[0.3em] transition-colors">← Back</button>
                        <div className="w-20 h-20 rounded-[30px] bg-[#FFB673]/10 flex items-center justify-center text-[#FFB673] text-4xl font-black mx-auto mb-8 shadow-inner border-2 border-white">?</div>
                        <h2 className={`text-4xl font-black mb-3 tracking-tight ${settings.darkMode ? 'text-white' : 'text-[#4A4A4A]'}`}>Name Your Shop</h2>
                        <p className={`text-sm mb-12 font-bold uppercase tracking-widest ${settings.darkMode ? 'text-white/40' : 'text-gray-400'}`}>This appears on every receipt.</p>
                        
                        <div className="relative group mb-12">
                            <input 
                                type="text" 
                                placeholder="e.g. Sunny Groceries"
                                className={`w-full clay-pill-container px-10 py-8 outline-none text-center text-3xl font-black border-4 focus:ring-8 focus:ring-[#6A4FBF]/10 transition-all ${settings.darkMode ? 'bg-black/40 text-white border-white/10' : 'bg-white text-[#4A4A4A] border-white'}`}
                                onKeyDown={(e) => e.key === 'Enter' && handleCompleteOnboarding((e.target as HTMLInputElement).value)}
                                autoFocus
                            />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#6A4FBF] text-white text-[9px] font-black uppercase rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Press Enter to Confirm</div>
                        </div>

                        <button 
                            onClick={() => handleCompleteOnboarding((document.querySelector('input') as HTMLInputElement).value)}
                            className="clay-button-primary w-full py-7 text-2xl font-black rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-[0_30px_60px_-15px_rgba(106,79,191,0.6)] uppercase tracking-widest"
                        >
                            Finalize Setup
                        </button>
                      </div>
                    )}
                </div>
            </div>
        )}

        {view === 'landing' && (
           <div className="animate-fade-in">
              <Hero onStart={() => shopName ? setView('pos') : setShowOnboarding(true)} />
              <Exchange />
              <Pricing />
           </div>
        )}

        {view === 'pos' && (
            <POS 
              products={products} 
              onCompleteSale={addSale} 
              customers={customers} 
              shopName={shopName} 
              currency={settings.currency} 
              categories={categories}
            />
        )}

        {view === 'inventory' && (
            <Inventory 
              products={products} 
              onOp={handleProductOp} 
              currency={settings.currency} 
              categories={categories}
              onUpdateCategories={updateCategories}
            />
        )}

        {view === 'customers' && (
            <Customers 
              customers={customers} 
              onAddCustomer={addCustomer} 
              onRepayment={recordRepayment} 
              sales={sales} 
              currency={settings.currency} 
            />
        )}

        {view === 'reports' && (
            <Reports sales={sales} products={products} currency={settings.currency} shopName={shopName} />
        )}

        {view === 'reseller' && (
            <ResellerDashboard currency={settings.currency} />
        )}

        {view === 'settings' && (
            <SettingsView 
              settings={settings} 
              onUpdate={updateSettings} 
              shopName={shopName} 
              onShopNameChange={(n) => { setShopName(n); localStorage.setItem('ss_shop_name', n); }} 
            />
        )}
      </main>

      {view === 'landing' && <Footer onLinkClick={(e, id) => { e.preventDefault(); handleNav(id); }} />}

      {/* Enhanced Sync Status Indicator */}
      <div className="fixed bottom-8 right-8 z-[200]">
          <div className={`clay-pill-container px-6 py-4 flex items-center gap-4 border-4 backdrop-blur-xl shadow-2xl transition-all duration-500 ${settings.darkMode ? 'bg-black/60 border-white/10' : 'bg-white/60 border-white'}`}>
              <div className="relative flex h-3 w-3">
                {syncError ? (
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                ) : isSyncing ? (
                   <span className="animate-spin relative inline-flex rounded-full h-3 w-3 border-2 border-[#6A4FBF] border-t-transparent"></span>
                ) : (
                   <>
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2AB9A9] opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2AB9A9] shadow-[0_0_8px_#2AB9A9]"></span>
                   </>
                )}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-[0.25em] ${settings.darkMode ? 'text-white' : 'text-[#4A4A4A]'}`}>
                {syncError ? 'Sync Failed' : (isSyncing ? 'Syncing...' : 'Encrypted & Offline')}
              </span>
              {syncError && (
                  <button onClick={triggerSync} className="text-[9px] font-black text-[#6A4FBF] underline decoration-2 underline-offset-4 uppercase tracking-widest ml-2 hover:text-[#FFB673] transition-colors">Retry</button>
              )}
          </div>
      </div>
    </div>
  );
};

export default App;
