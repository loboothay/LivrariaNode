const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/relatorioController');

/**
 * @swagger
 * /api/relatorios/livros-mais-emprestados:
 *   get:
 *     summary: Gerar relatório de livros mais emprestados
 *     tags: [Relatórios]
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 */
router.get('/livros-mais-emprestados', RelatorioController.livrosMaisEmprestados);

/**
 * @swagger
 * /api/relatorios/livros-mais-favoritados:
 *   get:
 *     summary: Gerar relatório de livros mais favoritados
 *     tags: [Relatórios]
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 */
router.get('/livros-mais-favoritados', RelatorioController.livrosMaisFavoritados);

/**
 * @swagger
 * /api/relatorios/usuarios-mais-ativos:
 *   get:
 *     summary: Gerar relatório de usuários mais ativos
 *     tags: [Relatórios]
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 */
router.get('/usuarios-mais-ativos', RelatorioController.usuariosMaisAtivos);

module.exports = router;