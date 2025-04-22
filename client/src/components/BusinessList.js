// client/src/components/BusinessList.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { businessApi } from '../services/api';

const BusinessList = ({ businesses, onDeleteBusiness }) => {
  const [filters, setFilters] = useState({
    name: '',
    city: '',
    category: ''
  });
  
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };
  
  const filteredBusinesses = businesses.filter(business => {
    // Aplicar filtros
    return (
      (filters.name ? business.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
      (filters.city ? business.city.toLowerCase().includes(filters.city.toLowerCase()) : true) &&
      (filters.category ? business.category.toLowerCase().includes(filters.category.toLowerCase()) : true)
    );
  });
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await businessApi.deleteBusiness(id);
        if (onDeleteBusiness) {
          onDeleteBusiness(id);
        }
      } catch (error) {
        console.error('Erro ao excluir empresa:', error);
        alert('Erro ao excluir empresa');
      }
    }
  };
  
  const handleExportExcel = () => {
    const url = businessApi.getExcelDownloadUrl(filters);
    window.open(url, '_blank');
  };
  
  return (
    <div className="business-list">
      <div className="list-header">
        <h2>Empresas Encontradas ({filteredBusinesses.length})</h2>
        <button onClick={handleExportExcel}>Exportar para Excel</button>
      </div>
      
      <div className="filters">
        <input
          type="text"
          name="name"
          placeholder="Filtrar por nome"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="city"
          placeholder="Filtrar por cidade"
          value={filters.city}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Filtrar por categoria"
          value={filters.category}
          onChange={handleFilterChange}
        />
      </div>
      
      <div className="business-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>CNPJ</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-results">Nenhuma empresa encontrada</td>
              </tr>
            ) : (
              filteredBusinesses.map(business => (
                <tr key={business._id}>
                  <td>{business.name}</td>
                  <td>{business.phone || 'N/A'}</td>
                  <td>{business.city}</td>
                  <td>{business.cnpj || 'Não encontrado'}</td>
                  <td>
                    <Link to={`/business/${business._id}`} className="btn-edit">
                      Editar
                    </Link>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(business._id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessList;