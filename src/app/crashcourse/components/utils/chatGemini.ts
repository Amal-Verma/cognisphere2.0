import { getGeminiResponse } from './gemini';

/**
 * Chat with Gemini using slide context
 * @param {string} userMessage - The user's message
 * @param {object} slideContext - Context including current slide and adjacent slides
 * @returns {Promise<string>} - The chat response
 */
export async function chatWithGemini(userMessage: string, slideContext: {
  currentSlide?: Record<string, unknown>;
  previousSlide?: Record<string, unknown>;
  nextSlide?: Record<string, unknown>;
  slideNumber: number;
  totalSlides: number;
}): Promise<string> {
  const contextInfo = slideContext ? `
SLIDE CONTEXT:
Current Slide: ${JSON.stringify(slideContext.currentSlide, null, 2)}
Previous Slide: ${slideContext.previousSlide ? JSON.stringify(slideContext.previousSlide, null, 2) : 'None (first slide)'}
Next Slide: ${slideContext.nextSlide ? JSON.stringify(slideContext.nextSlide, null, 2) : 'None (last slide)'}
Slide Position: ${slideContext.slideNumber + 1} of ${slideContext.totalSlides}
` : '';

  const prompt = `You are an AI teaching assistant helping students understand course content. You have access to the current slide and adjacent slides for context.

${contextInfo}

INSTRUCTIONS:
- Answer questions about the current slide content or related concepts
- If the user mentions a specific slide number, focus on that slide if it's in the context
- Provide clear, educational explanations
- Be encouraging and supportive
- Keep responses concise but informative
- If asked to navigate (next, previous, go to slide X), respond accordingly
- Use the slide context to provide relevant and specific answers

USER QUESTION: ${userMessage}

Provide a helpful response as an AI teacher:`;

  try {
    const response = await getGeminiResponse(prompt, false);
    return response;
  } catch (error) {
    console.error('Chat error:', error);
    return "I apologize, but I'm having trouble processing your question right now. Please try again or ask about something specific from the current slide.";
  }
}
