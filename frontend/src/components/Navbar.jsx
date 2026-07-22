import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Database, RefreshCw, CheckCircle2, AlertCircle, LayoutGrid, Table, Server } from 'lucide-react';

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
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      borderBottom: '2px solid #00b4d8',
      padding: '14px 32px',
      margin: '0 0 28px 0',
      background: '#030838',
      boxShadow: '0 4px 14px rgba(2, 6, 30, 0.5)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Left: Brand Logo (Redirects to Homepage) */}
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '14px', 
            textDecoration: 'none', 
            color: 'inherit',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          title="Go to Homepage"
        >
          <div style={{
            background: '#00b4d8',
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={20} color="#03045e" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#caf0f8', margin: 0, letterSpacing: '-0.01em' }}>
              GOreportGO
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#90e0ef', margin: 0 }}>
              Dynamic Schema & Report Engine
            </p>
          </div>
        </Link>

        {/* Center: Dynamic Navigation Pills */}
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
                background: '#0a194f',
                color: '#caf0f8',
                border: '1px solid #0077b6',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem',
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
                background: '#081442',
                color: '#caf0f8',
                border: '1px solid #00b4d8',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#081442', border: '1px solid #00b4d8', padding: '6px 14px', borderRadius: '6px' }}>
              <CheckCircle2 size={16} color="#00b4d8" />
              <div style={{ fontSize: '0.82rem' }}>
                <span style={{ color: '#90e0ef' }}>DB: </span>
                <strong style={{ color: '#caf0f8' }}>{connectionInfo?.dbname || 'Connected'}</strong>
              </div>
              <button 
                onClick={handleReset}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.75rem', marginLeft: '6px' }}
                title="Change Database Connection DSN"
              >
                <RefreshCw size={12} />
                Change DSN
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0a194f', border: '1px solid #0077b6', padding: '6px 14px', borderRadius: '6px', color: '#caf0f8', fontSize: '0.82rem', fontWeight: 600 }}>
              <AlertCircle size={15} />
              <span>Not Connected</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}






