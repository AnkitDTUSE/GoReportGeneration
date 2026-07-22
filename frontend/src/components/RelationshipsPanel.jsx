import React from 'react';
import { GitFork, ArrowRight } from 'lucide-react';

export default function RelationshipsPanel({ relationships = [] }) {
  if (!relationships || relationships.length === 0) {
    return (
      <div className="panel panel-purple" style={{ padding: '16px 20px', marginBottom: '24px', fontSize: '0.88rem', color: '#90e0ef' }}>
        <GitFork size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#00b4d8' }} />
        No foreign key relationships detected between tables in this schema. (Single table queries only)
      </div>
    );
  }

  return (
    <div className="panel panel-purple" style={{ padding: '18px 24px', marginBottom: '28px' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#caf0f8' }}>
        <GitFork size={18} color="#00b4d8" />
        Database Table Relationships ({relationships.length})
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {relationships.map((rel, idx) => (
          <div
            key={idx}
            style={{
              background: '#0a194f',
              border: '1px solid #0077b6',
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <span style={{ color: '#caf0f8', fontWeight: 600 }}>{rel.fromTable}.{rel.fromColumn}</span>
            <ArrowRight size={14} color="#00b4d8" />
            <span style={{ color: '#caf0f8', fontWeight: 600 }}>{rel.toTable}.{rel.toColumn}</span>
          </div>
        ))}
      </div>
    </div>
  );
}






