import React, { useMemo } from 'react';
import { Table as TableIcon, Key, CheckSquare, Square, ShieldCheck } from 'lucide-react';

export default function SchemaViewer({ schema, selectedColumns, onToggleColumn, onWarnUnreachable }) {
  const { tables = [], relationships = [] } = schema || {};

  // Build adjacency list for relationship connectivity
  const adjacencyMap = useMemo(() => {
    const adj = {};
    tables.forEach(t => {
      adj[t.name] = new Set();
    });

    relationships.forEach(rel => {
      if (adj[rel.fromTable]) adj[rel.fromTable].add(rel.toTable);
      if (adj[rel.toTable]) adj[rel.toTable].add(rel.fromTable);
    });

    return adj;
  }, [tables, relationships]);

  // Identify currently selected tables (tables with > 0 selected columns)
  const selectedTableNames = useMemo(() => {
    return Object.keys(selectedColumns).filter(tName => selectedColumns[tName] && selectedColumns[tName].length > 0);
  }, [selectedColumns]);

  // Determine reachability for each table
  const reachableTablesMap = useMemo(() => {
    const reachableMap = {};

    if (selectedTableNames.length === 0) {
      // If nothing is selected, all tables are reachable
      tables.forEach(t => { reachableMap[t.name] = true; });
      return reachableMap;
    }

    // Start BFS from the first selected table
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

    // A table is valid/reachable if it's connected to startTable AND all existing selected tables are reachable
    tables.forEach(t => {
      reachableMap[t.name] = visited.has(t.name);
    });

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
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', color: '#caf0f8' }}>
            <TableIcon size={20} color="#00b4d8" />
            Database Tables Schema
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#90e0ef', marginTop: '4px' }}>
            Click columns to build your query. Table relations are strictly validated to prevent invalid joins.
          </p>
        </div>

        {selectedTableNames.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0a194f', border: '1px solid #0077b6', padding: '6px 14px', borderRadius: '6px', fontSize: '0.82rem', color: '#caf0f8' }}>
            <ShieldCheck size={16} color="#00b4d8" />
            <span>Active Joint Base: <strong style={{ color: '#caf0f8' }}>{selectedTableNames.join(', ')}</strong></span>
          </div>
        )}
      </div>

      {/* Row layout for all tables */}
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
              {/* Table Title & Status Badge */}
              <div className="table-row-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.05rem', color: '#caf0f8' }}>
                  <TableIcon size={18} color={isSelectedTable ? '#00b4d8' : '#90e0ef'} />
                  <span>{t.name}</span>
                </div>
                <div>
                  {isSelectedTable ? (
                    <span className="badge badge-connected">
                      {selectedColsForTable.length} Selected
                    </span>
                  ) : isReachable ? (
                    <span className="badge badge-fk">
                      Selectable
                    </span>
                  ) : (
                    <span className="badge badge-unreachable" title="No foreign key path to selected tables">
                      No Path
                    </span>
                  )}
                </div>
              </div>

              {/* Divider line */}
              <div style={{ width: '1px', height: '40px', background: '#0077b6', flexShrink: 0 }} />

              {/* Columns Row */}
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
                        <CheckSquare size={15} color="#03045e" />
                      ) : (
                        <Square size={15} color="#00b4d8" />
                      )}
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{col.name}</span>

                      {col.primaryKey && (
                        <span className="badge badge-pk" title="Primary Key">
                          <Key size={10} /> PK
                        </span>
                      )}
                      <span style={{ fontSize: '0.75rem', opacity: 0.85, fontFamily: 'var(--font-mono)' }}>
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






