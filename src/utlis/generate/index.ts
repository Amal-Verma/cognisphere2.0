// Main exports for the course generation system
export { generateCourseSkeleton } from './course-skeleton';
export { generateCourseSlide } from './course-slide';
export { 
  generateCompleteCourse, 
  generateAllSlides, 
  generateCompleteCourseFlatJSON 
} from './course-complete';
export * from './type';
export { 
  slidePrompts, 
  slideSchemas,
  validateSlideContent,
  safeValidateSlideContent,
  getAvailableSlideTypes,
  createCombinedSlideSchema
} from './slide-prompts';
