import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Database, RefreshCw, CheckCircle2, AlertCircle, LayoutGrid, Table, Server } from 'lucide-react';

export default function Navbar({ connectionInfo, onResetConnection, isConnected, selectedColumns = {}, reportResult = null }) {
  const navigate = useNavigate();

  const handleReset = () => {
    onResetConnection();
    navigate('/');
  };

  const selectedCount = Object.values(selectedColumns || {}).reduce((acc, cols) => acc + (cols?.length || 0), 0);
  const hasReportData = reportResult && reportResult.data && reportResult.data.length > 0;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      width: '100%',
      borderBottom: '1px solid var(--border)',
      padding: '10px 28px',
      background: 'rgba(18, 24, 38, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'opacity 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--grad-blue), var(--grad-violet))',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={16} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
              GOreportGO
            </h1>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              Schema & Report Engine
            </p>
          </div>
        </Link>

        {/* Nav Pills */}
        <nav className="nav-container">
          <NavLink to="/" end className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}>
            <Server size={14} />
            Connect
          </NavLink>

          <NavLink to="/schema" className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}>
            <LayoutGrid size={14} />
            Schema
            {selectedCount > 0 && (
              <span style={{
                background: 'rgba(0, 119, 182, 0.2)',
                color: '#38bdf8',
                padding: '1px 5px',
                borderRadius: '3px',
                fontSize: '0.65rem',
                fontWeight: 700
              }}>
                {selectedCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/report" className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}>
            <Table size={14} />
            Report
            {hasReportData && (
              <span style={{
                background: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                padding: '1px 5px',
                borderRadius: '3px',
                fontSize: '0.65rem',
                fontWeight: 700
              }}>
                Ready
              </span>
            )}
          </NavLink>
        </nav>

        {/* Connection Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          {isConnected ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem'
            }}>
              <CheckCircle2 size={14} color="#34d399" />
              <span style={{ color: 'var(--text-secondary)' }}>
                {connectionInfo?.dbname || 'Connected'}
              </span>
              <button
                onClick={handleReset}
                className="btn btn-secondary"
                style={{ padding: '3px 8px', fontSize: '0.7rem', marginLeft: '4px' }}
              >
                <RefreshCw size={11} />
                Change
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem'
            }}>
              <AlertCircle size={13} />
              <span>Not Connected</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
