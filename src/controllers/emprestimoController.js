const { db } = require('../config/firebase');
const { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, addDoc, orderBy } = require('firebase/firestore');

class EmprestimoController {
    static async registrarEmprestimo(req, res) {
        try {
            const { livroId, usuarioId, dataEmprestimo } = req.body;

            // Verificar se o usuário existe
            const usuarioRef = doc(db, 'usuarios', usuarioId);
            const usuarioSnap = await getDoc(usuarioRef);
            if (!usuarioSnap.exists()) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }

            // Verificar se o livro existe e tem quantidade disponível
            const livroRef = doc(db, 'livros', livroId);
            const livroSnap = await getDoc(livroRef);

            if (!livroSnap.exists()) {
                return res.status(404).json({ erro: 'Livro não encontrado' });
            }

            const livroData = livroSnap.data();
            if (livroData.quantidade <= 0) {
                return res.status(400).json({ erro: 'Livro não disponível para empréstimo' });
            }

            // Criar o empréstimo
            const emprestimo = {
                livroId,
                livroTitulo: livroData.titulo,
                usuarioId,
                usuarioNome: usuarioSnap.data().nome,
                dataEmprestimo: dataEmprestimo || new Date(),
                status: 'ativo',
                criadoEm: new Date()
            };

            // Atualizar quantidade do livro
            await updateDoc(livroRef, {
                quantidade: livroData.quantidade - 1
            });

            const emprestimosRef = collection(db, 'emprestimos');
            const docRef = await addDoc(emprestimosRef, emprestimo);
            res.status(201).json({ id: docRef.id, ...emprestimo });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async registrarDevolucao(req, res) {
        try {
            const { emprestimoId } = req.params;
            const emprestimoRef = doc(db, 'emprestimos', emprestimoId);
            const emprestimoSnap = await getDoc(emprestimoRef);

            if (!emprestimoSnap.exists()) {
                return res.status(404).json({ erro: 'Empréstimo não encontrado' });
            }

            const emprestimoData = emprestimoSnap.data();
            if (emprestimoData.status === 'devolvido') {
                return res.status(400).json({ erro: 'Livro já foi devolvido' });
            }

            // Atualizar quantidade do livro
            const livroRef = doc(db, 'livros', emprestimoData.livroId);
            const livroSnap = await getDoc(livroRef);
            
            await updateDoc(livroRef, {
                quantidade: livroSnap.data().quantidade + 1
            });

            // Atualizar status do empréstimo
            await updateDoc(emprestimoRef, {
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
            const emprestimosRef = collection(db, 'emprestimos');
            const q = query(emprestimosRef, where('status', '==', 'ativo'));
            const querySnapshot = await getDocs(q);

            const emprestimos = [];
            querySnapshot.forEach(doc => {
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
            const emprestimosRef = collection(db, 'emprestimos');
            // Removed orderBy to avoid requiring composite index
            const q = query(
                emprestimosRef, 
                where('usuarioId', '==', usuarioId)
            );
            const querySnapshot = await getDocs(q);

            const emprestimos = [];
            querySnapshot.forEach(doc => {
                emprestimos.push({ id: doc.id, ...doc.data() });
            });

            res.json(emprestimos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = EmprestimoController;