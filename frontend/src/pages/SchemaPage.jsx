import React from 'react';
import { useNavigate } from 'react-router-dom';
import SchemaViewer from '../components/SchemaViewer';
import RelationshipsPanel from '../components/RelationshipsPanel';
import QueryControlBar from '../components/QueryControlBar';
import TemplatesManager from '../components/TemplatesManager';
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
    if (success) {
      navigate('/report');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Built-in Report Templates Manager */}
      <TemplatesManager
        selectedColumns={selectedColumns}
        onApplyTemplate={onApplyTemplate}
      />

      {!isConnected ? (
        /* If not connected, show connection prompt banner */
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', margin: '24px 0' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <AlertCircle size={28} color="var(--accent-amber)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
            Database Connection Required for Schema
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            You are viewing the Schema Builder in offline mode. Connect your PostgreSQL database DSN to analyze live table structures and generate reports.
          </p>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <Server size={18} /> Connect Database DSN
          </button>
        </div>
      ) : (!schema.tables || schema.tables.length === 0) ? (
        /* If database is empty */
        <div className="glass-panel animate-fade-in" style={{ padding: '48px 36px', textAlign: 'center', maxWidth: '580px', margin: '24px auto' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <DatabaseBackup size={28} color="var(--accent-amber)" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Empty Database Detected</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '24px' }}>
            The database <strong style={{ color: 'var(--accent-amber)' }}>{connectionInfo?.dbname || ''}</strong> is connected, but contains no tables or schema attributes.
          </p>
          <button onClick={() => { onResetConnection(); navigate('/'); }} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <RefreshCw size={16} /> Change DSN Connection
          </button>
        </div>
      ) : (
        /* Active Connected Schema View */
        <div>
          {/* Table Relationships Panel */}
          <RelationshipsPanel relationships={schema.relationships} />

          {/* Tables Row View (table 1 -> col1 col2 ...) */}
          <SchemaViewer
            schema={schema}
            selectedColumns={selectedColumns}
            onToggleColumn={onToggleColumn}
            onWarnUnreachable={onWarnUnreachable}
          />

          {/* Query Control Bar */}
          <QueryControlBar
            selectedColumns={selectedColumns}
            onFetchData={handleFetchReport}
            onClear={onClearSelection}
            loading={loadingReport}
          />
        </div>
      )}
    </div>
  );
}
