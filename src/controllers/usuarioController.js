const { db } = require('../config/firebase');
const { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } = require('firebase/firestore');

class UsuarioController {
    static async criarUsuario(req, res) {
        try {
            const { nome, email, telefone, cpf } = req.body;
            const usuario = {
                nome,
                email,
                telefone,
                cpf,
                criadoEm: new Date()
            };

            const usuariosRef = collection(db, 'usuarios');
            const docRef = doc(usuariosRef);
            await setDoc(docRef, usuario);

            res.status(201).json({ id: docRef.id, ...usuario });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarTodosUsuarios(req, res) {
        try {
            const usuariosRef = collection(db, 'usuarios');
            const querySnapshot = await getDocs(usuariosRef);
            
            const usuarios = [];
            querySnapshot.forEach(doc => {
                usuarios.push({ id: doc.id, ...doc.data() });
            });
            
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarUsuarioPorId(req, res) {
        try {
            const docRef = doc(db, 'usuarios', req.params.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }

            res.json({ id: docSnap.id, ...docSnap.data() });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async atualizarUsuario(req, res) {
        try {
            const { nome, email, telefone, cpf } = req.body;
            const docRef = doc(db, 'usuarios', req.params.id);
            
            await updateDoc(docRef, {
                nome,
                email,
                telefone,
                cpf,
                atualizadoEm: new Date()
            });

            res.json({ mensagem: 'Usuário atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async deletarUsuario(req, res) {
        try {
            const docRef = doc(db, 'usuarios', req.params.id);
            await deleteDoc(docRef);
            
            res.json({ mensagem: 'Usuário deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = UsuarioController;