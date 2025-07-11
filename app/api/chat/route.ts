import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Medical knowledge base - will be enhanced when you provide PDFs
const MEDICAL_CONTEXT = `
You are Dr. Clevens' AI assistant, helping patients explore cosmetic and aesthetic procedures.

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
- Be warm, professional, and empathetic
- Always recommend consultation for personalized advice
- Use medical citations when providing facts
- Focus on education and building trust
- Never provide specific medical diagnoses
- Emphasize natural-looking results
`;

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationState } = await request.json();
    
    // Build conversation context
    const systemPrompt = `${MEDICAL_CONTEXT}

CURRENT CONVERSATION STATE: ${conversationState}

INSTRUCTIONS:
- Respond as Dr. Clevens' knowledgeable assistant
- Keep responses conversational but informative
- Include relevant medical citations in [1] format when stating facts
- Transition the conversation naturally toward booking a consultation
- If showing before/after results, mention the gallery option
- Be encouraging but realistic about expectations
- Always include appropriate disclaimers for medical advice

RESPONSE FORMAT:
- Use a warm, professional tone
- Include citations for medical facts: [1], [2], etc.
- End with a relevant question to continue the conversation
- Keep responses to 2-3 sentences for better readability

GALLERY ACTIONS:
When the user requests to see images, results, photos, examples, or facility tours, include a JSON action block in your response:

For before/after photos: {"action":{"show_gallery":true,"gallery_type":"before_after","procedure_type":"rhinoplasty","image_count":2}}
For procedure steps: {"action":{"show_gallery":true,"gallery_type":"procedure_steps","procedure_type":"rhinoplasty","image_count":3}}
For facility tour: {"action":{"show_gallery":true,"gallery_type":"facility_tour","image_count":3}}
For credentials: {"action":{"show_gallery":true,"gallery_type":"doctor_credentials","image_count":2}}
For techniques: {"action":{"show_gallery":true,"gallery_type":"technique_comparison","procedure_type":"rhinoplasty","image_count":2}}

Examples of user requests that should trigger gallery actions:
- "Show me before and after photos" → before_after
- "Can I see examples?" → before_after
- "What does the procedure look like?" → procedure_steps
- "Show me your facility" → facility_tour
- "What are Dr. Clevens credentials?" → doctor_credentials
- "How does this technique work?" → technique_comparison

Include the JSON action block AFTER your text response, on a new line.
`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      temperature: 0.3,
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
          
          // Send completion signal with citations and gallery actions
          const citations = extractCitations(fullResponse);
          const galleryAction = extractGalleryAction(fullResponse);
          const cleanedResponse = removeGalleryActionFromText(fullResponse);
          
          const finalData = JSON.stringify({ 
            type: 'complete', 
            fullText: cleanedResponse,
            citations: citations,
            galleryAction: galleryAction
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