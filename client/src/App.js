// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

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