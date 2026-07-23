import React, { useMemo } from 'react';
import { Table as TableIcon, Key, CheckSquare, Square, ShieldCheck } from 'lucide-react';

export default function SchemaViewer({ schema, selectedColumns, onToggleColumn, onWarnUnreachable }) {
  const { tables = [], relationships = [] } = schema || {};

  const adjacencyMap = useMemo(() => {
    const adj = {};
    tables.forEach(t => { adj[t.name] = new Set(); });
    relationships.forEach(rel => {
      if (adj[rel.fromTable]) adj[rel.fromTable].add(rel.toTable);
      if (adj[rel.toTable]) adj[rel.toTable].add(rel.fromTable);
    });
    return adj;
  }, [tables, relationships]);

  const selectedTableNames = useMemo(() => {
    return Object.keys(selectedColumns).filter(tName => selectedColumns[tName] && selectedColumns[tName].length > 0);
  }, [selectedColumns]);

  const reachableTablesMap = useMemo(() => {
    const reachableMap = {};
    if (selectedTableNames.length === 0) {
      tables.forEach(t => { reachableMap[t.name] = true; });
      return reachableMap;
    }
    const startTable = selectedTableNames[0];
    const visited = new Set([startTable]);
    const queue = [startTable];
    while (queue.length > 0) {
      const curr = queue.shift();
      const neighbors = adjacencyMap[curr] || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    tables.forEach(t => { reachableMap[t.name] = visited.has(t.name); });
    return reachableMap;
  }, [tables, selectedTableNames, adjacencyMap]);

  const handleColumnClick = (tableName, columnName, isReachable) => {
    if (!isReachable && selectedTableNames.length > 0) {
      onWarnUnreachable(tableName, selectedTableNames);
      return;
    }
    onToggleColumn(tableName, columnName);
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <TableIcon size={18} color="var(--text-muted)" />
            Database Tables
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Click columns to build your query. Relations are validated to prevent invalid joins.
          </p>
        </div>

        {selectedTableNames.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            padding: '5px 12px', borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem', color: 'var(--text-secondary)'
          }}>
            <ShieldCheck size={14} color="var(--grad-blue)" />
            <span>Join base: <strong style={{ color: 'var(--text-primary)' }}>{selectedTableNames.join(', ')}</strong></span>
          </div>
        )}
      </div>

      <div className="tables-rows-container">
        {tables.map(t => {
          const isSelectedTable = selectedTableNames.includes(t.name);
          const isReachable = reachableTablesMap[t.name];
          const selectedColsForTable = selectedColumns[t.name] || [];

          return (
            <div
              key={t.name}
              className={`table-row-card ${isSelectedTable ? 'active-selected' : isReachable ? 'reachable' : 'unreachable'}`}
            >
              <div className="table-row-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  <TableIcon size={16} color={isSelectedTable ? 'var(--grad-coral)' : 'var(--text-muted)'} />
                  <span>{t.name}</span>
                </div>
                <div>
                  {isSelectedTable ? (
                    <span className="badge badge-connected">{selectedColsForTable.length} Selected</span>
                  ) : isReachable ? (
                    <span className="badge badge-fk">Selectable</span>
                  ) : (
                    <span className="badge badge-unreachable" title="No FK path to selected tables">No Path</span>
                  )}
                </div>
              </div>

              <div style={{ width: '1px', height: '36px', background: 'var(--border)', flexShrink: 0 }} />

              <div className="table-row-columns">
                {t.columns && t.columns.map(col => {
                  const isColSelected = selectedColsForTable.includes(col.name);
                  return (
                    <div
                      key={col.name}
                      className={`column-pill ${isColSelected ? 'selected' : ''}`}
                      onClick={() => handleColumnClick(t.name, col.name, isReachable)}
                    >
                      {isColSelected ? (
                        <CheckSquare size={14} color="#38bdf8" />
                      ) : (
                        <Square size={14} color="var(--text-muted)" />
                      )}
                      <span style={{ fontWeight: isColSelected ? 600 : 400 }}>{col.name}</span>

                      {col.primaryKey && (
                        <span className="badge badge-pk" title="Primary Key">
                          <Key size={9} /> PK
                        </span>
                      )}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {col.dataType}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
