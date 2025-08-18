import { th, tr } from "zod/v4/locales";
import { generateCourseSkeleton } from "./course-skeleton";
import { generateCourseSlide } from "./course-slide";
import { CompleteCourse, CourseSlide } from "./type";

export async function generateCourseComplete(title: string, description: string, userPrompt: string): Promise<CompleteCourse> {

  console.log("Generating complete course...");

  const skeleton = await generateCourseSkeleton(title, description);
  
  console.log("Generated course skeleton:");

  const slides: CourseSlide[] = [];

  for (const slide of skeleton) {

    console.log("Generating slide for:", slide.title);

    const courseSlide = await generateCourseSlide(slide.title, slide.description, slide.type, userPrompt);
    
    if (!courseSlide || courseSlide.length === 0) {
      console.warn(`No slides generated for: ${slide.title}`);
      continue;
    }

    courseSlide.forEach((s: Record<string, unknown>) => {
      // Remove title assignment since we removed title field from slide prompts
      s.type = slide.type[courseSlide.indexOf(s)];
      s.title = slide.title;

      slides.push(s as CourseSlide);
    });
  }

  return {
    skeleton,
    slides,
    metadata: {
      title,
      description,
      userPrompt,
    }
  };
}