const express = require('express');
const router = express.Router();
const FavoritoController = require('../controllers/favoritoController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorito:
 *       type: object
 *       required:
 *         - usuarioId
 *         - livroId
 *       properties:
 *         usuarioId:
 *           type: string
 *           description: ID do usuário
 *         livroId:
 *           type: string
 *           description: ID do livro
 */

/**
 * @swagger
 * /api/favoritos:
 *   post:
 *     summary: Adicionar um livro aos favoritos
 *     tags: [Favoritos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Favorito'
 *     responses:
 *       201:
 *         description: Livro adicionado aos favoritos com sucesso
 */
router.post('/', FavoritoController.adicionarFavorito);

/**
 * @swagger
 * /api/favoritos/{usuarioId}/{livroId}:
 *   delete:
 *     summary: Remover um livro dos favoritos
 *     tags: [Favoritos]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: livroId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro removido dos favoritos com sucesso
 */
router.delete('/:usuarioId/:livroId', FavoritoController.removerFavorito);

/**
 * @swagger
 * /api/favoritos/{usuarioId}:
 *   get:
 *     summary: Listar todos os favoritos de um usuário
 *     tags: [Favoritos]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de livros favoritos do usuário
 */
router.get('/:usuarioId', FavoritoController.listarFavoritos);

module.exports = router;