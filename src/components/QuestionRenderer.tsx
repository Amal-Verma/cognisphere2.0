import React from 'react';
import ReactMarkdown from 'react-markdown';

interface QuestionRendererProps {
  children: string | number | object;
  className?: string;
  style?: React.CSSProperties;
}

// Enhanced markdown renderer for assessment questions
// Supports basic markdown formatting and math expressions
export default function QuestionRenderer({ children, className = '', style = {} }: QuestionRendererProps) {
  // Ensure children is a string before passing to ReactMarkdown
  const content = typeof children === 'string' ? children : 
                 typeof children === 'object' ? JSON.stringify(children) :
                 String(children || '');
                 
  // Check if this is being used in a context where we should inherit styles
  const isInheriting = className.includes('text-inherit');
                 
  return (
    <div className={`markdown-content ${className}`} style={style}>
      <ReactMarkdown
        components={{
          // Custom styling for different markdown elements
          h1: ({ children }) => <h1 className={`text-2xl font-bold mb-4 ${isInheriting ? 'text-inherit' : 'text-gray-900'}`}>{children}</h1>,
          h2: ({ children }) => <h2 className={`text-xl font-semibold mb-3 ${isInheriting ? 'text-inherit' : 'text-gray-800'}`}>{children}</h2>,
          h3: ({ children }) => <h3 className={`text-lg font-medium mb-2 ${isInheriting ? 'text-inherit' : 'text-gray-700'}`}>{children}</h3>,
          p: ({ children }) => <p className={`mb-2 leading-relaxed ${isInheriting ? 'text-inherit' : 'text-gray-700'}`}>{children}</p>,
          strong: ({ children }) => <strong className={`font-semibold ${isInheriting ? 'text-inherit' : 'text-gray-900'}`}>{children}</strong>,
          em: ({ children }) => <em className={`italic ${isInheriting ? 'text-inherit' : 'text-gray-700'}`}>{children}</em>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className={isInheriting ? 'text-inherit' : 'text-gray-700'}>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className={`border-l-4 border-indigo-200 pl-4 py-2 mb-3 bg-indigo-50 italic ${isInheriting ? 'text-inherit' : 'text-gray-700'}`}>
              {children}
            </blockquote>
          ),
          code: ({ children, ...props }) => {
            const isInline = !props.className?.includes('language-');
            return isInline ? (
              <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${isInheriting ? 'bg-black/10 text-inherit' : 'bg-gray-100 text-indigo-600'}`}>
                {children}
              </code>
            ) : (
              <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-3">
                <code className="text-sm font-mono text-gray-800">{children}</code>
              </pre>
            );
          },
          // Handle math expressions (basic support without KaTeX for now)
          // Math expressions wrapped in $ or $$ will be styled differently
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
