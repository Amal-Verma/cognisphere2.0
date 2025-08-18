"use client";
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Nunito } from "next/font/google";

import { createJsonDemoMode } from './utils/pptDemoMode';
import PPTTemplate from './PPTTemplate';
import ChatBot from './ChatBot';
import CourseCompletionCard from './CourseCompletionCard';

const nunito = Nunito({ subsets: ["latin"] });

export default function CrashCourse() {
  const searchParams = useSearchParams();
  const demoMode = searchParams.get('demo');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('course'); // Always show course page now
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Generate course from localStorage data on component mount
  useEffect(() => {
    const courseTitle = localStorage.getItem('courseTitle');
    const courseDescription = localStorage.getItem('courseDescription');
    
    if (demoMode === 'true') {
      loadDemoCourse();
    } else if (courseTitle && courseDescription) {
      generateCourseFromData(courseTitle, courseDescription);
    } else {
      // If no course data, show error
      setError('No course data found. Please select a course from your roadmap.');
    }
  }, [demoMode]);

  const generateCourseFromData = async (title, description) => {
    // Synchronous/demo generation only — no external AI calls
    setIsProcessing(true);
    setError('');
    setProcessingStep('Creating local course preview...');
    setProcessingProgress(20);
    setSlides([]);
    setCurrentSlide(0);

    // Create a simple demo/fallback course based on provided title/description
    const demoSlides = createFallbackCourse(title, description);

    // Small simulated progress sequence for UX
    setTimeout(() => {
      setProcessingProgress(60);
      setProcessingStep('Formatting slides...');
      setTimeout(() => {
        setSlides(demoSlides);
        setCurrentSlide(0);
        setProcessingProgress(100);
        setProcessingStep('Course ready! 🎉');

        // Clear temporary course inputs from localStorage
        localStorage.removeItem('courseTitle');
        localStorage.removeItem('courseDescription');

        setTimeout(() => {
          setIsProcessing(false);
          setProcessingStep('');
          setProcessingProgress(0);
        }, 800);
      }, 400);
    }, 300);
  };

  const createFallbackCourse = (title, description) => {
    return [
      {
        type: 'title',
        title: title,
        subtitle: 'AI-Generated Course Content',
        author: 'CogniSphere',
        date: new Date().toLocaleDateString(),
        script: `Welcome to your course on ${title}. This presentation will guide you through the essential concepts and help you master this topic.`
      },
      {
        type: 'section',
        title: 'Course Overview',
        description: 'Let\'s explore what you\'ll learn in this course',
        script: 'Let\'s begin with an overview of what you can expect to learn in this comprehensive course.'
      },
      {
        type: 'content',
        title: 'Introduction',
        content: `Welcome to your course on **${title}**. 

${description}

This course is designed to provide you with a solid foundation and practical understanding of the topic.`,
        bullets: [
          'Understand core concepts',
          'Learn practical applications',
          'Master key principles',
          'Apply knowledge effectively'
        ],
        script: `This introduction covers the fundamental concepts of ${title}. We'll start with the basics and build your understanding step by step.`
      },
      {
        type: 'content',
        title: 'Key Learning Points',
        content: 'Here are the most important concepts you should focus on:',
        bullets: [
          'Master the fundamental principles',
          'Understand real-world applications', 
          'Practice with hands-on examples',
          'Connect theory with practice',
          'Build confidence through repetition'
        ],
        script: 'These key learning points will guide your study. Focus on understanding each concept thoroughly before moving to the next.'
      },
      {
        type: 'content',
        title: 'Practical Applications',
        content: `Let's explore how **${title}** is applied in real-world scenarios.

Understanding the practical side is just as important as grasping the theory.`,
        bullets: [
          'Industry use cases',
          'Common scenarios',
          'Best practices',
          'Problem-solving approaches'
        ],
        script: 'Understanding practical applications helps you see how theoretical knowledge translates into real-world value.'
      },
      {
        type: 'conclusion',
        title: 'Course Summary',
        content: `Congratulations! You've completed your introduction to **${title}**.

Remember to practice what you've learned and continue exploring this fascinating topic.`,
        script: 'Congratulations on completing this course! Remember to practice what you\'ve learned and continue exploring this topic further.'
      }
    ];
  };

  // Loads the default PPT JSON as a demo
  const loadDemoCourse = () => {
    const demoData = createJsonDemoMode();
    setSlides(demoData.slides);
    setCurrentSlide(0);
    setError('');
    setIsProcessing(false);
    setCurrentPage('course');
  };

  const handlePauseResume = (shouldPause) => {
    setIsPaused(shouldPause);
  };

  const resetComponent = () => {
    setSlides([]);
    setCurrentSlide(0);
    setError('');
    setIsProcessing(false);
    setProcessingStep('');
    setProcessingProgress(0);
    setIsChatbotOpen(false);
    // Go back to roadmap
    window.location.href = '/roadmap';
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Render Course Page
  const renderCoursePage = () => (
    <div className={`${nunito.className} flex flex-col w-full px-4 sm:px-8 mx-auto`}>
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={resetComponent}
          className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-gray-700 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          ← Back to Roadmap
        </button>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-800">
          Your AI Crash Course
        </h1>
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-pink-500 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          💬 Ask AI Teacher
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-4 rounded-xl mb-5 border border-red-200/50 text-sm shadow-sm">
          {error}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="text-center p-10 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl mb-8">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-5" />
          
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Creating Your Course...
            </h3>
            <p className="text-gray-600 mb-5">
              {processingStep}
            </p>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            
            <div className="mt-3 text-sm bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500 font-semibold">
              {processingProgress}% Complete
            </div>
          </div>
          
          <div className="text-sm text-gray-600 italic">
            {processingProgress < 40 ? 
              ' Creating course structure...' :
              processingProgress < 80 ?
              '📚 Generating content...' :
              '✨ Finalizing your course...'
            }
          </div>
        </div>
      )}

      {slides.length > 0 && !isProcessing ? (
        <PPTTemplate
          slides={slides}
          currentSlide={currentSlide}
          onNext={nextSlide}
          onPrev={prevSlide}
          onGoToSlide={goToSlide}
          script={slides[currentSlide]?.script}
          isPaused={isPaused}
          onPauseChange={handlePauseResume}
        />
      ) : !isProcessing && !error ? (
        <div className="text-center p-10 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome to Your Course
          </h3>
          <p className="text-gray-600">
            Your course content will appear here once it's generated.
          </p>
        </div>
      ) : null}

      {isChatbotOpen && (
        <ChatBot
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
          slides={slides}
          slideNumber={currentSlide}
          totalSlides={slides.length}
          onSlideChange={setCurrentSlide}
          onPauseResume={handlePauseResume}
          isPaused={isPaused}
        />
      )}
    </div>
  );

  return renderCoursePage();
}
