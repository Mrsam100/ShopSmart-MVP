/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface InfoPageProps {
  pageId: string;
}

const InfoPage: React.FC<InfoPageProps> = ({ pageId }) => {
  const contentMap: Record<string, { title: string, content: string }> = {
    help: { title: "Help Center", content: "How can we assist you today? Browse our FAQs or contact support." },
    api: { title: "API Documentation", content: "Build the future of finance with ClayCoin API. Powerful, reliable, and secure." },
    fees: { title: "Fee Schedule", content: "Transparent pricing. No hidden costs. Trading fees start at 0.1%." },
    security: { title: "Security", content: "Your assets are protected by industry-leading encryption and cold storage protocols." },
    privacy: { title: "Privacy Policy", content: "We value your privacy. We do not sell your data to third parties." },
    terms: { title: "Terms of Service", content: "By using ClayCoin, you agree to our terms of service." },
  };

  const data = contentMap[pageId] || { title: "Page Not Found", content: "The requested page does not exist." };

  return (
    <div className="min-h-screen py-32 px-6 max-w-[800px] mx-auto animate-fade-in-up text-center">
       <div className="clay-card p-12 bg-white/80 backdrop-blur-sm">
           <h1 className="text-4xl font-extrabold text-[#4A4A4A] mb-8">{data.title}</h1>
           <div className="w-16 h-1 bg-[#FFB673] mx-auto mb-8 rounded-full"></div>
           <p className="text-lg text-gray-600 leading-relaxed">
               {data.content}
           </p>
           <div className="mt-12 p-6 bg-[#F8E9DD] rounded-xl text-sm text-gray-500">
               This is a demo page for the ClayCoin application interface.
           </div>
       </div>
    </div>
  );
};

export default InfoPage;
