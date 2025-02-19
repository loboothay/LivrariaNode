const { db } = require('../config/firebase');
const { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } = require('firebase/firestore');

class LivroController {
    static async criarLivro(req, res) {
        try {
            const { titulo, autor, isbn, preco, quantidade, categoriaId } = req.body;
            
            // Verify if category exists
            const categoriaRef = doc(db, 'categorias', categoriaId);
            const categoriaSnap = await getDoc(categoriaRef);
            if (!categoriaSnap.exists()) {
                return res.status(404).json({ erro: 'Categoria não encontrada' });
            }

            const livro = {
                titulo,
                autor,
                isbn,
                preco,
                quantidade,
                categoriaId,
                categoriaName: categoriaSnap.data().nome,
                criadoEm: new Date()
            };

            const livrosRef = collection(db, 'livros');
            const docRef = await addDoc(livrosRef, livro);
            res.status(201).json({ id: docRef.id, ...livro });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarTodosLivros(req, res) {
        try {
            const livrosRef = collection(db, 'livros');
            const querySnapshot = await getDocs(livrosRef);
            const livros = [];
            querySnapshot.forEach(doc => {
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
            
            let updateData = {
                titulo,
                autor,
                isbn,
                preco,
                quantidade,
                atualizadoEm: new Date()
            };

            // Verify if category exists when updating category
            if (categoriaId) {
                const categoriaRef = doc(db, 'categorias', categoriaId);
                const categoriaSnap = await getDoc(categoriaRef);
                if (!categoriaSnap.exists()) {
                    return res.status(404).json({ erro: 'Categoria não encontrada' });
                }
                updateData.categoriaId = categoriaId;
                updateData.categoriaName = categoriaSnap.data().nome;
            }

            const livroRef = doc(db, 'livros', req.params.id);
            await updateDoc(livroRef, updateData);
            res.json({ mensagem: 'Livro atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarLivroPorId(req, res) {
        try {
            const livroRef = doc(db, 'livros', req.params.id);
            const docSnap = await getDoc(livroRef);
            if (!docSnap.exists()) {
                return res.status(404).json({ erro: 'Livro não encontrado' });
            }
            res.json({ id: docSnap.id, ...docSnap.data() });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async deletarLivro(req, res) {
        try {
            const livroRef = doc(db, 'livros', req.params.id);
            await deleteDoc(livroRef);
            res.json({ mensagem: 'Livro deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = LivroController;