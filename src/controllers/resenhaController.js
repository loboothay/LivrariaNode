const { db } = require('../config/firebase');
const { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } = require('firebase/firestore');

class ResenhaController {
    static async adicionarResenha(req, res) {
        try {
            const { livroId, usuarioId, texto, avaliacao } = req.body;

            // Verificar se o livro existe
            const livroRef = doc(db, 'livros', livroId);
            const livroSnap = await getDoc(livroRef);
            if (!livroSnap.exists()) {
                return res.status(404).json({ erro: 'Livro não encontrado' });
            }

            // Verificar se o usuário existe
            const usuarioRef = doc(db, 'usuarios', usuarioId);
            const usuarioSnap = await getDoc(usuarioRef);
            if (!usuarioSnap.exists()) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }

            const resenha = {
                livroId,
                livroTitulo: livroSnap.data().titulo,
                usuarioId,
                usuarioNome: usuarioSnap.data().nome,
                texto,
                avaliacao,
                criadoEm: new Date()
            };

            const resenhasRef = collection(db, 'resenhas');
            const docRef = await addDoc(resenhasRef, resenha);
            res.status(201).json({ id: docRef.id, ...resenha });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async listarResenhasLivro(req, res) {
        try {
            const { livroId } = req.params;
            const resenhasRef = collection(db, 'resenhas');
            const q = query(resenhasRef, where('livroId', '==', livroId));
            const querySnapshot = await getDocs(q);

            const resenhas = [];
            querySnapshot.forEach(doc => {
                resenhas.push({ id: doc.id, ...doc.data() });
            });

            res.json(resenhas);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async atualizarResenha(req, res) {
        try {
            const { id } = req.params;
            const { texto, avaliacao } = req.body;
            const usuarioId = req.body.usuarioId;

            const resenhaRef = doc(db, 'resenhas', id);
            const resenhaSnap = await getDoc(resenhaRef);

            if (!resenhaSnap.exists()) {
                return res.status(404).json({ erro: 'Resenha não encontrada' });
            }

            if (resenhaSnap.data().usuarioId !== usuarioId) {
                return res.status(403).json({ erro: 'Não autorizado a editar esta resenha' });
            }

            await updateDoc(resenhaRef, {
                texto,
                avaliacao,
                atualizadoEm: new Date()
            });

            res.json({ mensagem: 'Resenha atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async deletarResenha(req, res) {
        try {
            const { id } = req.params;
            const usuarioId = req.body.usuarioId;

            const resenhaRef = doc(db, 'resenhas', id);
            const resenhaSnap = await getDoc(resenhaRef);

            if (!resenhaSnap.exists()) {
                return res.status(404).json({ erro: 'Resenha não encontrada' });
            }

            if (resenhaSnap.data().usuarioId !== usuarioId) {
                return res.status(403).json({ erro: 'Não autorizado a deletar esta resenha' });
            }

            await deleteDoc(resenhaRef);
            res.json({ mensagem: 'Resenha deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = ResenhaController;