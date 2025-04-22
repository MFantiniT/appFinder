// client/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchForm from '../components/SearchForm';
import BusinessList from '../components/BusinessList';

const API_URL = 'http://localhost:5000/api';

const Home = () => {
    const [searches, setSearches] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [selectedSearch, setSelectedSearch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carregar buscas e empresas ao montar o componente
        const fetchData = async () => {
            try {
                // Carregar buscas recentes
                const searchResponse = await axios.get(`${API_URL}/searches`);
                setSearches(searchResponse.data.data);

                // Carregar todas as empresas
                const businessResponse = await axios.get(`${API_URL}/businesses`);
                setBusinesses(businessResponse.data.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearchComplete = (search) => {
        // Adicionar nova busca à lista
        setSearches([search, ...searches]);

        // Configurar um intervalo para verificar o status da busca
        const checkSearchStatus = setInterval(async () => {
            try {
                const response = await axios.get(`${API_URL}/searches/${search._id}`);
                const updatedSearch = response.data.data;

                // Atualizar a lista de buscas
                setSearches(prevSearches =>
                    prevSearches.map(s => (s._id === updatedSearch._id ? updatedSearch : s))
                );

                // Se a busca estiver concluída, carregar os resultados e limpar o intervalo
                if (updatedSearch.status === 'completed') {
                    setSelectedSearch(updatedSearch);
                    if (updatedSearch.businesses && updatedSearch.businesses.length > 0) {
                        setBusinesses(updatedSearch.businesses);
                    }
                    clearInterval(checkSearchStatus);
                } else if (updatedSearch.status === 'failed') {
                    clearInterval(checkSearchStatus);
                }
            } catch (error) {
                console.error('Erro ao verificar status da busca:', error);
                clearInterval(checkSearchStatus);
            }
        }, 5000); // Verificar a cada 5 segundos

        // Limpar o intervalo quando o componente for desmontado
        return () => clearInterval(checkSearchStatus);
    };

    const handleSearchSelect = async (searchId) => {
        try {
            setLoading(true);

            // Buscar detalhes da pesquisa selecionada
            const response = await axios.get(`${API_URL}/searches/${searchId}`);
            setSelectedSearch(response.data.data);

            // Filtrar empresas relacionadas a esta busca
            if (response.data.data.businesses && response.data.data.businesses.length > 0) {
                setBusinesses(response.data.data.businesses);
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes da busca:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBusiness = (businessId) => {
        // Atualizar lista de empresas após exclusão
        setBusinesses(businesses.filter(business => business._id !== businessId));
    };

    return (
        <div className="home-container">
            <div className="sidebar">
                <SearchForm onSearchComplete={handleSearchComplete} />

                <div className="recent-searches">
                    <h3>Buscas Recentes</h3>
                    {searches.length === 0 ? (
                        <p>Nenhuma busca realizada</p>
                    ) : (
                        <ul>
                            {searches.map(search => (
                                <li
                                    key={search._id}
                                    className={selectedSearch && selectedSearch._id === search._id ? 'active' : ''}
                                    onClick={() => handleSearchSelect(search._id)}
                                >
                                    <div className="search-info">
                                        <span className="search-query">{search.query}</span>
                                        <span className="search-date">
                                            {new Date(search.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="search-status">
                                        <span className={`status-badge ${search.status}`}>
                                            {search.status === 'pending' && 'Pendente'}
                                            {search.status === 'processing' && 'Processando'}
                                            {search.status === 'completed' && 'Concluído'}
                                            {search.status === 'failed' && 'Falhou'}
                                        </span>
                                        <span className="results-count">
                                            {search.resultsCount} resultados
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="main-content">
                {loading ? (
                    <div className="loading">Carregando...</div>
                ) : (
                    <BusinessList
                        businesses={businesses}
                        onDeleteBusiness={handleDeleteBusiness}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;