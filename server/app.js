// server/app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const searchRoutes = require('./routes/searchRoutes');
const businessRoutes = require('./routes/businessRoutes');

// Conectar ao banco de dados
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/searches', searchRoutes);
app.use('/api/businesses', businessRoutes);

// Servir frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Erro no servidor'
  });
});

module.exports = app;