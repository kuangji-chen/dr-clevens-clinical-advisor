export type ConversationState = 'welcome' | 'classify' | 'education' | 'gallery' | 'qualify' | 'booking' | 'capture' | 'complete';

export interface Message {
  type: 'user' | 'bot' | 'gallery';
  text?: string;
  timestamp: string;
  citations?: string[];
  hasGallery?: boolean;
  images?: GalleryImage[];
}

export interface GalleryImage {
  before?: string;
  after?: string;
  image?: string; // For single images (facility, team, etc.)
  caption: string;
  procedure?: string;
  ageRange?: string;
  gender?: 'male' | 'female';
  description?: string;
  type: 'before_after' | 'procedure_steps' | 'facility_tour' | 'doctor_credentials' | 'technique_comparison';
  caseId?: string; // Unique identifier for tracking
  isReal?: boolean; // Flag to indicate if these are real patient photos
}

export interface LeadInfo {
  name?: string;
  phone?: string;
  email?: string;
  preferredTime?: 'morning' | 'afternoon';
  interestLevel?: string;
}

export interface ConversationStore {
  // Current conversation state
  currentState: ConversationState;
  
  // Conversation context
  procedureType?: string | undefined;
  userConcerns: string[];
  
  // Messages with citations
  messages: Message[];
  
  // UI state
  isTyping: boolean;
  isStreaming: boolean;
  streamingMessage: string;
  quickPicks: string[];
  
  // Gallery state
  currentGalleryImages?: GalleryImage[];
  
  // Lead capture data
  leadInfo: LeadInfo;
  
  // Voice/Call features
  isVoiceActive: boolean;
  showCallModal: boolean;
  
  // Actions
  addMessage: (message: Message) => void;
  sendMessageToClaude: (userMessage: string) => Promise<void>;
  setCurrentState: (state: ConversationState) => void;
  setIsTyping: (typing: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  setStreamingMessage: (message: string) => void;
  setQuickPicks: (picks: string[]) => void;
  setIsVoiceActive: (active: boolean) => void;
  setShowCallModal: (show: boolean) => void;
  updateLeadInfo: (info: Partial<LeadInfo>) => void;
  resetConversation: () => void;
}