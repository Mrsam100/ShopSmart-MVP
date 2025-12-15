/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Paper } from '../types';
import { getPublisherInfo } from '../constants';

interface ProductCardProps {
  product: Paper;
  onClick: (paper: Paper) => void;
  onUpvote: (id: string) => void;
  isUpvoted: boolean;
  onPublisherClick?: (publisher: string) => void;
  onToggleSave?: (paper: Paper) => void;
  isSaved?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  onUpvote, 
  isUpvoted, 
  onPublisherClick,
  onToggleSave,
  isSaved 
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isSaved) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);
  
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
        onToggleSave(product);
    }
  };

  const publisherInfo = getPublisherInfo(product.publisher);

  return (
    <div 
        className="clay-card clay-bevel p-6 h-full flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group" 
        onClick={() => onClick(product)}
    >
      {/* 3D Depth Decoration */}
      <div 
        className="absolute -right-6 -top-6 w-32 h-32 shape-decoration-embedded opacity-60 transform group-hover:scale-110 transition-transform duration-700 pointer-events-none"
        style={{ color: publisherInfo.color }}
      ></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.2),2px_2px_4px_rgba(255,255,255,0.4)] border border-white/20" style={{ backgroundColor: publisherInfo.color }}>
                     {publisherInfo.logo}
                 </div>
                 <div>
                     <span className="block font-bold text-lg text-[#4A4A4A] leading-tight">{product.title}</span>
                     <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{product.publisher}</span>
                 </div>
             </div>
             <button 
                onClick={handleSaveClick}
                className={`w-10 h-10 clay-icon-btn ${shouldAnimate ? 'animate-pop' : ''} ${isSaved ? 'text-[#FFD447]' : 'text-gray-300 hover:text-[#6A4FBF]'}`}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 drop-shadow-sm">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                 </svg>
              </button>
        </div>

        {/* 3D Image Display */}
        {product.fileUrl && (
          <div className="mb-6 h-40 w-full clay-img-inset relative group-hover:shadow-inner transition-shadow duration-500">
             <img src={product.fileUrl} alt={product.title} className="w-full h-full object-cover opacity-90" />
             <div className="absolute inset-0 bg-gradient-to-tr from-[#6A4FBF]/10 to-transparent pointer-events-none"></div>
          </div>
        )}

        <div className="mb-4">
            {/* 3D Convex Display (Difficulty/Level) */}
            <span className="clay-text-convex mb-1">
                <span className="block text-2xl font-extrabold text-[#4A4A4A] tracking-tight">{product.readTime}</span>
            </span>
            <span className="text-sm font-medium text-[#2AB9A9] flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                {product.upvotes} XP Reward
            </span>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium line-clamp-3">
            {product.abstractPreview}
        </p>

        {/* 3D Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
             {product.aiInsights && product.aiInsights.slice(0,2).map((tag, i) => (
                 <span key={i} className="px-3 py-1 rounded-lg text-[10px] font-bold text-[#6A4FBF] clay-tag">
                     {tag}
                 </span>
             ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200/50 flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-gray-400">Rec. Grade: {product.publicationDate}</span>
          <button className="text-sm font-bold text-[#FFB673] hover:text-[#e09e60] transition-colors">Play Now →</button>
      </div>
    </div>
  );
}

export default ProductCard;