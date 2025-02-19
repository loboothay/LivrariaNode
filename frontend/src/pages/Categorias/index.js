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
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { categoriaService } from '../../services/categoriaService';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchCategorias = async () => {
        try {
            const data = await categoriaService.getCategorias();
            setCategorias(data);
        } catch (error) {
            showSnackbar('Erro ao carregar categorias', 'error');
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const handleOpenDialog = (categoria = null) => {
        if (categoria) {
            setSelectedCategoria(categoria);
            setFormData(categoria);
        } else {
            setSelectedCategoria(null);
            setFormData({ nome: '', descricao: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategoria(null);
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
            if (selectedCategoria) {
                await categoriaService.updateCategoria(selectedCategoria.id, formData);
                showSnackbar('Categoria atualizada com sucesso');
            } else {
                await categoriaService.createCategoria(formData);
                showSnackbar('Categoria criada com sucesso');
            }
            handleCloseDialog();
            fetchCategorias();
        } catch (error) {
            showSnackbar(error.response?.data?.erro || 'Erro ao salvar categoria', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
            try {
                await categoriaService.deleteCategoria(id);
                showSnackbar('Categoria excluída com sucesso');
                fetchCategorias();
            } catch (error) {
                showSnackbar('Erro ao excluir categoria', 'error');
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Categorias
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nova Categoria
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categorias.map((categoria) => (
                            <TableRow key={categoria.id}>
                                <TableCell>{categoria.nome}</TableCell>
                                <TableCell>{categoria.descricao}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(categoria)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(categoria.id)} color="error">
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
                    {selectedCategoria ? 'Editar Categoria' : 'Nova Categoria'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Descrição"
                            name="descricao"
                            multiline
                            rows={4}
                            value={formData.descricao}
                            onChange={handleChange}
                        />
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

export default Categorias;