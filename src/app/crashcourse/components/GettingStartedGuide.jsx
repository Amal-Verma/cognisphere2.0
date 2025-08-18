"use client";
import { useState } from 'react';

export default function GettingStartedGuide() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
          zIndex: 1000
        }}
        title="Show Getting Started Guide"
      >
        💡
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '320px',
      backgroundColor: 'white',
      border: '1px solid #dee2e6',
      borderRadius: '10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      zIndex: 1000,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px 10px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>🚀 Quick Start</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
            width: '24px',
            height: '24px'
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            color: '#28a745',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>🎯</span>
            Try Demo First
          </h4>
          <p style={{ 
            margin: 0, 
            fontSize: '13px', 
            color: '#6c757d',
            lineHeight: '1.4'
          }}>
            Click <strong>"🚀 Try Demo"</strong> to see the AI crash course generator in action with sample Machine Learning content.
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            color: '#007bff',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>📄</span>
            Upload Your PDF
          </h4>
          <p style={{ 
            margin: 0, 
            fontSize: '13px', 
            color: '#6c757d',
            lineHeight: '1.4'
          }}>
            Upload any educational PDF presentation to generate personalized teaching scripts.
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            color: '#17a2b8',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>🎵</span>
            Interactive Features
          </h4>
          <ul style={{ 
            margin: '0 0 0 20px', 
            padding: 0, 
            fontSize: '13px', 
            color: '#6c757d',
            lineHeight: '1.4'
          }}>
            <li>� Professional PPT-style presentation</li>
            <li>🤖 Interactive AI teaching assistant</li>
            <li>▶️ Auto-play with customizable speed</li>
            <li>� Chat with AI about slide content</li>
            <li>🎯 Voice commands for navigation</li>
            <li>� Responsive design for all devices</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#495057'
        }}>
          <strong>💡 Pro Tip:</strong> Use the chatbot to navigate slides by typing "next", "previous", or "go to slide 3". You can also ask questions about the content for deeper explanations!
        </div>
      </div>
    </div>
  );
}
