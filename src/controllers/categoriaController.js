const { db } = require('../config/firebase');
const { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query } = require('firebase/firestore');

class CategoriaController {
    static async criarCategoria(req, res) {
        try {
            const { nome, descricao } = req.body;
            const categoria = {
                nome,
                descricao,
                criadoEm: new Date()
            };

            const categoriaRef = doc(collection(db, 'categorias'));
            await setDoc(categoriaRef, categoria);

            res.status(201).json({ id: categoriaRef.id, ...categoria });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarTodasCategorias(req, res) {
        try {
            const categoriasRef = collection(db, 'categorias');
            const querySnapshot = await getDocs(categoriasRef);
            
            const categorias = [];
            querySnapshot.forEach(doc => {
                categorias.push({ id: doc.id, ...doc.data() });
            });

            res.json(categorias);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarCategoriaPorId(req, res) {
        try {
            const docRef = doc(db, 'categorias', req.params.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return res.status(404).json({ erro: 'Categoria não encontrada' });
            }

            res.json({ id: docSnap.id, ...docSnap.data() });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async atualizarCategoria(req, res) {
        try {
            const { nome, descricao } = req.body;
            const docRef = doc(db, 'categorias', req.params.id);
            
            await updateDoc(docRef, {
                nome,
                descricao,
                atualizadoEm: new Date()
            });

            res.json({ mensagem: 'Categoria atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async deletarCategoria(req, res) {
        try {
            const docRef = doc(db, 'categorias', req.params.id);
            await deleteDoc(docRef);
            
            res.json({ mensagem: 'Categoria deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = CategoriaController;