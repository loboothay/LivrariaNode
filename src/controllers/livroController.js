const db = require('../config/firebase');

class LivroController {
    static async criarLivro(req, res) {
        try {
            const { titulo, autor, isbn, preco, quantidade, categoriaId } = req.body;
            
            // Verify if category exists
            const categoriaRef = await db.collection('categorias').doc(categoriaId).get();
            if (!categoriaRef.exists) {
                return res.status(404).json({ erro: 'Categoria não encontrada' });
            }

            const livro = {
                titulo,
                autor,
                isbn,
                preco,
                quantidade,
                categoriaId,
                categoriaName: categoriaRef.data().nome,
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

    static async atualizarLivro(req, res) {
        try {
            const { titulo, autor, isbn, preco, quantidade, categoriaId } = req.body;
            
            // Verify if category exists when updating category
            if (categoriaId) {
                const categoriaRef = await db.collection('categorias').doc(categoriaId).get();
                if (!categoriaRef.exists) {
                    return res.status(404).json({ erro: 'Categoria não encontrada' });
                }
            }

            const updateData = {
                titulo,
                autor,
                isbn,
                preco,
                quantidade,
                atualizadoEm: new Date()
            };

            if (categoriaId) {
                updateData.categoriaId = categoriaId;
                updateData.categoriaName = categoriaRef.data().nome;
            }

            await db.collection('livros').doc(req.params.id).update(updateData);
            res.json({ mensagem: 'Livro atualizado com sucesso' });
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