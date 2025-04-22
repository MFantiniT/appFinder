import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes temporários para desenvolvimento inicial
const Home = () => (
  <div className="home-container">
    <div className="sidebar">
      <div className="search-form">
        <h2>Nova Pesquisa</h2>
        <form>
          <div className="form-group">
            <label htmlFor="category">Tipo de Empresa</label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="Ex: Clínicas médicas, Restaurantes, Hotéis"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Localização</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Cidade, UF"
              defaultValue="Florianópolis, SC"
            />
          </div>
          
          <button type="submit">Iniciar Busca</button>
        </form>
      </div>
      
      <div className="recent-searches">
        <h3>Buscas Recentes</h3>
        <p>Nenhuma busca realizada</p>
      </div>
    </div>
    
    <div className="main-content">
      <div className="business-list">
        <div className="list-header">
          <h2>Empresas Encontradas (0)</h2>
          <button>Exportar para Excel</button>
        </div>
        
        <div className="filters">
          <input type="text" placeholder="Filtrar por nome" />
          <input type="text" placeholder="Filtrar por cidade" />
          <input type="text" placeholder="Filtrar por categoria" />
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
              <tr>
                <td colSpan="5" className="no-results">Nenhuma empresa encontrada</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

const BusinessEdit = () => (
  <div className="business-edit">
    <h2>Detalhes em Construção</h2>
    <p>Esta página está em desenvolvimento.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Sistema de Busca de Empresas</h1>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/business/:id" element={<BusinessEdit />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Sistema de Busca de Empresas</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;