import React from 'react';
import { Workflow, ChevronRight, ChevronDown } from 'lucide-react';
import { ConversationState, Message } from '@/types/conversation';

interface StatePanelProps {
  currentState: ConversationState;
  messages: Message[];
  onClose: () => void;
}

const StatePanel: React.FC<StatePanelProps> = ({ currentState, messages, onClose }) => {
  const states: { id: ConversationState; label: string; icon: string; description?: string }[] = [
    { id: 'welcome', label: 'Welcome', icon: '👋' },
    { id: 'classify', label: 'Classify', icon: '🎯' },
    { id: 'education', label: 'Education', icon: '📚', description: 'Gallery / Booking' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'qualify', label: 'Qualify', icon: '✅' },
    { id: 'booking', label: 'Booking', icon: '📅' },
    { id: 'capture', label: 'Capture', icon: '📝' },
    { id: 'complete', label: 'Complete', icon: '🎉' },
  ];

  const getStateStatus = (stateId: ConversationState) => {
    const stateIndex = states.findIndex(s => s.id === stateId);
    const currentIndex = states.findIndex(s => s.id === currentState);
    
    if (stateIndex < currentIndex) return 'completed';
    if (stateIndex === currentIndex) return 'current';
    return 'pending';
  };


  return (
    <div className="w-72 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 shadow-xl overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Workflow className="w-4 h-4 text-white" />
            </div>
            Conversation Flow
          </h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">Track your consultation progress</p>
      </div>
      
      <div className="p-6">
      
        <div className="space-y-4">
          {states.map((state, index) => {
            const status = getStateStatus(state.id);
            return (
              <div key={state.id} className="relative">
                {/* Connection line */}
                {index < states.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all duration-500 ${
                    status === 'current' 
                      ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg animate-pulse' 
                      : status === 'completed'
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {status === 'completed' ? '✓' : state.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-semibold text-sm transition-colors ${
                      status === 'current' ? 'text-purple-700' : status === 'completed' ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {state.label}
                      {status === 'current' && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                          Active
                        </span>
                      )}
                    </div>
                    
                    {state.description && status === 'current' && (
                      <div className="mt-2 space-y-1">
                        {state.description.split(' / ').map((option, idx) => (
                          <div key={idx} className="flex items-center text-xs text-gray-600">
                            <ChevronDown className="w-3 h-3 text-gray-400 mr-1" />
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

        {/* Stats Section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
            📊 Session Stats
          </h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
              <div className="text-xs text-gray-600">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 capitalize">{currentState}</div>
              <div className="text-xs text-gray-600">Current Step</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600">
              {Math.round((states.findIndex(s => s.id === currentState) + 1) / states.length * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(states.findIndex(s => s.id === currentState) + 1) / states.length * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatePanel;