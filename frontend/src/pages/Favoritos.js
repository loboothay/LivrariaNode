import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Box
} from '@mui/material';
import axios from 'axios';
import { Delete as DeleteIcon } from '@mui/icons-material';

function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);

    useEffect(() => {
        carregarFavoritos();
    }, []);

    const carregarFavoritos = async () => {
        try {
            const token = localStorage.getItem('token');
            const nomeUsuario = localStorage.getItem('nome'); // Nome do usuário salvo no login
            
            // Primeiro busca todos os usuários
            const usuariosResponse = await axios.get('http://localhost:3000/api/usuarios', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Encontra o usuário pelo nome
            const usuario = usuariosResponse.data.find(u => u.nome === nomeUsuario);
            
            if (!usuario) {
                console.error('Usuário não encontrado:', nomeUsuario);
                return;
            }

            console.log('Usuário encontrado:', usuario);

            // Busca os favoritos com o ID do usuário
            const response = await axios.get(`http://localhost:3000/api/favoritos/${usuario.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Favoritos recebidos:', response.data);
            setFavoritos(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
            setFavoritos([]);
        }
    };

    const removerFavorito = async (livroId) => {
        try {
            const token = localStorage.getItem('token');
            const nomeUsuario = localStorage.getItem('nome');
            
            // Busca o ID do usuário
            const usuariosResponse = await axios.get('http://localhost:3000/api/usuarios', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const usuario = usuariosResponse.data.find(u => u.nome === nomeUsuario);
            
            if (!usuario) {
                console.error('Usuário não encontrado');
                return;
            }

            // Remove o favorito usando o endpoint correto
            await axios.delete(`http://localhost:3000/api/favoritos/${usuario.id}/${livroId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Favorito removido com sucesso');
            carregarFavoritos(); // Recarrega a lista após remover
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
                {favoritos.map((favorito) => (
                    <Grid item xs={12} sm={6} md={4} key={favorito.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={'https://placehold.co/400x600'}
                                alt={favorito.livroTitulo}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {favorito.livroTitulo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {favorito.livroAutor}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => removerFavorito(favorito.livroId)}
                                >
                                    Remover dos Favoritos
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                {favoritos.length === 0 && (
                    <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            Você ainda não tem livros favoritos
                        </Typography>
                    </Box>
                )}
            </Grid>
        </Container>
    );
}

export default Favoritos;