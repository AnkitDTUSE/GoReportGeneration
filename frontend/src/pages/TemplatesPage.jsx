import React from 'react';
import { useNavigate } from 'react-router-dom';
import TemplatesManager from '../components/TemplatesManager';
import { ArrowLeft } from 'lucide-react';

export default function TemplatesPage({ selectedColumns, onApplyTemplate }) {
  const navigate = useNavigate();

  const handleApply = (templateCols) => {
    onApplyTemplate(templateCols);
    navigate('/schema');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Templates</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Manage saved column selections for recurring reports.
          </p>
        </div>
        <button onClick={() => navigate('/schema')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
          <ArrowLeft size={14} /> Schema
        </button>
      </div>

      <TemplatesManager selectedColumns={selectedColumns} onApplyTemplate={handleApply} />
    </div>
  );
}
