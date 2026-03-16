import React, { useEffect, useMemo, useState } from 'react';
import { getMaterials, updateMaterialStock } from '../../services/material.service';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Admin.css';
import { useNotification } from '../../components/common/NotificationCenter';

const InventoryAdmin = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [draftStock, setDraftStock] = useState({});
  const { notifyError, notifySuccess } = useNotification();

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return materials;
    return materials.filter((m) => (m.name || '').toLowerCase().includes(s));
  }, [materials, search]);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMaterials();
      const list = res.data || [];
      setMaterials(list);
      const init = {};
      list.forEach((m) => {
        const id = m._id || m.id;
        init[id] = typeof m.stockQuantity === 'number' ? m.stockQuantity : 0;
      });
      setDraftStock(init);
    } catch (err) {
      setError(err?.message || 'Không thể tải danh sách vật liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const saveRow = async (m) => {
    const id = m._id || m.id;
    const value = Number(draftStock[id]);
    if (!Number.isFinite(value) || value < 0) {
      notifyError('Số lượng tồn kho không hợp lệ');
      return;
    }
    try {
      await updateMaterialStock(id, value);
      notifySuccess('Đã cập nhật tồn kho');
      setMaterials((prev) => prev.map((x) => ((x._id || x.id) === id ? { ...x, stockQuantity: value } : x)));
    } catch (err) {
      notifyError(err?.message || 'Cập nhật tồn kho thất bại');
    }
  };

  return (
    <div className="admin-page-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Quản lý Tồn kho</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input
            placeholder="Tìm theo tên vật liệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth={false}
          />
          <Button variant="outline-brown" onClick={fetchAll} loading={loading}>
            Tải lại
          </Button>
        </div>
      </div>

      {error ? (
        <p style={{ color: 'var(--color-error)' }}>{error}</p>
      ) : loading ? (
        <p>Đang tải...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên vật liệu</th>
                <th>Tồn kho</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const id = m._id || m.id;
                return (
                  <tr key={id}>
                    <td style={{ minWidth: 280 }}>{m.name}</td>
                    <td style={{ width: 160 }}>
                      <input
                        type="number"
                        min={0}
                        value={draftStock[id] ?? 0}
                        onChange={(e) =>
                          setDraftStock((prev) => ({
                            ...prev,
                            [id]: e.target.value
                          }))
                        }
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid var(--color-border)' }}
                      />
                    </td>
                    <td style={{ width: 180 }}>
                      <Button variant="primary" onClick={() => saveRow(m)}>
                        Lưu
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>
                    Không có vật liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryAdmin;

