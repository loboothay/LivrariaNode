// ... existing imports ...

const relatoriosRouter = require('./routes/relatorios');
app.use('/api/relatorios', relatoriosRouter);

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/livros', livrosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/auth', authRouter);
app.use('/api/resenhas', resenhasRouter);
app.use('/api/relatorios', relatoriosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;