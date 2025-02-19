const express = require('express');
const router = express.Router();
const EmprestimoController = require('../controllers/emprestimoController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Emprestimo:
 *       type: object
 *       required:
 *         - livroId
 *         - usuarioId
 *       properties:
 *         livroId:
 *           type: string
 *           description: ID do livro
 *         usuarioId:
 *           type: string
 *           description: ID do usuário
 *         dataEmprestimo:
 *           type: string
 *           format: date-time
 *           description: Data do empréstimo
 */

/**
 * @swagger
 * /api/emprestimos:
 *   post:
 *     summary: Registrar um novo empréstimo
 *     tags: [Empréstimos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Emprestimo'
 *     responses:
 *       201:
 *         description: Empréstimo registrado com sucesso
 */
router.post('/', EmprestimoController.registrarEmprestimo);

/**
 * @swagger
 * /api/emprestimos/{emprestimoId}/devolucao:
 *   post:
 *     summary: Registrar devolução de livro
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: emprestimoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Devolução registrada com sucesso
 */
router.post('/:emprestimoId/devolucao', EmprestimoController.registrarDevolucao);

/**
 * @swagger
 * /api/emprestimos/ativos:
 *   get:
 *     summary: Listar todos os empréstimos ativos
 *     tags: [Empréstimos]
 *     responses:
 *       200:
 *         description: Lista de empréstimos ativos
 */
router.get('/ativos', EmprestimoController.listarEmprestimosAtivos);

/**
 * @swagger
 * /api/emprestimos/usuario/{usuarioId}:
 *   get:
 *     summary: Listar histórico de empréstimos de um usuário
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico de empréstimos do usuário
 */
router.get('/usuario/:usuarioId', EmprestimoController.listarHistoricoUsuario);

module.exports = router;