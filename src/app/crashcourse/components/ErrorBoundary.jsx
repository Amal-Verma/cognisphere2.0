"use client";
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CrashCourse Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '1px solid #dee2e6',
          maxWidth: '600px',
          margin: '20px auto'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            Don't worry! You can still use the demo mode to see how the crash course generator works.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            🔄 Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🔄 Reload Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#6c757d' }}>
                🔧 Technical Details (Dev Mode)
              </summary>
              <pre style={{
                backgroundColor: '#f1f3f4',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
                marginTop: '10px'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
