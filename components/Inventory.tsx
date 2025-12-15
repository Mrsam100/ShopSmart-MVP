
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useRef } from 'react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onOp: (p: Product, op: 'add' | 'edit' | 'delete') => void;
  currency: string;
  categories: string[];
  onUpdateCategories: (cats: string[]) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onOp, currency, categories, onUpdateCategories }) => {
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Low Stock'>('All');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.name) return;
    const p = editing.id ? (editing as Product) : ({ ...editing, id: Math.random().toString(36).substr(2, 9), status: 'active' } as Product);
    onOp(p, editing.id ? 'edit' : 'add');
    setEditing(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditing(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim() || categories.includes(newCatName.trim())) return;
    onUpdateCategories([...categories, newCatName.trim()]);
    setNewCatName('');
  };

  const handleDeleteCategory = (cat: string) => {
    onUpdateCategories(categories.filter(c => c !== cat));
    if (selectedCat === cat) setSelectedCat('All');
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    if (filterType === 'Low Stock') {
      result = result.filter(p => p.stock < 10);
    }
    if (selectedCat !== 'All') {
      result = result.filter(p => p.category === selectedCat);
    }
    return result;
  }, [products, filterType, selectedCat]);

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 text-center md:text-left">
        <div>
           <span className="clay-text-convex text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest mb-3">Master Inventory</span>
           <h1 className="text-5xl font-black text-[#4A4A4A]">Stock Catalog</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="clay-pill-container p-1 flex items-center bg-white/40">
             <button 
               onClick={() => setFilterType('All')}
               className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'All' ? 'bg-[#6A4FBF] text-white shadow-md' : 'text-gray-400'}`}
             >
               All
             </button>
             <button 
               onClick={() => setFilterType('Low Stock')}
               className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative ${filterType === 'Low Stock' ? 'bg-red-500 text-white shadow-md' : 'text-gray-400'}`}
             >
               Low Stock
               {products.some(p => p.stock < 10) && (
                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse"></span>
               )}
             </button>
          </div>
          <button 
            onClick={() => setEditing({ name: '', sku: '', price: 0, costPrice: 0, stock: 0, category: categories[0] || 'General' })} 
            className="px-14 py-6 clay-button-primary text-xl font-black rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            Add Item +
          </button>
        </div>
      </div>

      {/* Category Toolbar */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-6 mb-10 border-b border-gray-100">
          <button 
            onClick={() => setSelectedCat('All')}
            className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCat === 'All' ? 'bg-[#4A4A4A] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button 
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCat === cat ? 'bg-[#6A4FBF] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
            >
                {cat}
            </button>
          ))}
          <button 
            onClick={() => setShowCatManager(true)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6A4FBF] border-2 border-[#6A4FBF]/10 hover:bg-[#6A4FBF]/5 transition-colors shadow-sm"
          >
            ⚙️
          </button>
      </div>

      {/* Category Manager Modal */}
      {showCatManager && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
              <div className="clay-card p-10 max-w-md w-full bg-white shadow-2xl relative animate-pop">
                  <h3 className="text-2xl font-black mb-8 text-[#4A4A4A] uppercase tracking-tighter">Manage Categories</h3>
                  <div className="flex gap-2 mb-8">
                      <input 
                        type="text" 
                        placeholder="New Category"
                        className="flex-1 clay-pill-container px-6 py-4 outline-none font-bold text-sm bg-gray-50"
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                      />
                      <button onClick={handleAddCategory} className="px-6 bg-[#2AB9A9] text-white font-black rounded-2xl">+</button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                      {categories.map(cat => (
                          <div key={cat} className="flex justify-between items-center p-4 bg-[#F8E9DD]/30 rounded-2xl border-2 border-white shadow-sm">
                              <span className="font-bold text-[#4A4A4A]">{cat}</span>
                              <button onClick={() => handleDeleteCategory(cat)} className="text-red-400 hover:text-red-600 font-black">×</button>
                          </div>
                      ))}
                  </div>
                  <button onClick={() => setShowCatManager(false)} className="w-full mt-8 py-4 clay-button text-gray-400 font-black uppercase tracking-widest text-xs">Done</button>
              </div>
          </div>
      )}

      {/* Product Editor Modal */}
      {editing && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#6A4FBF]/40 backdrop-blur-md">
            <div className="clay-card p-8 md:p-12 max-w-2xl w-full bg-white shadow-2xl animate-slide-up-fade border-4 border-white/60">
                <h3 className="text-3xl font-black mb-10 text-[#4A4A4A] tracking-tighter">{editing.id ? 'Edit Product' : 'New Product'}</h3>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Product Name</label>
                          <input type="text" placeholder="e.g. Rice 5kg" className="w-full clay-pill-container px-6 py-4 outline-none font-bold shadow-inner bg-white/60" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} required />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">SKU / Barcode</label>
                          <input type="text" placeholder="e.g. 89012345" className="w-full clay-pill-container px-6 py-4 outline-none font-bold shadow-inner bg-white/60" value={editing.sku || ''} onChange={e => setEditing({...editing, sku: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Cost Price</label>
                            <input type="number" step="0.01" className="w-full clay-pill-container px-4 py-4 outline-none font-bold shadow-inner bg-white/60" value={editing.costPrice || ''} onChange={e => setEditing({...editing, costPrice: Number(e.target.value)})} required />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Sale Price</label>
                            <input type="number" step="0.01" className="w-full clay-pill-container px-4 py-4 outline-none font-bold shadow-inner bg-white/60" value={editing.price || ''} onChange={e => setEditing({...editing, price: Number(e.target.value)})} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Units in Stock</label>
                            <input type="number" className="w-full clay-pill-container px-4 py-4 outline-none font-bold shadow-inner bg-white/60" value={editing.stock || ''} onChange={e => setEditing({...editing, stock: Number(e.target.value)})} required />
                          </div>
                          <div>
                              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Category</label>
                              <select className="w-full clay-pill-container px-4 py-4 outline-none font-bold appearance-none cursor-pointer bg-white" value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})}>
                                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                          </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-40 h-40 clay-card bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-200 group"
                        >
                            {editing.image ? (
                              <img src={editing.image} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                              <span className="text-gray-300 font-bold group-hover:text-[#6A4FBF] transition-colors">Add Photo</span>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                        <p className="text-[10px] text-gray-400 uppercase font-black">Recommended: Square Image</p>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex gap-4 pt-6">
                        <button type="submit" className="flex-1 clay-button-primary py-5 text-lg font-black rounded-full uppercase tracking-widest">Confirm</button>
                        <button type="button" onClick={() => setEditing(null)} className="flex-1 clay-button py-5 text-lg font-black text-gray-300 rounded-full uppercase tracking-widest">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(p => (
              <div key={p.id} className="clay-card p-10 bg-white flex flex-col items-center text-center group border-2 border-white hover:border-[#6A4FBF]/20 transition-all shadow-xl relative overflow-hidden">
                  <div className="w-24 h-24 rounded-[35px] bg-[#F8E9DD]/50 shadow-inner flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform">
                      {p.image ? (
                        <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                      ) : (
                        <span>{p.category === 'Bakery' ? '🍞' : p.category === 'Grocery' ? '🥛' : p.category === 'Dairy' ? '🧀' : '📦'}</span>
                      )}
                  </div>
                  <h3 className="font-black text-2xl mb-1 text-[#4A4A4A] truncate w-full px-2 uppercase tracking-tighter">{p.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-widest">SKU: {p.sku || 'N/A'}</p>
                  <div className="text-[#6A4FBF] font-black text-3xl mb-1">{currency}{p.price.toFixed(2)}</div>
                  <div className="text-[10px] font-black text-[#2AB9A9] uppercase mb-6 tracking-widest">{p.category}</div>
                  
                  <div className={`w-full rounded-[30px] p-5 mb-8 border-2 border-dashed flex flex-col items-center gap-1 transition-all ${p.stock < 10 ? 'bg-red-50 border-red-200 text-red-500 shadow-inner' : 'bg-green-50 border-green-200 text-green-600 shadow-inner'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Stock Count</span>
                      <span className="text-3xl font-black">{p.stock}</span>
                      {p.stock < 10 && (
                        <span className="mt-1 px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase rounded-full animate-pulse">Low Stock</span>
                      )}
                  </div>
                  
                  <div className="flex gap-6 w-full pt-6 border-t border-gray-50 px-2 mt-auto">
                    <button onClick={() => setEditing(p)} className="flex-1 text-[11px] font-black uppercase tracking-widest text-[#6A4FBF] hover:underline transition-all active:scale-95">Edit</button>
                    <button onClick={() => onOp(p, 'delete')} className="flex-1 text-[11px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-all active:scale-95">Delete</button>
                  </div>
              </div>
          ))}
          {filteredProducts.length === 0 && (
              <div className="col-span-full py-40 text-center opacity-30 text-gray-400 font-black flex flex-col items-center">
                  <div className="text-9xl mb-8">📋</div>
                  <div className="text-2xl uppercase tracking-[0.2em]">No Items Found</div>
              </div>
          )}
      </div>
    </div>
  );
};

export default Inventory;
