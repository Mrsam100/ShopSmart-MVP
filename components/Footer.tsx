
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { BRAND_NAME } from '../constants';

interface FooterProps {
  onLinkClick: (e: React.MouseEvent, targetId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  return (
    <footer className="relative pt-32 pb-12 px-6 mt-20 overflow-hidden group">
        {/* Deep Dark Body with Large Radius */}
        <div className="absolute inset-0 bg-[#1c1917] rounded-t-[60px] md:rounded-t-[100px] z-0 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"></div>

        {/* Decorative Floating Blobs for "Awesome" vibe */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-[#6A4FBF] opacity-[0.07] blur-[100px] animate-float pointer-events-none"></div>
        <div className="absolute bottom-20 right-[5%] w-80 h-80 bg-[#FFB673] opacity-[0.07] blur-[100px] animate-float-delayed pointer-events-none"></div>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFooter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFooter)"/>
            </svg>
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10">
            
            {/* Top Footer: CTA Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 pb-20 border-b border-white/5">
                <div className="text-center lg:text-left">
                    <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                        Ready to grow your <br/>
                        <span className="text-[#FFB673]">neighborhood shop?</span>
                    </h3>
                    <p className="text-white/50 text-lg font-medium max-w-md mx-auto lg:mx-0">
                        Join 5,000+ merchants who simplified their business with {BRAND_NAME}.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                    <button 
                        onClick={(e) => onLinkClick(e, 'hero')}
                        className="px-10 py-5 bg-white text-[#1c1917] font-black uppercase tracking-widest rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Get Started Free
                    </button>
                    <button 
                        onClick={(e) => onLinkClick(e, 'reseller')}
                        className="px-10 py-5 bg-white/5 text-white border border-white/10 font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-all"
                    >
                        Talk to an Expert
                    </button>
                </div>
            </div>

            {/* Middle Footer: Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
                
                {/* Brand Column */}
                <div className="col-span-2 lg:col-span-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-8 cursor-pointer group/logo" onClick={(e) => onLinkClick(e, 'landing')}>
                        <div className="w-12 h-12 rounded-[18px] bg-[#FFB673] flex items-center justify-center text-white font-black text-lg shadow-[0_10px_20px_rgba(255,182,115,0.3)] group-hover/logo:scale-110 group-hover/logo:rotate-3 transition-all">S</div>
                        <span className="font-serif italic text-3xl text-white tracking-tighter">
                            Shop<span className="font-sans not-italic font-light opacity-60 text-2xl">Smart</span>
                        </span>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed max-w-[220px] mx-auto lg:mx-0">
                        The simple app that helps small shops sell smarter and grow faster. Built for real business, for real people.
                    </p>
                </div>

                {/* Nav Groups */}
                {[
                    { title: "Product", links: [
                        { n: "Features", id: "features" },
                        { n: "Pricing", id: "pricing" },
                        { n: "Stock Manager", id: "inventory" },
                        { n: "Sales Stats", id: "reports" }
                    ]},
                    { title: "Resellers", links: [
                        { n: "Join Program", id: "reseller" },
                        { n: "Partner Login", id: "reseller" },
                        { n: "Success Stories", id: "landing" },
                        { n: "Assets Kit", id: "landing" }
                    ]},
                    { title: "Support", links: [
                        { n: "Help Center", id: "landing" },
                        { n: "API Access", id: "landing" },
                        { n: "Community", id: "landing" },
                        { n: "Contact", id: "landing" }
                    ]},
                    { title: "Company", links: [
                        { n: "Privacy Policy", id: "landing" },
                        { n: "Terms of Service", id: "landing" },
                        { n: "Security", id: "landing" },
                        { n: "About Us", id: "landing" }
                    ]}
                ].map((col, idx) => (
                    <div key={idx} className="text-center md:text-left">
                        <h4 className="font-black text-white/30 text-[10px] mb-8 uppercase tracking-[0.3em]">{col.title}</h4>
                        <div className="flex flex-col gap-4 items-center md:items-start">
                            {col.links.map((link, lIdx) => (
                                <button 
                                    key={lIdx} 
                                    onClick={(e) => onLinkClick(e, link.id)} 
                                    className="text-[15px] text-white/60 hover:text-[#FFB673] transition-colors font-medium"
                                >
                                    {link.n}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Footer: Info & Socials */}
            <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">System Status: Operational</span>
                    </div>
                    <p className="text-[13px] font-medium text-white/20">© 2025 ShopSmart POS. Made for the world's shopkeepers.</p>
                </div>

                {/* Interactive Social Buttons (Claymorphic Style) */}
                <div className="flex items-center gap-4">
                    {[
                        { 
                            label: "WhatsApp", 
                            icon: <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793 0-.853.448-1.273.607-1.446.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298l.541 1.316c.046.112.078.242.005.388-.073.146-.11.238-.219.365-.11.127-.231.283-.329.38-.11.107-.225.225-.097.447.128.223.57 1.05 1.22 1.63.834.743 1.537.973 1.754 1.077.217.103.343.086.47-.058.126-.144.542-.63.687-.847.144-.217.29-.181.491-.107l1.543.725c.203.096.337.144.384.225.047.081.047.46-.097.865z"/>
                        },
                        { 
                            label: "Instagram", 
                            icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        }
                    ].map((social, sIdx) => (
                        <a 
                            key={sIdx} 
                            href="#" 
                            className="w-12 h-12 rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1 active:translate-y-0 shadow-lg"
                            aria-label={social.label}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                {social.icon}
                            </svg>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
