import React from 'react';

export default function CodeBlock({ code, language }) {
  return (
    <pre style={{ background: '#1e293b', color: '#f1f5f9', padding: 16, borderRadius: 8, overflowX: 'auto' }}>
      <code>
        {code}
      </code>
    </pre>
  );
}
