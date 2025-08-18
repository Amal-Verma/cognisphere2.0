// Enhanced PPT Template Data Structure
// This utility helps convert various data formats to the PPT template format

export function createPPTSlideFromJSON(slideData) {
  // Support multiple JSON formats
  if (typeof slideData === 'string') {
    return slideData;
  }

  if (slideData.title && slideData.content) {
    // Structured format with title and content
    let formattedSlide = slideData.title + '\n\n';
    
    if (Array.isArray(slideData.content)) {
      formattedSlide += slideData.content.join('\n');
    } else {
      formattedSlide += slideData.content;
    }
    
    return formattedSlide;
  }

  if (slideData.heading && slideData.bullets) {
    // PowerPoint-like format
    let formattedSlide = slideData.heading + '\n\n';
    
    if (slideData.subheading) {
      formattedSlide += slideData.subheading + '\n';
    }
    
    slideData.bullets.forEach(bullet => {
      formattedSlide += '• ' + bullet + '\n';
    });
    
    return formattedSlide;
  }

  // Fallback: convert object to readable format
  return JSON.stringify(slideData, null, 2).replace(/["{},]/g, '').replace(/\n\s+/g, '\n');
}

export function createPPTDataFromArray(slidesArray) {
  return slidesArray.map(slide => createPPTSlideFromJSON(slide));
}

// Sample JSON formats that work with the PPT template
export const samplePPTFormats = {
  // Format 1: Simple title and content
  format1: {
    title: "Welcome to Machine Learning",
    content: [
      "Machine Learning is a powerful subset of AI",
      "• Enables computers to learn from data",
      "• No explicit programming required",
      "• Applications everywhere: Netflix, Google, Tesla"
    ]
  },

  // Format 2: PowerPoint-like structure
  format2: {
    heading: "Types of Machine Learning",
    subheading: "Three main categories:",
    bullets: [
      "Supervised Learning - learns from labeled data",
      "Unsupervised Learning - finds hidden patterns",
      "Reinforcement Learning - learns through trial and error"
    ]
  },

  // Format 3: Complex nested content
  format3: {
    title: "Deep Learning Neural Networks",
    content: {
      introduction: "Neural networks inspired by the human brain",
      components: [
        "Input Layer - receives data",
        "Hidden Layers - process information", 
        "Output Layer - provides predictions"
      ],
      applications: "Image recognition, Natural Language Processing, Game AI"
    }
  },

  // Format 4: Hybrid with content and image
  format4: {
    type: "content-and-image",
    title: "Hybrid: Content and Image",
    content: "Combine text with a visual element for greater impact.",
    bullets: [
      "Explain concepts visually",
      "Showcase product screenshots",
      "Add diagrams or charts"
    ],
    imageUrl: "https://ik.imagekit.io/ikmedia/tr:w-300,h-300/docs_images/examples/example_space.jpg",
    imageCaption: "Visuals enhance learning."
  },

  // Format 5: Hybrid with content and code
  format5: {
    type: "content-and-code",
    title: "Hybrid: Content and Code",
    content: "Present code alongside explanations or instructions.",
    language: "python",
    code: "class MyClass:\n  def __init__(self, name):\n    self.name = name"
  }
};

// Helper function to validate JSON slide data
export function validateSlideData(slideData) {
  if (!slideData) return false;
  
  if (typeof slideData === 'string' && slideData.trim().length > 0) {
    return true;
  }
  
  if (typeof slideData === 'object') {
    // Check if it has any meaningful content
    const keys = Object.keys(slideData);
    return keys.length > 0 && keys.some(key => 
      slideData[key] && 
      (typeof slideData[key] === 'string' || Array.isArray(slideData[key]))
    );
  }
  
  return false;
}

// Auto-navigation configuration
export const autoNavConfig = {
  defaultSpeed: 5000, // 5 seconds per slide
  speeds: {
    slow: 8000,
    normal: 5000,
    fast: 3000,
    veryFast: 2000
  },
  enableAutoAdvance: true,
  pauseOnUserInteraction: true
};
