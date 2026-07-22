import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Database, RefreshCw, CheckCircle2, AlertCircle, LayoutGrid, Bookmark, Table, Server } from 'lucide-react';

export default function Navbar({ connectionInfo, onResetConnection, isConnected, selectedColumns = {}, reportResult = null }) {
  const navigate = useNavigate();

  const handleReset = () => {
    onResetConnection();
    navigate('/');
  };

  // Compute dynamic counts
  const selectedCount = Object.values(selectedColumns || {}).reduce((acc, cols) => acc + (cols?.length || 0), 0);
  const hasReportData = reportResult && reportResult.data && reportResult.data.length > 0;

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      borderRadius: 0,
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 32px',
      margin: '0 0 28px 0',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Left: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--accent-cyan-glow)'
          }}>
            <Database size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              GoReport Studio
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Dynamic Schema & Report Engine
            </p>
          </div>
        </div>

        {/* Center: Centered Dynamic Navigation Pills */}
        <nav className="nav-container">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
          >
            <Server size={15} />
            Connect DSN
          </NavLink>

          <NavLink
            to="/schema"
            className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
          >
            <LayoutGrid size={15} />
            Schema Builder
            {selectedCount > 0 && (
              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                padding: '2px 7px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginLeft: '2px'
              }}>
                {selectedCount}
              </span>
            )}
          </NavLink>


          <NavLink
            to="/report"
            className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
          >
            <Table size={15} />
            Report Results
            {hasReportData && (
              <span style={{
                background: 'var(--accent-emerald)',
                color: '#ffffff',
                padding: '2px 7px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginLeft: '2px'
              }}>
                Ready
              </span>
            )}
          </NavLink>
        </nav>

        {/* Right: Connection Info & Reset Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
          {isConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '5px 14px', borderRadius: '30px' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              <div style={{ fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>DB: </span>
                <strong style={{ color: 'var(--accent-emerald)' }}>{connectionInfo?.dbname || 'Connected'}</strong>
              </div>
              <button 
                onClick={handleReset}
                className="btn btn-secondary"
                style={{ padding: '3px 10px', fontSize: '0.75rem', marginLeft: '6px' }}
                title="Change Database Connection DSN"
              >
                <RefreshCw size={12} />
                Change DSN
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '5px 14px', borderRadius: '30px', color: 'var(--accent-amber)', fontSize: '0.82rem' }}>
              <AlertCircle size={15} />
              <span>Not Connected</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
