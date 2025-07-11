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

      // Extract procedure type if in classify state
      if (state.currentState === 'classify') {
        const procedureType = extractProcedureType(userMessage);
        if (procedureType) {
          set((prevState) => ({
            ...prevState,
            procedureType: procedureType
          }));
        }
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

      // Determine next state based on current state and user input
      const currentState = state.currentState;
      console.log('🔄 State transition:', { currentState, userMessage });
      let newState = determineNextState(currentState, userMessage, state);
      console.log('➡️ New state:', newState);

      // Send to Claude API
      ClaudeService.sendMessage(
        [...state.messages, userMsg],
        newState,
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

          set((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, botMessage],
            isTyping: false,
            isStreaming: false,
            streamingMessage: '',
            currentState: newState,
            quickPicks: (() => {
              const picks = generateQuickPicks(newState, response.text, state.procedureType);
              console.log('🎯 Generated quick picks:', picks);
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

// State transition logic
function determineNextState(
  currentState: ConversationState, 
  userMessage: string, 
  state: { leadInfo?: any }
): ConversationState {
  const lowerMessage = userMessage.toLowerCase();
  
  switch (currentState) {
    case 'welcome':
      return 'classify';
      
    case 'classify':
      // Extract procedure type from user message
      if (lowerMessage.includes('rhinoplasty') || lowerMessage.includes('nose')) {
        return 'education';
      } else if (lowerMessage.includes('facial') || lowerMessage.includes('face') || lowerMessage.includes('rejuvenation')) {
        return 'education';
      } else if (lowerMessage.includes('mommy') || lowerMessage.includes('makeover') || lowerMessage.includes('tummy')) {
        return 'education';
      } else {
        return 'education'; // Default to education for any procedure interest
      }
      
    case 'education':
      if (lowerMessage.includes('results') || lowerMessage.includes('before') || lowerMessage.includes('after') || lowerMessage.includes('photos')) {
        return 'gallery';
      } else if (lowerMessage.includes('schedule') || lowerMessage.includes('consultation') || lowerMessage.includes('appointment')) {
        return 'booking';
      } else if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('qualified')) {
        return 'qualify';
      }
      return 'education'; // Stay in education for more questions
      
    case 'gallery':
      if (lowerMessage.includes('schedule') || lowerMessage.includes('consultation') || lowerMessage.includes('appointment')) {
        return 'booking';
      } else if (lowerMessage.includes('qualified') || lowerMessage.includes('candidate')) {
        return 'qualify';
      }
      return 'qualify'; // Default progression after gallery
      
    case 'qualify':
      if (lowerMessage.includes('schedule') || lowerMessage.includes('consultation') || lowerMessage.includes('ready')) {
        return 'booking';
      }
      return 'booking'; // Default progression after qualification
      
    case 'booking':
      if (lowerMessage.includes('yes') || lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
        return 'capture';
      }
      return 'capture'; // Progress to lead capture
      
    case 'capture':
      // Check if we have enough info to complete
      const leadInfo = state.leadInfo || {};
      if (leadInfo.name && (leadInfo.phone || leadInfo.email)) {
        return 'complete';
      }
      return 'capture'; // Stay in capture until we have required info
      
    case 'complete':
      return 'complete'; // Terminal state
      
    default:
      return currentState;
  }
}

// Generate state-specific quick picks
function generateQuickPicks(
  state: ConversationState, 
  lastBotMessage: string, 
  procedureType?: string
): string[] {
  switch (state) {
    case 'welcome':
      return [
        "I'm interested in rhinoplasty",
        "Tell me about facial rejuvenation", 
        "What's a mommy makeover?",
        "I'd like to schedule a consultation"
      ];
      
    case 'classify':
      return [
        "I want to improve my nose",
        "I look tired all the time",
        "I want to restore my body after pregnancy",
        "I'm not sure what procedure I need"
      ];
      
    case 'education':
      return [
        "Show me before and after photos",
        "What's the recovery time?",
        "How much does it cost?",
        "Am I a good candidate?"
      ];
      
    case 'gallery':
      return [
        "These results look great!",
        "What's the next step?",
        "Schedule a consultation",
        "Tell me more about the procedure"
      ];
      
    case 'qualify':
      return [
        "I haven't had previous surgery",
        "I'm in good health",
        "I'm ready to move forward",
        "Schedule my consultation"
      ];
      
    case 'booking':
      return [
        "Yes, I'd like to schedule",
        "What times are available?",
        "I prefer mornings",
        "I prefer afternoons"
      ];
      
    case 'capture':
      if (lastBotMessage.includes('name')) {
        return ["Sarah Johnson", "Michael Smith", "Jessica Brown"];
      } else if (lastBotMessage.includes('phone')) {
        return ["(555) 123-4567", "Text me instead", "Call me at..."];
      } else if (lastBotMessage.includes('email')) {
        return ["sarah@email.com", "mike.smith@gmail.com", "Use my phone instead"];
      }
      return ["Here's my information", "Let me provide that", "Contact me at..."];
      
    case 'complete':
      return [
        "Thank you!",
        "When should I expect your call?",
        "What should I prepare?",
        "Start a new conversation"
      ];
      
    default:
      return [];
  }
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