import React from 'react';
import { useNavigate } from 'react-router-dom';
import SchemaViewer from '../components/SchemaViewer';
import RelationshipsPanel from '../components/RelationshipsPanel';
import QueryControlBar from '../components/QueryControlBar';
import QueryFiltersPanel from '../components/QueryFiltersPanel';
import SqlViewer from '../components/SqlViewer';
import { DatabaseBackup, RefreshCw, Server, AlertCircle } from 'lucide-react';

function buildSqlQuery(schema, selectedColumns, options = {}) {
  const { filters = [], orderBy = [], groupBy = [], having = [] } = options;
  const tables = schema.tables || [];
  const relationships = schema.relationships || [];

  // Get active selections
  const reqTables = Object.keys(selectedColumns).filter(
    tName => selectedColumns[tName] && selectedColumns[tName].length > 0
  );

  if (reqTables.length === 0) {
    return "";
  }

  // Sort tables to keep output deterministic
  reqTables.sort();

  // Quote identifiers helper
  const quote = (name) => `"${name.replace(/"/g, '""')}"`;

  // Collect select list
  const selectCols = [];
  reqTables.forEach(tName => {
    const cols = selectedColumns[tName] || [];
    cols.forEach(col => {
      selectCols.push(`${quote(tName)}.${quote(col)}`);
    });
  });

  let baseTable = reqTables[0];
  let joinClauses = [];
  let neededTables = { [baseTable]: true };

  if (reqTables.length > 1) {
    // Multi-table traversal
    const adj = {};
    tables.forEach(t => { adj[t.name] = []; });
    relationships.forEach(r => {
      if (adj[r.fromTable]) {
        adj[r.fromTable].push({
          fromTable: r.fromTable,
          fromColumn: r.fromColumn,
          toTable: r.toTable,
          toColumn: r.toColumn
        });
      }
      if (adj[r.toTable]) {
        adj[r.toTable].push({
          fromTable: r.toTable,
          fromColumn: r.toColumn,
          toTable: r.fromTable,
          toColumn: r.fromColumn
        });
      }
    });

    const visited = {};
    const parentEdge = {};
    
    visited[baseTable] = true;
    const queue = [baseTable];

    while (queue.length > 0) {
      const curr = queue.shift();
      const edges = adj[curr] || [];
      edges.forEach(edge => {
        if (!visited[edge.toTable]) {
          visited[edge.toTable] = true;
          parentEdge[edge.toTable] = edge;
          queue.push(edge.toTable);
        }
      });
    }

    // Check if all requested tables are reachable
    for (const tName of reqTables) {
      if (!visited[tName]) {
        return "-- Unconnected tables selected. Please choose related tables.";
      }
    }

    neededTables = {};
    reqTables.forEach(tName => {
      neededTables[tName] = true;
      let curr = tName;
      while (curr !== baseTable) {
        const edge = parentEdge[curr];
        if (!edge) break;
        neededTables[edge.fromTable] = true;
        curr = edge.fromTable;
      }
    });

    const included = { [baseTable]: true };
    const neededCount = Object.keys(neededTables).length;
    let progress = true;

    while (Object.keys(included).length < neededCount && progress) {
      progress = false;

      // Get needed tables that are not yet included
      const neededList = Object.keys(neededTables).filter(t => !included[t]);
      neededList.sort();

      for (const t of neededList) {
        const edge = parentEdge[t];
        if (edge && included[edge.fromTable]) {
          const clause = `JOIN ${quote(edge.toTable)} ON ${quote(edge.fromTable)}.${quote(edge.fromColumn)} = ${quote(edge.toTable)}.${quote(edge.toColumn)}`;
          joinClauses.push(clause);
          included[edge.toTable] = true;
          progress = true;
          break;
        }
      }
    }

    if (Object.keys(included).length < neededCount) {
      return "-- Failed to construct valid JOIN sequence.";
    }
  }

  // 1. WHERE
  const whereClauses = [];
  filters.forEach(f => {
    if (!neededTables[f.table]) return;
    const op = f.operator.toUpperCase().trim();
    const colIdent = `${quote(f.table)}.${quote(f.column)}`;
    
    if (op === 'IS NULL' || op === 'IS NOT NULL') {
      whereClauses.push(`${colIdent} ${op}`);
    } else {
      const escapedVal = f.value.replace(/'/g, "''");
      whereClauses.push(`${colIdent} ${op} '${escapedVal}'`);
    }
  });

  // 2. GROUP BY
  const groupByClauses = [];
  groupBy.forEach(g => {
    const parts = g.split('.');
    if (parts.length === 2 && neededTables[parts[0]]) {
      groupByClauses.push(`${quote(parts[0])}.${quote(parts[1])}`);
    }
  });

  // 3. HAVING
  const havingClauses = [];
  having.forEach(h => {
    if (!neededTables[h.table]) return;
    const op = h.operator.toUpperCase().trim();
    
    let expr;
    if (h.column.includes('(') && h.column.includes(')')) {
      expr = h.column;
    } else {
      expr = `${quote(h.table)}.${quote(h.column)}`;
    }

    if (op === 'IS NULL' || op === 'IS NOT NULL') {
      havingClauses.push(`${expr} ${op}`);
    } else {
      const escapedVal = h.value.replace(/'/g, "''");
      havingClauses.push(`${expr} ${op} '${escapedVal}'`);
    }
  });

  // 4. ORDER BY
  const orderByClauses = [];
  orderBy.forEach(o => {
    if (!neededTables[o.table]) return;
    const dir = o.direction.toUpperCase().trim() === 'DESC' ? 'DESC' : 'ASC';
    orderByClauses.push(`${quote(o.table)}.${quote(o.column)} ${dir}`);
  });

  // Assemble query
  let query = `SELECT\n  ${selectCols.join(',\n  ')}\nFROM ${quote(baseTable)}`;
  if (joinClauses.length > 0) {
    query += `\n${joinClauses.join('\n')}`;
  }
  if (whereClauses.length > 0) {
    query += `\nWHERE ${whereClauses.join(' AND ')}`;
  }
  if (groupByClauses.length > 0) {
    query += `\nGROUP BY ${groupByClauses.join(', ')}`;
  }
  if (havingClauses.length > 0) {
    query += `\nHAVING ${havingClauses.join(' AND ')}`;
  }
  if (orderByClauses.length > 0) {
    query += `\nORDER BY ${orderByClauses.join(', ')}`;
  }
  query += `;`;

  return query;
}

export default function SchemaPage({
  schema,
  selectedColumns,
  onToggleColumn,
  onWarnUnreachable,
  onFetchData,
  onClearSelection,
  loadingReport,
  isConnected,
  connectionInfo,
  onResetConnection,
  onApplyTemplate,
  filters,
  setFilters,
  orderBy,
  setOrderBy,
  groupBy,
  setGroupBy,
  having,
  setHaving
}) {
  const navigate = useNavigate();

  const handleFetchReport = async () => {
    const success = await onFetchData();
    if (success) navigate('/report');
  };

  const query = buildSqlQuery(schema, selectedColumns, { filters, orderBy, groupBy, having });

  return (
    <div className="animate-fade-in">
      {!isConnected ? (
        <div className="panel" style={{ padding: '36px', textAlign: 'center', margin: '24px 0' }}>
          <AlertCircle size={24} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
            Connection Required
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '420px', margin: '0 auto 20px auto', lineHeight: '1.6' }}>
            Connect your PostgreSQL database to browse table structures and generate reports.
          </p>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <Server size={15} /> Connect DSN
          </button>
        </div>
      ) : (!schema.tables || schema.tables.length === 0) ? (
        <div className="panel animate-fade-in" style={{ padding: '40px 32px', textAlign: 'center', maxWidth: '520px', margin: '24px auto' }}>
          <DatabaseBackup size={24} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>Empty Database</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '20px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{connectionInfo?.dbname}</strong> has no tables.
          </p>
          <button onClick={() => { onResetConnection(); navigate('/'); }} className="btn btn-secondary" style={{ padding: '8px 18px' }}>
            <RefreshCw size={14} /> Change DSN
          </button>
        </div>
      ) : (
        <div>
          <RelationshipsPanel relationships={schema.relationships} />
          <SchemaViewer schema={schema} selectedColumns={selectedColumns} onToggleColumn={onToggleColumn} onWarnUnreachable={onWarnUnreachable} />
          <QueryFiltersPanel
            filters={filters}
            setFilters={setFilters}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            having={having}
            setHaving={setHaving}
            schema={schema}
            selectedColumns={selectedColumns}
          />
          <QueryControlBar selectedColumns={selectedColumns} onFetchData={handleFetchReport} onClear={onClearSelection} loading={loadingReport} />
          <SqlViewer query={query} />
        </div>
      )}
    </div>
  );
}
