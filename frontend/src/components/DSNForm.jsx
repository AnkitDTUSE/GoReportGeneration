import React, { useState } from 'react';
import { Server, Key, Database, User, ShieldCheck, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function DSNForm({ onConnect, error, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '',
    dbname: 'postgres',
    sslmode: 'disable'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConnect(formData);
  };

  const inputStyle = {
    width: '100%',
    padding: '9px 12px 9px 34px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-sans)',
    transition: 'border-color 0.15s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em'
  };

  const iconStyle = {
    position: 'absolute',
    left: '10px',
    top: '11px',
    color: 'var(--text-muted)'
  };

  return (
    <div style={{ maxWidth: '480px', margin: '48px auto', padding: '0 20px' }}>
      <div className="panel panel-blue animate-fade-in" style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--grad-blue), var(--grad-violet))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto'
          }}>
            <Database size={20} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Connect to Database</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
            Provide your PostgreSQL DSN to begin.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(230, 57, 70, 0.08)',
            border: '1px solid rgba(230, 57, 70, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#f87171',
            fontSize: '0.82rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Host</label>
              <div style={{ position: 'relative' }}>
                <Server size={14} style={iconStyle} />
                <input type="text" name="host" value={formData.host} onChange={handleChange} placeholder="localhost" required style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Port</label>
              <input type="number" name="port" value={formData.port} onChange={handleChange} placeholder="5432" required
                style={{ ...inputStyle, paddingLeft: '12px' }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Database Name</label>
            <div style={{ position: 'relative' }}>
              <Database size={14} style={iconStyle} />
              <input type="text" name="dbname" value={formData.dbname} onChange={handleChange} placeholder="my_database" required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>User</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={iconStyle} />
                <input type="text" name="user" value={formData.user} onChange={handleChange} placeholder="postgres" required style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={14} style={iconStyle} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '34px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '10px', top: '10px',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>SSL Mode</label>
            <div style={{ position: 'relative' }}>
              <ShieldCheck size={14} style={iconStyle} />
              <select name="sslmode" value={formData.sslmode} onChange={handleChange} style={inputStyle}>
                <option value="disable" style={{ background: '#121826' }}>disable</option>
                <option value="require" style={{ background: '#121826' }}>require</option>
                <option value="verify-ca" style={{ background: '#121826' }}>verify-ca</option>
                <option value="verify-full" style={{ background: '#121826' }}>verify-full</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', padding: '10px', marginTop: '6px', fontSize: '0.88rem' }}>
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Connecting...
              </>
            ) : (
              <>
                Connect & Load Schema <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
