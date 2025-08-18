import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ children, className = '', style = {} }) {
  // Ensure children is a string before passing to ReactMarkdown
  const content = typeof children === 'string' ? children : 
                 typeof children === 'object' ? JSON.stringify(children) :
                 String(children || '');
                 
  return (
    <div className={className} style={style}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
