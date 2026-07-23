import React, { useState } from 'react';
import { Filter, SortAsc, Layers, HelpCircle, Plus, Trash2, ShieldQuestion } from 'lucide-react';

export default function QueryFiltersPanel({
  filters = [],
  setFilters,
  orderBy = [],
  setOrderBy,
  groupBy = [],
  setGroupBy,
  having = [],
  setHaving,
  schema = {},
  selectedColumns = {}
}) {
  const [activeTab, setActiveTab] = useState('filters');

  // Get list of tables that have at least one column selected
  const activeTables = Object.keys(selectedColumns).filter(
    (tName) => selectedColumns[tName] && selectedColumns[tName].length > 0
  );

  // Helper to get columns for a table
  const getTableColumns = (tName) => {
    return selectedColumns[tName] || [];
  };

  const operators = [
    { value: '=', label: '=' },
    { value: '!=', label: '!=' },
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '>=', label: '>=' },
    { value: '<=', label: '<=' },
    { value: 'LIKE', label: 'LIKE' },
    { value: 'ILIKE', label: 'ILIKE' },
    { value: 'IS NULL', label: 'IS NULL' },
    { value: 'IS NOT NULL', label: 'IS NOT NULL' }
  ];

  // --- Handlers for WHERE Filters ---
  const addFilter = () => {
    if (activeTables.length === 0) return;
    const defaultTable = activeTables[0];
    const defaultCols = getTableColumns(defaultTable);
    setFilters([
      ...filters,
      {
        table: defaultTable,
        column: defaultCols[0] || '',
        operator: '=',
        value: ''
      }
    ]);
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index, field, val) => {
    const updated = [...filters];
    updated[index][field] = val;

    // If changing table, reset column to the first column of the new table
    if (field === 'table') {
      const cols = getTableColumns(val);
      updated[index].column = cols[0] || '';
    }
    setFilters(updated);
  };

  // --- Handlers for ORDER BY ---
  const addOrderBy = () => {
    if (activeTables.length === 0) return;
    const defaultTable = activeTables[0];
    const defaultCols = getTableColumns(defaultTable);
    setOrderBy([
      ...orderBy,
      {
        table: defaultTable,
        column: defaultCols[0] || '',
        direction: 'ASC'
      }
    ]);
  };

  const removeOrderBy = (index) => {
    setOrderBy(orderBy.filter((_, i) => i !== index));
  };

  const updateOrderBy = (index, field, val) => {
    const updated = [...orderBy];
    updated[index][field] = val;

    if (field === 'table') {
      const cols = getTableColumns(val);
      updated[index].column = cols[0] || '';
    }
    setOrderBy(updated);
  };

  // --- Handlers for GROUP BY ---
  const handleToggleGroupBy = (tableColString) => {
    if (groupBy.includes(tableColString)) {
      setGroupBy(groupBy.filter((g) => g !== tableColString));
    } else {
      setGroupBy([...groupBy, tableColString]);
    }
  };

  // --- Handlers for HAVING ---
  const addHaving = () => {
    if (activeTables.length === 0) return;
    const defaultTable = activeTables[0];
    const defaultCols = getTableColumns(defaultTable);
    setHaving([
      ...having,
      {
        table: defaultTable,
        column: `COUNT(${defaultTable}.${defaultCols[0] || 'id'})`,
        operator: '>',
        value: '1'
      }
    ]);
  };

  const removeHaving = (index) => {
    setHaving(having.filter((_, i) => i !== index));
  };

  const updateHaving = (index, field, val) => {
    const updated = [...having];
    updated[index][field] = val;
    setHaving(updated);
  };

  if (activeTables.length === 0) {
    return (
      <div className="panel" style={{ padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
        <HelpCircle size={20} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Query Configuration</h4>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          Select at least one column above to build filters, sorting, grouping, and aggregations.
        </p>
      </div>
    );
  }

  return (
    <div className="panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
      {/* Tabs Header */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: '1px', gap: '16px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('filters')}
          style={{
            background: 'none', border: 'none', padding: '6px 12px 10px 12px', cursor: 'pointer',
            fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
            color: activeTab === 'filters' ? '#38bdf8' : 'var(--text-muted)',
            borderBottom: activeTab === 'filters' ? '2px solid #38bdf8' : '2px solid transparent',
            transition: 'all 0.15s'
          }}
        >
          <Filter size={13} />
          Filters (WHERE)
          {filters.length > 0 && <span style={{ fontSize: '0.62rem', background: 'rgba(56, 189, 248, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>{filters.length}</span>}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orderBy')}
          style={{
            background: 'none', border: 'none', padding: '6px 12px 10px 12px', cursor: 'pointer',
            fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
            color: activeTab === 'orderBy' ? '#38bdf8' : 'var(--text-muted)',
            borderBottom: activeTab === 'orderBy' ? '2px solid #38bdf8' : '2px solid transparent',
            transition: 'all 0.15s'
          }}
        >
          <SortAsc size={13} />
          Sorting (ORDER BY)
          {orderBy.length > 0 && <span style={{ fontSize: '0.62rem', background: 'rgba(56, 189, 248, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>{orderBy.length}</span>}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('groupBy')}
          style={{
            background: 'none', border: 'none', padding: '6px 12px 10px 12px', cursor: 'pointer',
            fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
            color: activeTab === 'groupBy' ? '#38bdf8' : 'var(--text-muted)',
            borderBottom: activeTab === 'groupBy' ? '2px solid #38bdf8' : '2px solid transparent',
            transition: 'all 0.15s'
          }}
        >
          <Layers size={13} />
          Grouping (GROUP BY)
          {groupBy.length > 0 && <span style={{ fontSize: '0.62rem', background: 'rgba(56, 189, 248, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>{groupBy.length}</span>}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('having')}
          style={{
            background: 'none', border: 'none', padding: '6px 12px 10px 12px', cursor: 'pointer',
            fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
            color: activeTab === 'having' ? '#38bdf8' : 'var(--text-muted)',
            borderBottom: activeTab === 'having' ? '2px solid #38bdf8' : '2px solid transparent',
            transition: 'all 0.15s'
          }}
        >
          <ShieldQuestion size={13} />
          Aggregation (HAVING)
          {having.length > 0 && <span style={{ fontSize: '0.62rem', background: 'rgba(56, 189, 248, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>{having.length}</span>}
        </button>
      </div>

      {/* Tabs Content */}
      <div>
        {/* FILTERS TAB */}
        {activeTab === 'filters' && (
          <div className="animate-fade-in">
            {filters.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                No filters defined. Results will not be filtered.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                {filters.map((filter, index) => {
                  const cols = getTableColumns(filter.table);
                  const isNullOp = filter.operator === 'IS NULL' || filter.operator === 'IS NOT NULL';

                  return (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1.5fr auto', gap: '10px', alignItems: 'center' }}>
                      {/* Table Dropdown */}
                      <select
                        value={filter.table}
                        onChange={(e) => updateFilter(index, 'table', e.target.value)}
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 10px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
                      >
                        {activeTables.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>

                      {/* Column Dropdown */}
                      <select
                        value={filter.column}
                        onChange={(e) => updateFilter(index, 'column', e.target.value)}
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 10px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
                      >
                        {cols.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        {cols.length === 0 && <option value="">No selected columns</option>}
                      </select>

                      {/* Operator Dropdown */}
                      <select
                        value={filter.operator}
                        onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 10px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
                      >
                        {operators.map((op) => (
                          <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                      </select>

                      {/* Value Input */}
                      {isNullOp ? (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', paddingLeft: '8px', fontStyle: 'italic' }}>
                          (Value omitted)
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={filter.value}
                          onChange={(e) => updateFilter(index, 'value', e.target.value)}
                          placeholder="e.g. active, 42, John%"
                          style={{
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            padding: '7px 10px',
                            fontSize: '0.78rem',
                            color: 'var(--text-primary)',
                            width: '100%'
                          }}
                        />
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFilter(index)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={addFilter}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={13} />
              Add Filter condition
            </button>
          </div>
        )}

        {/* ORDER BY TAB */}
        {activeTab === 'orderBy' && (
          <div className="animate-fade-in">
            {orderBy.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                No sorting defined. Results will be returned in database insertion order.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                {orderBy.map((ord, index) => {
                  const cols = getTableColumns(ord.table);
                  return (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.2fr auto', gap: '10px', alignItems: 'center' }}>
                      {/* Table Dropdown */}
                      <select
                        value={ord.table}
                        onChange={(e) => updateOrderBy(index, 'table', e.target.value)}
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 10px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
                      >
                        {activeTables.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>

                      {/* Column Dropdown */}
                      <select
                        value={ord.column}
                        onChange={(e) => updateOrderBy(index, 'column', e.target.value)}
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 10px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
                      >
                        {cols.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        {cols.length === 0 && <option value="">No selected columns</option>}
                      </select>

                      {/* Direction Dropdown */}
                      <select
                        value={ord.direction}
                        onChange={(e) => updateOrderBy(index, 'direction', e.target.value)}
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 10px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
                      >
                        <option value="ASC">Ascending (ASC)</option>
                        <option value="DESC">Descending (DESC)</option>
                      </select>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeOrderBy(index)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={addOrderBy}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={13} />
              Add Sorting rule
            </button>
          </div>
        )}

        {/* GROUP BY TAB */}
        {activeTab === 'groupBy' && (
          <div className="animate-fade-in">
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Select fields to group by. Grouping is typically required when generating summaries using aggregate functions.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
              {activeTables.map((tName) => {
                const cols = getTableColumns(tName);
                return cols.map((col) => {
                  const key = `${tName}.${col}`;
                  const isChecked = groupBy.includes(key);
                  return (
                    <label
                      key={key}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                        background: isChecked ? 'rgba(56, 189, 248, 0.08)' : 'var(--surface-2)',
                        border: isChecked ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid var(--border)',
                        borderRadius: '6px', fontSize: '0.76rem', color: 'var(--text-primary)', cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleGroupBy(key)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{tName}.{col}</span>
                    </label>
                  );
                });
              })}
            </div>
          </div>
        )}

        {/* HAVING TAB */}
        {activeTab === 'having' && (
          <div className="animate-fade-in">
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Define aggregation conditions filtering grouped records. Use aggregate functions like <code>COUNT(table.id)</code> or <code>SUM(table.column)</code>.
            </p>
            {having.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                No aggregate conditions defined.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                {having.map((hav, index) => {
                  const isNullOp = hav.operator === 'IS NULL' || hav.operator === 'IS NOT NULL';
                  return (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 1fr 1.5fr auto', gap: '10px', alignItems: 'center' }}>
                      {/* Table Dropdown */}
                      <select
                        value={hav.table}
                        onChange={(e) => updateHaving(index, 'table', e.target.value)}
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 10px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
                      >
                        {activeTables.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>

                      {/* Custom Expression Input */}
                      <input
                        type="text"
                        value={hav.column}
                        onChange={(e) => updateHaving(index, 'column', e.target.value)}
                        placeholder="e.g. COUNT(orders.id), SUM(orders.total)"
                        style={{
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          padding: '7px 10px',
                          fontSize: '0.78rem',
                          color: 'var(--text-primary)',
                          width: '100%'
                        }}
                      />

                      {/* Operator Dropdown */}
                      <select
                        value={hav.operator}
                        onChange={(e) => updateHaving(index, 'operator', e.target.value)}
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 10px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
                      >
                        {operators.map((op) => (
                          <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                      </select>

                      {/* Value Input */}
                      {isNullOp ? (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', paddingLeft: '8px', fontStyle: 'italic' }}>
                          (Value omitted)
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={hav.value}
                          onChange={(e) => updateHaving(index, 'value', e.target.value)}
                          placeholder="e.g. 5, 1000"
                          style={{
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            padding: '7px 10px',
                            fontSize: '0.78rem',
                            color: 'var(--text-primary)',
                            width: '100%'
                          }}
                        />
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeHaving(index)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={addHaving}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={13} />
              Add Aggregation rule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
