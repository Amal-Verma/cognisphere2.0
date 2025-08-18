import { getGeminiResponse } from "./gemini";
import { RoadmapNode } from "./type";

export async function generateRoadmap(prompt: string, syllabus: string = ""): Promise<RoadmapNode[]> {

  const commonRules = `
  - Only respond with the roadmap in JSON format.
  - Do not include any additional text or explanations.
  - Do not include any markdown formatting.
  - Ensure the JSON is valid and properly formatted.
  - Each node must have a "type" field with value either "course" or "test".
  - Use "course" for learning/teaching content and "test" for assessments/evaluations.
  - MUST cover ALL topics mentioned in the syllabus - do not skip any topic.
  - Break large topics into multiple smaller, focused nodes rather than cramming everything into one description but also note that you don't break it too much.
  - Create a logical progression from basic to advanced concepts.
  - Add tests strategically when necessary (after major concepts or sections), not after every single module.
  - Prioritize comprehensive coverage over frequent testing.
  - Don't put "all topics" or "previous topics" in description instead of specific content.
  - One module should have atleast 5 topics, but not more than 7.
  - In case no more topics available for minimum 5 topics, then just place the remaining topics in the last module.
  - Maintain the course to test ratio of 3:1, meaning for every 3 course nodes, there should be 1 test node.
  - Limit total number of nodes to 20, including tests.
  - Ensure the roadmap is balanced and not overloaded with too many nodes.
  `

  const jsonFormat = `
  [
    {
      "title": "Node Title",
      "description": "Node Description",
      "type": "course"
    },
    ...
  ]
  `;

  const exampleResponse = `
  [
    {
      "title": "Introduction to Machine Learning",
      "description": "Learn the fundamentals and core concepts of machine learning including basic terminology, types of learning, and the typical machine learning workflow. Understand the difference between AI, ML, and traditional programming.",
      "type": "course"
    },
    {
      "title": "Supervised Learning Algorithms",
      "description": "Understand classification and regression techniques such as linear regression, logistic regression, decision trees, and support vector machines. Learn when to apply each algorithm and how to evaluate their performance.",
      "type": "course"
    },
    {
      "title": "Unsupervised Learning Methods",
      "description": "Explore clustering algorithms like K-means and hierarchical clustering, and dimensionality reduction approaches such as PCA and t-SNE. Learn how to extract patterns and structures from unlabeled data.",
      "type": "course"
    },
    {
      "title": "Machine Learning Fundamentals Assessment",
      "description": "Evaluate understanding of core ML concepts, supervised and unsupervised learning algorithms, and ability to select appropriate techniques for different problem types. Includes practical implementation challenges.",
      "type": "test"
    }
  ]
  `;

  const fullPrompt = `
  You are an expert AI tutor. Your task is to generate a detailed learning roadmap based on the provided prompt and syllabus. The roadmap should be structured as a JSON array of objects, where each object represents a node in the roadmap with a title and description.

  ${
  syllabus ? `
  Syllabus: 
  ${syllabus}`
  : ""
  }

  User Instructions: 
  ${prompt}

  Common Rules: 
  ${commonRules}

  Response Format:
  ${jsonFormat}

  Example Response:
  ${exampleResponse}
  `;

  try {
    const response = await getGeminiResponse(fullPrompt, true);
    const roadmap: RoadmapNode[] = JSON.parse(response);
    return roadmap;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to generate roadmap");
  }

}