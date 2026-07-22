import React from 'react';
import { useNavigate } from 'react-router-dom';
import DSNForm from '../components/DSNForm';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ConnectPage({ onConnect, error, loading, isConnected, connectionInfo }) {
  const navigate = useNavigate();

  const handleConnectSuccess = async (dsnPayload) => {
    await onConnect(dsnPayload);
    navigate('/schema');
  };

  if (isConnected) {
    return (
      <div style={{ maxWidth: '540px', margin: '40px auto', padding: '0 20px' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '36px', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <CheckCircle2 size={28} color="var(--accent-emerald)" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Database Connected</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px', marginBottom: '24px' }}>
            Connected to <strong>{connectionInfo?.dbname || 'PostgreSQL DB'}</strong> on host <strong>{connectionInfo?.host || 'localhost'}</strong>.
          </p>

          <button
            onClick={() => navigate('/schema')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            Go to Schema Builder <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <DSNForm
      onConnect={handleConnectSuccess}
      error={error}
      loading={loading}
    />
  );
}
