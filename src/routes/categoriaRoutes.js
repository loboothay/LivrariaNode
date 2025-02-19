const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/categoriaController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome da categoria
 *         descricao:
 *           type: string
 *           description: Descrição da categoria
 */

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Criar uma nova categoria (requer autenticação de administrador)
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 */
router.post('/', CategoriaController.criarCategoria);

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Retorna todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/', CategoriaController.buscarTodasCategorias);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', CategoriaController.buscarCategoriaPorId);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Atualizar uma categoria (requer autenticação de administrador)
 *     tags: [Categorias]
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
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 */
router.put('/:id', CategoriaController.atualizarCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Deletar uma categoria (requer autenticação de administrador)
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso
 */
router.delete('/:id', CategoriaController.deletarCategoria);

module.exports = router;