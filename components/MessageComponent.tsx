import React from 'react';
import { Message } from '@/types/conversation';

interface MessageComponentProps {
  message: Message;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ message }) => {
  if (message.type === 'user') {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-xl">
          <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-6 py-4 shadow-sm">
            <p className="text-base leading-relaxed">{message.text}</p>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-right">{message.timestamp}</p>
        </div>
      </div>
    );
  }

  if (message.type === 'bot') {
    return (
      <div className="flex space-x-4 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">DC</span>
        </div>
        <div className="flex-1">
          <div className="bg-white rounded-2xl rounded-bl-md px-6 py-4 shadow-sm border border-gray-200">
            <p className="text-base text-gray-800 leading-relaxed">
              {message.text?.split(/(\[\d+\])/).map((part, i) => {
                const match = part.match(/\[(\d+)\]/);
                if (match) {
                  return (
                    <sup key={i} className="text-blue-600 font-semibold cursor-help ml-1" title={message.citations?.[parseInt(match[1]) - 1]}>
                      [{match[1]}]
                    </sup>
                  );
                }
                return part;
              })}
            </p>
            {message.citations && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Sources: {message.citations.join(', ')}
                </p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">{message.timestamp}</p>
        </div>
      </div>
    );
  }

  if (message.type === 'gallery' && message.images) {
    return (
      <div className="ml-14 grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        {message.images.map((img, imgIndex) => (
          <div key={imgIndex} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {img.before === img.after ? (
              // Single image display (facility, credentials, etc.)
              <div className="relative">
                <img 
                  src={img.before} 
                  alt={img.caption} 
                  className="w-full h-64 object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/400/300';
                  }}
                />
              </div>
            ) : (
              // Before/after comparison
              <div className="grid grid-cols-2">
                <div className="relative">
                  <img 
                    src={img.before} 
                    alt="Before" 
                    className="w-full h-56 object-cover" 
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/300/400';
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">Before</span>
                </div>
                <div className="relative">
                  <img 
                    src={img.after} 
                    alt="After" 
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/300/400';
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">After</span>
                </div>
              </div>
            )}
            <div className="p-4">
              <p className="text-sm font-medium text-gray-800">{img.caption}</p>
              <p className="text-sm text-gray-500 mt-1">Results may vary</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default MessageComponent;