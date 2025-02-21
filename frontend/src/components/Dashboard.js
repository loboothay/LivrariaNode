import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';

function Dashboard() {
    const cards = [
        {
            title: 'Livros',
            description: 'Gerenciar catálogo de livros',
            icon: <LibraryBooksIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
            link: '/livros'  // Changed from /dashboard
        },
        {
            title: 'Categorias',
            description: 'Gerenciar categorias de livros',
            icon: <CategoryIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
            link: '/categorias'
        },
        {
            title: 'Empréstimos',
            description: 'Controlar empréstimos',
            icon: <MenuBookIcon sx={{ fontSize: 40, color: '#f44336' }} />,
            link: '/emprestimos'
        },
        {
            title: 'Resenhas',
            description: 'Ver e adicionar resenhas',
            icon: <StarIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
            link: '/resenhas'
        },
        {
            title: 'Favoritos',
            description: 'Seus livros favoritos',
            icon: <FavoriteIcon sx={{ fontSize: 40, color: '#e91e63' }} />,
            link: '/favoritos'
        },
        {
            title: 'Relatórios',
            description: 'Visualizar relatórios',
            icon: <AssessmentIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
            link: '/relatorios'
        },
        {
            title: 'Usuários',
            description: 'Gerenciar usuários do sistema',
            icon: <PeopleIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
            link: '/usuarios'
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Olá, {localStorage.getItem('nome')}!
            </Typography>
            <Grid container spacing={3}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} key={card.title}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                {card.icon}
                                <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
                                    {card.title}
                                </Typography>
                                <Typography color="textSecondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                            <Button
                                component={Link}
                                to={card.link}
                                sx={{ 
                                    textTransform: 'uppercase',
                                    mb: 2
                                }}
                            >
                                ACESSAR
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Dashboard;