const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/livroController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Livro:
 *       type: object
 *       required:
 *         - titulo
 *         - autor
 *         - isbn
 *       properties:
 *         titulo:
 *           type: string
 *           description: Título do livro
 *         autor:
 *           type: string
 *           description: Nome do autor do livro
 *         isbn:
 *           type: string
 *           description: ISBN do livro
 *         preco:
 *           type: number
 *           description: Preço do livro
 *         quantidade:
 *           type: integer
 *           description: Quantidade em estoque
 */

/**
 * @swagger
 * /api/livros:
 *   post:
 *     summary: Criar um novo livro
 *     tags: [Livros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 */
router.post('/', LivroController.criarLivro);

/**
 * @swagger
 * /api/livros:
 *   get:
 *     summary: Retorna todos os livros
 *     tags: [Livros]
 *     responses:
 *       200:
 *         description: Lista de livros
 */
router.get('/', LivroController.buscarTodosLivros);

/**
 * @swagger
 * /api/livros/{id}:
 *   get:
 *     summary: Buscar livro por ID
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro encontrado
 *       404:
 *         description: Livro não encontrado
 */
router.get('/:id', LivroController.buscarLivroPorId);

/**
 * @swagger
 * /api/livros/{id}:
 *   put:
 *     summary: Atualizar um livro
 *     tags: [Livros]
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
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 */
router.put('/:id', LivroController.atualizarLivro);

/**
 * @swagger
 * /api/livros/{id}:
 *   delete:
 *     summary: Deletar um livro
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro deletado com sucesso
 */
router.delete('/:id', LivroController.deletarLivro);

module.exports = router;