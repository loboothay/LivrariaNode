const { db, auth } = require('../config/firebase');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth');
const { collection, doc, getDoc, setDoc } = require('firebase/firestore');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'seu_jwt_secret';

class AuthController {
    static async registro(req, res) {
        try {
            console.log('Iniciando registro...'); // Debug log
            const { email, senha, nome, telefone, cpf } = req.body;

            if (!email || !senha || !nome) {
                return res.status(400).json({ 
                    erro: 'Email, senha e nome são obrigatórios' 
                });
            }

            // Criar usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            console.log('Usuário criado no Auth:', userCredential.user.uid); // Debug log

            // Salvar dados adicionais no Firestore
            const userData = {
                nome,
                email,
                telefone,
                cpf,
                criadoEm: new Date()
            };

            const userDocRef = doc(db, 'usuarios', userCredential.user.uid);
            await setDoc(userDocRef, userData);
            console.log('Dados salvos no Firestore'); // Debug log

            // Gerar token JWT
            const token = jwt.sign(
                { uid: userCredential.user.uid, email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                mensagem: 'Usuário registrado com sucesso',
                usuario: {
                    uid: userCredential.user.uid,
                    ...userData
                },
                token
            });
        } catch (error) {
            console.error('Erro no registro:', error); // Debug log
            res.status(500).json({ 
                erro: error.message,
                detalhes: error.code 
            });
        }
    }

    static async login(req, res) {
        try {
            console.log('Iniciando login...');
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ 
                    erro: 'Email e senha são obrigatórios' 
                });
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;
            console.log('Usuário autenticado:', user.uid);

            // Buscar dados do usuário usando os métodos corretos do Firestore
            const userDocRef = doc(db, 'usuarios', user.uid);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();

            const token = jwt.sign(
                { uid: user.uid, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                usuario: {
                    uid: user.uid,
                    email: user.email,
                    nome: userData?.nome
                }
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(401).json({ 
                erro: 'Credenciais inválidas',
                detalhes: error.message 
            });
        }
    }

    static async recuperarSenha(req, res) {
        try {
            const { email } = req.body;
            await sendPasswordResetEmail(auth, email);
            res.json({ mensagem: 'Email de recuperação enviado com sucesso' });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = AuthController;