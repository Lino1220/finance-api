const express = require('express');

const {
    criarTransacao,
    listarTransacoes,
    buscarTransacaoPorId,
    atualizarTransacao,
    excluirTransacao
} = require('../controllers/transacaoController');

const router = express.Router();

router.post('/', criarTransacao);
router.get('/', listarTransacoes);
router.get('/:id', buscarTransacaoPorId);
router.put('/:id', atualizarTransacao);
router.delete('/:id', excluirTransacao);

module.exports = router;