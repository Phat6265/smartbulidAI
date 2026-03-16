// Project Quotation Service
import apiClient from './apiClient';

/**
 * Get project quotation estimate
 * @param {Object} projectData - { projectType, area, rooms, completionLevel }
 * @returns {Promise}
 */
export const getProjectQuotation = async (projectData) => {
  try {
    // Get all project quotations from json-server
    // json-server returns projectQuotations as an object, not an array
    const response = await apiClient.get('/projectQuotations');
    // json-server returns the object directly
    const projectQuotations = response;
    
    // Get the specific project type template
    const template = projectQuotations?.[projectData.projectType];
    
    if (!template) {
      throw new Error(`Không tìm thấy template cho loại công trình: ${projectData.projectType}`);
    }
    
    // Calculate based on area and completion level
    const area = projectData.area || 80;
    const completionMultiplier = projectData.completionLevel === 'hoan-thien' ? 1.5 : 
                                 projectData.completionLevel === 'ban-hoan-thien' ? 1.2 : 1.0;

    const materials = template.materials.map(m => {
      const quantity = Math.round(m.quantityPerM2 * area * completionMultiplier);
      return {
        name: m.name,
        quantity: quantity,
        unit: m.unit,
        price: m.price,
        total: quantity * m.price
      };
    });

    const totalPrice = materials.reduce((sum, m) => sum + m.total, 0);

    return {
      data: {
        materials,
        totalPrice
      }
    };
  } catch (error) {
    throw error;
  }
};
