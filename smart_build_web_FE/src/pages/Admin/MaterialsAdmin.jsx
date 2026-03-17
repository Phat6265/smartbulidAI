import React, { useEffect, useState } from 'react';
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial
} from '../../services/material.service';
import { MATERIAL_CATEGORIES, SUBCATEGORY_NAMES } from '../../utils/constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input/Input.jsx';
import './Admin.css';
import { useNotification } from '../../components/common/NotificationCenter';
import { FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';

const emptyForm = {
  name: '',
  category: '',
  subcategory: '',
  priceReference: '',
  unit: '',
  description: '',
  imagePath: ''
};

const MaterialsAdmin = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubcategory, setFilterSubcategory] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState({ key: 'name', dir: 'asc' });
  const { notifyError, notifySuccess, confirm } = useNotification();

  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMaterials({
        search,
        category: filterCategory || undefined,
        subcategory: filterSubcategory || undefined
      });
      const items = res.data || [];
      setMaterials(items);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Lỗi khi tải danh sách vật liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || '',
      category: item.category || '',
      subcategory: item.subcategory || '',
      priceReference: item.priceReference || '',
      unit: item.unit || '',
      description: item.description || '',
      imagePath: item.imagePath || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    const confirmed = await confirm({
      title: 'Xác nhận xóa vật liệu',
      message: `Bạn có chắc chắn muốn xóa vật liệu "${item.name}"?`
    });
    if (!confirmed) return;
    try {
      await deleteMaterial(item._id || item.id);
      notifySuccess('Đã xóa vật liệu');
      fetchMaterials();
    } catch (err) {
      notifyError(err.message || 'Xóa thất bại');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, imagePath: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateMaterial(editing._id || editing.id, {
          ...editing,
          ...form,
          priceReference: parseFloat(form.priceReference) || 0
        });
        notifySuccess('Cập nhật vật liệu thành công');
      } else {
        await createMaterial({
          ...form,
          priceReference: parseFloat(form.priceReference) || 0,
          createdAt: new Date().toISOString()
        });
        notifySuccess('Tạo vật liệu mới thành công');
      }
      setIsModalOpen(false);
      fetchMaterials();
    } catch (err) {
      notifyError(err.message || 'Lưu thất bại');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchMaterials();
  };

  return (
    <div className="admin-page-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Quản lý Vật liệu</h2>
        <Button variant="primary" onClick={openCreate}>
          <FiPlus style={{ marginRight: 4 }} /> Thêm vật liệu
        </Button>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <input
          placeholder="Tìm kiếm tên, mô tả..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid var(--color-border)', flex: 2, minWidth: 200 }}
        />
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setFilterSubcategory(''); }}
          style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid var(--color-border)', flex: 1, minWidth: 160 }}
        >
          <option value="">Tất cả danh mục</option>
          {MATERIAL_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={filterSubcategory}
          onChange={(e) => setFilterSubcategory(e.target.value)}
          disabled={!filterCategory}
          style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid var(--color-border)', flex: 1, minWidth: 160, opacity: filterCategory ? 1 : 0.6 }}
        >
          <option value="">Tất cả phân loại</option>
          {filterCategory && MATERIAL_CATEGORIES.find(c => c.id === filterCategory)?.subcategories?.flatMap(sub => {
            // sub ở đây là object { id, name, details }
            return sub.details && sub.details.length
              ? sub.details.map(detailId => ({ id: detailId, label: SUBCATEGORY_NAMES[detailId] || detailId }))
              : [{ id: sub.id, label: sub.name }];
          }).map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
        <Button type="submit" variant="outline-brown">Lọc</Button>
        <Button
          type="button"
          variant="outline-brown"
          onClick={() => {
            setSearch('');
            setFilterCategory('');
            setFilterSubcategory('');
            fetchMaterials();
          }}
        >
          Xóa
        </Button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <button type="button" className="btn" onClick={() => { /* sort toggle */ setSortBy(s => ({ key: 'name', dir: s.dir === 'asc' ? 'desc' : 'asc' })); }}>Sort Name</button>
          <Button variant="outline-brown" onClick={() => {
            import('../../utils/csv').then(mod => {
              const cols = [
                { header: 'Tên', accessor: 'name' },
                { header: 'Danh mục', accessor: (m) => {
                  const cat = MATERIAL_CATEGORIES.find(c => c.id === (m.category || ''));
                  return (cat && cat.name) ? cat.name : (m.category || '');
                } },
                { header: 'Phân loại', accessor: (m) => SUBCATEGORY_NAMES[m.subcategory] || m.subcategory },
                { header: 'Đơn vị', accessor: 'unit' },
                { header: 'Đơn giá', accessor: (m) => m.priceReference }
              ];
              const csv = mod.objectsToCSV(materials, cols);
              mod.downloadCSV(`materials-${Date.now()}.csv`, csv);
            });
          }}>Export CSV</Button>
        </div>

      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p style={{ color: 'var(--color-error)' }}>{error}</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Danh mục</th>
                <th>Phân loại</th>
                <th>Đơn vị</th>
                <th>Đơn giá</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // client-side sort
                const sorted = [...materials].sort((a,b) => {
                  const va = (a[sortBy.key] || '').toString().toLowerCase();
                  const vb = (b[sortBy.key] || '').toString().toLowerCase();
                  if (va < vb) return sortBy.dir === 'asc' ? -1 : 1;
                  if (va > vb) return sortBy.dir === 'asc' ? 1 : -1;
                  return 0;
                });
                const start = (page-1)*perPage;
                const paged = sorted.slice(start, start+perPage);
                return paged.map((m) => (
                <tr key={m._id || m.id}>
                  <td style={{ minWidth: 220 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {m.imagePath ? (
                        <img src={m.imagePath} alt={m.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                      ) : (
                        <div style={{ width: 48, height: 48, background: 'var(--color-bg-secondary)', borderRadius: 6 }} />
                      )}
                      <div>{m.name}</div>
                    </div>
                  </td>
                  <td>{(() => { const cat = MATERIAL_CATEGORIES.find(c => c.id === (m.category || '')); return (cat && cat.name) ? cat.name : (m.category || ''); })()}</td>
                  <td>{SUBCATEGORY_NAMES[m.subcategory] || m.subcategory}</td>
                  <td>{m.unit}</td>
                  <td>{typeof m.priceReference === 'number' ? m.priceReference.toLocaleString() : m.priceReference}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="outline-brown" onClick={() => openEdit(m)}>
                        <FiEdit2 style={{ marginRight: 4 }} /> Sửa
                      </Button>
                      <Button variant="outline-danger" onClick={() => handleDelete(m)}>
                        <FiTrash2 style={{ marginRight: 4 }} /> Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
                ));
              })()}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <div>Page {page}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline-brown" onClick={() => setPage(p => Math.max(1, p-1))}>Prev</Button>
              <Button variant="outline-brown" onClick={() => setPage(p => p+1)}>Next</Button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>{editing ? 'Sửa vật liệu' : 'Thêm vật liệu'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
              <Input label="Tên" name="name" value={form.name} onChange={handleChange} required fullWidth />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="input-label">Danh mục</label>
                  <select 
                    name="category" 
                    value={form.category} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid var(--color-border)' }}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {MATERIAL_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Phân loại</label>
                  <select 
                    name="subcategory" 
                    value={form.subcategory} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid var(--color-border)' }}
                  >
                    <option value="">-- Chọn phân loại --</option>
                    {form.category && MATERIAL_CATEGORIES.find(c => c.id === form.category)?.subcategories?.flatMap(sub => {
                      // sub ở đây là object { id, name, details }
                      return sub.details && sub.details.length
                        ? sub.details.map(detailId => ({ id: detailId, label: SUBCATEGORY_NAMES[detailId] || detailId }))
                        : [{ id: sub.id, label: sub.name }];
                    }).map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input label="Đơn vị" name="unit" value={form.unit} onChange={handleChange} fullWidth />
                <Input label="Đơn giá" type="number" name="priceReference" value={form.priceReference} onChange={handleChange} fullWidth />
              </div>
              <div>
                <label className="input-label">Ảnh</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {form.imagePath && (
                  <div style={{ marginTop: 8 }}>
                    <img src={form.imagePath} alt="preview" style={{ maxWidth: 160, maxHeight: 120, borderRadius: 8 }} />
                  </div>
                )}
              </div>
              <Input label="Mô tả" name="description" value={form.description} onChange={handleChange} fullWidth />

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <Button variant="outline-brown" type="button" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                <Button variant="primary" type="submit">Lưu</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsAdmin;
