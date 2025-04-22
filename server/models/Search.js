// server/models/Search.js
const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  businesses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  }],
  createdBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Search', SearchSchema);