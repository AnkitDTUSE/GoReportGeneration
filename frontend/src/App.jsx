import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ConnectPage from './pages/ConnectPage';
import SchemaPage from './pages/SchemaPage';
import ReportPage from './pages/ReportPage';
import { AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [schema, setSchema] = useState({ tables: [], relationships: [] });
  const [selectedColumns, setSelectedColumns] = useState({});
  const [reportResult, setReportResult] = useState(null);
  
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState(null);
  const [warningToast, setWarningToast] = useState(null);

  const handleResetConnection = () => {
    setIsConnected(false);
    setConnectionInfo(null);
    setSchema({ tables: [], relationships: [] });
    setSelectedColumns({});
    setReportResult(null);
    setError(null);
  };

  // Apply a report template's column selection
  const handleApplyTemplate = (templateSelectedColumns) => {
    if (!templateSelectedColumns) return;
    setSelectedColumns(templateSelectedColumns);
    setReportResult(null);
  };

  // Connect to DB via DSN Details
  const handleConnectDSN = async (dsnPayload) => {
    try {
      setLoadingSchema(true);
      setError(null);

      const res = await fetch('/api/v1/connDb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dsnPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect to database');
      }

      // If backend returned schema directly
      if (data.tables) {
        setSchema(data);
      } else {
        // Fetch schema
        const schemaRes = await fetch('/api/v1/getDets');
        if (schemaRes.ok) {
          const schemaData = await schemaRes.json();
          setSchema(schemaData);
        }
      }

      setIsConnected(true);
      setConnectionInfo(dsnPayload);
      setSelectedColumns({});
      setReportResult(null);
    } catch (err) {
      setError(err.message || 'Database connection failed');
      throw err;
    } finally {
      setLoadingSchema(false);
    }
  };

  // Toggle column selection in SchemaViewer
  const handleToggleColumn = (tableName, columnName) => {
    setSelectedColumns(prev => {
      const currentCols = prev[tableName] || [];
      let updatedCols;
      if (currentCols.includes(columnName)) {
        updatedCols = currentCols.filter(c => c !== columnName);
      } else {
        updatedCols = [...currentCols, columnName];
      }

      const next = { ...prev };
      if (updatedCols.length > 0) {
        next[tableName] = updatedCols;
      } else {
        delete next[tableName];
      }
      return next;
    });
  };

  // Relationship Integrity Warning Trigger
  const handleWarnUnreachable = (targetTable, selectedTables) => {
    setWarningToast(
      `Table "${targetTable}" has no foreign key relationship path to currently selected tables (${selectedTables.join(', ')}). Cross-table join queries require valid relationship constraints!`
    );
  };

  // Clear all selected columns
  const handleClearSelection = () => {
    setSelectedColumns({});
    setReportResult(null);
  };

  // Fetch Report Data from backend (/api/v1/getData)
  const handleFetchReportData = async () => {
    try {
      setLoadingReport(true);
      setError(null);

      const payload = {
        selected: selectedColumns
      };

      const res = await fetch('/api/v1/getData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to retrieve data from database');
      }

      setReportResult(data);
      return true;
    } catch (err) {
      setError(err.message || 'Error fetching report data');
      return false;
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        connectionInfo={connectionInfo}
        isConnected={isConnected}
        onResetConnection={handleResetConnection}
        selectedColumns={selectedColumns}
        reportResult={reportResult}
      />

      <main style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0 32px 60px 32px', flex: 1 }}>
        {/* Warning Toast */}
        {warningToast && (
          <div className="animate-fade-in" style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--accent-amber)',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} style={{ flexShrink: 0 }} />
              <span>{warningToast}</span>
            </div>
            <button onClick={() => setWarningToast(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="animate-fade-in" style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--accent-rose)',
            fontSize: '0.88rem'
          }}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Multi-Page Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <ConnectPage
                onConnect={handleConnectDSN}
                error={error}
                loading={loadingSchema}
                isConnected={isConnected}
                connectionInfo={connectionInfo}
              />
            }
          />

          <Route
            path="/schema"
            element={
              <SchemaPage
                schema={schema}
                selectedColumns={selectedColumns}
                onToggleColumn={handleToggleColumn}
                onWarnUnreachable={handleWarnUnreachable}
                onFetchData={handleFetchReportData}
                onClearSelection={handleClearSelection}
                loadingReport={loadingReport}
                isConnected={isConnected}
                connectionInfo={connectionInfo}
                onResetConnection={handleResetConnection}
                onApplyTemplate={handleApplyTemplate}
              />
            }
          />

          <Route
            path="/report"
            element={
              <ReportPage
                reportResult={reportResult}
                isConnected={isConnected}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
