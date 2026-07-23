import React, { useState, useMemo } from 'react';
import { Table, Search, Download, CheckSquare, Square, Info } from 'lucide-react';

export default function DataTable({ data = [] }) {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(val =>
        val !== null && val !== undefined && String(val).toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm]);

  const toggleRow = (index) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredData.length && filteredData.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map((_, i) => i)));
    }
  };

  const exportCSV = () => {
    if (filteredData.length === 0) return;
    const rowsToExport = selectedRows.size > 0
      ? filteredData.filter((_, i) => selectedRows.has(i))
      : filteredData;
    const headers = columns.join(',');
    const csvLines = rowsToExport.map(row =>
      columns.map(col => {
        let val = row[col];
        if (val === null || val === undefined) return '""';
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      }).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...csvLines].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `report_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data || data.length === 0) {
    return (
      <div className="panel" style={{ padding: '36px', textAlign: 'center' }}>
        <Info size={28} style={{ opacity: 0.3, marginBottom: '10px', color: 'var(--text-muted)' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>No Data Returned</h3>
        <p style={{ fontSize: '0.82rem', marginTop: '4px', color: 'var(--text-muted)' }}>
          Select columns from the schema and click "Fetch Report Data" to generate results.
        </p>
      </div>
    );
  }

  const handleWheel = (e) => {
    const el = e.currentTarget;
    const isScrollingUp = e.deltaY < 0;
    const isScrollingDown = e.deltaY > 0;

    if (isScrollingUp && el.scrollTop === 0) {
      // Propagate scroll upwards to the main window
      window.scrollBy({ top: e.deltaY, behavior: 'auto' });
    } else if (isScrollingDown && el.scrollTop + el.clientHeight >= el.scrollHeight) {
      // Propagate scroll downwards to the main window
      window.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }
  };

  const isAllSelected = selectedRows.size === filteredData.length && filteredData.length > 0;

  return (
    <div className="panel animate-fade-in" style={{ padding: '20px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <Table size={17} color="var(--text-muted)" />
            Results ({data.length} rows)
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '7px 12px 7px 32px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                minWidth: '180px'
              }}
            />
          </div>

          {selectedRows.size > 0 && (
            <span style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {selectedRows.size} selected
            </span>
          )}

          <button onClick={exportCSV} className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      <div
        className="data-table-wrapper"
        style={{ maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}
        onWheel={handleWheel}
      >
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <div onClick={toggleSelectAll} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                  {isAllSelected ? <CheckSquare size={14} color="#38bdf8" /> : <Square size={14} color="var(--text-muted)" />}
                </div>
              </th>
              {columns.map(col => <th key={col}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => {
              const isRowSelected = selectedRows.has(idx);
              return (
                <tr key={idx} className={isRowSelected ? 'row-selected' : ''} onClick={() => toggleRow(idx)}>
                  <td style={{ textAlign: 'center' }} onClick={(e) => { e.stopPropagation(); toggleRow(idx); }}>
                    {isRowSelected ? <CheckSquare size={14} color="#38bdf8" /> : <Square size={14} color="var(--text-muted)" />}
                  </td>
                  {columns.map(col => (
                    <td key={col}>
                      {row[col] === null || row[col] === undefined ? (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>null</span>
                      ) : typeof row[col] === 'boolean' ? (
                        row[col] ? 'true' : 'false'
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
