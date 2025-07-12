import React from 'react';
import { ChevronRight, Settings } from 'lucide-react';

interface NavigationButtonsProps {
  onNextCard: () => void;
  onToggleSettings: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNextCard,
  onToggleSettings
}) => {
  return (
    <>
      {/* Next Card Button - Fixed at bottom center */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={onNextCard}
          className="bg-green-500 hover:bg-green-600 rounded-full pt-3 pb-3 pl-8 pr-4 shadow-lg border border-green-200 hover:shadow-xl transition-all flex items-center text-white font-medium"
        >
          <span className="mr-2">Next</span>
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Settings Gear Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={onToggleSettings}
          className="bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
        >
          <Settings className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </>
  );
}; 