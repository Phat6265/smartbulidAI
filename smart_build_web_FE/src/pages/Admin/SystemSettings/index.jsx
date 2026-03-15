// ===== NEW FILE CREATED FOR SYSTEM SETTINGS FEATURE =====
import React, { useEffect } from 'react';
import useSystemSettingStore from '../../../store/systemSetting.store';
import { useNotification } from '../../../components/common/NotificationCenter';
import WebsiteSettingsForm from './WebsiteSettingsForm';
import ShippingSettingsForm from './ShippingSettingsForm';
import CompanyInfoForm from './CompanyInfoForm';
import '../Admin.css';
import './SystemSettings.css';

const AdminSystemSettingsPage = () => {
  const { settings, loading, error, fetchSettings, updateSiteSettings, updateShippingSettings, updateCompanySettings } = useSystemSettingStore();
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    fetchSettings().catch(() => {});
  }, [fetchSettings]);

  const handleSaveSite = async (data) => {
    try {
      await updateSiteSettings(data);
      notifySuccess('Đã lưu cấu hình website');
    } catch (err) {
      notifyError(err?.message || 'Lưu thất bại');
    }
  };

  const handleSaveShipping = async (data) => {
    try {
      await updateShippingSettings(data);
      notifySuccess('Đã lưu cấu hình vận chuyển');
    } catch (err) {
      notifyError(err?.message || 'Lưu thất bại');
    }
  };

  const handleSaveCompany = async (data) => {
    try {
      await updateCompanySettings(data);
      notifySuccess('Đã lưu thông tin công ty');
    } catch (err) {
      notifyError(err?.message || 'Lưu thất bại');
    }
  };

  return (
    <div className="admin-page-section">
      <h2>Cài đặt hệ thống</h2>
      {error && <p style={{ color: 'var(--color-error)', marginBottom: 16 }}>{error}</p>}
      {loading && !settings ? (
        <p>Đang tải...</p>
      ) : (
        <div className="admin-system-settings-sections">
          <section className="admin-settings-section">
            <WebsiteSettingsForm settings={settings} onSave={handleSaveSite} loading={loading} />
          </section>
          <section className="admin-settings-section">
            <ShippingSettingsForm settings={settings} onSave={handleSaveShipping} loading={loading} />
          </section>
          <section className="admin-settings-section">
            <CompanyInfoForm settings={settings} onSave={handleSaveCompany} loading={loading} />
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminSystemSettingsPage;
