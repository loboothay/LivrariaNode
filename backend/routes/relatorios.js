const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

const getTotalLivros = async (token) => {
    try {
        console.log('Iniciando busca de livros na API...');
        const response = await axios.get('http://localhost:3000/api/livros', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Resposta da API:', response.data);
        return response.data.length;
    } catch (error) {
        console.error('Erro ao buscar livros da API:', error);
        throw error;
    }
};

router.get('/', auth, async (req, res) => {
    console.log('Rota de relatórios acessada');
    try {
        console.log('Token recebido:', req.token);
        const totalLivros = await getTotalLivros(req.token);
        console.log('Total de livros calculado:', totalLivros);

        res.json({ totalLivros });

    } catch (error) {
        console.error('Erro completo ao gerar relatório:', error);
        res.status(500).json({ error: 'Erro ao buscar total de livros' });
    }
});

module.exports = router;