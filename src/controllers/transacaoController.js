const db = require('../config/database');

async function criarTransacao(req, res) {
    try {
        const {
            descricao,
            valor,
            tipo,
            categoria,
            data_transacao
        } = req.body;

        const usuario_id = req.usuario.id;

        if (!descricao || valor === undefined || valor === null || !tipo || !data_transacao) {
            return res.status(400).json({
                erro: 'descricao, valor, tipo e data_transacao são obrigatórios'
            });
        }

        if (!['receita', 'despesa'].includes(tipo)) {
            return res.status(400).json({
                erro: 'tipo deve ser receita ou despesa'
            });
        }

        if (isNaN(Number(valor)) || Number(valor) <= 0) {
            return res.status(400).json({
                erro: 'valor deve ser um número maior que zero'
            });
        }

        const sql = `
            INSERT INTO transacoes
            (usuario_id, descricao, valor, tipo, categoria, data_transacao)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const valores = [
            usuario_id,
            descricao,
            valor,
            tipo,
            categoria || 'outros',
            data_transacao
        ];

        const resultado = await db.query(sql, valores);

        res.status(201).json(resultado.rows[0]);

    } catch (erro) {
        console.error('Erro ao criar transação:', erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
}

async function listarTransacoes(req, res) {
    try {
        const usuario_id = req.usuario.id;

        const sql = `
            SELECT *
            FROM transacoes
            WHERE usuario_id = $1
            ORDER BY data_transacao DESC, id DESC;
        `;

        const resultado = await db.query(sql, [usuario_id]);

        res.json(resultado.rows);

    } catch (erro) {
        console.error('Erro ao listar transações:', erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
}

async function buscarTransacaoPorId(req, res) {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario.id;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                erro: 'ID deve ser um número inteiro positivo'
            });
        }

        const sql = `
            SELECT *
            FROM transacoes
            WHERE id = $1
            AND usuario_id = $2;
        `;

        const resultado = await db.query(sql, [id, usuario_id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Transação não encontrada'
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {
        console.error('Erro ao buscar transação:', erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
}

async function atualizarTransacao(req, res) {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario.id;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                erro: 'ID deve ser um número inteiro positivo'
            });
        }

        const {
            descricao,
            valor,
            tipo,
            categoria,
            data_transacao
        } = req.body;

        if (!descricao || valor === undefined || valor === null || !tipo || !data_transacao) {
            return res.status(400).json({
                erro: 'descricao, valor, tipo e data_transacao são obrigatórios'
            });
        }

        if (!['receita', 'despesa'].includes(tipo)) {
            return res.status(400).json({
                erro: 'tipo deve ser receita ou despesa'
            });
        }

        if (isNaN(Number(valor)) || Number(valor) <= 0) {
            return res.status(400).json({
                erro: 'valor deve ser um número maior que zero'
            });
        }

        const sql = `
            UPDATE transacoes
            SET
                descricao = $1,
                valor = $2,
                tipo = $3,
                categoria = $4,
                data_transacao = $5,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = $6
            AND usuario_id = $7
            RETURNING *;
        `;

        const valores = [
            descricao,
            valor,
            tipo,
            categoria || 'outros',
            data_transacao,
            id,
            usuario_id
        ];

        const resultado = await db.query(sql, valores);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Transação não encontrada'
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {
        console.error('Erro ao atualizar transação:', erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
}

async function excluirTransacao(req, res) {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario.id;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                erro: 'ID deve ser um número inteiro positivo'
            });
        }

        const sql = `
            DELETE FROM transacoes
            WHERE id = $1
            AND usuario_id = $2
            RETURNING *;
        `;

        const resultado = await db.query(sql, [id, usuario_id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Transação não encontrada'
            });
        }

        res.json({
            mensagem: 'Transação excluída com sucesso',
            transacao: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao excluir transação:', erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
}

module.exports = {
    criarTransacao,
    listarTransacoes,
    buscarTransacaoPorId,
    atualizarTransacao,
    excluirTransacao
};