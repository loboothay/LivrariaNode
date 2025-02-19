const db = require('../config/firebase');

class EmprestimoController {
    static async registrarEmprestimo(req, res) {
        try {
            const { livroId, usuarioId, dataEmprestimo } = req.body;

            // Verificar se o usuário existe
            const usuarioRef = await db.collection('usuarios').doc(usuarioId).get();
            if (!usuarioRef.exists) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }

            // Verificar se o livro existe e tem quantidade disponível
            const livroRef = db.collection('livros').doc(livroId);
            const livro = await livroRef.get();

            if (!livro.exists) {
                return res.status(404).json({ erro: 'Livro não encontrado' });
            }

            const livroData = livro.data();
            if (livroData.quantidade <= 0) {
                return res.status(400).json({ erro: 'Livro não disponível para empréstimo' });
            }

            // Criar o empréstimo
            const emprestimo = {
                livroId,
                livroTitulo: livroData.titulo,
                usuarioId,
                usuarioNome: usuarioRef.data().nome,
                dataEmprestimo: dataEmprestimo || new Date(),
                status: 'ativo',
                criadoEm: new Date()
            };

            // Atualizar quantidade do livro
            await livroRef.update({
                quantidade: livroData.quantidade - 1
            });

            const docRef = await db.collection('emprestimos').add(emprestimo);
            res.status(201).json({ id: docRef.id, ...emprestimo });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async registrarDevolucao(req, res) {
        try {
            const { emprestimoId } = req.params;
            const emprestimoRef = db.collection('emprestimos').doc(emprestimoId);
            const emprestimo = await emprestimoRef.get();

            if (!emprestimo.exists) {
                return res.status(404).json({ erro: 'Empréstimo não encontrado' });
            }

            if (emprestimo.data().status === 'devolvido') {
                return res.status(400).json({ erro: 'Livro já foi devolvido' });
            }

            // Atualizar quantidade do livro
            const livroRef = db.collection('livros').doc(emprestimo.data().livroId);
            const livro = await livroRef.get();
            
            await livroRef.update({
                quantidade: livro.data().quantidade + 1
            });

            // Atualizar status do empréstimo
            await emprestimoRef.update({
                status: 'devolvido',
                dataDevolucao: new Date()
            });

            res.json({ mensagem: 'Devolução registrada com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async listarEmprestimosAtivos(req, res) {
        try {
            const emprestimosSnapshot = await db.collection('emprestimos')
                .where('status', '==', 'ativo')
                .get();

            const emprestimos = [];
            emprestimosSnapshot.forEach(doc => {
                emprestimos.push({ id: doc.id, ...doc.data() });
            });

            res.json(emprestimos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async listarHistoricoUsuario(req, res) {
        try {
            const { usuarioId } = req.params;
            const emprestimosSnapshot = await db.collection('emprestimos')
                .where('usuarioId', '==', usuarioId)
                .orderBy('criadoEm', 'desc')
                .get();

            const emprestimos = [];
            emprestimosSnapshot.forEach(doc => {
                emprestimos.push({ id: doc.id, ...doc.data() });
            });

            res.json(emprestimos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = EmprestimoController;