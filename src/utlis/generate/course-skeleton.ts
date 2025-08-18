import { getGeminiResponse } from "./gemini";
import { slidePrompts } from "./slide-prompts";
import { CourseSkeleton } from "./type";

export async function generateCourseSkeleton(title: string, description: string, userPrompt: string = ""): Promise<CourseSkeleton[]> {
  const commonRules = `
  - Only respond with the course skeleton in JSON format.
  - Do not include any additional text or explanations.
  - Do not include any markdown formatting.
  - Ensure the JSON is valid and properly formatted.
  - The "type" field should be an array of slide types.
  - Use single type arrays for simple slides (e.g., ["title"], ["section"], ["content"]).
  - Limit to maximum 3 slides per topic. If a topic needs more than 3 slides, divide it into 2 separate topic titles.
  `;

  const jsonFormat = `
  [
    {
      "title": "Slide Title 1",
      "description": "Slide Description 1",
      "type": ["content"],
    },
    {
      "title": "Slide Title 2",
      "description": "Slide Description 2",
      "type": ["section", "content", "content"],
    },
    ...
  ]
  `;

  const importantNotes = `
  - When a topic requires more than 3 slides, break it into multiple topic titles (e.g., "JavaScript Basics Part 1" and "JavaScript Basics Part 2").
  - Descriptions will be used to generate the content later, so keep them detailed and specific.
  - Multiple slide types are if [content, code, mermaid] then slide 1 is content, slide 2 is code, slide 3 is mermaid we are just clubbing together things with same title.
  - Descriptions should give entire picture of the slide content, because when generating only this description will be used ignoring the other descriptions.
  `;

  // line seperated key: shortDescription
  const types = Object.entries(slidePrompts)
    .filter(([, value]) => value.include)
    .map(([key, value]) => `${key}: ${value.shortDescription}`)
    .join('\n');

  const fullPrompt = `
You are an expert AI course designer. Your task is to generate a detailed course skeleton based on the provided title, description, and user prompt. Keep the course engaging and interactive by using various slide types. This is a crash course, so ensure the content is concise yet informative.

Title: ${title}
Description: ${description}
${userPrompt ? `User Prompt: ${userPrompt}` : ""}

Here are the available slide types and their descriptions:
${types}

Common Rules:
${commonRules}

Important Notes:
${importantNotes}

Response Format:
${jsonFormat}
`;

  try {
    const response = await getGeminiResponse(fullPrompt, true);
    
    // Check if the response contains an error
    if (response.includes('"error"') || response.startsWith("Sorry, I")) {
      console.warn(`Gemini API returned error: ${response}`);
      throw new Error(`API error: ${response}`);
    }
    
    const courseSkeleton: CourseSkeleton[] = JSON.parse(response);

    // Check if it's an error object
    if (Array.isArray(courseSkeleton) && courseSkeleton.length > 0) {
      const firstItem = courseSkeleton[0] as Record<string, unknown>;
      if (firstItem.error) {
        console.warn(`Generation error: ${firstItem.message || firstItem.error}`);
        throw new Error(`Generation error: ${firstItem.message || firstItem.error}`);
      }
    }

    // Validate the course skeleton structure
    if (!Array.isArray(courseSkeleton)) {
      throw new Error("Invalid course skeleton format. Expected an array.");
    }

    console.log("Generated course skeleton:", courseSkeleton);
    return courseSkeleton;
  } catch (error) {
    console.error("Error generating course skeleton:", error);
    console.log("Full prompt sent to Gemini:", fullPrompt.substring(0, 500) + "...");
    
    // Return a fallback skeleton if generation fails
    return generateFallbackSkeleton(title, description);
  }
}

function generateFallbackSkeleton(title: string, description: string): CourseSkeleton[] {
  return [
    {
      title: `Introduction to ${title}`,
      description: `Overview and fundamental concepts of ${title}. ${description}`,
      type: ["title", "content"]
    },
    {
      title: `Core Concepts of ${title}`,
      description: `Deep dive into the main principles and key learning points.`,
      type: ["section", "content", "list"]
    },
    {
      title: `Practical Applications`,
      description: `Real-world examples and use cases demonstrating the practical value.`,
      type: ["content", "list"]
    },
    {
      title: `Summary and Next Steps`,
      description: `Key takeaways and recommendations for continued learning.`,
      type: ["content", "quote"]
    }
  ];
}