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
      <div style={{ maxWidth: '480px', margin: '48px auto', padding: '0 20px' }}>
        <div className="panel animate-fade-in" style={{ padding: '32px', textAlign: 'center' }}>
          <CheckCircle2 size={28} color="#34d399" style={{ marginBottom: '12px' }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Connected</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', marginBottom: '20px' }}>
            Connected to <strong style={{ color: 'var(--text-primary)' }}>{connectionInfo?.dbname || 'PostgreSQL'}</strong> on <strong style={{ color: 'var(--text-primary)' }}>{connectionInfo?.host || 'localhost'}</strong>.
          </p>
          <button onClick={() => navigate('/schema')} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
            Open Schema Builder <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return <DSNForm onConnect={handleConnectSuccess} error={error} loading={loading} />;
}
