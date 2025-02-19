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
    FormControl,
    // Adicionar os novos componentes aqui
    TablePagination,
    CircularProgress,
    TableSortLabel
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
}

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

    // Novos estados
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState('dataEmprestimo');
    const [order, setOrder] = useState('desc');
    const [filterStatus, setFilterStatus] = useState('todos');

    // Modificar o fetchData para incluir loading
    const fetchData = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

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

    const handleDevolucao = async () => {
        try {
            await axios.post(
                `http://localhost:3000/api/emprestimos/${confirmDialog.emprestimoId}/devolucao`
            );
            showSnackbar('Devolução registrada com sucesso');
            setConfirmDialog({ open: false, emprestimoId: null });
            fetchData();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.erro || 
                               `Erro ao registrar devolução (${error.message})`;
            showSnackbar(errorMessage, 'error');
        }
    };

    // Funções para paginação
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Função para ordenação
    const handleSort = (property) => () => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Função para filtrar por status
    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
        setPage(0);
    };

    // Função para ordenar e filtrar os dados
    const getProcessedEmprestimos = () => {
        let filteredEmprestimos = [...emprestimos];

        // Aplicar filtro
        if (filterStatus !== 'todos') {
            filteredEmprestimos = filteredEmprestimos.filter(emp => emp.status === filterStatus);
        }

        // Aplicar ordenação
        filteredEmprestimos.sort((a, b) => {
            let comparison = 0;
            switch (orderBy) {
                case 'dataEmprestimo':
                    comparison = new Date(a.dataEmprestimo) - new Date(b.dataEmprestimo);
                    break;
                case 'dataDevolucaoPrevista':
                    comparison = new Date(a.dataDevolucaoPrevista) - new Date(b.dataDevolucaoPrevista);
                    break;
                default:
                    comparison = a[orderBy] < b[orderBy] ? -1 : 1;
            }
            return order === 'desc' ? -comparison : comparison;
        });

        return filteredEmprestimos;
    };

    // Modificar o return para incluir as novas funcionalidades
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Empréstimos
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filterStatus}
                            label="Status"
                            onChange={handleFilterChange}
                            size="small"
                        >
                            <MenuItem value="todos">Todos</MenuItem>
                            <MenuItem value="ativo">Ativos</MenuItem>
                            <MenuItem value="devolvido">Devolvidos</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                    >
                        Novo Empréstimo
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'livroTitulo'}
                                            direction={orderBy === 'livroTitulo' ? order : 'asc'}
                                            onClick={handleSort('livroTitulo')}
                                        >
                                            Livro
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'usuarioNome'}
                                            direction={orderBy === 'usuarioNome' ? order : 'asc'}
                                            onClick={handleSort('usuarioNome')}
                                        >
                                            Usuário
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'dataEmprestimo'}
                                            direction={orderBy === 'dataEmprestimo' ? order : 'asc'}
                                            onClick={handleSort('dataEmprestimo')}
                                        >
                                            Data Empréstimo
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'dataDevolucaoPrevista'}
                                            direction={orderBy === 'dataDevolucaoPrevista' ? order : 'asc'}
                                            onClick={handleSort('dataDevolucaoPrevista')}
                                        >
                                            Data Prevista
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'status'}
                                            direction={orderBy === 'status' ? order : 'asc'}
                                            onClick={handleSort('status')}
                                        >
                                            Status
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getProcessedEmprestimos()
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((emprestimo) => (
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
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={getProcessedEmprestimos().length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Itens por página"
                        />
                    </>
                )}
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