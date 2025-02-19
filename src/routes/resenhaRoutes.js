const express = require('express');
const router = express.Router();
const ResenhaController = require('../controllers/resenhaController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Resenha:
 *       type: object
 *       required:
 *         - livroId
 *         - usuarioId
 *         - texto
 *         - avaliacao
 *       properties:
 *         livroId:
 *           type: string
 *           description: ID do livro
 *         usuarioId:
 *           type: string
 *           description: ID do usuário
 *         texto:
 *           type: string
 *           description: Texto da resenha
 *         avaliacao:
 *           type: number
 *           description: Avaliação de 1 a 5
 */

/**
 * @swagger
 * /api/resenhas:
 *   post:
 *     summary: Adicionar uma nova resenha
 *     tags: [Resenhas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resenha'
 *     responses:
 *       201:
 *         description: Resenha criada com sucesso
 */
router.post('/', ResenhaController.adicionarResenha);

/**
 * @swagger
 * /api/resenhas/livro/{livroId}:
 *   get:
 *     summary: Listar todas as resenhas de um livro
 *     tags: [Resenhas]
 *     parameters:
 *       - in: path
 *         name: livroId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de resenhas do livro
 */
router.get('/livro/:livroId', ResenhaController.listarResenhasLivro);

/**
 * @swagger
 * /api/resenhas/{id}:
 *   put:
 *     summary: Atualizar uma resenha
 *     tags: [Resenhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *               avaliacao:
 *                 type: number
 *               usuarioId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resenha atualizada com sucesso
 */
router.put('/:id', ResenhaController.atualizarResenha);

/**
 * @swagger
 * /api/resenhas/{id}:
 *   delete:
 *     summary: Deletar uma resenha
 *     tags: [Resenhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resenha deletada com sucesso
 */
router.delete('/:id', ResenhaController.deletarResenha);

module.exports = router;