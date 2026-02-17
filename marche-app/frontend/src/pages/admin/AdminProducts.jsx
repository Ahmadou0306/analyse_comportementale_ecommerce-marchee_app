import { useState, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUpload, FiX, FiLink } from 'react-icons/fi';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../data/products';
import AdminModal from '../../components/Admin/AdminModal';
import { resolveImageUrl } from '../../utils/api';
import './AdminProducts.css';

const emptyForm = {
  name: '', categoryId: '', price: '', oldPrice: '', description: '', image: '', rating: '4', tag: '',
};

export default function AdminProducts() {
  const { productsList, categoriesList, addProduct, updateProduct, deleteProduct } = useAdmin();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Upload image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const fileInputRef = useRef(null);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview('');
    setImageMode('upload');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    resetImageState();
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      categoryId: String(product.categoryId),
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      description: product.description || '',
      image: product.image,
      rating: String(product.rating),
      tag: product.tag || '',
    });
    setImageFile(null);
    setImagePreview(resolveImageUrl(product.image));
    setImageMode(product.image.startsWith('http') ? 'url' : 'upload');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setModalOpen(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    update('image', ''); // Clear URL input when file is selected
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    update('image', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const data = {
        name: form.name,
        categoryId: Number(form.categoryId),
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        description: form.description,
        image: form.image || undefined,
        rating: Number(form.rating),
        tag: form.tag || null,
      };

      if (editing) {
        await updateProduct(editing.id, data, imageFile || undefined);
        showToast('✅', 'Produit mis à jour');
      } else {
        await addProduct(data, imageFile || undefined);
        showToast('✅', 'Produit ajouté');
      }
      setModalOpen(false);
      resetImageState();
    } catch (err) {
      showToast('⚠️', err.message || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteProduct(deleteConfirm.id);
        showToast('🗑', 'Produit supprimé');
      } catch (err) {
        showToast('⚠️', err.message || 'Erreur');
      }
      setDeleteConfirm(null);
    }
  };

  const hasImage = imageFile || form.image;
  const canSave = form.name && form.categoryId && form.price && hasImage && !submitting;

  const filtered = search
    ? productsList.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : productsList;

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Produits</h1>
          <p>{productsList.length} produit(s) au total</p>
        </div>
        <button className="admin-btn-primary" onClick={openAdd}>
          <FiPlus size={16} /> Ajouter
        </button>
      </div>

      <div className="admin-search-bar">
        <FiSearch size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit..." />
      </div>

      <div className="admin-card" style={{ marginTop: 16 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={resolveImageUrl(p.image)} alt={p.name} className="admin-product-thumb" onError={(e) => { e.target.src = '/placeholder.svg'; }} />
                  </td>
                  <td>
                    <div className="admin-product-name">{p.name}</div>
                  </td>
                  <td>
                    <span className="admin-cat-badge">{p.category?.name || '-'}</span>
                  </td>
                  <td className="admin-table-bold">{formatPrice(p.price)}</td>
                  <td>
                    {p.tag && <span className={`admin-tag admin-tag--${p.tag}`}>{p.tag}</span>}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn edit" onClick={() => openEdit(p)} title="Modifier">
                        <FiEdit2 size={15} />
                      </button>
                      <button className="admin-action-btn delete" onClick={() => setDeleteConfirm(p)} title="Supprimer">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Aucun produit trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal open={modalOpen} onClose={() => { setModalOpen(false); resetImageState(); }} title={editing ? 'Modifier le produit' : 'Ajouter un produit'}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nom du produit *</label>
            <input className="form-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ex: Casque Audio Pro" />
          </div>
          <div className="form-group">
            <label className="form-label">Catégorie *</label>
            <select className="form-input" value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
              <option value="">Sélectionner</option>
              {categoriesList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Prix (FC) *</label>
            <input className="form-input" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="45000" />
          </div>
          <div className="form-group">
            <label className="form-label">Ancien prix (FC)</label>
            <input className="form-input" type="number" value={form.oldPrice} onChange={(e) => update('oldPrice', e.target.value)} placeholder="Optionnel" />
          </div>
        </div>

        {/* Image upload section */}
        <div className="form-group">
          <label className="form-label">Image du produit *</label>
          <div className="admin-image-mode-tabs">
            <button
              type="button"
              className={`admin-image-tab ${imageMode === 'upload' ? 'active' : ''}`}
              onClick={() => setImageMode('upload')}
            >
              <FiUpload size={14} /> Uploader
            </button>
            <button
              type="button"
              className={`admin-image-tab ${imageMode === 'url' ? 'active' : ''}`}
              onClick={() => setImageMode('url')}
            >
              <FiLink size={14} /> URL web
            </button>
          </div>

          {imageMode === 'upload' ? (
            <div className="admin-image-upload-zone">
              {imagePreview && !form.image ? (
                <div className="admin-image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" className="admin-image-remove" onClick={removeImage} title="Supprimer">
                    <FiX size={16} />
                  </button>
                </div>
              ) : editing && !imageFile && !form.image && imagePreview ? (
                <div className="admin-image-preview">
                  <img src={imagePreview} alt="Current" />
                  <button type="button" className="admin-image-remove" onClick={removeImage} title="Supprimer">
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className="admin-image-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUpload size={24} style={{ opacity: 0.4 }} />
                  <span>Cliquez pour choisir une image</span>
                  <span style={{ fontSize: '.75rem', opacity: 0.5 }}>JPG, PNG, WebP - Max 5MB</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div>
              <input
                className="form-input"
                value={form.image}
                onChange={(e) => {
                  update('image', e.target.value);
                  setImageFile(null);
                  setImagePreview(e.target.value);
                }}
                placeholder="https://exemple.com/image.jpg"
              />
              {form.image && (
                <div className="admin-image-preview" style={{ marginTop: 8 }}>
                  <img src={form.image} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Description du produit..." rows={3} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Note (1-5)</label>
            <select className="form-input" value={form.rating} onChange={(e) => update('rating', e.target.value)}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} étoile(s)</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tag</label>
            <select className="form-input" value={form.tag} onChange={(e) => update('tag', e.target.value)}>
              <option value="">Aucun</option>
              <option value="new">Nouveau</option>
              <option value="sale">Promo</option>
              <option value="popular">Populaire</option>
            </select>
          </div>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={!canSave} style={{ marginTop: 8 }}>
          {submitting ? 'Enregistrement...' : editing ? 'Enregistrer' : 'Ajouter le produit'}
        </button>
      </AdminModal>

      <AdminModal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmer la suppression">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '.9rem', lineHeight: 1.6 }}>
          Êtes-vous sûr de vouloir supprimer <strong>{deleteConfirm?.name}</strong> ? Cette action est irréversible.
          {deleteConfirm?.image?.startsWith('/images/uploads/') && (
            <><br />L'image associée sera également supprimée du serveur.</>
          )}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" style={{ marginTop: 0 }} onClick={() => setDeleteConfirm(null)}>Annuler</button>
          <button className="btn-primary" style={{ background: 'var(--coral)' }} onClick={handleDelete}>Supprimer</button>
        </div>
      </AdminModal>
    </div>
  );
}
