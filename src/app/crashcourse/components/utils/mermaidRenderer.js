// src/app/components/CrashCourse/utils/mermaidRenderer.js

// Simple Mermaid renderer for React (client-side only)
import { useEffect, useRef } from 'react';

// Function to validate and sanitize Mermaid syntax
function sanitizeMermaidChart(chart) {
  if (!chart || typeof chart !== 'string') {
    return 'graph LR\n    A[No Content] --> B[Error]';
  }

  // Remove common problematic patterns
  let sanitized = chart
    .replace(/color\s*:\s*[^,\s;]+/g, '') // Remove color specifications that might cause issues
    .replace(/style\s+\w+\s+color\s*:\s*[^,\s;]+/g, '') // Remove color in style definitions
    .replace(/\bcolor\b[^,\s;]*model/g, 'model') // Fix "color model" issues
    .trim();
    
  // Basic syntax validation
  if (!sanitized.includes('graph') && !sanitized.includes('flowchart') && !sanitized.includes('sequenceDiagram')) {
    // If it doesn't contain a valid diagram type, wrap it in a basic graph
    sanitized = `graph LR\n    A[${sanitized.substring(0, 50)}] --> B[Diagram]`;
  }
  
  // Ensure proper line endings
  sanitized = sanitized.replace(/\\n/g, '\n');
  
  return sanitized;
}

export default function Mermaid({ chart, className = '', style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    // Ensure code runs only on the client and the component is mounted
    if (typeof window === 'undefined' || !ref.current) {
      return;
    }

    // Sanitize the chart first
    const sanitizedChart = sanitizeMermaidChart(chart);

    // Dynamically import mermaid to prevent it from running on the server
    import('mermaid').then(async (m) => {
      const mermaid = m.default;
      mermaid.initialize({ 
        startOnLoad: false, 
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'arial'
      });

      // Double-check that the component is still mounted before rendering
      if (ref.current) {
        try {
          // Use a unique id for each render to avoid DOM conflicts
          const uniqueId = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;

          // The render function is async and returns a promise with the SVG
          const { svg } = await mermaid.render(uniqueId, sanitizedChart);

          // Check ref again after the async operation completes
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (err) {
          // Handle any rendering errors with a more user-friendly fallback
          if (ref.current) {
            ref.current.innerHTML = `
              <div style="padding: 20px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; text-align: center;">
                <p style="color: #6c757d; margin: 0; font-size: 14px;">
                  <strong>⚠️ Diagram Rendering Error</strong><br/>
                  Unable to render the diagram. The content may contain unsupported syntax.
                </p>
                <details style="margin-top: 10px;">
                  <summary style="cursor: pointer; color: #495057;">View Error Details</summary>
                  <pre style="background: #f1f3f4; padding: 8px; border-radius: 4px; font-size: 12px; text-align: left; margin-top: 8px;">${err.message}</pre>
                </details>
              </div>
            `;
          }
          console.error('Mermaid rendering error:', err);
        }
      }
    });
  }, [chart]); // Rerun this effect if the chart data changes

  return <div ref={ref} className={className} style={style} />;
}