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
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <Terminal size={14} color="var(--text-muted)" />
          <span>Generated SQL</span>
        </div>
        <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
          {copied ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="sql-box">{query}</div>
    </div>
  );
}
