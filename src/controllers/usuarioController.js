const db = require('../config/firebase');

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

            const docRef = await db.collection('usuarios').add(usuario);
            res.status(201).json({ id: docRef.id, ...usuario });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarTodosUsuarios(req, res) {
        try {
            const usuariosSnapshot = await db.collection('usuarios').get();
            const usuarios = [];
            usuariosSnapshot.forEach(doc => {
                usuarios.push({ id: doc.id, ...doc.data() });
            });
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async buscarUsuarioPorId(req, res) {
        try {
            const doc = await db.collection('usuarios').doc(req.params.id).get();
            if (!doc.exists) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }
            res.json({ id: doc.id, ...doc.data() });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async atualizarUsuario(req, res) {
        try {
            const { nome, email, telefone, cpf } = req.body;
            await db.collection('usuarios').doc(req.params.id).update({
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
            await db.collection('usuarios').doc(req.params.id).delete();
            res.json({ mensagem: 'Usuário deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = UsuarioController;