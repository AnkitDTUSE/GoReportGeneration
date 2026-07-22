import React from 'react';
import { Play, Trash2, Layers, Loader2 } from 'lucide-react';

export default function QueryControlBar({ selectedColumns, onFetchData, onClear, loading }) {
  // Count total columns selected across all tables
  let totalCols = 0;
  const activeTables = [];

  Object.entries(selectedColumns).forEach(([tName, cols]) => {
    if (cols && cols.length > 0) {
      totalCols += cols.length;
      activeTables.push(`${tName} (${cols.length})`);
    }
  });

  return (
    <div className="panel panel-indigo" style={{ padding: '18px 24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          background: '#0a194f',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #0077b6',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Layers size={20} color="#00b4d8" />
          <div>
            <div style={{ fontSize: '0.78rem', color: '#90e0ef' }}>Query Selection</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#caf0f8' }}>
              {totalCols > 0 ? (
                <>
                  {totalCols} Columns across {activeTables.length} Table{activeTables.length > 1 ? 's' : ''}
                </>
              ) : (
                <span style={{ color: '#00b4d8', fontWeight: 400 }}>No columns selected yet</span>
              )}
            </div>
          </div>
        </div>

        {activeTables.length > 0 && (
          <div style={{ fontSize: '0.83rem', color: '#90e0ef' }}>
            Selected: <strong style={{ color: '#caf0f8' }}>{activeTables.join(', ')}</strong>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {totalCols > 0 && (
          <button
            onClick={onClear}
            className="btn btn-danger"
            style={{ fontSize: '0.85rem' }}
          >
            <Trash2 size={16} />
            Clear Selection
          </button>
        )}

        <button
          onClick={onFetchData}
          className="btn btn-primary"
          disabled={totalCols === 0 || loading}
          style={{ minWidth: '180px' }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Executing Query...
            </>
          ) : (
            <>
              <Play size={18} />
              Fetch Report Data
            </>
          )}
        </button>
      </div>
    </div>
  );
}






