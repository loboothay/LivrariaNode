import React from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
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
    Assessment as ReportIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const menuItems = [
    { title: 'Livros', icon: <BookIcon />, path: '/livros', color: '#1976d2' },
    { title: 'Categorias', icon: <CategoryIcon />, path: '/categorias', color: '#388e3c' },
    { title: 'Empréstimos', icon: <LoanIcon />, path: '/emprestimos', color: '#d32f2f' },
    { title: 'Resenhas', icon: <ReviewIcon />, path: '/resenhas', color: '#f57c00' },
    { title: 'Favoritos', icon: <FavoriteIcon />, path: '/favoritos', color: '#c2185b' },
    { title: 'Relatórios', icon: <ReportIcon />, path: '/relatorios', color: '#7b1fa2' }
];

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom component="h1">
                Dashboard
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
};

export default Dashboard;