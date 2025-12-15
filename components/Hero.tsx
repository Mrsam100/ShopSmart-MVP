
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-60 md:pb-52 px-6 perspective-[1000px] z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fde2c8] to-[#f9c1d2] -z-20"></div>
      
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <span className="inline-block px-6 py-2.5 rounded-full bg-white/70 text-[#6A4FBF] font-black text-[13px] uppercase tracking-widest mb-8 border border-white/60 shadow-lg backdrop-blur-md">
                No Training Needed • Works Offline
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1c1917] leading-[1.1] mb-10 drop-shadow-sm">
                The Simple App <br/>
                <span className="text-[#6A4FBF] relative">
                    Helps You Sell.
                    <svg className="absolute -bottom-4 left-0 w-full h-4 text-[#FFD447]" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </svg>
                </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#555] mb-12 max-w-2xl leading-relaxed font-semibold">
                A clean, easy tool for small businesses to manage sales, products, and customers. Anyone can use it. Anyone can sell it.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-6 w-full sm:w-auto">
                <button 
                    onClick={onStart}
                    className="clay-button-primary px-12 md:px-20 py-5 md:py-8 text-xl md:text-2xl font-black uppercase tracking-widest shadow-2xl rounded-full"
                >
                    Get Started
                </button>
                <button className="clay-button px-12 md:px-20 py-5 md:py-8 bg-[#F8E9DD] text-[#4A4A4A] text-lg md:text-xl font-black uppercase tracking-widest shadow-[10px_10px_20px_#d3c6bc,-10px_-10px_20px_#ffffff] hover:scale-105 active:scale-95 transition-all border-2 border-white/60 rounded-full">
                    Become a Reseller
                </button>
            </div>
        </div>

        {/* Mockup Visual - Represents the Product */}
        <div className="relative h-[500px] md:h-[650px] flex items-center justify-center perspective-[1200px]">
            <div className="relative w-[320px] h-[640px] bg-[#1c1917] rounded-[60px] border-[10px] border-[#333] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden animate-float transform-style-3d rotate-y-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#333] rounded-b-3xl z-20"></div>
                <div className="w-full h-full bg-[#F8E9DD] p-8 pt-12 flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <div className="w-10 h-10 rounded-full bg-[#FFB673] flex items-center justify-center text-white font-black text-xs shadow-md">SS</div>
                        <div className="w-8 h-8 rounded-xl bg-[#6A4FBF]/10 flex items-center justify-center shadow-inner">
                            <div className="w-4 h-1 bg-[#6A4FBF] rounded-full"></div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 mb-10">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Today's Sales</div>
                        <div className="text-4xl font-black text-[#1c1917]">$1,240.00</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="aspect-square bg-white rounded-3xl shadow-[4px_4px_10px_rgba(0,0,0,0.05)] p-4 flex flex-col items-center justify-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#F8E9DD] shadow-inner"></div>
                                <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-auto w-full py-5 bg-[#6A4FBF] text-white rounded-[24px] font-black shadow-xl text-base uppercase tracking-widest transform transition-transform active:scale-95">
                        New Sale +
                    </button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
