// server/controllers/searchController.js
const Search = require('../models/Search');
const Business = require('../models/Business');
const googleMapsScraper = require('../services/googleMapsScraper');
const cnpjScraper = require('../services/cnpjScraper');

exports.createSearch = async (req, res) => {
  try {
    const { category, location } = req.body;
    
    // Validar entradas
    if (!category || !location) {
      return res.status(400).json({ 
        success: false, 
        error: 'Categoria e localização são obrigatórias' 
      });
    }
    
    // Criar registro de busca
    const search = new Search({
      query: `${category} em ${location}`,
      category,
      location,
      status: 'pending'
    });
    
    await search.save();
    
    // Iniciar busca em background (não bloqueia a resposta)
    this.processSearch(search._id);
    
    return res.status(201).json({
      success: true,
      data: search
    });
  } catch (error) {
    console.error('Erro ao criar busca:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar a requisição'
    });
  }
};

exports.processSearch = async (searchId) => {
  let search;
  
  try {
    // Atualizar status
    search = await Search.findById(searchId);
    search.status = 'processing';
    await search.save();
    
    // Iniciar scraping
    const businesses = await googleMapsScraper.searchBusinesses(
      search.category, 
      search.location
    );
    
    // Salvar empresas no banco
    const businessIds = [];
    
    for (const businessData of businesses) {
      // Verificar se a empresa já existe
      let business = await Business.findOne({
        name: businessData.name,
        city: search.location
      });
      
      if (!business) {
        // Extrair cidade e estado da localização
        const [city, state] = search.location.split(',').map(s => s.trim());
        
        // Criar nova empresa
        business = new Business({
          ...businessData,
          city: city || search.location,
          state: state || '' // Estado vazio se não fornecido
        });
        
        await business.save();
      }
      
      businessIds.push(business._id);
    }
    
    // Atualizar busca com resultados
    search.businesses = businessIds;
    search.resultsCount = businessIds.length;
    search.status = 'completed';
    await search.save();
    
    // Buscar CNPJs em segundo plano
    this.processCnpjSearch(searchId);
    
  } catch (error) {
    console.error('Erro ao processar busca:', error);
    
    // Atualizar status em caso de erro
    if (search) {
      search.status = 'failed';
      await search.save();
    }
  } finally {
    // Encerrar navegador
    await googleMapsScraper.close();
  }
};

exports.processCnpjSearch = async (searchId) => {
  try {
    const search = await Search.findById(searchId).populate('businesses');
    
    // Iniciar scraper de CNPJ
    await cnpjScraper.initialize();
    
    for (const business of search.businesses) {
      // Pular se já tiver CNPJ
      if (business.cnpj) continue;
      
      // Buscar CNPJ
      const cnpj = await cnpjScraper.findCnpj(business.name, business.state);
      
      if (cnpj) {
        business.cnpj = cnpj;
        business.lastUpdated = new Date();
        await business.save();
      }
    }
  } catch (error) {
    console.error('Erro ao processar CNPJs:', error);
  } finally {
    await cnpjScraper.close();
  }
};

exports.getSearches = async (req, res) => {
  try {
    const searches = await Search.find()
      .sort({ createdAt: -1 })
      .select('-businesses');
    
    return res.status(200).json({
      success: true,
      count: searches.length,
      data: searches
    });
  } catch (error) {
    console.error('Erro ao listar buscas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar registros'
    });
  }
};

exports.getSearchById = async (req, res) => {
  try {
    const search = await Search.findById(req.params.id)
      .populate('businesses');
    
    if (!search) {
      return res.status(404).json({
        success: false,
        error: 'Busca não encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: search
    });
  } catch (error) {
    console.error('Erro ao buscar registro:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar registro'
    });
  }
};