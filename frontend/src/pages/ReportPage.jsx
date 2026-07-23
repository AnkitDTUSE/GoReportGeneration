import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import TemplatesManager from '../components/TemplatesManager';
import { ArrowLeft, Play, Info, Loader2 } from 'lucide-react';

export default function ReportPage({
  reportResult,
  isConnected,
  selectedColumns,
  onApplyTemplate,
  onFetchData,
  loadingReport
}) {
  const navigate = useNavigate();

  const handleApplyTemplateAndFetch = async (templateCols) => {
    if (onApplyTemplate) onApplyTemplate(templateCols);
    if (onFetchData && isConnected) await onFetchData(templateCols);
  };

  const hasData = reportResult && reportResult.data && reportResult.data.length > 0;

  return (
    <div className="animate-fade-in" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) 300px',
      gap: '24px',
      alignItems: 'start'
    }}>
      {/* Main */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Report</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Click rows to select. Use templates to switch views.
            </p>
          </div>
          <button onClick={() => navigate('/schema')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            <ArrowLeft size={14} /> Edit Columns
          </button>
        </div>

        {loadingReport ? (
          <div className="panel" style={{ padding: '48px', textAlign: 'center' }}>
            <Loader2 size={28} color="var(--text-muted)" style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>Fetching data...</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Executing query.</p>
          </div>
        ) : !isConnected ? (
          <div className="panel" style={{ padding: '36px', textAlign: 'center' }}>
            <Info size={24} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Not Connected</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '18px', maxWidth: '380px', margin: '0 auto 18px auto', lineHeight: '1.5' }}>
              Connect to a database to fetch live report data.
            </p>
            <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '9px 20px' }}>
              Connect DSN
            </button>
          </div>
        ) : !hasData ? (
          <div className="panel" style={{ padding: '36px', textAlign: 'center' }}>
            <Info size={24} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Empty Results</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '18px', maxWidth: '380px', margin: '0 auto 18px auto', lineHeight: '1.5' }}>
              Tables are empty or no matching records found.
            </p>
            <button onClick={() => navigate('/schema')} className="btn btn-primary" style={{ padding: '9px 20px' }}>
              <Play size={14} /> Schema Builder
            </button>
          </div>
        ) : (
          <DataTable data={reportResult.data} />
        )}
      </div>

      {/* Sidebar */}
      <div style={{ position: 'sticky', top: '80px' }}>
        <TemplatesManager selectedColumns={selectedColumns} onApplyTemplate={handleApplyTemplateAndFetch} />
      </div>
    </div>
  );
}
