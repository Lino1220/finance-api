const express = require('express');
require('./config/database');

const transacaoRoutes = require('./routes/transacaoRoutes');
const authRoutes = require('./routes/authRoutes');
const autenticar = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Gestão Financeira'
    });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.get('/api/protegida', autenticar, (req, res) => {
    res.json({
        mensagem: 'Você está autenticado',
        usuario: req.usuario
    });
});

// Rotas de transações
app.use('/api/transacoes', autenticar, transacaoRoutes);

module.exports = app;