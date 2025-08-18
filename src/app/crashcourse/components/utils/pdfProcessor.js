import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Set up the PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

export async function extractTextFromPDF(file) {
  try {
    console.log('Starting PDF processing for:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: false
    }).promise;
    
    console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
    
    const pages = [];
    const totalPages = pdf.numPages;
    
    // Process each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        console.log(`Processing page ${pageNum}/${totalPages}`);
        const page = await pdf.getPage(pageNum);
        
        // Extract text content
        const textContent = await page.getTextContent();
        let pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .trim();
        
        // If no text found, try to extract from images using OCR
        if (!pageText || pageText.length < 20) {
          console.log(`Page ${pageNum} has minimal text, trying image extraction...`);
          const imageText = await extractTextFromPageImages(page, pageNum);
          pageText = imageText || pageText;
        }
        
        // Clean and process the text
        if (pageText && pageText.length > 0) {
          pageText = cleanExtractedText(pageText);
          pages.push(pageText);
        } else {
          // Create a meaningful placeholder for pages with no extractable content
          pages.push(`Slide ${pageNum}: This slide contains visual content that couldn't be extracted as text. It likely includes images, diagrams, charts, or complex formatting that requires visual interpretation.`);
        }
        
        console.log(`Page ${pageNum} processed. Text length: ${pageText?.length || 0}`);
        
      } catch (pageError) {
        console.warn(`Error processing page ${pageNum}:`, pageError);
        pages.push(`Slide ${pageNum}: Error processing this page. The content may be corrupted or in an unsupported format.`);
      }
    }
    
    // Ensure we have at least one page
    if (pages.length === 0) {
      pages.push('This PDF appears to be empty or contains only unsupported content. Please try a different PDF file or use the demo mode to see how the system works.');
    }
    
    const fullText = pages.join('\n\n');
    
    console.log(`PDF processing complete. Extracted ${pages.length} pages with total text length: ${fullText.length}`);
    
    return {
      pages,
      totalPages: pages.length,
      fullText,
      metadata: {
        title: file.name.replace('.pdf', ''),
        author: 'PDF Extract',
        creator: 'Advanced PDF Processor'
      }
    };
  } catch (error) {
    console.error('Error extracting PDF:', error);
    
    // Provide detailed error information
    let errorMessage = 'Failed to extract text from PDF. ';
    if (error.message.includes('Invalid PDF')) {
      errorMessage += 'The file appears to be corrupted or not a valid PDF.';
    } else if (error.message.includes('password')) {
      errorMessage += 'The PDF is password protected.';
    } else {
      errorMessage += 'This may be a scanned document or contain complex formatting.';
    }
    
    throw new Error(errorMessage);
  }
}

async function extractTextFromPageImages(page, pageNum) {
  try {
    // Get page dimensions
    const viewport = page.getViewport({ scale: 2.0 });
    
    // Create canvas to render page
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    // Convert canvas to image data for OCR
    const imageData = canvas.toDataURL('image/png');
    
    console.log(`Starting OCR for page ${pageNum}...`);
    
    // Create OCR worker
    const worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          console.log(`OCR progress for page ${pageNum}: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    
    // Perform OCR
    const { data: { text } } = await worker.recognize(imageData);
    await worker.terminate();
    
    console.log(`OCR completed for page ${pageNum}. Extracted ${text.length} characters.`);
    
    return text.trim();
    
  } catch (ocrError) {
    console.warn(`OCR failed for page ${pageNum}:`, ocrError);
    return null;
  }
}

function cleanExtractedText(text) {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove non-printable characters except newlines
    .replace(/[^\x20-\x7E\n]/g, '')
    // Remove multiple newlines
    .replace(/\n\s*\n/g, '\n')
    // Remove leading/trailing whitespace
    .trim()
    // Ensure minimum readability
    .split(' ')
    .filter(word => word.length > 0)
    .join(' ');
}

export function preprocessSlideContent(content) {
  // Additional cleaning for script generation
  return content
    .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure proper sentence spacing
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/(\d+)([A-Za-z])/g, '$1 $2') // Space between numbers and letters
    .trim();
}
