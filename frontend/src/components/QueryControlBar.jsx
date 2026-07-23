import React from 'react';
import { Play, Trash2, Layers, Loader2 } from 'lucide-react';

export default function QueryControlBar({ selectedColumns, onFetchData, onClear, loading }) {
  let totalCols = 0;
  const activeTables = [];

  Object.entries(selectedColumns).forEach(([tName, cols]) => {
    if (cols && cols.length > 0) {
      totalCols += cols.length;
      activeTables.push(`${tName} (${cols.length})`);
    }
  });

  return (
    <div className="panel" style={{
      padding: '14px 20px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          background: 'var(--surface-2)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Layers size={17} color="var(--text-muted)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Selection</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {totalCols > 0 ? (
                <>{totalCols} cols · {activeTables.length} table{activeTables.length > 1 ? 's' : ''}</>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>None</span>
              )}
            </div>
          </div>
        </div>

        {activeTables.length > 0 && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {activeTables.join(', ')}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {totalCols > 0 && (
          <button onClick={onClear} className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '7px 14px' }}>
            <Trash2 size={14} /> Clear
          </button>
        )}

        <button
          onClick={onFetchData}
          className="btn btn-primary"
          disabled={totalCols === 0 || loading}
          style={{ minWidth: '160px', padding: '8px 16px' }}
        >
          {loading ? (
            <>
              <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
              Querying...
            </>
          ) : (
            <>
              <Play size={15} />
              Fetch Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}
