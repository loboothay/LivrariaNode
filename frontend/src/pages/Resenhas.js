import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Rating,
    Box,
    MenuItem // Adicionado MenuItem aos imports
} from '@mui/material';
import axios from 'axios';

function Resenhas() {
    const [resenhas, setResenhas] = useState([]);
    const [livros, setLivros] = useState([]);
    const [livroSelecionado, setLivroSelecionado] = useState('');
    const [novaResenha, setNovaResenha] = useState({
        livroId: '',
        texto: '',
        avaliacao: 0
    });

    useEffect(() => {
        const fetchLivros = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/livros', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Verificar e transformar os dados se necessário
                const livrosData = response.data;
                if (livrosData && typeof livrosData === 'object') {
                    // Se for um objeto, converte para array
                    const livrosArray = Array.isArray(livrosData) ? livrosData : Object.values(livrosData);
                    console.log('Livros processados:', livrosArray);
                    setLivros(livrosArray);
                }
            } catch (error) {
                console.error('Erro detalhado:', error.response || error);
            }
        };

        fetchLivros();
    }, []);

    // Remover a função carregarLivros duplicada que não está sendo usada
    useEffect(() => {
        if (livroSelecionado) {
            carregarResenhas(livroSelecionado);
        }
    }, [livroSelecionado]);

    const carregarLivros = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/livros', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Livros carregados:', response.data); // Para debug
            setLivros(response.data);
        } catch (error) {
            console.error('Erro ao carregar livros:', error);
        }
    };

    const carregarResenhas = async (livroId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3001/api/resenhas/livro/${livroId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Resenhas carregadas:', response.data); // Para debug
            setResenhas(response.data);
        } catch (error) {
            console.error('Erro ao carregar resenhas:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/api/resenhas', novaResenha, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNovaResenha({ livroId: '', texto: '', avaliacao: 0 });
            if (livroSelecionado) {
                carregarResenhas(livroSelecionado);
            }
        } catch (error) {
            console.error('Erro ao adicionar resenha:', error);
        }
    };

    const handleLivroChange = (e) => {
        const livroId = e.target.value;
        setLivroSelecionado(livroId);
        setNovaResenha({ ...novaResenha, livroId });
    };

    // REMOVER esta segunda declaração do handleSubmit (linhas 89-100)
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await axios.post('http://localhost:3001/api/resenhas', novaResenha);
    //         setNovaResenha({ livroId: '', texto: '', avaliacao: 0 });
    //         carregarResenhas();
    //     } catch (error) {
    //         console.error('Erro ao adicionar resenha:', error);
    //     }
    // };
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Resenhas
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Selecione um livro"
                            value={novaResenha.livroId}
                            onChange={handleLivroChange}
                        >
                            <MenuItem value="">
                                <em>Selecione um livro</em>
                            </MenuItem>
                            {livros.map((livro) => (
                                <MenuItem key={livro.id} value={livro.id}>
                                    {livro.titulo}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Sua resenha"
                            value={novaResenha.texto}
                            onChange={(e) => setNovaResenha(prev => ({ ...prev, texto: e.target.value }))}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography component="legend">Avaliação</Typography>
                        <Rating
                            value={novaResenha.avaliacao}
                            onChange={(_, newValue) => setNovaResenha(prev => ({ ...prev, avaliacao: newValue }))}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            disabled={!novaResenha.livroId}
                        >
                            Adicionar Resenha
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {livroSelecionado && (
                <Grid container spacing={2}>
                    {resenhas.map((resenha) => (
                        <Grid item xs={12} md={6} key={resenha.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">
                                        {livros.find(l => l.id === resenha.livroId)?.titulo}
                                    </Typography>
                                    <Rating value={resenha.avaliacao} readOnly />
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {resenha.texto}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default Resenhas;