// server/models/Business.js
const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  address: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  googleMapsUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  state: {
    type: String,
    required: true
  },
  // Campos adicionais para informações complementares
  cnpj: {
    type: String,
    default: ''
  },
  instagram: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  facebook: {
    type: String,
    default: ''
  },
  ownerName: {
    type: String, 
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  // Metadados
  foundDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para melhorar performance de busca
BusinessSchema.index({ name: 'text', city: 'text' });

module.exports = mongoose.model('Business', BusinessSchema);