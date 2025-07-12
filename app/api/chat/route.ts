import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Medical knowledge base - will be enhanced when you provide PDFs
const MEDICAL_CONTEXT = `
You are Dr. Clevens' AI assistant, helping patients explore cosmetic and aesthetic procedures.
IMPORTANT: Be CONCISE (1-2 sentences) while maintaining a warm, professional, and empathetic tone.

ABOUT DR. CLEVENS:
- Board-certified plastic surgeon
- Specializes in facial rejuvenation, rhinoplasty, and body contouring
- Known for natural-looking results
- Offers complimentary consultations

KEY PROCEDURES:
1. RHINOPLASTY
   - Recovery: 7-10 days back to work, final results at 12 months
   - Addresses: dorsal humps, crooked noses, tip refinement
   - Technique: Closed or open approach based on case complexity

2. FACIAL REJUVENATION
   - Facelifts, brow lifts, eyelid surgery
   - Non-surgical options: Botox, fillers
   - Recovery varies by procedure

3. MOMMY MAKEOVER
   - Combines tummy tuck, breast surgery, liposuction
   - Customized to individual needs
   - Best performed after done having children

CONVERSATION GUIDELINES:
- Maintain warm, professional, and empathetic demeanor
- Balance medical expertise with genuine compassion
- Show understanding for patient concerns and emotions
- Always recommend consultation for personalized advice
- Use medical citations when providing facts
- Build trust through professional expertise and empathy
- Never provide specific medical diagnoses
- Emphasize natural-looking results
- Ensure patients feel heard, respected, and valued
`;

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationState } = await request.json();
    
    // Parse enhanced conversation context
    let contextInfo;
    try {
      contextInfo = JSON.parse(conversationState);
    } catch {
      // Fallback for simple string state
      contextInfo = { currentState: conversationState };
    }
    
    // Build conversation context
    const systemPrompt = `${MEDICAL_CONTEXT}

CURRENT CONVERSATION CONTEXT: ${JSON.stringify(contextInfo, null, 2)}

CONVERSATION STATES:
- welcome: Initial greeting, understanding patient needs
- classify: Identifying specific procedure interests
- education: Providing procedure information and details
- gallery: Showing before/after results and examples
- qualify: Assessing candidacy and medical history
- booking: Scheduling consultation appointment
- capture: Collecting contact information
- complete: Confirming appointment and next steps

INSTRUCTIONS:
- Respond as Dr. Clevens' knowledgeable assistant
- Keep responses conversational but informative
- Include relevant medical citations in [1] format when stating facts
- Guide the conversation naturally based on patient needs
- Be encouraging but realistic about expectations
- Always include appropriate disclaimers for medical advice

STATE TRANSITION RULES:
- Analyze the user's intent and message content
- Determine the most appropriate next state based on the conversation
- You can skip states if the user expresses clear intent (e.g., "I want to book now" can go directly to booking)
- You can return to previous states if the user has more questions
- Include the next state in your response as: {"next_state": "state_name"}

IMPORTANT: Always include the next state transition at the end of your response.
Examples:
- User asks about a procedure → {"next_state": "education"}
- User wants to see results → {"next_state": "gallery"}
- User ready to book → {"next_state": "booking"}
- User asks more questions about procedure → stay in current state or return to "education"

RESPONSE FORMAT:
- Maintain warm, professional, and empathetic tone throughout
- CONCISE: 1-2 sentences typically (unless explaining procedures or addressing concerns)
- Show understanding: "I understand your concerns", "That's a great question"
- Include citations for medical facts: [1], [2], etc.
- End with a brief, professional question to guide conversation
- Use clear, accessible language while maintaining professionalism
- ALWAYS include {"next_state": "appropriate_state"} at the very end

TONE EXAMPLES:
- User: "I'm nervous" → "I completely understand - it's natural to feel that way! What specific concerns can I help address?"
- User: "What's rhinoplasty?" → "Great question! Rhinoplasty reshapes your nose to improve appearance or breathing [1]. What aspects of your nose would you like to change?"
- User: "How much?" → "Rhinoplasty typically ranges from $7,000-$15,000 [2]. We offer flexible financing - would that be helpful?"
- User: "Tell me everything" → [Warm, detailed response appropriate here]

SEMANTIC GALLERY SYSTEM:
Use your intelligence to determine when visual content would enhance the conversation. Consider the user's intent, conversation context, and natural flow.

GALLERY DECISION FRAMEWORK:
Analyze each user message for:
1. **Visual Intent**: Does the user seem interested in seeing something visual?
2. **Conversation Context**: Would showing images naturally help answer their question?
3. **Educational Value**: Would visuals enhance understanding of what they're asking about?
4. **Conversation Flow**: Is this a natural moment to introduce visuals?

AVAILABLE GALLERY TYPES:
- before_after: Patient transformation results
- procedure_steps: How procedures are performed
- facility_tour: Dr. Clevens' office and facilities
- doctor_credentials: Certifications and qualifications
- technique_comparison: Different surgical techniques

SEMANTIC TRIGGERS (use your judgment):
- User expresses curiosity about results ("what kind of results", "how effective", "what to expect")
- User asks about the procedure process ("how it works", "what happens during")
- User wants to understand techniques or approaches
- User inquires about Dr. Clevens or the practice
- User seems hesitant and would benefit from seeing examples
- Natural conversation progression where visuals would help

CONTEXTUAL CONSIDERATIONS:
- Don't repeat the same gallery type if recently shown
- Consider the user's emotional state and readiness
- Match gallery type to their specific interests
- Use conversation history to avoid redundancy
- Be responsive to follow-up requests for different views

EXAMPLES of SEMANTIC DECISION MAKING:
- "I'm worried about looking unnatural" → before_after (natural-looking results)
- "How invasive is the procedure?" → procedure_steps (show gentle approach)
- "I'm not sure about this doctor" → doctor_credentials (build trust)
- "What's recovery like?" → before_after (healing progression) or procedure_steps
- "Tell me about your practice" → facility_tour (comfortable environment)

FORMAT: Include {"action":{"show_gallery":true,"gallery_type":"type","procedure_type":"procedure","image_count":2-4}} when appropriate.

Trust your semantic understanding - show galleries when they would naturally enhance the conversation and help the user.
`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      temperature: 0.4,
      system: systemPrompt,
      messages: messages.map((msg: { type: string; text: string }) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      stream: true,
    });

    // Set up Server-Sent Events for streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        
        try {
          for await (const chunk of response) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const text = chunk.delta.text;
              fullResponse += text;
              
              // Send each chunk as SSE
              const data = JSON.stringify({ 
                type: 'text_delta', 
                text: text,
                fullText: fullResponse 
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          
          // Send completion signal with citations, gallery actions, and state transition
          const citations = extractCitations(fullResponse);
          const galleryAction = extractGalleryAction(fullResponse);
          const nextState = extractNextState(fullResponse);
          
          // Debug logging for gallery triggers
          if (galleryAction) {
            console.log('🖼️ Gallery action triggered:', galleryAction);
            console.log('📝 Full Claude response:', fullResponse);
          }
          
          let cleanedResponse = removeGalleryActionFromText(fullResponse);
          cleanedResponse = removeNextStateFromText(cleanedResponse);
          
          const finalData = JSON.stringify({ 
            type: 'complete', 
            fullText: cleanedResponse,
            citations: citations,
            galleryAction: galleryAction,
            nextState: nextState
          });
          controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
          
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = JSON.stringify({ 
            type: 'error', 
            message: 'Sorry, I encountered an issue. Please try again.' 
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Claude' },
      { status: 500 }
    );
  }
}

// Extract citations from response text
function extractCitations(text: string): string[] {
  const citations: string[] = [];
  const citationMatches = text.match(/\[(\d+)\]/g);
  
  if (citationMatches) {
    // Map citation numbers to source descriptions
    const sourceMap: { [key: string]: string } = {
      '[1]': 'Dr. Clevens Surgical Guidelines',
      '[2]': 'Rhinoplasty Recovery Guide',
      '[3]': 'Facial Rejuvenation Techniques',
      '[4]': 'Mommy Makeover Best Practices',
      '[5]': 'Patient Safety Protocols'
    };
    
    citationMatches.forEach(match => {
      if (sourceMap[match] && !citations.includes(sourceMap[match])) {
        citations.push(sourceMap[match]);
      }
    });
  }
  
  return citations;
}

// Extract gallery action from response text
function extractGalleryAction(text: string): Record<string, unknown> | null {
  try {
    // Look for JSON action blocks in the response
    const actionMatch = text.match(/\{"action":\{[^}]+\}\}/);
    if (actionMatch) {
      const actionJson = JSON.parse(actionMatch[0]);
      return actionJson.action as Record<string, unknown>;
    }
  } catch (error) {
    console.log('Failed to parse gallery action:', error);
  }
  return null;
}

// Remove gallery action JSON from display text
function removeGalleryActionFromText(text: string): string {
  return text.replace(/\{"action":\{[^}]+\}\}/, '').trim();
}

// Extract next state from response text
function extractNextState(text: string): string | null {
  try {
    const stateMatch = text.match(/\{"next_state":\s*"([^"]+)"\}/);
    if (stateMatch && stateMatch[1]) {
      return stateMatch[1];
    }
  } catch (error) {
    console.log('Failed to parse next state:', error);
  }
  return null;
}

// Remove next state JSON from display text
function removeNextStateFromText(text: string): string {
  return text.replace(/\{"next_state":\s*"[^"]+"\}/, '').trim();
}