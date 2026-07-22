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

  // Load saved templates from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTemplates(JSON.parse(saved));
      } else {
        // Initial sample template
        const defaultTemplates = [
          {
            id: 'sample-1',
            name: 'Quick Overview',
            description: 'Sample template selection',
            selected: selectedColumns || {},
            createdAt: new Date().toISOString()
          }
        ];
        setTemplates(defaultTemplates);
      }
    } catch (e) {
      console.error('Failed to load templates from localStorage:', e);
    }
  }, []);

  // Save templates array to localStorage
  const saveTemplatesToStorage = (updatedTemplates) => {
    setTemplates(updatedTemplates);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    } catch (e) {
      console.error('Failed to save templates to localStorage:', e);
    }
  };

  // Count columns selected in current workspace
  const currentColsCount = Object.values(selectedColumns || {}).reduce((acc, cols) => acc + (cols?.length || 0), 0);

  // Handle Save Template Form Submit
  const handleSaveTemplate = (e) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    const newTpl = {
      id: 'tpl_' + Date.now(),
      name: newTemplateName.trim(),
      description: newTemplateDesc.trim() || `${currentColsCount} columns selected`,
      selected: { ...selectedColumns },
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [newTpl, ...templates];
    saveTemplatesToStorage(updated);

    setNewTemplateName('');
    setNewTemplateDesc('');
    setIsSaving(false);
    showToast(`Template "${newTpl.name}" saved locally!`);
  };

  // Delete template confirmation handlers
  const handlePromptDelete = (tpl, e) => {
    e.stopPropagation();
    setTemplateToDelete(tpl);
  };

  const handleConfirmDelete = () => {
    if (!templateToDelete) return;
    const updated = templates.filter(t => t.id !== templateToDelete.id);
    saveTemplatesToStorage(updated);
    showToast(`Template "${templateToDelete.name}" removed`);
    setTemplateToDelete(null);
  };

  const showToast = (msg) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  return (
    <div className="panel panel-amber" style={{ padding: '20px 24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#0a194f',
            border: '1px solid #0077b6',
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bookmark size={18} color="#00b4d8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#caf0f8' }}>
              Report Templates
              <span className="badge badge-pk" style={{ fontSize: '0.68rem' }}>Temporary Local</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#90e0ef' }}>
              Save & reuse column selections for quick report generation.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Save Current Selection */}
          <button
            onClick={() => setIsSaving(true)}
            className="btn btn-secondary"
            disabled={currentColsCount === 0}
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            title={currentColsCount === 0 ? 'Select columns first to save a template' : 'Save current selection as a template'}
          >
            <Plus size={15} />
            Save Current as Template
          </button>

          {/* Cloud Sync / Login (Under Development) */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="btn"
            style={{
              background: '#0a194f',
              border: '1px solid #0077b6',
              color: '#caf0f8',
              fontSize: '0.82rem',
              padding: '6px 14px'
            }}
          >
            <Lock size={14} />
            Save to Cloud (Login)
          </button>
        </div>
      </div>

      {/* Save Template Modal / Input Form */}
      {isSaving && (
        <form onSubmit={handleSaveTemplate} className="animate-fade-in" style={{
          background: '#030838',
          border: '1px solid #0077b6',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#caf0f8' }}>
              Save New Report Template ({currentColsCount} columns selected)
            </h4>
            <button type="button" onClick={() => setIsSaving(false)} style={{ background: 'none', border: 'none', color: '#00b4d8', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input
              type="text"
              placeholder="Template Name (e.g. Sales Overview)"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              required
              autoFocus
              style={{
                padding: '8px 12px',
                background: '#0a194f',
                border: '1px solid #0077b6',
                borderRadius: 'var(--radius-sm)',
                color: '#caf0f8',
                fontSize: '0.85rem'
              }}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTemplateDesc}
              onChange={(e) => setNewTemplateDesc(e.target.value)}
              style={{
                padding: '8px 12px',
                background: '#0a194f',
                border: '1px solid #0077b6',
                borderRadius: 'var(--radius-sm)',
                color: '#caf0f8',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={() => setIsSaving(false)} className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '4px 14px', fontSize: '0.8rem' }}>
              <Check size={14} /> Save Template
            </button>
          </div>
        </form>
      )}

      {/* Templates List */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {templates.length === 0 ? (
          <div style={{ fontSize: '0.82rem', color: '#00b4d8', fontStyle: 'italic' }}>
            No saved templates yet. Select columns above and click "Save Current as Template".
          </div>
        ) : (
          templates.map(tpl => {
            const colsCount = Object.values(tpl.selected || {}).reduce((acc, c) => acc + (c?.length || 0), 0);
            return (
              <div
                key={tpl.id}
                onClick={() => onApplyTemplate(tpl.selected)}
                style={{
                  background: '#030838',
                  border: '1px solid #0077b6',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00b4d8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#0077b6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FolderHeart size={18} color="#00b4d8" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#caf0f8' }}>
                    {tpl.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#90e0ef' }}>
                    {colsCount} columns • {tpl.description}
                  </div>
                </div>

                <button
                  onClick={(e) => handlePromptDelete(tpl, e)}
                  title="Delete template"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00b4d8',
                    cursor: 'pointer',
                    padding: '4px',
                    marginLeft: '4px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#00b4d8'; }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Toast notification */}
      {activeToast && (
        <div style={{
          marginTop: '12px',
          fontSize: '0.8rem',
          color: '#00b4d8',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Sparkles size={14} />
          <span>{activeToast}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {templateToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 8, 56, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="panel animate-fade-in" style={{ padding: '28px 32px', maxWidth: '440px', width: '90%', textAlign: 'center', borderLeft: '4px solid #f87171' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'rgba(248, 113, 113, 0.15)',
              border: '1px solid #f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Trash2 size={24} color="#f87171" />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#caf0f8' }}>
              Delete Template?
            </h3>
            <p style={{ color: '#90e0ef', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '24px' }}>
              Are you sure you want to delete <strong style={{ color: '#caf0f8' }}>"{templateToDelete.name}"</strong>? This template will be permanently removed.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                className="btn btn-secondary"
                style={{ padding: '10px', fontSize: '0.88rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn btn-danger"
                style={{ padding: '10px', fontSize: '0.88rem' }}
              >
                Delete Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Under Development Cloud Login Modal */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 8, 56, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="panel animate-fade-in" style={{ padding: '32px', maxWidth: '460px', width: '90%', textAlign: 'center', borderLeft: '4px solid #00b4d8' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: '#0a194f',
              border: '1px solid #0077b6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Lock size={26} color="#00b4d8" />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px', color: '#caf0f8' }}>
              Cloud Template Sync
            </h3>
            <span className="badge badge-pk" style={{ marginBottom: '16px' }}>
              ⚠️ Feature Under Development
            </span>

            <p style={{ color: '#90e0ef', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '24px' }}>
              User authentication and cloud template database persistence are currently under active development!
              <br /><br />
              In the meantime, your report templates are safely saved in your <strong>browser session (Local Storage)</strong> and ready to use anytime.
            </p>

            <button
              onClick={() => setShowLoginModal(false)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px' }}
            >
              Got it, continue with Local Templates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}






