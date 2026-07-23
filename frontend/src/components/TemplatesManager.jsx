import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Trash2, Check, Lock, Sparkles, FolderHeart, X } from 'lucide-react';

const STORAGE_KEY = 'goreport_saved_templates';

export default function TemplatesManager({ selectedColumns, onApplyTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [activeToast, setActiveToast] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTemplates(JSON.parse(saved));
      } else {
        const defaultTemplates = [{
          id: 'sample-1',
          name: 'Quick Overview',
          description: 'Sample template selection',
          selected: selectedColumns || {},
          createdAt: new Date().toISOString()
        }];
        setTemplates(defaultTemplates);
      }
    } catch (e) {
      console.error('Failed to load templates:', e);
    }
  }, []);

  const saveTemplatesToStorage = (updated) => {
    setTemplates(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (e) {}
  };

  const currentColsCount = Object.values(selectedColumns || {}).reduce((acc, cols) => acc + (cols?.length || 0), 0);

  const handleSaveTemplate = (e) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;
    const newTpl = {
      id: 'tpl_' + Date.now(),
      name: newTemplateName.trim(),
      description: newTemplateDesc.trim() || `${currentColsCount} columns`,
      selected: { ...selectedColumns },
      createdAt: new Date().toLocaleDateString()
    };
    saveTemplatesToStorage([newTpl, ...templates]);
    setNewTemplateName('');
    setNewTemplateDesc('');
    setIsSaving(false);
    showToast(`"${newTpl.name}" saved`);
  };

  const handlePromptDelete = (tpl, e) => { e.stopPropagation(); setTemplateToDelete(tpl); };
  const handleConfirmDelete = () => {
    if (!templateToDelete) return;
    saveTemplatesToStorage(templates.filter(t => t.id !== templateToDelete.id));
    showToast(`"${templateToDelete.name}" removed`);
    setTemplateToDelete(null);
  };

  const showToast = (msg) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const isTemplateActive = (tplSelected) => {
    if (!tplSelected || !selectedColumns) return false;
    const k1 = Object.keys(tplSelected).filter(k => tplSelected[k]?.length > 0).sort();
    const k2 = Object.keys(selectedColumns).filter(k => selectedColumns[k]?.length > 0).sort();
    if (k1.length === 0 || k2.length === 0 || k1.length !== k2.length) return false;
    for (let i = 0; i < k1.length; i++) {
      if (k2[i] !== k1[i]) return false;
      const c1 = [...(tplSelected[k1[i]] || [])].sort();
      const c2 = [...(selectedColumns[k1[i]] || [])].sort();
      if (c1.length !== c2.length || c1.some((col, idx) => col !== c2[idx])) return false;
    }
    return true;
  };

  const inputStyle = {
    padding: '7px 10px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-sans)',
    width: '100%'
  };

  return (
    <div className="panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '260px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bookmark size={16} color="var(--text-muted)" />
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Templates</h3>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>Quick switch & save</p>
          </div>
        </div>
        <span className="badge badge-fk">Local</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button onClick={() => setIsSaving(!isSaving)} className="btn btn-secondary" disabled={currentColsCount === 0}
          style={{ fontSize: '0.78rem', padding: '6px 10px', width: '100%', justifyContent: 'center' }}>
          <Plus size={13} />
          {isSaving ? 'Cancel' : 'Save Selection'}
        </button>
        <button onClick={() => setShowLoginModal(true)} className="btn btn-secondary"
          style={{ fontSize: '0.72rem', padding: '5px 10px', width: '100%', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <Lock size={11} /> Cloud Sync
        </button>
      </div>

      {/* Save Form */}
      {isSaving && (
        <form onSubmit={handleSaveTemplate} className="animate-fade-in" style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '10px',
          display: 'flex', flexDirection: 'column', gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Save ({currentColsCount} cols)</span>
            <button type="button" onClick={() => setIsSaving(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
              <X size={13} />
            </button>
          </div>
          <input type="text" placeholder="Template name" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} required autoFocus style={inputStyle} />
          <input type="text" placeholder="Description (opt)" value={newTemplateDesc} onChange={(e) => setNewTemplateDesc(e.target.value)} style={inputStyle} />
          <button type="submit" className="btn btn-primary" style={{ padding: '6px', fontSize: '0.78rem', width: '100%' }}>
            <Check size={13} /> Save
          </button>
        </form>
      )}

      {/* Toast */}
      {activeToast && (
        <div className="toast-enter" style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 0' }}>
          <Sparkles size={12} /> {activeToast}
        </div>
      )}

      {/* Template List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '480px', overflowY: 'auto' }}>
        {templates.length === 0 ? (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
            No saved templates yet.
          </div>
        ) : (
          templates.map(tpl => {
            const colsCount = Object.values(tpl.selected || {}).reduce((acc, c) => acc + (c?.length || 0), 0);
            const active = isTemplateActive(tpl.selected);
            return (
              <div
                key={tpl.id}
                onClick={() => onApplyTemplate(tpl.selected, tpl)}
                style={{
                  background: active ? 'rgba(0, 119, 182, 0.08)' : 'var(--surface-1)',
                  border: `1px solid ${active ? 'rgba(0, 119, 182, 0.25)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  transition: 'all 0.12s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = active ? 'rgba(0,119,182,0.12)' : 'var(--surface-2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = active ? 'rgba(0,119,182,0.08)' : 'var(--surface-1)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <FolderHeart size={15} color={active ? '#38bdf8' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tpl.name}</span>
                      {active && <span style={{ fontSize: '0.58rem', background: 'rgba(0,119,182,0.2)', color: '#38bdf8', padding: '1px 4px', borderRadius: '2px', fontWeight: 700 }}>Active</span>}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {colsCount} cols · {tpl.description}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handlePromptDelete(tpl, e)}
                  title="Delete"
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '3px', flexShrink: 0, transition: 'color 0.1s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Modal */}
      {templateToDelete && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="panel modal-panel" style={{ padding: '24px 28px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <Trash2 size={22} color="#f87171" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>Delete Template?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.5', marginBottom: '20px' }}>
              Remove <strong style={{ color: 'var(--text-primary)' }}>"{templateToDelete.name}"</strong> permanently?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button type="button" onClick={() => setTemplateToDelete(null)} className="btn btn-secondary" style={{ padding: '8px' }}>Cancel</button>
              <button type="button" onClick={handleConfirmDelete} className="btn btn-danger" style={{ padding: '8px' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Cloud Modal */}
      {showLoginModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="panel modal-panel" style={{ padding: '28px', maxWidth: '420px', width: '90%', textAlign: 'center' }}>
            <Lock size={22} color="var(--grad-blue)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>Cloud Sync</h3>
            <span className="badge badge-pk" style={{ marginBottom: '14px' }}>Coming Soon</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Cloud persistence is under development. Templates are currently stored in your browser's local storage.
            </p>
            <button onClick={() => setShowLoginModal(false)} className="btn btn-primary" style={{ width: '100%', padding: '9px' }}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
