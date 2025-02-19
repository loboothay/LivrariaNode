const db = require('../config/firebase');

class FavoritoController {
    static async adicionarFavorito(req, res) {
        try {
            const { usuarioId, livroId } = req.body;

            // Verificar se o usuário existe
            const usuarioRef = await db.collection('usuarios').doc(usuarioId).get();
            if (!usuarioRef.exists) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }

            // Verificar se o livro existe
            const livroRef = await db.collection('livros').doc(livroId).get();
            if (!livroRef.exists) {
                return res.status(404).json({ erro: 'Livro não encontrado' });
            }

            const livroData = livroRef.data();
            const favorito = {
                usuarioId,
                livroId,
                livroTitulo: livroData.titulo,
                livroAutor: livroData.autor,
                criadoEm: new Date()
            };

            const docRef = await db.collection('favoritos').add(favorito);
            res.status(201).json({ id: docRef.id, ...favorito });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async removerFavorito(req, res) {
        try {
            const { usuarioId, livroId } = req.params;
            
            const favoritosRef = await db.collection('favoritos')
                .where('usuarioId', '==', usuarioId)
                .where('livroId', '==', livroId)
                .get();

            if (favoritosRef.empty) {
                return res.status(404).json({ erro: 'Favorito não encontrado' });
            }

            await db.collection('favoritos').doc(favoritosRef.docs[0].id).delete();
            res.json({ mensagem: 'Livro removido dos favoritos com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async listarFavoritos(req, res) {
        try {
            const { usuarioId } = req.params;
            
            // Verify if user exists
            const userRef = await db.collection('usuarios').doc(usuarioId).get();
            if (!userRef.exists) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }
        
            const favoritosSnapshot = await db.collection('favoritos')
                .where('usuarioId', '==', usuarioId)
                .get();
        
            if (favoritosSnapshot.empty) {
                return res.json([]);
            }
        
            const favoritos = [];
            for (const doc of favoritosSnapshot.docs) {
                const favoritoData = doc.data();
                const livroRef = await db.collection('livros').doc(favoritoData.livroId).get();
                
                favoritos.push({
                    id: doc.id,
                    ...favoritoData,
                    livro: livroRef.exists ? livroRef.data() : null
                });
            }
        
            res.json(favoritos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = FavoritoController;