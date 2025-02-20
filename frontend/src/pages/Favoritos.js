import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Grid,
    Button,
    CardMedia
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const usuarioId = localStorage.getItem('userId');

    useEffect(() => {
        carregarFavoritos();
    }, []);

    const carregarFavoritos = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/favoritos/usuario/${usuarioId}`);
            setFavoritos(response.data);
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
        }
    };

    const removerFavorito = async (livroId) => {
        try {
            await axios.delete(`http://localhost:3001/api/favoritos/${usuarioId}/${livroId}`);
            carregarFavoritos();
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Meus Livros Favoritos
            </Typography>

            <Grid container spacing={3}>
                {favoritos.map((livro) => (
                    <Grid item xs={12} sm={6} md={4} key={livro.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={livro.capa || 'https://via.placeholder.com/200x300'}
                                alt={livro.titulo}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {livro.titulo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {livro.autor}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                    onClick={() => removerFavorito(livro.id)}
                                >
                                    Remover dos Favoritos
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Favoritos;