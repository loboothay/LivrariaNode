const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistroRequest:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *         - nome
 *       properties:
 *         email:
 *           type: string
 *         senha:
 *           type: string
 *         nome:
 *           type: string
 *         telefone:
 *           type: string
 *         cpf:
 *           type: string
 *     RegistroResponse:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *         usuario:
 *           type: object
 *           properties:
 *             uid:
 *               type: string
 *             nome:
 *               type: string
 *             email:
 *               type: string
 *         token:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroRequest'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroResponse'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/registro', AuthController.registro);

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *         senha:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         usuario:
 *           type: object
 *           properties:
 *             uid:
 *               type: string
 *             email:
 *               type: string
 *             nome:
 *               type: string
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/recuperar-senha:
 *   post:
 *     summary: Recuperar senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 */
router.post('/recuperar-senha', AuthController.recuperarSenha);

module.exports = router;