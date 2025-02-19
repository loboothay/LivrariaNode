import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Snackbar,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { livroService } from '../../services/livroService';
import { categoriaService } from '../../services/categoriaService';

const Livros = () => {
    const [livros, setLivros] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLivro, setSelectedLivro] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        autor: '',
        isbn: '',
        preco: '',
        quantidade: '',
        categoriaId: ''
    });
    const [categorias, setCategorias] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchLivros = async () => {
        try {
            const data = await livroService.getLivros();
            setLivros(data);
        } catch (error) {
            showSnackbar('Erro ao carregar livros', 'error');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [livrosData, categoriasData] = await Promise.all([
                    livroService.getLivros(),
                    categoriaService.getCategorias()
                ]);
                setLivros(livrosData);
                setCategorias(categoriasData);
            } catch (error) {
                showSnackbar('Erro ao carregar dados', 'error');
            }
        };
        fetchData();
    }, []);

    const handleOpenDialog = (livro = null) => {
        if (livro) {
            setSelectedLivro(livro);
            setFormData(livro);
        } else {
            setSelectedLivro(null);
            setFormData({
                titulo: '',
                autor: '',
                isbn: '',
                preco: '',
                quantidade: '',
                categoriaId: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedLivro(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedLivro) {
                await livroService.updateLivro(selectedLivro.id, formData);
                showSnackbar('Livro atualizado com sucesso');
            } else {
                await livroService.createLivro(formData);
                showSnackbar('Livro criado com sucesso');
            }
            handleCloseDialog();
            fetchLivros();
        } catch (error) {
            showSnackbar(error.response?.data?.erro || 'Erro ao salvar livro', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este livro?')) {
            try {
                await livroService.deleteLivro(id);
                showSnackbar('Livro excluído com sucesso');
                fetchLivros();
            } catch (error) {
                showSnackbar('Erro ao excluir livro', 'error');
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Livros
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Novo Livro
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Autor</TableCell>
                            <TableCell>ISBN</TableCell>
                            <TableCell>Preço</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {livros.map((livro) => (
                            <TableRow key={livro.id}>
                                <TableCell>{livro.titulo}</TableCell>
                                <TableCell>{livro.autor}</TableCell>
                                <TableCell>{livro.isbn}</TableCell>
                                <TableCell>R$ {livro.preco}</TableCell>
                                <TableCell>{livro.quantidade}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(livro)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(livro.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedLivro ? 'Editar Livro' : 'Novo Livro'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Título"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Autor"
                            name="autor"
                            value={formData.autor}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="ISBN"
                            name="isbn"
                            value={formData.isbn}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Preço"
                            name="preco"
                            type="number"
                            value={formData.preco}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Quantidade"
                            name="quantidade"
                            type="number"
                            value={formData.quantidade}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Categoria</InputLabel>
                            <Select
                                value={formData.categoriaId || ''}
                                label="Categoria"
                                name="categoriaId"
                                onChange={handleChange}
                            >
                                {categorias.map((categoria) => (
                                    <MenuItem key={categoria.id} value={categoria.id}>
                                        {categoria.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Livros;