// client/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const searchApi = {
  // Criar nova busca
  createSearch: (data) => api.post('/searches', data),
  
  // Listar buscas
  getSearches: () => api.get('/searches'),
  
  // Buscar por ID
  getSearchById: (id) => api.get(`/searches/${id}`)
};

export const businessApi = {
  // Listar empresas
  getBusinesses: (filters = {}) => api.get('/businesses', { params: filters }),
  
  // Buscar por ID
  getBusinessById: (id) => api.get(`/businesses/${id}`),
  
  // Atualizar empresa
  updateBusiness: (id, data) => api.put(`/businesses/${id}`, data),
  
  // Excluir empresa
  deleteBusiness: (id) => api.delete(`/businesses/${id}`),
  
  // URL para download de Excel
  getExcelDownloadUrl: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return `${API_URL}/businesses/export/excel?${params}`;
  }
};

export default api;