
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
  shopName: string;
  onShopNameChange: (n: string) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ settings, onUpdate, shopName, onShopNameChange }) => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-[900px] mx-auto animate-fade-in">
      <div className="text-center md:text-left mb-16">
        <span className="clay-text-convex text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest mb-3">Customization</span>
        <h1 className="text-6xl font-black text-[#4A4A4A] tracking-tighter">Account Setup</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="clay-card p-12 bg-white border-4 border-white shadow-xl">
          <h3 className="text-3xl font-black mb-10 text-[#4A4A4A]">Identity</h3>
          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Business Name</label>
              <input 
                type="text" 
                className="w-full clay-pill-container px-8 py-5 font-black text-xl outline-none shadow-inner bg-white/60" 
                value={shopName} 
                onChange={e => onShopNameChange(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Industry Category</label>
              <select 
                className="w-full clay-pill-container px-8 py-5 font-black outline-none appearance-none cursor-pointer bg-white" 
                value={settings.businessType} 
                onChange={e => onUpdate({ businessType: e.target.value })}
              >
                <option value="General">General Retail</option>
                <option value="Grocery">Supermarket / Grocery</option>
                <option value="Pharmacy">Healthcare / Pharmacy</option>
                <option value="Salon">Salon & Aesthetics</option>
                <option value="Cafe">Food & Beverage</option>
              </select>
            </div>
          </div>
        </div>

        <div className="clay-card p-12 bg-white border-4 border-white shadow-xl flex flex-col justify-between">
          <h3 className="text-3xl font-black mb-10 text-[#4A4A4A]">Localization</h3>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Display Language</label>
                <select 
                  className="w-full clay-pill-container px-6 py-4 font-black outline-none bg-white shadow-inner" 
                  value={settings.language} 
                  onChange={e => onUpdate({ language: e.target.value as any })}
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Default Currency</label>
                <select 
                  className="w-full clay-pill-container px-6 py-4 font-black outline-none bg-white shadow-inner" 
                  value={settings.currency} 
                  onChange={e => onUpdate({ currency: e.target.value })}
                >
                  <option value="$">USD ($)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="SAR">SAR (ر.س)</option>
                  <option value="£">GBP (£)</option>
                  <option value="€">EUR (€)</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-6 border-t border-dashed border-gray-100 mt-4">
              <div className="flex flex-col">
                <span className="font-black text-xl text-[#4A4A4A]">Dark Mode</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Easier on the eyes</span>
              </div>
              <button 
                onClick={() => onUpdate({ darkMode: !settings.darkMode })} 
                className={`w-20 h-10 rounded-full transition-all relative shadow-inner border-2 border-white ${settings.darkMode ? 'bg-[#6A4FBF]' : 'bg-gray-100'}`}
              >
                <div className={`absolute top-1 w-7 h-7 rounded-full shadow-md transition-all ${settings.darkMode ? 'right-1 bg-white' : 'left-1 bg-white'}`}></div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Advanced Config */}
        <div className="col-span-1 lg:col-span-2 clay-card p-12 bg-[#F8E9DD]/50 border-4 border-white shadow-xl">
           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex-1">
                 <h3 className="text-2xl font-black text-[#4A4A4A] mb-2">VAT & Taxation</h3>
                 <p className="text-sm font-medium text-gray-400 leading-relaxed">Configure automatic tax calculations for your receipts. This will be added to the grand total of every sale.</p>
              </div>
              <div className="flex items-center gap-6">
                 <input 
                    type="number" 
                    className="w-32 clay-pill-container px-6 py-5 font-black text-2xl text-center shadow-inner bg-white/60 outline-none" 
                    value={settings.taxRate} 
                    onChange={e => onUpdate({ taxRate: Number(e.target.value) })}
                    placeholder="0"
                 />
                 <span className="text-2xl font-black text-[#6A4FBF]">%</span>
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-20 text-center opacity-40">
         <div className="w-16 h-16 rounded-[25px] bg-gray-200 mx-auto flex items-center justify-center text-3xl mb-4 grayscale">S</div>
         <p className="text-[10px] font-black uppercase tracking-[0.4em]">ShopSmart Version 2.5.0 • Enterprise Ready</p>
      </div>
    </div>
  );
};

export default SettingsView;
