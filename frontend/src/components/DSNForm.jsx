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

  return (
    <div style={{ maxWidth: '540px', margin: '40px auto', padding: '0 20px' }}>
      <div className="panel panel-blue animate-fade-in" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: '#00b4d8',
            border: '1px solid #caf0f8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Database size={26} color="#03045e" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#caf0f8' }}>Connect to Database</h2>
          <p style={{ color: '#90e0ef', fontSize: '0.88rem', marginTop: '6px' }}>
            Provide DSN details for your PostgreSQL database to analyze schema & generate reports.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(248, 113, 113, 0.15)',
            border: '1px solid #f87171',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#f87171',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#caf0f8', marginBottom: '6px' }}>
                Host
              </label>
              <div style={{ position: 'relative' }}>
                <Server size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#00b4d8' }} />
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  placeholder="e.g. localhost"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    background: '#030838',
                    border: '1px solid #0077b6',
                    borderRadius: 'var(--radius-md)',
                    color: '#caf0f8',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#caf0f8', marginBottom: '6px' }}>
                Port
              </label>
              <input
                type="number"
                name="port"
                value={formData.port}
                onChange={handleChange}
                placeholder="5432"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#030838',
                  border: '1px solid #0077b6',
                  borderRadius: 'var(--radius-md)',
                  color: '#caf0f8',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#caf0f8', marginBottom: '6px' }}>
              Database Name
            </label>
            <div style={{ position: 'relative' }}>
              <Database size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#00b4d8' }} />
              <input
                type="text"
                name="dbname"
                value={formData.dbname}
                onChange={handleChange}
                placeholder="e.g. my_database"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  background: '#030838',
                  border: '1px solid #0077b6',
                  borderRadius: 'var(--radius-md)',
                  color: '#caf0f8',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#caf0f8', marginBottom: '6px' }}>
                User
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#00b4d8' }} />
                <input
                  type="text"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  placeholder="postgres"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    background: '#030838',
                    border: '1px solid #0077b6',
                    borderRadius: 'var(--radius-md)',
                    color: '#caf0f8',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#caf0f8', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#00b4d8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 36px 10px 36px',
                    background: '#030838',
                    border: '1px solid #0077b6',
                    borderRadius: 'var(--radius-md)',
                    color: '#caf0f8',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '10px',
                    background: 'none',
                    border: 'none',
                    color: '#00b4d8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#caf0f8', marginBottom: '6px' }}>
              SSL Mode
            </label>
            <div style={{ position: 'relative' }}>
              <ShieldCheck size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#00b4d8' }} />
              <select
                name="sslmode"
                value={formData.sslmode}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  background: '#030838',
                  border: '1px solid #0077b6',
                  borderRadius: 'var(--radius-md)',
                  color: '#caf0f8',
                  fontSize: '0.9rem'
                }}
              >
                <option value="disable">disable</option>
                <option value="require">require</option>
                <option value="verify-ca">verify-ca</option>
                <option value="verify-full">verify-full</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '0.95rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                Connecting & Fetching Schema...
              </>
            ) : (
              <>
                Connect & Load Schema <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}






