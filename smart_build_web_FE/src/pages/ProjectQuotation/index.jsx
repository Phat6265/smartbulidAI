// Project Quotation Page
import React, { useMemo, useState } from 'react';
import { PROJECT_TYPES, COMPLETION_LEVELS } from '../../utils/constants';
import useProjectQuotationStore from '../../store/projectQuotation.store';
import { formatCurrency } from '../../utils/formatCurrency';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';
import useQuotationStore from '../../store/quotation.store';
import nhaCap4Img from '../../assets/img/nha-cap-4.jpg';
import nha1TangImg from '../../assets/img/nha-1-tang.jpg';
import nha2TangImg from '../../assets/img/nha-2-tang.jpg';
import nhaTroImg from '../../assets/img/nha-tro.jpg';
import './ProjectQuotation.css';

// Project image mapping
const PROJECT_IMAGES = {
  'nha-cap-4.jpg': nhaCap4Img,
  'nha-1-tang.jpg': nha1TangImg,
  'nha-2-tang.jpg': nha2TangImg,
  'nha-tro.jpg': nhaTroImg
};

const ProjectQuotation = () => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState('');
  const [projectData, setProjectData] = useState({
    area: '',
    bedrooms: '',
    livingrooms: false,
    bathrooms: '',
    kitchens: false,
    garage: false,
    completionLevel: 'tho'
  });
  const { projectQuotation, loading, error, getProjectQuotation } = useProjectQuotationStore();
  const { createQuotation } = useQuotationStore();

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [sending, setSending] = useState(false);

  const projectTypeName = useMemo(() => {
    const p = PROJECT_TYPES.find((x) => x.id === selectedProject);
    return p?.name || selectedProject;
  }, [selectedProject]);

  // Get field labels based on selected project type
  const getFieldLabels = () => {
    const projectType = PROJECT_TYPES.find(p => p.id === selectedProject);
    if (!projectType) return {};
    
    const labels = {
      'nha-cap-4': {
        bedrooms: 'Số phòng ngủ',
        livingrooms: 'Số phòng khách',
        bathrooms: 'Số phòng tắm/WC',
        kitchens: 'Số nhà bếp',
        garage: 'Nhà xe/kho'
      },
      'nha-1-tang': {
        bedrooms: 'Số phòng ngủ',
        livingrooms: 'Số phòng khách',
        bathrooms: 'Số phòng tắm/WC',
        kitchens: 'Số nhà bếp',
        garage: 'Nhà xe'
      },
      'nha-2-tang': {
        bedrooms: 'Số phòng ngủ',
        livingrooms: 'Số phòng khách',
        bathrooms: 'Số phòng tắm/WC',
        kitchens: 'Số nhà bếp',
        garage: 'Nhà xe'
      },
      'nha-tro': {
        bedrooms: 'Số phòng trọ',
        livingrooms: 'Phòng tiếp khách',
        bathrooms: 'Số WC riêng/chung',
        kitchens: 'Khu bếp chung',
        garage: 'Chỗ để xe'
      }
    };
    return labels[selectedProject] || {};
  };

  // Get which fields are checkboxes for specific project types
  const getCheckboxFields = () => {
    if (selectedProject === 'nha-tro') {
      return ['livingrooms', 'kitchens', 'garage'];
    }
    return ['garage'];
  };

  const isCheckboxField = (fieldName) => {
    return getCheckboxFields().includes(fieldName);
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = async () => {
    if (!selectedProject || !projectData.area) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await getProjectQuotation({
        projectType: selectedProject,
        area: parseFloat(projectData.area),
        bedrooms: parseInt(projectData.bedrooms) || 0,
        livingrooms: isCheckboxField('livingrooms') ? (projectData.livingrooms ? 1 : 0) : (parseInt(projectData.livingrooms) || 0),
        bathrooms: parseInt(projectData.bathrooms) || 0,
        kitchens: isCheckboxField('kitchens') ? (projectData.kitchens ? 1 : 0) : (parseInt(projectData.kitchens) || 0),
        garage: projectData.garage ? 1 : 0,
        completionLevel: projectData.completionLevel
      });
      setStep(3);
    } catch (err) {
      console.error('Error calculating project quotation:', err);
      alert(err?.message || 'Có lỗi xảy ra khi tính toán báo giá. Vui lòng kiểm tra backend MERN đang chạy.');
    }
  };

  const openSendModal = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để gửi yêu cầu báo giá');
      return;
    }
    if (!projectQuotation?.materials?.length) {
      alert('Chưa có dữ liệu báo giá để gửi');
      return;
    }
    setIsSendModalOpen(true);
  };

  const handleSendRequest = async () => {
    if (!location.trim()) {
      alert('Vui lòng nhập địa điểm công trình');
      return;
    }
    if (!user?._id && !user?.id) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }
    setSending(true);
    try {
      const items = (projectQuotation.materials || []).map((m) => ({
        materialId: m.materialId || '',
        name: m.name,
        quantity: m.quantity,
        unit: m.unit || ''
      }));

      await createQuotation({
        customerId: user._id || user.id,
        customerName: user.name || user.email,
        location: location.trim(),
        items,
        totalPrice: projectQuotation.totalPrice,
        source: 'project',
        project: {
          projectType: selectedProject,
          projectTypeName,
          input: {
            ...projectData,
            area: parseFloat(projectData.area)
          }
        }
      });

      alert('Đã gửi yêu cầu báo giá công trình thành công!');
      setIsSendModalOpen(false);
      setLocation('');
    } catch (err) {
      alert(err?.message || 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setSending(false);
    }
  };

  const tableColumns = projectQuotation?.materials
    ? [
        { header: 'Tên vật liệu', accessor: 'name' },
        { header: 'Số lượng', accessor: 'quantity' },
        { header: 'Đơn vị', accessor: 'unit' },
        {
          header: 'Đơn giá',
          accessor: 'price',
          render: (value) => formatCurrency(value)
        },
        {
          header: 'Thành tiền',
          accessor: 'total',
          render: (value) => formatCurrency(value)
        }
      ]
    : [];

  return (
    <div className="project-quotation">
      <div className="container">
        <h1 className="project-quotation-title">Báo giá công trình</h1>

        {step === 1 && (
          <div className="project-quotation-step">
            <h2>Chọn loại công trình</h2>
            <div className="project-quotation-projects">
              {PROJECT_TYPES.map((project) => (
                <div
                  key={project.id}
                  className="project-quotation-card"
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <div className="project-quotation-icon">
                    <img 
                      src={PROJECT_IMAGES[project.imagePath]} 
                      alt={project.name}
                      className="project-quotation-icon-img"
                    />
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="project-quotation-error">
            <p>{error}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
              Vui lòng kiểm tra backend MERN đang chạy.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="project-quotation-step">
            <h2>Nhập thông tin công trình</h2>
            <div className="project-quotation-form">
              <Input
                label="Diện tích (m²) *"
                type="number"
                name="area"
                value={projectData.area}
                onChange={handleInputChange}
                required
                fullWidth
              />
              
              <div className="project-quotation-fields-grid">
                <Input
                  label={getFieldLabels().bedrooms || 'Số phòng ngủ'}
                  type="number"
                  name="bedrooms"
                  value={projectData.bedrooms}
                  onChange={handleInputChange}
                  fullWidth
                />
                <Input
                  label={getFieldLabels().bathrooms || 'Số phòng tắm/WC'}
                  type="number"
                  name="bathrooms"
                  value={projectData.bathrooms}
                  onChange={handleInputChange}
                  fullWidth
                />
                {!isCheckboxField('kitchens') ? (
                  <Input
                    label={getFieldLabels().kitchens || 'Số nhà bếp'}
                    type="number"
                    name="kitchens"
                    value={projectData.kitchens}
                    onChange={handleInputChange}
                    fullWidth
                  />
                ) : (
                  <div className="project-quotation-checkbox-wrapper">
                    <label className="project-quotation-checkbox-label">
                      <input
                        type="checkbox"
                        name="kitchens"
                        checked={projectData.kitchens}
                        onChange={(e) => setProjectData(prev => ({ ...prev, kitchens: e.target.checked }))}
                      />
                      <span>{getFieldLabels().kitchens || 'Khu bếp chung'}</span>
                    </label>
                  </div>
                )}

                {!isCheckboxField('livingrooms') ? (
                  <Input
                    label={getFieldLabels().livingrooms || 'Số phòng khách'}
                    type="number"
                    name="livingrooms"
                    value={projectData.livingrooms}
                    onChange={handleInputChange}
                    fullWidth
                  />
                ) : (
                  <div className="project-quotation-checkbox-wrapper">
                    <label className="project-quotation-checkbox-label">
                      <input
                        type="checkbox"
                        name="livingrooms"
                        checked={projectData.livingrooms}
                        onChange={(e) => setProjectData(prev => ({ ...prev, livingrooms: e.target.checked }))}
                      />
                      <span>{getFieldLabels().livingrooms || 'Phòng tiếp khách'}</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="project-quotation-checkbox-wrapper">
                <label className="project-quotation-checkbox-label">
                  <input
                    type="checkbox"
                    name="garage"
                    checked={projectData.garage}
                    onChange={(e) => setProjectData(prev => ({ ...prev, garage: e.target.checked }))}
                  />
                  <span>{getFieldLabels().garage || 'Có nhà xe/kho'}</span>
                </label>
              </div>

              <div className="project-quotation-radio-group">
                <label>Mức hoàn thiện:</label>
                {COMPLETION_LEVELS.map((level) => (
                  <label key={level.id} className="project-quotation-radio">
                    <input
                      type="radio"
                      name="completionLevel"
                      value={level.id}
                      checked={projectData.completionLevel === level.id}
                      onChange={handleInputChange}
                    />
                    {level.name}
                  </label>
                ))}
              </div>
              <div className="project-quotation-actions">
                <Button variant="outline-brown" onClick={() => setStep(1)}>
                  Quay lại
                </Button>
                <Button variant="primary" onClick={handleCalculate} loading={loading}>
                  Tính toán
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && projectQuotation && (
          <div className="project-quotation-step">
            <h2>Báo giá chi tiết</h2>
            <Table columns={tableColumns} data={projectQuotation.materials || []} />
            <div className="project-quotation-total">
              <p className="project-quotation-total-label">Tổng chi phí dự kiến:</p>
              <p className="project-quotation-total-amount">
                {formatCurrency(projectQuotation.totalPrice)}
              </p>
            </div>
            <div className="project-quotation-actions">
              <Button variant="outline-brown" onClick={() => setStep(1)}>
                Tính lại
              </Button>
              <Button variant="primary" onClick={openSendModal}>
                Gửi yêu cầu báo giá
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isSendModalOpen}
        onClose={() => (sending ? null : setIsSendModalOpen(false))}
        title="Gửi yêu cầu báo giá công trình"
        size="medium"
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
            Yêu cầu sẽ được gửi kèm bảng vật liệu và tổng chi phí dự kiến.
          </p>
          <Input
            label="Địa điểm công trình *"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ví dụ: Thủ Đức, TP.HCM"
            fullWidth
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 8 }}>
            <Button
              variant="outline-brown"
              type="button"
              onClick={() => setIsSendModalOpen(false)}
              disabled={sending}
            >
              Hủy
            </Button>
            <Button variant="primary" type="button" onClick={handleSendRequest} loading={sending}>
              Gửi yêu cầu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectQuotation;

