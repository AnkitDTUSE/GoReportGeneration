import React from 'react';
import { GitFork, ArrowRight } from 'lucide-react';

export default function RelationshipsPanel({ relationships = [] }) {
  if (!relationships || relationships.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
        <GitFork size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
        No foreign key relationships detected between tables in this schema. (Single table queries only)
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '18px 24px', marginBottom: '28px' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
        <GitFork size={18} color="var(--accent-indigo)" />
        Database Table Relationships ({relationships.length})
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {relationships.map((rel, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{rel.fromTable}.{rel.fromColumn}</span>
            <ArrowRight size={14} color="var(--text-dim)" />
            <span style={{ color: 'var(--accent-indigo)', fontWeight: 600 }}>{rel.toTable}.{rel.toColumn}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
