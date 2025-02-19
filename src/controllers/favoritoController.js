const { db } = require('../config/firebase');
const { collection, doc, getDoc, getDocs, addDoc, deleteDoc, query, where } = require('firebase/firestore');

class FavoritoController {
    static async adicionarFavorito(req, res) {
        try {
            const { usuarioId, livroId } = req.body;

            // Verificar se o usuário existe
            const usuarioRef = doc(db, 'usuarios', usuarioId);
            const usuarioSnap = await getDoc(usuarioRef);
            if (!usuarioSnap.exists()) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }

            // Verificar se o livro existe
            const livroRef = doc(db, 'livros', livroId);
            const livroSnap = await getDoc(livroRef);
            if (!livroSnap.exists()) {
                return res.status(404).json({ erro: 'Livro não encontrado' });
            }

            const livroData = livroSnap.data();
            const favorito = {
                usuarioId,
                livroId,
                livroTitulo: livroData.titulo,
                livroAutor: livroData.autor,
                criadoEm: new Date()
            };

            const favoritosRef = collection(db, 'favoritos');
            const docRef = await addDoc(favoritosRef, favorito);
            res.status(201).json({ id: docRef.id, ...favorito });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async removerFavorito(req, res) {
        try {
            const { usuarioId, livroId } = req.params;
            
            const favoritosRef = collection(db, 'favoritos');
            const q = query(
                favoritosRef,
                where('usuarioId', '==', usuarioId),
                where('livroId', '==', livroId)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return res.status(404).json({ erro: 'Favorito não encontrado' });
            }

            const docRef = doc(db, 'favoritos', querySnapshot.docs[0].id);
            await deleteDoc(docRef);
            res.json({ mensagem: 'Livro removido dos favoritos com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async listarFavoritos(req, res) {
        try {
            const { usuarioId } = req.params;
            
            const favoritosRef = collection(db, 'favoritos');
            const q = query(favoritosRef, where('usuarioId', '==', usuarioId));
            const querySnapshot = await getDocs(q);

            const favoritos = [];
            querySnapshot.forEach(doc => {
                favoritos.push({ id: doc.id, ...doc.data() });
            });

            res.json(favoritos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = FavoritoController;