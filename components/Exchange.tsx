
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { INDUSTRIES } from '../constants';

const Exchange: React.FC = () => {
  return (
    <div className="py-24 px-6 flex flex-col items-center justify-center relative overflow-hidden bg-[#F8E9DD]">
      <div className="text-center mb-16 max-w-2xl z-10">
        <span className="clay-text-convex text-xs font-bold uppercase tracking-widest text-[#FFB673] mb-4">Who We Serve</span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#4A4A4A] mb-4 leading-tight">Works for Any Shop</h2>
        <p className="text-gray-500 text-lg font-medium">
            Merchants from all backgrounds trust ShopSmart to run their business. 
            Join thousands of shops growing with us.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1200px] w-full z-10">
          {INDUSTRIES.map((ind, i) => (
              <div key={i} className="clay-card p-6 flex flex-col items-center justify-center text-center hover:scale-[1.05] transition-transform cursor-pointer group">
                  <div className="text-4xl mb-4 group-hover:animate-bounce">{ind.icon}</div>
                  <h3 className="font-bold text-[#4A4A4A]">{ind.name}</h3>
              </div>
          ))}
      </div>

      <div className="mt-20 z-10 bg-white/60 p-10 rounded-[40px] shadow-inner max-w-3xl w-full text-center border border-white/40">
          <h3 className="text-2xl font-extrabold text-[#4A4A4A] mb-6">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                  { n: "1", t: "Download", d: "Get the app on any device." },
                  { n: "2", t: "Add Items", d: "Upload your products." },
                  { n: "3", t: "Sell Fast", d: "Start taking orders." },
                  { n: "4", t: "Track", d: "Automated reports." }
              ].map(step => (
                  <div key={step.n} className="space-y-2">
                      <div className="w-8 h-8 rounded-full bg-[#6A4FBF] text-white font-bold flex items-center justify-center mx-auto mb-4">{step.n}</div>
                      <h4 className="font-extrabold text-[#4A4A4A]">{step.t}</h4>
                      <p className="text-xs text-gray-500 font-medium">{step.d}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Exchange;
