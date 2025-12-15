
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { BRAND_NAME } from '../constants';
import { AppView } from '../types';

interface NavbarProps {
  onNavClick: (targetId: string) => void;
  activeView: AppView;
  shopName?: string;
  hasLowStock?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, activeView, shopName, hasLowStock }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLanding = activeView === 'landing';
  
  const navItems = isLanding 
    ? [
        { name: 'Home', id: 'landing' },
        { name: 'Features', id: 'features' },
        { name: 'Resellers', id: 'reseller' }
      ]
    : [
        { name: 'POS', id: 'pos' },
        { name: 'Stock', id: 'inventory' },
        { name: 'Clients', id: 'customers' },
        { name: 'Stats', id: 'reports' }
      ];

  const handleItemClick = (id: string) => {
    onNavClick(id);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-6 left-0 w-full px-6 flex justify-center z-[150]">
      <nav className="w-full max-w-[1200px] flex items-center justify-between px-4 md:px-8 py-3 bg-[#F8E9DD]/95 backdrop-blur-md clay-pill-container border-2 border-white/60 shadow-[inset_10px_10px_20px_#d3c6bc,inset_-10px_-10px_20px_#ffffff] relative">
        
        {/* Logo / Shop Branding */}
        <div 
          className="flex items-center gap-3 md:gap-4 cursor-pointer group shrink-0" 
          onClick={() => handleItemClick('landing')}
        >
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-[20px] bg-[#FFB673] flex items-center justify-center text-white font-black text-lg md:text-xl shadow-[6px_6px_12px_#d3c6bc,-6px_-6px_12px_#ffffff] group-hover:scale-110 transition-transform">
            {shopName ? shopName.substring(0,1).toUpperCase() : 'S'}
          </div>
          <div className="flex flex-col">
            <span className="font-serif italic text-2xl md:text-4xl text-[#1c1917] tracking-tighter leading-none drop-shadow-[2px_2px_2px_rgba(255,255,255,0.8)]">
              {shopName || BRAND_NAME}
            </span>
            {shopName && <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#6A4FBF] mt-1 hidden sm:inline-block">Open for Business</span>}
          </div>
        </div>

        {/* Desktop Central Pill Navigator */}
        <div className="hidden lg:flex items-center gap-1 md:gap-3 flex-1 justify-center max-w-2xl px-4">
           {navItems.map((item) => (
             <button 
                key={item.id}
                onClick={() => handleItemClick(item.id)} 
                className={`px-5 md:px-7 py-2.5 text-[11px] md:text-[14px] font-black uppercase tracking-widest rounded-full whitespace-nowrap transition-all active:scale-95 relative ${
                    activeView === item.id 
                    ? 'bg-[#6A4FBF] text-white shadow-xl scale-105' 
                    : 'text-[#4A4A4A] hover:bg-white/40'
                }`}
             >
               {item.name}
               {item.id === 'reports' && hasLowStock && (
                 <span className="absolute -top-1 -right-1 flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                 </span>
               )}
             </button>
           ))}
        </div>

        {/* Right Section: Mobile Toggle & Desktop CTA */}
        <div className="flex items-center shrink-0 ml-4 gap-2">
           <button 
             onClick={() => handleItemClick(isLanding ? 'pos' : 'landing')}
             className="hidden sm:block px-8 md:px-14 py-4 md:py-6 clay-button-primary text-white text-[12px] md:text-[16px] font-black uppercase tracking-[0.2em] whitespace-nowrap rounded-full shadow-[0_20px_40px_-10px_rgba(106,79,191,0.5)] transition-all hover:scale-105 active:scale-95"
           >
             {isLanding ? 'Enter Shop' : 'Go Home'}
           </button>

           {/* Hamburger Menu Toggle (Mobile) */}
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="lg:hidden w-12 h-12 rounded-full bg-white/40 flex flex-col items-center justify-center gap-1 border border-white/60 active:scale-95 transition-all"
             aria-label="Toggle Menu"
           >
             <span className={`w-6 h-0.5 bg-[#4A4A4A] transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
             <span className={`w-6 h-0.5 bg-[#4A4A4A] transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
             <span className={`w-6 h-0.5 bg-[#4A4A4A] transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
           </button>
        </div>

        {/* Mobile Sidebar/Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full mt-4 px-6 animate-slide-up-fade">
             <div className="bg-[#F8E9DD] rounded-[30px] p-6 shadow-2xl border-2 border-white/60 flex flex-col gap-4">
                {navItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full py-5 text-center font-black uppercase tracking-[0.2em] rounded-2xl relative transition-all ${
                      activeView === item.id ? 'bg-[#6A4FBF] text-white' : 'bg-white/40 text-[#4A4A4A]'
                    }`}
                  >
                    {item.name}
                    {item.id === 'reports' && hasLowStock && (
                      <span className="absolute top-4 right-6 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
                    )}
                  </button>
                ))}
                <button 
                  onClick={() => handleItemClick(isLanding ? 'pos' : 'landing')}
                  className="w-full py-5 text-center font-black uppercase tracking-[0.2em] rounded-2xl bg-[#FFB673] text-white"
                >
                  {isLanding ? 'Enter Shop' : 'Go Home'}
                </button>
             </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
