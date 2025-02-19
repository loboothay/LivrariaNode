const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const livroRoutes = require('./routes/livroRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');

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
        ]
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
app.use('/api/favoritos', favoritoRoutes);

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