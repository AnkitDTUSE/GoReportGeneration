import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import SneakyMascots from './components/SneakyMascots';
import ConnectPage from './pages/ConnectPage';
import SchemaPage from './pages/SchemaPage';
import ReportPage from './pages/ReportPage';
import { AlertTriangle, X } from 'lucide-react';

import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import api from './api/axios';

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

  // Filtration States
  const [filters, setFilters] = useState([]);
  const [orderBy, setOrderBy] = useState([]);
  const [groupBy, setGroupBy] = useState([]);
  const [having, setHaving] = useState([]);

  const scrollContainerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const isReportPage = location.pathname === '/report';

    if (isReportPage) {
      // Revert completely to native scrolling for report pages to prevent scroll lock conflicts
      setScrollY(0);

      // Explicitly strip any scroll-lock states or classes left over by Locomotive Scroll
      document.documentElement.classList.remove('has-scroll-smooth');
      document.body.classList.remove('has-scroll-smooth');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';

      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.transform = '';
        scrollContainerRef.current.style.height = '';
      }

      const handleNativeScroll = () => {
        setScrollY(window.scrollY || document.documentElement.scrollTop);
      };
      window.addEventListener('scroll', handleNativeScroll);
      return () => {
        window.removeEventListener('scroll', handleNativeScroll);
      };
    }

    if (!scrollContainerRef.current) return;

    // Initialize LocomotiveScroll for other pages
    const scrollInstance = new LocomotiveScroll({
      el: scrollContainerRef.current,
      smooth: true,
      multiplier: 1.0,
      touchMultiplier: 2.0,
      firefoxMultiplier: 50,
      useKeyboard: true
    });

    // Listen to scroll events to update state
    scrollInstance.on('scroll', (instance) => {
      setScrollY(instance.scroll.y);
    });

    // Re-calculate page height dynamically on content updates
    const resizeObserver = new ResizeObserver(() => {
      scrollInstance.update();
    });
    resizeObserver.observe(scrollContainerRef.current);

    const handleResize = () => {
      scrollInstance.update();
    };
    window.addEventListener('resize', handleResize);

    // Initial update after DOM settles
    const timer = setTimeout(() => {
      scrollInstance.update();
    }, 150);

    return () => {
      scrollInstance.destroy();
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [location.pathname]); // Recreate/reset on route changes

  const handleResetConnection = async () => {
    try {
      await api.post('/api/v1/disconnect');
    } catch (e) {
      console.error('Failed to reset DB connection on backend:', e);
    }
    setIsConnected(false);
    setConnectionInfo(null);
    setSchema({ tables: [], relationships: [] });
    setSelectedColumns({});
    setReportResult(null);
    setError(null);
    setFilters([]);
    setOrderBy([]);
    setGroupBy([]);
    setHaving([]);
  };

  // Apply a report template's column selection
  const handleApplyTemplate = (templateSelectedColumns) => {
    if (!templateSelectedColumns) return;
    setSelectedColumns(templateSelectedColumns);
    setReportResult(null);
    setFilters([]);
    setOrderBy([]);
    setGroupBy([]);
    setHaving([]);
  };

  // Connect to DB via DSN Details
  const handleConnectDSN = async (dsnPayload) => {
    try {
      setLoadingSchema(true);
      setError(null);

      const res = await api.post('/api/v1/connDb', dsnPayload);
      const data = res.data;

      // If backend returned schema directly
      if (data.tables) {
        setSchema(data);
      } else {
        // Fetch schema
        const schemaRes = await api.get('/api/v1/getDets');
        setSchema(schemaRes.data);
      }

      setIsConnected(true);
      setConnectionInfo(dsnPayload);
      setSelectedColumns({});
      setReportResult(null);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Database connection failed';
      setError(errorMsg);
      throw new Error(errorMsg);
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
    setFilters([]);
    setOrderBy([]);
    setGroupBy([]);
    setHaving([]);
  };

  // Fetch Report Data from backend (/api/v1/getData)
  const handleFetchReportData = async (overrideColumns) => {
    if (!isConnected) {
      setError('Database connection required. Please connect your database DSN first to generate reports.');
      return false;
    }

    try {
      setLoadingReport(true);
      setError(null);

      const targetSelected = overrideColumns || selectedColumns;

      const payload = {
        selected: targetSelected,
        filters: filters,
        orderBy: orderBy,
        groupBy: groupBy,
        having: having
      };

      const res = await api.post('/api/v1/getData', payload);
      setReportResult(res.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error fetching report data');
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

      <div
        data-scroll-container
        ref={scrollContainerRef}
        style={{ flex: 1, width: '100%' }}
      >
        <main style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '94px 32px 60px 32px' }}>
          {/* Warning Toast */}
          {warningToast && (
            <div className="toast-enter" style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#f59e0b',
              fontSize: '0.84rem'
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
            <div className="toast-enter" style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#f87171',
              fontSize: '0.84rem'
            }}>
              <span>{error}</span>
              <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Multi-Page Routes with transitions */}
          <PageTransition>
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
                    filters={filters}
                    setFilters={setFilters}
                    orderBy={orderBy}
                    setOrderBy={setOrderBy}
                    groupBy={groupBy}
                    setGroupBy={setGroupBy}
                    having={having}
                    setHaving={setHaving}
                  />
                }
              />

              <Route
                path="/report"
                element={
                  <ReportPage
                    reportResult={reportResult}
                    isConnected={isConnected}
                    selectedColumns={selectedColumns}
                    onApplyTemplate={handleApplyTemplate}
                    onFetchData={handleFetchReportData}
                    loadingReport={loadingReport}
                  />
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageTransition>
        </main>
      </div>

      <SneakyMascots scrollY={scrollY} />
    </div>
  );
}
