import React from 'react';

interface QuickPicksProps {
  picks: string[];
  onSelect: (pick: string) => void;
}

const QuickPicks: React.FC<QuickPicksProps> = ({ picks, onSelect }) => {
  return (
    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm font-semibold text-gray-700 mb-3 text-center">💬 Quick responses</p>
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
          {picks.map((pick, index) => (
            <button
              key={index}
              onClick={() => onSelect(pick)}
              className="flex-shrink-0 bg-white hover:bg-blue-50 text-gray-800 hover:text-blue-700 border border-gray-200 hover:border-blue-300 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-fit whitespace-nowrap"
            >
              {pick}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickPicks;