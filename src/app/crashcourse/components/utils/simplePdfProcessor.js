// Simple browser-compatible PDF text extractor
export async function extractTextFromPDFSimple(file) {
  try {
    // For now, let's create a simple text extraction that works in all browsers
    // We'll use a basic approach that can handle most PDFs
    
    const text = await extractTextUsingFileReader(file);
    
    // Split into pages based on common PDF patterns
    let pages = splitTextIntoPages(text);
    
    if (pages.length === 0 || pages.every(page => page.trim().length === 0)) {
      // If we can't extract readable text, provide a helpful message
      pages = [
        `Unable to extract readable text from this PDF file. 
        
This could be because:
• The PDF contains mainly images or scanned content
• The PDF is password protected
• The PDF has complex formatting

Please try:
• Using a text-based PDF instead of a scanned document
• Converting your presentation to a simpler PDF format
• Or use the demo mode to see how the system works`
      ];
    }
    
    return {
      pages,
      totalPages: pages.length,
      fullText: pages.join('\n\n'),
      metadata: {
        title: file.name.replace('.pdf', ''),
        author: 'Unknown',
        creator: 'Simple PDF Processor'
      }
    };
  } catch (error) {
    console.error('Error extracting PDF:', error);
    
    // Provide a fallback that still allows the user to continue
    return {
      pages: [
        `Failed to process PDF: ${file.name}
        
Please try the demo mode to see how the crash course generator works, 
or try uploading a different PDF file.`
      ],
      totalPages: 1,
      fullText: 'PDF processing failed',
      metadata: {
        title: file.name.replace('.pdf', ''),
        author: 'Unknown',
        creator: 'Fallback Processor'
      }
    };
  }
}

async function extractTextUsingFileReader(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Simple text extraction from PDF bytes
        // This is a basic approach and won't work for all PDFs
        let text = '';
        for (let i = 0; i < uint8Array.length - 1; i++) {
          const char = uint8Array[i];
          // Extract printable ASCII characters
          if (char >= 32 && char <= 126) {
            text += String.fromCharCode(char);
          } else if (char === 10 || char === 13) {
            text += ' ';
          }
        }
        
        // Clean up the extracted text
        text = text
          .replace(/[^\w\s\.\,\!\?\:\;\-\(\)\[\]]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

function splitTextIntoPages(text) {
  if (!text || text.length < 100) {
    return [text || 'No content extracted'];
  }
  
  // Try to split by common page indicators
  let pages = text.split(/(?:page\s+\d+|slide\s+\d+)/i);
  
  // If no clear page breaks, split by estimated content length
  if (pages.length === 1) {
    const avgCharsPerPage = 800; // Reasonable estimate for slide content
    pages = [];
    for (let i = 0; i < text.length; i += avgCharsPerPage) {
      const pageText = text.substring(i, i + avgCharsPerPage).trim();
      if (pageText.length > 0) {
        pages.push(pageText);
      }
    }
  }
  
  // Clean up pages
  pages = pages
    .map(page => page.trim())
    .filter(page => page.length > 50) // Only keep pages with substantial content
    .slice(0, 20); // Limit to reasonable number of pages
  
  return pages.length > 0 ? pages : ['No readable content found'];
}
