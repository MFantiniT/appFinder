// server/controllers/businessController.js
const Business = require('../models/Business');
const excelExporter = require('../utils/excelExporter');

exports.getBusinesses = async (req, res) => {
  try {
    const { city, category, name } = req.query;
    const query = {};
    
    // Filtros opcionais
    if (city) query.city = city;
    if (category) query.category = category;
    if (name) query.name = { $regex: name, $options: 'i' };
    
    const businesses = await Business.find(query)
      .sort({ name: 1 });
    
    return res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar registros'
    });
  }
};

exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Empresa não encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar registro'
    });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const updates = req.body;
    
    // Impedir atualização de campos reservados
    delete updates._id;
    delete updates.foundDate;
    delete updates.createdAt;
    delete updates.updatedAt;
    
    // Marcar como atualizado
    updates.lastUpdated = new Date();
    
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Empresa não encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao atualizar registro'
    });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Empresa não encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao excluir registro'
    });
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    const { city, category } = req.query;
    const query = {};
    
    // Filtros opcionais
    if (city) query.city = city;
    if (category) query.category = category;
    
    const businesses = await Business.find(query)
      .sort({ name: 1 });
    
    // Gerar planilha
    const buffer = await excelExporter.generateExcel(businesses);
    
    // Configurar headers para download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=empresas_${Date.now()}.xlsx`);
    
    return res.send(buffer);
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao exportar dados'
    });
  }
};