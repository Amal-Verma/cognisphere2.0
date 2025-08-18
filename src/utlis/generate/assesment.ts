import { getGeminiResponse } from "./gemini";
import { assement } from "./type";

export async function generateAssessment(title: string, Description: string, userPrompt: string = ""): Promise<assement[]> {
  const commonRules = 
`- Only respond with the assessment in correct JSON format.
- Do not include any additional text or explanations.
- Do not include any markdown formatting.
- Ensure the JSON is valid and properly formatted.
`;

  const importantNotes =
`- Each question should have a clear question text, a list of options, and the correct answer(s) specified by their index in the options array.
- The assessment should cover key concepts from the course skeleton.
- Ensure the questions are varied in type (e.g., multiple choice, true/false).
- The assessment should be engaging and test the learner's understanding of the course material.
`;

  const jsonFormat = `
  [
    {
      "question" : string,    // You can use Markdown formatting for the question text
      "options" : [string, string, string], // Here you can use Markdown formatting for the options
      "answer" : [number, number]   // index of correct answers in options array
    },
    ...
  ]
`;

  const jsonExample = 
`[
  {
    "question": "**What is the capital of France?**",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "answer": [2]
  },
  {
    "question": "**Which of the following are programming languages?**",
    "options": ["HTML", "Python", "CSS", "JavaScript"],
    "answer": [1, 3]
  },
  {
    "question": "### Mathematics - Quadratic Formula\n\nThe quadratic formula is: \`ax² + bx + c = 0\`\n\nWhich of the following represents the **solutions** to this equation?\n\n> The discriminant is \`b² - 4ac\`",
    "options": [
      "x = (-b ± √(b² - 4ac)) / 2a",
      "x = (-b ± √(b² + 4ac)) / 2a", 
      "x = (b ± √(b² - 4ac)) / 2a",
      "x = (-b ± √(4ac - b²)) / 2a"
    ],
    "answer": [0]
  },
]`;


  const fullPrompt = `
You are an expert AI assessment designer. Your task is to generate a detailed assessment based on the provided course skeleton. The assessment should effectively test the learner's understanding of the course material.
Generate Exactly 10 questions for the assessment, ensuring a mix of question types and difficulty levels.

Here are the rules you must follow:
${commonRules}

Here are some important notes to consider:
${importantNotes}

Here is the context for the assessment:
Title: ${title}
Description: ${Description}

The prompt given by user to generate the entire course is:
${userPrompt} // Dont use this prompt in the assessment, just use it to understand the context of the course.

Generate the assessment in the following JSON format:
${jsonFormat}

Here is an example of the expected JSON format:
${jsonExample}
`;

  console.log("Generating assessment with prompt:", fullPrompt);

  const response = await getGeminiResponse(fullPrompt, true);

  if (!response || !response.length) {
    throw new Error("Failed to generate assessment");
  }

  try {
    const assessment: assement[] = JSON.parse(response);
    return assessment;
  } catch (error) {
    console.error("Error parsing assessment JSON:", error);
    throw new Error("Invalid assessment format received");
  }
}