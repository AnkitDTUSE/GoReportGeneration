import React from 'react';
import { GitFork, ArrowRight } from 'lucide-react';

export default function RelationshipsPanel({ relationships = [] }) {
  if (!relationships || relationships.length === 0) {
    return (
      <div className="panel" style={{ padding: '14px 18px', marginBottom: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <GitFork size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
        No foreign key relationships detected. Single table queries only.
      </div>
    );
  }

  return (
    <div className="panel panel-purple" style={{ padding: '16px 20px', marginBottom: '20px' }}>
      <h3 style={{
        fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px',
        display: 'flex', alignItems: 'center', gap: '7px',
        color: 'var(--text-secondary)'
      }}>
        <GitFork size={15} color="var(--text-muted)" />
        Relationships ({relationships.length})
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {relationships.map((rel, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{rel.fromTable}.{rel.fromColumn}</span>
            <ArrowRight size={12} color="var(--text-muted)" />
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{rel.toTable}.{rel.toColumn}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
