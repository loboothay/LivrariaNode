const { db } = require('../config/firebase');
const { collection, getDocs, query, where } = require('firebase/firestore');

class RelatorioController {
    static async livrosMaisEmprestados(req, res) {
        try {
            const emprestimosRef = collection(db, 'emprestimos');
            const querySnapshot = await getDocs(emprestimosRef);
            const emprestimos = {};

            querySnapshot.forEach(doc => {
                const data = doc.data();
                if (!emprestimos[data.livroId]) {
                    emprestimos[data.livroId] = {
                        livroId: data.livroId,
                        titulo: data.livroTitulo,
                        quantidade: 1
                    };
                } else {
                    emprestimos[data.livroId].quantidade++;
                }
            });

            const relatorio = Object.values(emprestimos)
                .sort((a, b) => b.quantidade - a.quantidade);

            res.json({
                titulo: 'Relatório de Livros Mais Emprestados',
                data: new Date(),
                livros: relatorio
            });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async livrosMaisFavoritados(req, res) {
        try {
            const favoritosRef = collection(db, 'favoritos');
            const querySnapshot = await getDocs(favoritosRef);
            const favoritos = {};

            querySnapshot.forEach(doc => {
                const data = doc.data();
                if (!favoritos[data.livroId]) {
                    favoritos[data.livroId] = {
                        livroId: data.livroId,
                        titulo: data.livroTitulo,
                        quantidade: 1
                    };
                } else {
                    favoritos[data.livroId].quantidade++;
                }
            });

            const relatorio = Object.values(favoritos)
                .sort((a, b) => b.quantidade - a.quantidade);

            res.json({
                titulo: 'Relatório de Livros Mais Favoritados',
                data: new Date(),
                livros: relatorio
            });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async usuariosMaisAtivos(req, res) {
        try {
            const usuarios = {};

            // Buscar empréstimos
            const emprestimosRef = collection(db, 'emprestimos');
            const emprestimosSnapshot = await getDocs(emprestimosRef);

            emprestimosSnapshot.forEach(doc => {
                const data = doc.data();
                if (!usuarios[data.usuarioId]) {
                    usuarios[data.usuarioId] = {
                        usuarioId: data.usuarioId,
                        nome: data.usuarioNome,
                        emprestimos: 1,
                        favoritos: 0,
                        resenhas: 0
                    };
                } else {
                    usuarios[data.usuarioId].emprestimos++;
                }
            });

            // Buscar favoritos
            const favoritosRef = collection(db, 'favoritos');
            const favoritosSnapshot = await getDocs(favoritosRef);

            favoritosSnapshot.forEach(doc => {
                const data = doc.data();
                if (usuarios[data.usuarioId]) {
                    usuarios[data.usuarioId].favoritos++;
                }
            });

            // Buscar resenhas
            const resenhasRef = collection(db, 'resenhas');
            const resenhasSnapshot = await getDocs(resenhasRef);

            resenhasSnapshot.forEach(doc => {
                const data = doc.data();
                if (usuarios[data.usuarioId]) {
                    usuarios[data.usuarioId].resenhas++;
                }
            });

            const relatorio = Object.values(usuarios)
                .map(usuario => ({
                    ...usuario,
                    pontuacaoTotal: usuario.emprestimos * 2 + usuario.favoritos + usuario.resenhas
                }))
                .sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);

            res.json({
                titulo: 'Relatório de Usuários Mais Ativos',
                data: new Date(),
                usuarios: relatorio
            });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = RelatorioController;