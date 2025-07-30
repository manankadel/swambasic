// src/components/modules/catalog/CatalogControls.tsx

"use client";

type ViewMode = 'immersive' | 'grid';

interface CatalogControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  goBack: () => void;
}

export const CatalogControls = ({ viewMode, setViewMode, goBack }: CatalogControlsProps) => {
  return (
    <div className="fixed bottom-8 left-8 z-50 flex items-center gap-4">
      <button 
        onClick={goBack}
        className="px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full text-white font-sans text-sm hover:bg-white/20 transition-colors"
      >
        Back
      </button>
      <div className="flex bg-black/30 backdrop-blur-sm rounded-full p-1">
        <button
          onClick={() => setViewMode('immersive')}
          className={`px-4 py-1 rounded-full text-sm font-sans ${viewMode === 'immersive' ? 'bg-white text-black' : 'text-white'}`}
        >
          Focus
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-1 rounded-full text-sm font-sans ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white'}`}
        >
          Grid
        </button>
      </div>
    </div>
  );
};