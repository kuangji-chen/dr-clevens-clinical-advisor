'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Headphones, ChevronLeft, ChevronRight, Workflow } from 'lucide-react';
import { useConversationStore } from '@/store/conversationStore';
import MessageComponent from './MessageComponent';
import CallModal from './CallModal';
// Removed unused imports - now using semantic gallery triggering

// Helper function to get state order for comparison
const getStateOrder = (state: string): number => {
  const stateOrder = {
    'welcome': 0,
    'classify': 1,
    'education': 2,
    'gallery': 3,
    'qualify': 4,
    'booking': 5,
    'capture': 6,
    'complete': 7
  };
  return stateOrder[state as keyof typeof stateOrder] ?? 999;
};

const ConversationalAdvisor = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [showStatePanel, setShowStatePanel] = useState(true);

  const {
    messages,
    isTyping,
    isStreaming,
    streamingMessage,
    quickPicks,
    isVoiceActive,
    showCallModal,
    currentState,
    procedureType,
    leadInfo,
    // addMessage, // Now handled automatically by semantic triggering
    sendMessageToClaude,
    setIsVoiceActive,
    setShowCallModal,
  } = useConversationStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const message = inputValue;
      setInputValue('');
      
      // Send to Claude API
      await sendMessageToClaude(message);
    }
  };

  const handleQuickPick = async (option: string) => {
    // All quick picks now go through Claude's semantic understanding
    await sendMessageToClaude(option);
  };

  const getPlaceholderText = () => {
    if (messages.length === 0) return "Tell me what you&apos;d like to improve...";
    const lastBotMessage = [...messages].reverse().find(m => m.type === 'bot');
    if (lastBotMessage?.text?.includes('name')) return "Type your name...";
    if (lastBotMessage?.text?.includes('email')) return "Enter your email address...";
    if (lastBotMessage?.text?.includes('phone')) return "Enter your phone number...";
    return "Ask me anything about this procedure...";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">DC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dr. Clevens Assistant</h1>
              <p className="text-sm text-gray-600">Your personal aesthetic advisor</p>
            </div>
          </div>
          <button 
            onClick={() => setShowCallModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-full transition-all shadow-lg font-medium"
          >
            <Headphones className="w-5 h-5" />
            <span>Call Me</span>
          </button>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-1 hover:bg-blue-100 rounded">
              <ChevronLeft className="w-5 h-5 text-blue-700" />
            </button>
            <span className="text-base font-semibold text-blue-900">
              Demo: {currentState.charAt(0).toUpperCase() + currentState.slice(1)} State 
              {procedureType && ` - ${procedureType.replace('-', ' ')}`}
            </span>
            <button className="p-1 hover:bg-blue-100 rounded">
              <ChevronRight className="w-5 h-5 text-blue-700" />
            </button>
          </div>
          <span className="text-sm text-blue-700">Interactive Demo - Try typing your own messages
            {leadInfo.name && ` • Contact: ${leadInfo.name}`}</span>
        </div>
      </div>

      {/* Call Modal */}
      {showCallModal && <CallModal />}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Container */}
        <div className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-4xl space-y-6">
              {messages.map((message, index) => (
                <div key={index}>
                  <MessageComponent message={message} />
                  {/* Quick Picks after bot messages */}
                  {message.type === 'bot' && index === messages.length - 1 && quickPicks.length > 0 && !isTyping && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {quickPicks.map((pick, pickIndex) => (
                          <button
                            key={pickIndex}
                            onClick={() => handleQuickPick(pick)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                          >
                            {pick}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Streaming message */}
              {isStreaming && streamingMessage && (
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">DC</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl rounded-bl-md px-6 py-4 shadow-sm border border-gray-200">
                      <p className="text-base text-gray-800">{streamingMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">DC</span>
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md px-6 py-4 shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 px-8 py-6">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`p-3 rounded-full transition-all ${
                    isVoiceActive 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isVoiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={getPlaceholderText()}
                    className="w-full px-6 py-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">
                By chatting, you agree to our privacy policy. Medical advice requires consultation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        {showStatePanel && (
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-base font-semibold text-gray-800 flex items-center">
                <Workflow className="w-5 h-5 mr-2" />
                Conversation Flow
              </h4>
              <button
                onClick={() => setShowStatePanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 mb-8">
              {/* Dynamic State Display */}
              {(['welcome', 'classify', 'education', 'gallery', 'qualify', 'booking', 'capture', 'complete'] as const).map((state) => {
                const isCompleted = getStateOrder(state) < getStateOrder(currentState);
                const isCurrent = state === currentState;
                const isUpcoming = getStateOrder(state) > getStateOrder(currentState);
                
                return (
                  <div key={state} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      isCurrent ? 'bg-purple-600' : 
                      isCompleted ? 'bg-green-500' : 
                      'bg-gray-200'
                    } ${
                      isCurrent || isCompleted ? 'flex items-center justify-center' : ''
                    }`}>
                      {(isCurrent || isCompleted) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className={`text-sm ${
                      isCurrent ? 'font-medium text-purple-700' :
                      isCompleted ? 'font-medium text-green-700' :
                      'text-gray-500'
                    }`}>
                      {state.charAt(0).toUpperCase() + state.slice(1)}
                    </span>
                    {state === 'classify' && procedureType && isCompleted && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {procedureType.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current Context Section */}
            <div className="border-t border-gray-200 pt-6">
              <h5 className="text-base font-semibold text-gray-800 mb-4">Current Context</h5>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Procedure:</span>
                    <span className="text-sm font-medium text-gray-900">{procedureType ? procedureType.replace('-', ' ').charAt(0).toUpperCase() + procedureType.replace('-', ' ').slice(1) : 'Not determined'}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Interest Level:</span>
                    <span className="text-sm font-medium text-gray-900">{leadInfo?.interestLevel || 'Not assessed'}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Messages:</span>
                    <span className="text-sm font-medium text-gray-900">{messages.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h5 className="text-base font-semibold text-gray-800 mb-4">Legend</h5>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <span className="text-sm text-gray-600">Current State</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <span className="text-sm text-gray-600">Not Visited</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed State Panel Toggle */}
        {!showStatePanel && (
          <button
            onClick={() => setShowStatePanel(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-l-lg px-3 py-6 shadow-sm hover:shadow-md transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConversationalAdvisor;