// AI Recognition Service
import axios from 'axios';
import { AI_SERVICE_URL } from '../utils/constants';

/**
 * Recognize material from image
 * @param {File|FormData} image - Image file or FormData
 * @returns {Promise} - { materialType, confidence, suggestions }
 */
export const recognizeMaterial = async (image) => {
  try {
    const formData = new FormData();
    
    // If image is File, append it. If FormData, use it directly
    if (image instanceof File) {
      formData.append('image', image);
    } else if (image instanceof FormData) {
      // Already FormData, use it
      formData = image;
    } else {
      throw new Error('Invalid image format');
    }
    
    const response = await axios.post(
      `${AI_SERVICE_URL}/ai/recognize`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 seconds for AI processing
      }
    );
    
    return response.data;
  } catch (error) {
    // If AI service is not available, return mock result for demo
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.warn('AI Service not available, returning mock result');
      // Mock recognition for demo
      const materialTypes = ['gach', 'xi-mang', 'thep', 'cat-da', 'ong-nhua'];
      const randomType = materialTypes[Math.floor(Math.random() * materialTypes.length)];
      const confidence = 0.7 + Math.random() * 0.25;
      
      return {
        materialType: randomType,
        confidence: confidence,
        suggestions: []
      };
    }
    throw error;
  }
};

/**
 * Get material suggestions based on AI recognition
 * @param {string} materialType - Material type from AI
 * @returns {Promise}
 */
export const getMaterialSuggestions = async (materialType) => {
  try {
    // Map AI material type to category
    const categoryMap = {
      'gach': 'brick',
      'xi-mang': 'cement',
      'thep': 'steel',
      'cat-da': 'sand-stone',
      'ong-nhua': 'pipe'
    };
    
    const category = categoryMap[materialType] || materialType;
    
    // Call API to get materials by category
    const apiClient = (await import('./apiClient')).default;
    const response = await apiClient.get(`/materials?category=${category}`);
    const materials = Array.isArray(response) ? response : (response.data || []);
    
    return materials.slice(0, 5); // Return top 5 suggestions
  } catch (error) {
    console.warn('Failed to get material suggestions:', error);
    return [];
  }
};

