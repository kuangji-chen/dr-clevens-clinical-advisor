import { Message } from '@/types/conversation';

export interface StreamingResponse {
  type: 'text_delta' | 'complete' | 'error';
  text?: string;
  fullText?: string;
  citations?: string[];
  galleryAction?: Record<string, unknown>;
  nextState?: string;
  message?: string;
}

export class ClaudeService {
  static async sendMessage(
    messages: Message[],
    conversationState: string,
    onChunk: (chunk: StreamingResponse) => void,
    onComplete: (response: { text: string; citations: string[]; galleryAction?: Record<string, unknown>; nextState?: string }) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.filter(m => m.type !== 'gallery').map(m => ({
            type: m.type,
            text: m.text
          })),
          conversationState
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: StreamingResponse = JSON.parse(line.slice(6));
              
              if (data.type === 'text_delta') {
                onChunk(data);
              } else if (data.type === 'complete') {
                onComplete({
                  text: data.fullText || '',
                  citations: data.citations || [],
                  galleryAction: data.galleryAction,
                  nextState: data.nextState
                });
              } else if (data.type === 'error') {
                onError(data.message || 'Unknown error occurred');
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Claude service error:', error);
      onError('Failed to connect to Claude. Please try again.');
    }
  }

  static generateQuickPicks(conversationState: string, lastMessage?: string): string[] {
    const basePicks = {
      welcome: [
        "I'm interested in rhinoplasty",
        "Tell me about facial rejuvenation",
        "What's a mommy makeover?",
        "I'd like to schedule a consultation"
      ],
      classify: [
        "Show me results",
        "What's the recovery like?",
        "How much does it cost?",
        "Schedule consultation"
      ],
      education: [
        "Show me before and after photos",
        "What are the risks?",
        "How long is recovery?",
        "Book a consultation"
      ],
      gallery: [
        "These look great! What's next?",
        "How much would this cost?",
        "Schedule my consultation",
        "Tell me about recovery"
      ],
      qualify: [
        "I haven't had surgery before",
        "I'm in good health",
        "Book consultation now",
        "What should I prepare?"
      ],
      booking: [
        "Mornings work better",
        "Afternoons are preferred",
        "I'm flexible with timing",
        "What should I bring?"
      ],
      capture: [
        "Yes, that's correct",
        "Please use my email",
        "Call me instead",
        "When will you contact me?"
      ]
    };

    return basePicks[conversationState as keyof typeof basePicks] || basePicks.welcome;
  }
}