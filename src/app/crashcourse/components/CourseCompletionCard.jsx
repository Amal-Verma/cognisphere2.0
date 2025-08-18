"use client";
import { useState, useEffect } from 'react';

export default function CourseCompletionCard({ totalSlides, currentSlide, scripts, onRestart }) {
  const [showCelebration, setShowCelebration] = useState(false);
  const isCompleted = currentSlide === totalSlides - 1;
  const progressPercentage = Math.round(((currentSlide + 1) / totalSlides) * 100);

  useEffect(() => {
    if (isCompleted && !showCelebration) {
      setShowCelebration(true);
      // Auto-hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [isCompleted, showCelebration]);

  const totalWords = scripts.reduce((total, script) => {
    return total + (script ? script.split(' ').length : 0);
  }, 0);

  const estimatedTime = Math.ceil(totalWords / 150); // Average reading speed

  return (
    <div style={{
      backgroundColor: isCompleted ? '#d4edda' : '#e3f2fd',
      border: `1px solid ${isCompleted ? '#c3e6cb' : '#bbdefb'}`,
      borderRadius: '10px',
      padding: '20px',
      margin: '20px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Celebration Animation */}
      {showCelebration && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '24px',
          animation: 'bounce 0.5s ease-in-out infinite alternate'
        }}>
          🎉
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            color: isCompleted ? '#155724' : '#0d47a1',
            fontSize: '18px'
          }}>
            {isCompleted ? '🎓 Course Completed!' : '📈 Course Progress'}
          </h3>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <strong>Progress:</strong> {progressPercentage}% ({currentSlide + 1}/{totalSlides} slides)
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <strong>Content:</strong> {totalWords.toLocaleString()} words
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <strong>Est. Time:</strong> {estimatedTime} min read
            </div>
          </div>

          {isCompleted && (
            <div style={{ marginTop: '15px' }}>
              <p style={{ 
                margin: '0 0 10px 0', 
                color: '#155724', 
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                🌟 Congratulations! You've completed the entire crash course.
              </p>
              <p style={{ 
                margin: 0, 
                color: '#155724', 
                fontSize: '13px'
              }}>
                All scripts are available for review. You can copy them or start a new course anytime.
              </p>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          {isCompleted && (
            <button
              onClick={onRestart}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '10px'
              }}
            >
              🔄 Start New Course
            </button>
          )}
          
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `conic-gradient(${isCompleted ? '#28a745' : '#007bff'} ${progressPercentage * 3.6}deg, #e9ecef 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              color: isCompleted ? '#28a745' : '#007bff'
            }}>
              {progressPercentage}%
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          from { transform: translateY(0px); }
          to { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
