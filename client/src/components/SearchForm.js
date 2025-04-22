// client/src/components/SearchForm.js
import React, { useState } from 'react';
import { searchApi } from '../services/api';

const SearchForm = ({ onSearchComplete }) => {
  const [formData, setFormData] = useState({
    category: '',
    location: 'Florianópolis'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchApi.createSearch(formData);
      
      if (onSearchComplete) {
        onSearchComplete(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao iniciar busca');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="search-form">
      <h2>Nova Pesquisa</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
        <label htmlFor="category">Tipo de Empresa</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Ex: Clínicas médicas, Restaurantes, Hotéis"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Localização</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Cidade, UF"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Processando...' : 'Iniciar Busca'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
