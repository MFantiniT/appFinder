// server/routes/businessRoutes.js
const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

// Listar empresas (com filtros opcionais)
router.get('/', businessController.getBusinesses);

// Buscar por ID
router.get('/:id', businessController.getBusinessById);

// Atualizar empresa
router.put('/:id', businessController.updateBusiness);

// Excluir empresa
router.delete('/:id', businessController.deleteBusiness);

// Exportar para Excel
router.get('/export/excel', businessController.exportToExcel);

module.exports = router;