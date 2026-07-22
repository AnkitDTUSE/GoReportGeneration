import React from 'react';
import { useNavigate } from 'react-router-dom';
import SqlViewer from '../components/SqlViewer';
import DataTable from '../components/DataTable';
import { ArrowLeft, Play, Info } from 'lucide-react';

export default function ReportPage({ reportResult, isConnected }) {
  const navigate = useNavigate();

  if (!reportResult || !reportResult.data) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '40px' }}>
          <Info size={36} color="var(--accent-cyan)" style={{ marginBottom: '14px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Report Generated Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Select table columns in the Schema Builder and click "Fetch Report Data" to generate query results.
          </p>
          <button onClick={() => navigate('/schema')} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <Play size={16} /> Open Schema Builder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Generated Report View</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Executed SQL query and retrieved dataset. Click any row to highlight.
          </p>
        </div>

        <button onClick={() => navigate('/schema')} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Modify Query Columns
        </button>
      </div>

      {/* Generated SQL Viewer */}
      {reportResult.query && (
        <SqlViewer query={reportResult.query} />
      )}

      {/* Interactive Data Table with Row Highlight */}
      <DataTable data={reportResult.data} />
    </div>
  );
}
