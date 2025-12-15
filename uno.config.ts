import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // Tailwind-compatible utilities
    presetAttributify(), // Enables attributify mode
  ],
  theme: {
    colors: {
      primary: '#FFB673',
      secondary: '#6A4FBF',
      accent1: '#2AB9A9',
      accent2: '#FFD447',
      neutral: '#F8E9DD',
      text: '#4A4A4A',
    },
  },
  shortcuts: {
    // Custom clay styles
    'clay-pill-container': 'bg-neutral rounded-full shadow-[inset_8px_8px_16px_#d3c6bc,inset_-8px_-8px_16px_#ffffff] border border-white/60',
    'clay-card': 'bg-neutral rounded-[40px] shadow-[20px_20px_60px_#d3c6bc,-20px_-20px_60px_#ffffff] border border-white/40 transition-all duration-400',
    'clay-button': 'bg-neutral rounded-full shadow-[6px_6px_12px_#d3c6bc,-6px_-6px_12px_#ffffff] border border-white/80 inline-flex items-center justify-center transition-all duration-300',
    'clay-button-primary': 'bg-secondary text-white rounded-full shadow-[12px_12px_24px_rgba(106,79,191,0.35),-10px_-10px_20px_rgba(255,255,255,0.9)] border-2.5 border-white/25 inline-flex items-center justify-center transition-all duration-300',
    'clay-text-convex': 'bg-neutral rounded-xl shadow-[4px_4px_8px_#d3c6bc,-4px_-4px_8px_#ffffff] px-3 py-1 inline-block border border-white/20',
  },
})
