import { create } from 'zustand';
import { ConversationStore, Message, ConversationState, LeadInfo } from '@/types/conversation';
import { loadFromSession, saveToSession, clearSession } from '@/utils/sessionStorage';
import { ClaudeService } from '@/utils/claudeService';
import { getImagesByProcedure, getRandomImages, placeholderImages, getImagesForAction, GalleryAction } from '@/data/galleryImages';

const getInitialState = () => ({
  currentState: 'welcome' as ConversationState,
  procedureType: undefined,
  userConcerns: [],
  messages: [
    {
      type: 'bot' as const,
      text: "Hi there! I'm here to help you explore your options with Dr. Clevens. What brings you here today?",
      timestamp: '10:00 AM'
    }
  ],
  isTyping: false,
  isStreaming: false,
  streamingMessage: '',
  quickPicks: [
    "I'm interested in rhinoplasty",
    "Tell me about facial rejuvenation", 
    "What's a mommy makeover?",
    "I'd like to schedule a consultation"
  ],
  currentGalleryImages: undefined,
  leadInfo: {},
  isVoiceActive: false,
  showCallModal: false,
});

export const useConversationStore = create<ConversationStore>((set, get) => ({
  ...getInitialState(),
    
    addMessage: (message: Message) => {
      set((state) => {
        const newState = {
          ...state,
          messages: [...state.messages, message],
          isTyping: message.type === 'user',
        };
        
        // Save to session storage (disabled for now)
        // saveToSession(newState);
        
        return newState;
      });
    },

    // New method to send message to Claude
    sendMessageToClaude: async (userMessage: string) => {
      const state = get();
      
      // Add user message
      const userMsg: Message = {
        type: 'user',
        text: userMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      set((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, userMsg],
        isTyping: true,
        isStreaming: false,
        streamingMessage: '',
      }));

      // Extract procedure type from any message for context
      const procedureType = extractProcedureType(userMessage);
      if (procedureType && !state.procedureType) {
        set((prevState) => ({
          ...prevState,
          procedureType: procedureType
        }));
      }
      
      // Extract lead info if in capture state
      if (state.currentState === 'capture') {
        const leadInfo = extractLeadInfo(userMessage, state.leadInfo || {});
        if (leadInfo) {
          set((prevState) => ({
            ...prevState,
            leadInfo: { ...(prevState.leadInfo || {}), ...leadInfo }
          }));
        }
      }

      // Log current state for debugging
      const currentState = state.currentState;
      console.log('🔄 Current state:', { currentState, userMessage });

      // Send to Claude API
      ClaudeService.sendMessage(
        [...state.messages, userMsg],
        currentState,
        // On chunk received (streaming)
        (chunk) => {
          if (chunk.type === 'text_delta' && chunk.text) {
            set((prevState) => ({
              ...prevState,
              isStreaming: true,
              streamingMessage: prevState.streamingMessage + chunk.text,
            }));
          }
        },
        // On complete
        (response) => {
          const botMessage: Message = {
            type: 'bot',
            text: response.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            citations: response.citations.length > 0 ? response.citations : undefined
          };

          // Use Claude's state transition if provided, otherwise keep current state
          const nextState = response.nextState || currentState;
          console.log('➡️ Claude determined next state:', nextState);

          set((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, botMessage],
            isTyping: false,
            isStreaming: false,
            streamingMessage: '',
            currentState: nextState as ConversationState,
            quickPicks: (() => {
              const picks = generateQuickPicks(nextState as ConversationState, response.text, prevState.procedureType);
              console.log('🎯 Generated quick picks for state', nextState, ':', picks);
              return picks;
            })(),
          }));

          // Handle gallery actions from Claude's response
          if (response.galleryAction && response.galleryAction.show_gallery) {
            console.log('🖼️ Gallery action detected:', response.galleryAction);
            
            setTimeout(() => {
              const galleryImages = getImagesForAction(response.galleryAction as unknown as GalleryAction);
              console.log('📸 Fetched gallery images:', galleryImages);
              
              // Format images for display
              const formattedImages = galleryImages.map(img => {
                if (img.type === 'before_after') {
                  return {
                    before: img.before!,
                    after: img.after!,
                    caption: `${img.procedure?.replace('-', ' ') || 'Procedure'} - ${img.caption}`
                  };
                } else {
                  // For single images (facility, credentials, etc.)
                  return {
                    before: img.image!,
                    after: img.image!, // Same image for both sides
                    caption: img.caption
                  };
                }
              });

              const galleryMessage: Message = {
                type: 'gallery',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                images: formattedImages.length > 0 ? formattedImages : [
                  { 
                    before: '/api/placeholder/300/400', 
                    after: '/api/placeholder/300/400', 
                    caption: 'Images not available' 
                  }
                ]
              };

              set((prevState) => ({
                ...prevState,
                messages: [...prevState.messages, galleryMessage],
              }));
            }, 1000); // Small delay for better UX
          }
        },
        // On error
        (error) => {
          const errorMessage: Message = {
            type: 'bot',
            text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          set((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, errorMessage],
            isTyping: false,
            isStreaming: false,
            streamingMessage: '',
          }));
        }
      );
    },
    
    setCurrentState: (currentState: ConversationState) => {
      set({ currentState });
    },
    
    setIsTyping: (isTyping: boolean) => set({ isTyping }),
    
    setIsStreaming: (isStreaming: boolean) => set({ isStreaming }),
    
    setStreamingMessage: (streamingMessage: string) => set({ streamingMessage }),
    
    setQuickPicks: (quickPicks: string[]) => set({ quickPicks }),
    
    setIsVoiceActive: (isVoiceActive: boolean) => set({ isVoiceActive }),
    
    setShowCallModal: (showCallModal: boolean) => set({ showCallModal }),
    
    updateLeadInfo: (info: Partial<LeadInfo>) => {
      set((state) => ({
        leadInfo: { ...state.leadInfo, ...info }
      }));
    },
    
    resetConversation: () => {
      clearSession();
      set(getInitialState());
    },
}));

// DEPRECATED: State transitions are now handled by Claude AI
// This function is kept for backwards compatibility but is no longer used
// Claude determines the next state based on conversation context and returns it in the response
function determineNextState(
  currentState: ConversationState, 
  userMessage: string, 
  state: { leadInfo?: any }
): ConversationState {
  // This function is deprecated - Claude now handles state transitions
  console.warn('determineNextState is deprecated. State transitions are now handled by Claude.');
  return currentState;
}

// Generate context-aware quick picks based on state and conversation history
function generateQuickPicks(
  state: ConversationState, 
  lastBotMessage: string, 
  procedureType?: string
): string[] {
  const lowerBotMessage = lastBotMessage.toLowerCase();
  
  // Context-aware suggestions based on bot's last message
  if (lowerBotMessage.includes('what brings you') || lowerBotMessage.includes('help you explore')) {
    return [
      "I'm interested in rhinoplasty",
      "Tell me about facial rejuvenation", 
      "What's a mommy makeover?",
      "I'd like to schedule a consultation"
    ];
  }
  
  if (lowerBotMessage.includes('tell me more') || lowerBotMessage.includes('specific concerns')) {
    return [
      "I want to improve my nose shape",
      "I look tired and want to appear refreshed",
      "I'd like to restore my pre-pregnancy body",
      "Can you show me some examples?"
    ];
  }
  
  if (lowerBotMessage.includes('photos') || lowerBotMessage.includes('results') || lowerBotMessage.includes('examples')) {
    return [
      "Show me before and after photos",
      "What about recovery time?",
      "How much does this typically cost?",
      "Am I a good candidate?"
    ];
  }
  
  if (lowerBotMessage.includes('candidate') || lowerBotMessage.includes('qualify')) {
    return [
      "I'm in good health",
      "I haven't had previous surgery",
      "I'm ready to schedule a consultation",
      "Tell me more about the process"
    ];
  }
  
  if (lowerBotMessage.includes('schedule') || lowerBotMessage.includes('consultation') || lowerBotMessage.includes('appointment')) {
    return [
      "Yes, I'd like to schedule",
      "What times are available?",
      "I prefer mornings",
      "Tell me what to expect"
    ];
  }
  
  if (lowerBotMessage.includes('name') && !lowerBotMessage.includes('procedure')) {
    return ["John Smith", "Sarah Johnson", "Let me type it"];
  }
  
  if (lowerBotMessage.includes('phone') || lowerBotMessage.includes('number')) {
    return ["(555) 123-4567", "Text me instead", "I'll provide my email"];
  }
  
  if (lowerBotMessage.includes('email')) {
    return ["john@email.com", "sarah@gmail.com", "Use my phone instead"];
  }
  
  // Default quick picks based on state if no specific context match
  const defaultPicks: Record<ConversationState, string[]> = {
    welcome: [
      "I'm exploring my options",
      "Tell me about popular procedures",
      "I have a specific concern",
      "Schedule a consultation"
    ],
    classify: [
      "Show me what's possible",
      "I need more information",
      "What do you recommend?",
      "Let's discuss my goals"
    ],
    education: [
      "Show me examples",
      "What about recovery?",
      "Tell me about costs",
      "Next steps?"
    ],
    gallery: [
      "Impressive results!",
      "Tell me more",
      "I'm interested",
      "Different angles?"
    ],
    qualify: [
      "I'm healthy",
      "No prior surgery",
      "Some medical history",
      "Ready to proceed"
    ],
    booking: [
      "Yes, book me",
      "Morning works",
      "Afternoon is better",
      "What's next?"
    ],
    capture: [
      "Here's my info",
      "Contact me",
      "Prefer phone",
      "Prefer email"
    ],
    complete: [
      "Thank you",
      "What's next?",
      "When will you call?",
      "New question"
    ]
  };
  
  // Add procedure-specific options when relevant
  if (procedureType && (state === 'education' || state === 'gallery')) {
    const procedureSpecific = {
      'rhinoplasty': ["Show nose job results", "Breathing improvements?", "Natural looking?"],
      'facial-rejuvenation': ["Show facelift results", "Non-surgical options?", "How long does it last?"],
      'mommy-makeover': ["Show full transformations", "Recovery with kids?", "Staged procedures?"]
    };
    
    const specificOptions = procedureSpecific[procedureType as keyof typeof procedureSpecific];
    if (specificOptions) {
      return [...specificOptions, "Schedule consultation"];
    }
  }
  
  return defaultPicks[state] || defaultPicks.welcome;
}

// Extract procedure type from user message
function extractProcedureType(message: string): string | undefined {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('rhinoplasty') || lowerMessage.includes('nose')) {
    return 'rhinoplasty';
  } else if (lowerMessage.includes('facial') || lowerMessage.includes('face') || lowerMessage.includes('rejuvenation')) {
    return 'facial-rejuvenation';
  } else if (lowerMessage.includes('mommy') || lowerMessage.includes('makeover') || lowerMessage.includes('tummy')) {
    return 'mommy-makeover';
  } else if (lowerMessage.includes('breast') || lowerMessage.includes('augmentation')) {
    return 'breast-surgery';
  } else if (lowerMessage.includes('liposuction') || lowerMessage.includes('lipo')) {
    return 'liposuction';
  }
  
  return undefined;
}

// Extract lead information from user message
function extractLeadInfo(message: string, currentLeadInfo: any = {}): any {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
  
  const updates: any = {};
  
  // Extract email
  const emailMatch = message.match(emailRegex);
  if (emailMatch && !currentLeadInfo.email) {
    updates.email = emailMatch[0];
  }
  
  // Extract phone
  const phoneMatch = message.match(phoneRegex);
  if (phoneMatch && !currentLeadInfo.phone) {
    updates.phone = phoneMatch[0];
  }
  
  // Extract name (simple heuristic - if no email/phone and looks like a name)
  if (!currentLeadInfo.name && !emailMatch && !phoneMatch) {
    const words = message.trim().split(' ');
    if (words.length >= 2 && words.length <= 4 && words.every(word => 
      word.length > 1 && /^[A-Za-z]+$/.test(word)
    )) {
      updates.name = message.trim();
    }
  }
  
  // Extract time preference
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('morning') && !currentLeadInfo.preferredTime) {
    updates.preferredTime = 'morning';
  } else if (lowerMessage.includes('afternoon') && !currentLeadInfo.preferredTime) {
    updates.preferredTime = 'afternoon';
  }
  
  return Object.keys(updates).length > 0 ? updates : undefined;
}