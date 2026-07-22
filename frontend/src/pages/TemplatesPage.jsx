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
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Saved Report Templates</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Manage saved column selection configurations for recurring report generation.
          </p>
        </div>

        <button onClick={() => navigate('/schema')} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Schema Builder
        </button>
      </div>

      <TemplatesManager
        selectedColumns={selectedColumns}
        onApplyTemplate={handleApply}
      />
    </div>
  );
}
