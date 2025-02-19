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

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, senha });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.erro || 'Erro ao fazer login';
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
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Entrar
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link component={RouterLink} to="/register" variant="body2">
                            Não tem uma conta? Cadastre-se
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

export default Login;