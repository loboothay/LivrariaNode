import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button
} from '@mui/material';
import {
    Book as BookIcon,
    Category as CategoryIcon,
    SwapHoriz as LoanIcon,
    Star as ReviewIcon,
    Favorite as FavoriteIcon,
    Assessment as ReportIcon,
    Person as UserIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const menuItems = [
    { title: 'Livros', icon: <BookIcon />, path: '/livros', color: '#1976d2', description: 'Gerenciar catálogo de livros' },
    { title: 'Categorias', icon: <CategoryIcon />, path: '/categorias', color: '#388e3c', description: 'Gerenciar categorias de livros' },
    { title: 'Empréstimos', icon: <LoanIcon />, path: '/emprestimos', color: '#d32f2f', description: 'Controlar empréstimos' },
    { title: 'Resenhas', icon: <ReviewIcon />, path: '/resenhas', color: '#f57c00', description: 'Ver e adicionar resenhas' },
    { title: 'Favoritos', icon: <FavoriteIcon />, path: '/favoritos', color: '#c2185b', description: 'Seus livros favoritos' },
    { title: 'Relatórios', icon: <ReportIcon />, path: '/relatorios', color: '#7b1fa2', description: 'Visualizar relatórios' },
    { title: 'Usuários', icon: <UserIcon />, path: '/usuarios', color: '#0288d1', description: 'Gerenciar usuários do sistema' }
];

function Dashboard() {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            return payload;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const token = localStorage.getItem('token');
                const tokenData = decodeToken(token);
                const emailFromToken = tokenData?.email;

                if (!emailFromToken) {
                    console.error('Email não encontrado no token');
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/usuarios', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const usuarioEncontrado = response.data.find(
                    user => user.email.toLowerCase() === emailFromToken.toLowerCase()
                );
                
                if (usuarioEncontrado) {
                    setUsuario(usuarioEncontrado);
                    localStorage.setItem('nome', usuarioEncontrado.nome);
                    localStorage.setItem('userId', usuarioEncontrado.id);
                    localStorage.setItem('email', usuarioEncontrado.email);
                } else {
                    console.error('Usuário não encontrado com o email:', emailFromToken);
                }
                
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
            }
        };

        fetchUsuario();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom component="h1">
                {usuario ? `Olá, ${usuario.nome}!` : 'Carregando...'}
            </Typography>
            <Grid container spacing={3}>
                {menuItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.title}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s ease-in-out'
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mb: 2,
                                        color: item.color
                                    }}
                                >
                                    {React.cloneElement(item.icon, { sx: { fontSize: 40 } })}
                                </Box>
                                <Typography gutterBottom variant="h5" component="h2" align="center">
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    {item.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    size="small" 
                                    fullWidth
                                    onClick={() => navigate(item.path)}
                                    sx={{ color: item.color }}
                                >
                                    Acessar
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Dashboard;