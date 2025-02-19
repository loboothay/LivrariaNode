const db = require('../config/firebase');

class LivroController {
    static async criarLivro(req, res) {
        try {
            const { titulo, autor, isbn, preco, quantidade } = req.body;
            const livro = {
                titulo,
                autor,
                isbn,
                preco,
                quantidade,
                criadoEm: new Date()
            };

            const docRef = await db.collection('livros').add(livro);
            res.status(201).json({ id: docRef.id, ...livro });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarTodosLivros(req, res) {
        try {
            const livrosSnapshot = await db.collection('livros').get();
            const livros = [];
            livrosSnapshot.forEach(doc => {
                livros.push({ id: doc.id, ...doc.data() });
            });
            res.json(livros);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarLivroPorId(req, res) {
        try {
            const doc = await db.collection('livros').doc(req.params.id).get();
            if (!doc.exists) {
                return res.status(404).json({ erro: 'Livro não encontrado' });
            }
            res.json({ id: doc.id, ...doc.data() });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async atualizarLivro(req, res) {
        try {
            const { titulo, autor, isbn, preco, quantidade } = req.body;
            await db.collection('livros').doc(req.params.id).update({
                titulo,
                autor,
                isbn,
                preco,
                quantidade,
                atualizadoEm: new Date()
            });
            res.json({ mensagem: 'Livro atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async deletarLivro(req, res) {
        try {
            await db.collection('livros').doc(req.params.id).delete();
            res.json({ mensagem: 'Livro deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = LivroController;