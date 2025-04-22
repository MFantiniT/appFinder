// server/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Criar nova busca
router.post('/', searchController.createSearch);

// Listar todas as buscas
router.get('/', searchController.getSearches);

// Buscar por ID
router.get('/:id', searchController.getSearchById);

module.exports = router;