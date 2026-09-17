const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: 'Nome, email e senha são obrigatórios'
            });
        }

        const usuarioExistente = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [email]
        );

        if (usuarioExistente.rows.length > 0) {
            return res.status(409).json({
                erro: 'Email já está cadastrado'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(
            `INSERT INTO usuarios (nome, email, senha)
             VALUES ($1, $2, $3)
             RETURNING id, nome, email, created_at`,
            [nome, email, senhaHash]
        );

        res.status(201).json({
            mensagem: 'Usuário criado com sucesso',
            usuario: resultado.rows[0]
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: 'Email e senha são obrigatórios'
            });
        }

        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                erro: 'Email ou senha inválidos'
            });
        }

        const usuario = resultado.rows[0];

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                erro: 'Email ou senha inválidos'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.json({
            mensagem: 'Login realizado com sucesso',
            token
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    register,
    login
};