"use client";
import { useState } from 'react';

export default function SlideViewer({ slides, currentSlide, onNext, onPrev, onGoToSlide }) {
  const [showThumbnails, setShowThumbnails] = useState(false);

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      padding: '20px',
      backgroundColor: 'white'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>
          Slide {currentSlide + 1} of {slides.length}
        </h3>
        <button
          onClick={() => setShowThumbnails(!showThumbnails)}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showThumbnails ? 'Hide' : 'Show'} All Slides
        </button>
      </div>

      {/* Current Slide Content */}
      <div style={{
        minHeight: '400px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '6px',
        padding: '20px',
        marginBottom: '20px',
        overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        {slides[currentSlide] || 'No content available for this slide'}
      </div>

      {/* Navigation Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={onPrev}
          disabled={currentSlide === 0}
          style={{
            backgroundColor: currentSlide === 0 ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          ← Previous
        </button>

        {/* Slide Progress */}
        <div style={{ 
          display: 'flex', 
          gap: '4px',
          alignItems: 'center'
        }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => onGoToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentSlide ? '#007bff' : '#dee2e6',
                cursor: 'pointer',
                margin: '0 2px'
              }}
              title={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={currentSlide === slides.length - 1}
          style={{
            backgroundColor: currentSlide === slides.length - 1 ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          Next →
        </button>
      </div>

      {/* Thumbnails View */}
      {showThumbnails && (
        <div style={{
          border: '1px solid #e9ecef',
          borderRadius: '6px',
          padding: '15px',
          backgroundColor: '#f8f9fa'
        }}>
          <h4 style={{ marginTop: 0, color: '#495057' }}>All Slides</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '10px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            {slides.map((slide, index) => (
              <div
                key={index}
                onClick={() => {
                  onGoToSlide(index);
                  setShowThumbnails(false);
                }}
                style={{
                  padding: '10px',
                  border: index === currentSlide ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  height: '100px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#007bff'
                }}>
                  Slide {index + 1}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#666',
                  lineHeight: '1.3',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {slide.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
