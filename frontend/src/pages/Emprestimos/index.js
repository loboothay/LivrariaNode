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
    AssignmentReturn as ReturnIcon
} from '@mui/icons-material';
import { emprestimoService } from '../../services/emprestimoService';
import { livroService } from '../../services/livroService';
// Add to imports
import { usuarioService } from '../../services/usuarioService';
// Add axios to imports at the top
import axios from 'axios';
// Add this helper function before the Emprestimos component
// Update the formatDate function to handle both cases
const formatDate = (dateString, allowEmpty = false) => {
    if (!dateString && allowEmpty) return '-';
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
};

const Emprestimos = () => {
    const [emprestimos, setEmprestimos] = useState([]);
    const [livros, setLivros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        livroId: '',
        usuarioId: '',
        dataEmprestimo: new Date().toISOString().split('T')[0],
        dataDevolucaoPrevista: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        emprestimoId: null
    });

    const fetchData = async () => {
        try {
            const [emprestimosData, livrosData, usuariosData] = await Promise.all([
                emprestimoService.getEmprestimos(),
                livroService.getLivros(),
                usuarioService.getUsuarios()
            ]);
            setEmprestimos(emprestimosData);
            setLivros(livrosData);
            setUsuarios(usuariosData);
        } catch (error) {
            showSnackbar('Erro ao carregar dados', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            livroId: '',
            usuarioId: '',
            dataEmprestimo: new Date().toISOString().split('T')[0],
            dataDevolucaoPrevista: ''
        });
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
            await emprestimoService.createEmprestimo(formData);
            showSnackbar('Empréstimo registrado com sucesso');
            handleCloseDialog();
            fetchData();
        } catch (error) {
            showSnackbar(error.response?.data?.erro || 'Erro ao registrar empréstimo', 'error');
        }
    };

    const handleConfirmDevolucao = (id) => {
        setConfirmDialog({
            open: true,
            emprestimoId: id
        });
    };
    // Then the handleDevolucao function will work as is
    const handleDevolucao = async () => {
        try {
            console.log('Tentando registrar devolução para o ID:', confirmDialog.emprestimoId);
            const response = await axios.post(
                `http://localhost:3000/api/emprestimos/${confirmDialog.emprestimoId}/devolucao`
            );
            console.log('Resposta da devolução:', response);
            showSnackbar('Devolução registrada com sucesso');
            setConfirmDialog({ open: false, emprestimoId: null });
            fetchData();
        } catch (error) {
            console.error('Erro completo:', error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.erro || 
                               `Erro ao registrar devolução (${error.message})`;
            showSnackbar(errorMessage, 'error');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Empréstimos
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                >
                    Novo Empréstimo
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Livro</TableCell>
                            <TableCell>Usuário</TableCell>
                            <TableCell>Data Empréstimo</TableCell>
                            <TableCell>Data Prevista</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {emprestimos.map((emprestimo) => (
                            <TableRow key={emprestimo.id}>
                                <TableCell>{emprestimo.livroTitulo}</TableCell>
                                <TableCell>{emprestimo.usuarioNome}</TableCell>
                                <TableCell>{formatDate(emprestimo.dataEmprestimo)}</TableCell>
                                <TableCell>{emprestimo.dataDevolucaoPrevista || '-'}</TableCell>
                                <TableCell>{emprestimo.status}</TableCell>
                                <TableCell>
                                    {emprestimo.status === 'ativo' && (  // Changed from 'ATIVO' to 'ativo'
                                        <IconButton 
                                            onClick={() => handleConfirmDevolucao(emprestimo.id)}
                                            color="primary"
                                            title="Registrar Devolução"
                                        >
                                            <ReturnIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Novo Empréstimo</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Livro</InputLabel>
                            <Select
                                value={formData.livroId}
                                label="Livro"
                                name="livroId"
                                onChange={handleChange}
                            >
                                {livros.map((livro) => (
                                    <MenuItem key={livro.id} value={livro.id}>
                                        {livro.titulo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Usuário</InputLabel>
                            <Select
                                value={formData.usuarioId}
                                label="Usuário"
                                name="usuarioId"
                                onChange={handleChange}
                            >
                                {usuarios.map((usuario) => (
                                    <MenuItem key={usuario.id} value={usuario.id}>
                                        {usuario.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Data de Devolução Prevista"
                            name="dataDevolucaoPrevista"
                            type="date"
                            value={formData.dataDevolucaoPrevista}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: new Date().toISOString().split('T')[0]
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Registrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add this dialog before the Snackbar */}
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, emprestimoId: null })}
            >
                <DialogTitle>Confirmar Devolução</DialogTitle>
                <DialogContent>
                    <Typography>
                        Tem certeza que deseja registrar a devolução deste empréstimo?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setConfirmDialog({ open: false, emprestimoId: null })}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDevolucao}
                        variant="contained"
                        color="primary"
                    >
                        Confirmar
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

export default Emprestimos;