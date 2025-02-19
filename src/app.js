const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const livroRoutes = require('./routes/livroRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const resenhaRoutes = require('./routes/resenhaRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const authRoutes = require('./routes/authRoutes');
const verificarToken = require('./middleware/authMiddleware');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Livraria',
            version: '1.0.0',
            description: 'API para gerenciamento de uma livraria'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use('/api/livros', livroRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/emprestimos', emprestimoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);

// Proteger todas as outras rotas
app.use('/api/livros', verificarToken, livroRoutes);
app.use('/api/categorias', verificarToken, categoriaRoutes);
app.use('/api/emprestimos', verificarToken, emprestimoRoutes);
app.use('/api/favoritos', verificarToken, favoritoRoutes);
app.use('/api/resenhas', verificarToken, resenhaRoutes);
app.use('/api/relatorios', verificarToken, relatorioRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/resenhas', resenhaRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Redirect root to Swagger documentation
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});