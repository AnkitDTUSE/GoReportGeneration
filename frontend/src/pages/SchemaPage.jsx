import React from 'react';
import { useNavigate } from 'react-router-dom';
import SchemaViewer from '../components/SchemaViewer';
import RelationshipsPanel from '../components/RelationshipsPanel';
import QueryControlBar from '../components/QueryControlBar';
import { DatabaseBackup, RefreshCw, Server, AlertCircle } from 'lucide-react';

export default function SchemaPage({
  schema,
  selectedColumns,
  onToggleColumn,
  onWarnUnreachable,
  onFetchData,
  onClearSelection,
  loadingReport,
  isConnected,
  connectionInfo,
  onResetConnection,
  onApplyTemplate
}) {
  const navigate = useNavigate();

  const handleFetchReport = async () => {
    const success = await onFetchData();
    if (success) navigate('/report');
  };

  return (
    <div className="animate-fade-in">
      {!isConnected ? (
        <div className="panel" style={{ padding: '36px', textAlign: 'center', margin: '24px 0' }}>
          <AlertCircle size={24} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
            Connection Required
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '420px', margin: '0 auto 20px auto', lineHeight: '1.6' }}>
            Connect your PostgreSQL database to browse table structures and generate reports.
          </p>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <Server size={15} /> Connect DSN
          </button>
        </div>
      ) : (!schema.tables || schema.tables.length === 0) ? (
        <div className="panel animate-fade-in" style={{ padding: '40px 32px', textAlign: 'center', maxWidth: '520px', margin: '24px auto' }}>
          <DatabaseBackup size={24} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>Empty Database</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '20px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{connectionInfo?.dbname}</strong> has no tables.
          </p>
          <button onClick={() => { onResetConnection(); navigate('/'); }} className="btn btn-secondary" style={{ padding: '8px 18px' }}>
            <RefreshCw size={14} /> Change DSN
          </button>
        </div>
      ) : (
        <div>
          <RelationshipsPanel relationships={schema.relationships} />
          <SchemaViewer schema={schema} selectedColumns={selectedColumns} onToggleColumn={onToggleColumn} onWarnUnreachable={onWarnUnreachable} />
          <QueryControlBar selectedColumns={selectedColumns} onFetchData={handleFetchReport} onClear={onClearSelection} loading={loadingReport} />
        </div>
      )}
    </div>
  );
}
