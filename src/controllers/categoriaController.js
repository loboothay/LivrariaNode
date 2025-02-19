const db = require('../config/firebase');

class CategoriaController {
    static async criarCategoria(req, res) {
        try {
            const { nome, descricao } = req.body;
            const categoria = {
                nome,
                descricao,
                criadoEm: new Date()
            };

            const docRef = await db.collection('categorias').add(categoria);
            res.status(201).json({ id: docRef.id, ...categoria });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarTodasCategorias(req, res) {
        try {
            const categoriasSnapshot = await db.collection('categorias').get();
            const categorias = [];
            categoriasSnapshot.forEach(doc => {
                categorias.push({ id: doc.id, ...doc.data() });
            });
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarCategoriaPorId(req, res) {
        try {
            const doc = await db.collection('categorias').doc(req.params.id).get();
            if (!doc.exists) {
                return res.status(404).json({ erro: 'Categoria não encontrada' });
            }
            res.json({ id: doc.id, ...doc.data() });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async atualizarCategoria(req, res) {
        try {
            const { nome, descricao } = req.body;
            await db.collection('categorias').doc(req.params.id).update({
                nome,
                descricao,
                atualizadoEm: new Date()
            });
            res.json({ mensagem: 'Categoria atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async deletarCategoria(req, res) {
        try {
            await db.collection('categorias').doc(req.params.id).delete();
            res.json({ mensagem: 'Categoria deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = CategoriaController;