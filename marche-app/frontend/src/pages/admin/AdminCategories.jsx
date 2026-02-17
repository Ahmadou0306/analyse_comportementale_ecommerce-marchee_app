import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { getCategoryIcon } from '../../utils/categoryIcons';
import AdminModal from '../../components/Admin/AdminModal';
import './AdminCategories.css';

const emptyForm = { slug: '', name: '' };

export default function AdminCategories() {
  const { categoriesList, productsList, addCategory, updateCategory, deleteCategory } = useAdmin();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ slug: cat.slug, name: cat.name });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      if (editing) {
        await updateCategory(editing.id, { name: form.name, slug: form.slug });
        showToast('ok', 'Catégorie mise à jour');
      } else {
        const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await addCategory({ slug, name: form.name });
        showToast('ok', 'Catégorie ajoutée');
      }
      setModalOpen(false);
    } catch (err) {
      showToast('err', err.message || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteCategory(deleteConfirm.id);
        showToast('ok', 'Catégorie supprimée');
      } catch (err) {
        showToast('err', err.message || 'Erreur');
      }
      setDeleteConfirm(null);
    }
  };

  const canSave = form.name && !submitting;

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Catégories</h1>
          <p>{categoriesList.length} catégorie(s)</p>
        </div>
        <button className="admin-btn-primary" onClick={openAdd}>
          <FiPlus size={16} /> Ajouter
        </button>
      </div>

      <div className="admin-categories-grid">
        {categoriesList.map((cat) => {
          const count = productsList.filter((p) => p.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="admin-cat-card">
              <div className="admin-cat-icon">{getCategoryIcon(cat.slug)}</div>
              <div className="admin-cat-info">
                <h3>{cat.name}</h3>
                <span className="admin-cat-slug">{cat.slug}</span>
                <span className="admin-cat-count">{count} produit(s)</span>
              </div>
              <div className="admin-cat-actions">
                <button className="admin-action-btn edit" onClick={() => openEdit(cat)} title="Modifier">
                  <FiEdit2 size={15} />
                </button>
                <button className="admin-action-btn delete" onClick={() => setDeleteConfirm(cat)} title="Supprimer">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}>
        {!editing && (
          <div className="form-group">
            <label className="form-label">Identifiant (slug)</label>
            <input className="form-input" value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="ex: electronics (auto-généré si vide)" />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Nom de la catégorie *</label>
          <input className="form-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ex: Électronique" />
        </div>
        <div className="form-group" style={{ color: 'var(--text-muted)', fontSize: '.8125rem' }}>
          L'icône est automatiquement assignée selon l'identifiant de la catégorie.
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={!canSave} style={{ marginTop: 8 }}>
          {submitting ? 'Enregistrement...' : editing ? 'Enregistrer' : 'Ajouter la catégorie'}
        </button>
      </AdminModal>

      <AdminModal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmer la suppression">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: '.9rem', lineHeight: 1.6 }}>
          Êtes-vous sûr de vouloir supprimer la catégorie <strong>{deleteConfirm?.name}</strong> ?
        </p>
        {deleteConfirm && productsList.filter((p) => p.categoryId === deleteConfirm.id).length > 0 && (
          <p style={{ color: 'var(--coral)', fontSize: '.8125rem', marginBottom: 16, fontWeight: 500 }}>
            Attention : {productsList.filter((p) => p.categoryId === deleteConfirm.id).length} produit(s) sont liés à cette catégorie.
          </p>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" style={{ marginTop: 0 }} onClick={() => setDeleteConfirm(null)}>Annuler</button>
          <button className="btn-primary" style={{ background: 'var(--coral)' }} onClick={handleDelete}>Supprimer</button>
        </div>
      </AdminModal>
    </div>
  );
}
