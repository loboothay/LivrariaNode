import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Alert,
    Snackbar
} from '@mui/material';
import api from '../../services/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
        cpf: ''
    });
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/registro', formData);
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.erro === 'auth/email-already-in-use' 
                ? 'Este email já está cadastrado'
                : error.response?.data?.erro || 'Erro ao registrar usuário';
            setError(errorMessage);
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    Cadastro
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Senha"
                        name="senha"
                        type="password"
                        value={formData.senha}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="CPF"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Cadastrar
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link component={RouterLink} to="/login" variant="body2">
                            Já tem uma conta? Faça login
                        </Link>
                    </Box>
                </Box>
            </Paper>
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity="error" 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Register;