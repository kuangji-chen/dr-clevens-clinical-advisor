import React, { useState } from 'react';
import { Headphones, Phone } from 'lucide-react';
import { useConversationStore } from '@/store/conversationStore';

const CallModal: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callRequested, setCallRequested] = useState(false);
  const { setShowCallModal, updateLeadInfo } = useConversationStore();

  const handleCallRequest = () => {
    if (phoneNumber) {
      updateLeadInfo({ phone: phoneNumber });
      setCallRequested(true);
      
      // In production, this would trigger actual call system
      setTimeout(() => {
        setShowCallModal(false);
        setCallRequested(false);
        setPhoneNumber('');
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl transform transition-all">
        {!callRequested ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Let&apos;s Talk!</h3>
              <p className="text-gray-600 text-sm">
                Enter your number and we&apos;ll call you right away to discuss your aesthetic goals
              </p>
            </div>
            
            <div className="space-y-4">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              
              <button
                onClick={handleCallRequest}
                disabled={!phoneNumber}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                Call Me Now
              </button>
              
              <button
                onClick={() => {
                  setShowCallModal(false);
                  setPhoneNumber('');
                }}
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
              >
                Continue Chatting
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-purple-600 animate-bounce" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Calling You Now!</h3>
            <p className="text-gray-600 text-sm">
              You&apos;ll receive a call at {phoneNumber} within 30 seconds
            </p>
            <div className="mt-4">
              <div className="inline-flex space-x-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallModal;