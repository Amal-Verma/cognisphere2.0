import { getGeminiResponse } from "./gemini";
import { slidePrompts } from "./slide-prompts";

export async function generateCourseSlide(title: string, description: string, type: Array<keyof typeof slidePrompts>, userPrompt: string = "") {
  const commonRules = `
  - Only respond with the course slide in JSON format.
  - Do not include any additional text or explanations.
  - Do not include any markdown formatting.
  - Ensure the JSON is valid and properly formatted.
  - Create a balanced mix of content and interactive elements.
  - Don't add extra elements in the output json array
  - Number of elements in the output json array should be equal to the number of types in the type array
  - Make sure to use proper JSON formatting and use escaping where necessary.
  - Make sure to close the JSON array with a closing square bracket.
  `;

  const jsonFormat = `
  [
  ${type.map(t => slidePrompts[t].format).join(',\n').split('\n').map(line => `  ${line}`).join('\n')}
  ]`;

  const purposes = type.map(t => `${t}: ${slidePrompts[t].longDescription}`).join('\n');

  const fullPrompt = `
  You are an expert AI course designer. Your task is to generate a detailed course slide based on the provided title, description, and user prompt. Keep the slide engaging and interactive by using various slide types. This is a crash course, so ensure the content is concise yet informative.

  Title: ${title}
  Description: ${description}
  ${userPrompt ? `User Prompt: ${userPrompt}` : ""}

  Type of Slide[i]: ${type.map(t => t).join(', ')}

  Common Rules:
${commonRules}

  Purpose of the slide:
${purposes}

  Response Format:
${jsonFormat}
  `;

  try {
    const response = await getGeminiResponse(fullPrompt, true);
    
    // Check if the response is an error message or contains error
    if (response.startsWith("Sorry, I") || response.includes('"error"')) {
      console.warn(`Gemini API returned error: ${response}`);
      throw new Error(`API error: ${response}`);
    }
    
    const courseSlide = JSON.parse(response);

    // Check if it's an error object
    if (courseSlide.error) {
      console.warn(`Generation error: ${courseSlide.message || courseSlide.error}`);
      throw new Error(`Generation error: ${courseSlide.message || courseSlide.error}`);
    }

    // Validate the course slide structure
    if (!courseSlide || typeof courseSlide !== "object") {
      throw new Error("Invalid course slide format. Expected an object.");
    }

    // Check if it's a valid array
    if (Array.isArray(courseSlide) && courseSlide.length > 0) {
      console.log("Generated course slide:", courseSlide);
      return courseSlide;
    }

    console.log("Generated course slide:", courseSlide);
    return courseSlide;
  } catch (error) {
    console.error("Error generating course slide:", error);
    console.log("Full prompt sent to Gemini:", fullPrompt.substring(0, 500) + "...");
    
    // Return intelligent fallback slides based on the type
    return generateFallbackSlides(title, description, type);
  }
}

function generateFallbackSlides(title: string, description: string, type: Array<keyof typeof slidePrompts>) {
  const fallbackSlides = [];
  
  for (const slideType of type) {
    switch (slideType) {
      case 'title':
        fallbackSlides.push({
          title: title,
          subtitle: description,
          backgroundImage: "",
          backgroundColor: "#4f46e5"
        });
        break;
        
      case 'content':
        fallbackSlides.push({
          content: `# ${title}\n\n${description}\n\nThis section covers the fundamental concepts and key learning objectives. Due to current service limitations, this content provides a foundational overview that will help you understand the core principles.`,
          bullets: [
            "Core concepts and principles",
            "Key learning objectives",
            "Practical applications",
            "Important takeaways"
          ]
        });
        break;
        
      case 'section':
        fallbackSlides.push({
          title: title,
          subtitle: description,
          icon: "📚"
        });
        break;
        
      case 'list':
        fallbackSlides.push({
          title: title,
          items: [
            { title: "Key Concept 1", description: "Understanding the fundamentals" },
            { title: "Key Concept 2", description: "Practical applications" },
            { title: "Key Concept 3", description: "Advanced techniques" },
            { title: "Summary", description: description }
          ]
        });
        break;
        
      case 'code':
        fallbackSlides.push({
          title: title,
          description: description,
          code: `// Example code for ${title}\n// This demonstrates the key concepts\n\n// TODO: Implement specific examples\nconsole.log("Learning ${title}");`,
          language: "javascript"
        });
        break;
        
      case 'quote':
        fallbackSlides.push({
          quote: `"The journey of learning ${title} begins with understanding its core principles and applications."`,
          author: "Learning Framework",
          context: description
        });
        break;
        
      default:
        // Generic content slide for unknown types
        fallbackSlides.push({
          content: `# ${title}\n\n${description}\n\nThis slide covers important aspects of the topic. While we're experiencing temporary service limitations, this content provides essential information to help you progress in your learning journey.`,
          bullets: [
            "Essential concepts covered",
            "Key learning points",
            "Practical relevance"
          ]
        });
    }
  }
  
  return fallbackSlides;
}