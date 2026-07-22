import React, { useState, useMemo } from 'react';
import { Table, Search, Download, CheckSquare, Square, Info } from 'lucide-react';

export default function DataTable({ data = [] }) {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Extract column keys dynamically from the first row of data
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(row => {
      return Object.values(row).some(val => 
        val !== null && val !== undefined && String(val).toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm]);

  // Toggle row selection on row click
  const toggleRow = (index) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Select all or deselect all
  const toggleSelectAll = () => {
    if (selectedRows.size === filteredData.length && filteredData.length > 0) {
      setSelectedRows(new Set());
    } else {
      const allIndices = new Set(filteredData.map((_, i) => i));
      setSelectedRows(allIndices);
    }
  };

  // Export filtered & selected data to CSV
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
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `report_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data || data.length === 0) {
    return (
      <div className="panel panel-emerald" style={{ padding: '40px', textAlign: 'center', color: '#90e0ef' }}>
        <Info size={32} style={{ opacity: 0.5, marginBottom: '12px', color: '#00b4d8' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#caf0f8' }}>No Data Returned</h3>
        <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
          Select columns from table schema above and click "Fetch Report Data" to generate query results.
        </p>
      </div>
    );
  }

  const isAllSelected = selectedRows.size === filteredData.length && filteredData.length > 0;

  return (
    <div className="panel panel-emerald animate-fade-in" style={{ padding: '24px', marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', color: '#caf0f8' }}>
            <Table size={20} color="#00b4d8" />
            Query Result Data ({data.length} Rows)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#90e0ef', marginTop: '2px' }}>
            Click on any row below to highlight and select it.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search filter */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#00b4d8' }} />
            <input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px 8px 36px',
                background: '#030838',
                border: '1px solid #0077b6',
                borderRadius: 'var(--radius-md)',
                color: '#caf0f8',
                fontSize: '0.85rem',
                minWidth: '220px'
              }}
            />
          </div>

          {/* Selection counter badge */}
          {selectedRows.size > 0 && (
            <div style={{
              background: '#0a194f',
              border: '1px solid #0077b6',
              color: '#caf0f8',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              {selectedRows.size} Row{selectedRows.size > 1 ? 's' : ''} Highlighted
            </div>
          )}

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <Download size={15} />
            Export {selectedRows.size > 0 ? 'Selected' : 'All'} CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="data-table-wrapper" style={{ maxHeight: '520px', overflowY: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '44px', textAlign: 'center' }}>
                <div onClick={toggleSelectAll} style={{ cursor: 'pointer' }}>
                  {isAllSelected ? (
                    <CheckSquare size={16} color="#00b4d8" />
                  ) : (
                    <Square size={16} color="#0077b6" />
                  )}
                </div>
              </th>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => {
              const isRowSelected = selectedRows.has(idx);
              return (
                <tr
                  key={idx}
                  className={isRowSelected ? 'row-selected' : ''}
                  onClick={() => toggleRow(idx)}
                >
                  <td style={{ textAlign: 'center' }} onClick={(e) => { e.stopPropagation(); toggleRow(idx); }}>
                    {isRowSelected ? (
                      <CheckSquare size={16} color="#00b4d8" />
                    ) : (
                      <Square size={16} color="#0077b6" />
                    )}
                  </td>
                  {columns.map(col => (
                    <td key={col}>
                      {row[col] === null || row[col] === undefined ? (
                        <span style={{ color: '#00b4d8', fontStyle: 'italic' }}>null</span>
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

