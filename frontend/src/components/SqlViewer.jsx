import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export default function SqlViewer({ query }) {
  const [copied, setCopied] = useState(false);

  if (!query) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: '#caf0f8' }}>
          <Terminal size={16} color="#00b4d8" />
          <span>Generated SQL Query (Backend Execution)</span>
        </div>
        <button
          onClick={handleCopy}
          className="btn btn-secondary"
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
        >
          {copied ? <Check size={14} color="#00b4d8" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy SQL'}
        </button>
      </div>

      <div className="sql-box">
        {query}
      </div>
    </div>
  );
}

