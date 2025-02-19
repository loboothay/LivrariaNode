const jwt = require('jsonwebtoken');
const { admin } = require('../config/firebase');

const JWT_SECRET = 'seu_jwt_secret'; // Em produção, use variável de ambiente

const verificarToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ erro: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await admin.auth().getUser(decoded.uid);
        
        req.user = {
            uid: user.uid,
            email: user.email
        };
        
        next();
    } catch (error) {
        res.status(401).json({ erro: 'Token inválido' });
    }
};

module.exports = verificarToken;