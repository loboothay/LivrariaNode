const db = require('../config/firebase');

class ResenhaController {
    static async adicionarResenha(req, res) {
        try {
            const { livroId, usuarioId, texto, avaliacao } = req.body;

            // Verificar se o livro existe
            const livroRef = await db.collection('livros').doc(livroId).get();
            if (!livroRef.exists) {
                return res.status(404).json({ erro: 'Livro não encontrado' });
            }

            // Verificar se o usuário existe
            const usuarioRef = await db.collection('usuarios').doc(usuarioId).get();
            if (!usuarioRef.exists) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }

            const resenha = {
                livroId,
                livroTitulo: livroRef.data().titulo,
                usuarioId,
                usuarioNome: usuarioRef.data().nome,
                texto,
                avaliacao,
                criadoEm: new Date()
            };

            const docRef = await db.collection('resenhas').add(resenha);
            res.status(201).json({ id: docRef.id, ...resenha });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async listarResenhasLivro(req, res) {
        try {
            const { livroId } = req.params;

            // Removed orderBy to avoid requiring composite index
            const resenhasSnapshot = await db.collection('resenhas')
                .where('livroId', '==', livroId)
                .get();

            const resenhas = [];
            resenhasSnapshot.forEach(doc => {
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

            const resenhaRef = await db.collection('resenhas').doc(id).get();
            if (!resenhaRef.exists) {
                return res.status(404).json({ erro: 'Resenha não encontrada' });
            }

            // Verificar se o usuário é o autor da resenha
            if (resenhaRef.data().usuarioId !== usuarioId) {
                return res.status(403).json({ erro: 'Não autorizado a editar esta resenha' });
            }

            await db.collection('resenhas').doc(id).update({
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

            const resenhaRef = await db.collection('resenhas').doc(id).get();
            if (!resenhaRef.exists) {
                return res.status(404).json({ erro: 'Resenha não encontrada' });
            }

            // Verificar se o usuário é o autor da resenha
            if (resenhaRef.data().usuarioId !== usuarioId) {
                return res.status(403).json({ erro: 'Não autorizado a deletar esta resenha' });
            }

            await db.collection('resenhas').doc(id).delete();
            res.json({ mensagem: 'Resenha deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = ResenhaController;