// client/src/components/BusinessEditForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { businessApi } from '../services/api';

const BusinessEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [business, setBusiness] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    city: '',
    state: '',
    cnpj: '',
    instagram: '',
    linkedin: '',
    facebook: '',
    ownerName: '',
    email: '',
    category: '',
    notes: ''
  });
  
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await businessApi.getBusinessById(id);
        setBusiness(response.data.data);
      } catch (err) {
        setError('Erro ao carregar dados da empresa');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusiness();
  }, [id]);
  
  const handleChange = (e) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await businessApi.updateBusiness(id, business);
      alert('Empresa atualizada com sucesso!');
      navigate('/');
    } catch (err) {
      setError('Erro ao atualizar empresa');
      console.error(err);
    }
  };
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="business-edit">
      <h2>Editar Empresa</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nome da Empresa</label>
            <input
              type="text"
              id="name"
              name="name"
              value={business.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <input
              type="text"
              id="category"
              name="category"
              value={business.category}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">Endereço</label>
            <input
              type="text"
              id="address"
              name="address"
              value={business.address}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">Cidade</label>
            <input
              type="text"
              id="city"
              name="city"
              value={business.city}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="state">Estado</label>
            <input
              type="text"
              id="state"
              name="state"
              value={business.state}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={business.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={business.email}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={business.website}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cnpj">CNPJ</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={business.cnpj}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <h3>Redes Sociais</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="instagram">Instagram</label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={business.instagram}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="text"
              id="linkedin"
              name="linkedin"
              value={business.linkedin}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="facebook">Facebook</label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              value={business.facebook}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ownerName">Nome do Proprietário</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={business.ownerName}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Observações</label>
          <textarea
            id="notes"
            name="notes"
            value={business.notes}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-save">Salvar Alterações</button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessEditForm;