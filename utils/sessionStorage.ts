const SESSION_KEY = 'clevens-chatbot-session';

export interface SessionData {
  currentState: string;
  messages: any[];
  leadInfo: any;
  procedureType?: string;
  userConcerns: string[];
}

export const loadFromSession = (): SessionData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from session storage:', error);
    return null;
  }
};

export const saveToSession = (data: any): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Only save necessary data
    const dataToSave = {
      currentState: data.currentState,
      messages: data.messages,
      leadInfo: data.leadInfo,
      procedureType: data.procedureType,
      userConcerns: data.userConcerns,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving to session storage:', error);
  }
};

export const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session storage:', error);
  }
};