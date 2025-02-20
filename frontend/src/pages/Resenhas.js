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
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function Resenhas() {
    const [resenhas, setResenhas] = useState([]);
    const [livros, setLivros] = useState([]);
    const [livroSelecionado, setLivroSelecionado] = useState('');
    const [novaResenha, setNovaResenha] = useState({
        livroId: '',
        texto: '',
        avaliacao: 0
    });
    const [editingResenha, setEditingResenha] = useState(null);

    useEffect(() => {
        const fetchLivros = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/livros', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Resposta da API:', response.data);
                setLivros(response.data);
            } catch (error) {
                console.error('Erro ao carregar livros:', error);
            }
        };

        fetchLivros();
    }, []);

    const carregarResenhas = async (livroId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/resenhas/livro/${livroId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setResenhas(response.data);
        } catch (error) {
            console.error('Erro ao carregar resenhas:', error);
        }
    };

    // Adicionar no início do componente, junto com os outros estados
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    // Adicionar após o useEffect dos livros
    // Modificar o useEffect do usuário
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const token = localStorage.getItem('token');
                const nomeUsuario = localStorage.getItem('nome'); // Nome do usuário salvo no login
                
                console.log('Nome do usuário:', nomeUsuario);

                const response = await axios.get('http://localhost:3000/api/usuarios', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Encontrar o usuário pelo nome
                const usuario = response.data.find(u => u.nome === nomeUsuario);
                if (usuario) {
                    console.log('Usuário encontrado:', usuario);
                    setUsuarioLogado(usuario);
                } else {
                    console.error('Usuário não encontrado com o nome:', nomeUsuario);
                }
                
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
            }
        };
    
        fetchUsuario();
    }, []);
    
    // Modificar o handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!novaResenha.livroId || !novaResenha.texto || !novaResenha.avaliacao) {
                alert('Por favor, preencha todos os campos');
                return;
            }
            
            const token = localStorage.getItem('token');
            
            console.log('Usuário logado:', usuarioLogado);
            
            if (!usuarioLogado || !usuarioLogado.id) {
                console.error('Dados do usuário:', usuarioLogado);
                alert('Erro: Dados do usuário não disponíveis. Por favor, faça login novamente.');
                return;
            }
            
            const resenhaData = {
                livroId: novaResenha.livroId,
                usuarioId: usuarioLogado.id,
                texto: novaResenha.texto.trim(),
                avaliacao: novaResenha.avaliacao
            };
            
            console.log('Enviando resenha:', resenhaData);
            
            const response = await axios.post('http://localhost:3000/api/resenhas', resenhaData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Resposta:', response.data);
            
            setNovaResenha({ livroId: '', texto: '', avaliacao: 0 });
            if (livroSelecionado) {
                carregarResenhas(livroSelecionado);
            }
        } catch (error) {
            console.error('Erro ao adicionar resenha:', error.response?.data || error);
            alert('Erro ao adicionar resenha. Por favor, tente novamente.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar esta resenha?')) {
            try {
                const token = localStorage.getItem('token');
                const resenha = resenhas.find(r => r.id === id);
                
                console.log('Tentando deletar resenha:', {
                    resenhaId: id,
                    resenhaUsuarioId: resenha.usuarioId,
                    usuarioLogadoId: usuarioLogado.id,
                    resenhaCompleta: resenha
                });

                await axios.delete(`http://localhost:3000/api/resenhas/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        usuarioId: usuarioLogado.id
                    }
                });
                
                if (livroSelecionado) {
                    carregarResenhas(livroSelecionado);
                }
            } catch (error) {
                console.error('Erro ao deletar resenha:', error);
                alert('Você não tem permissão para deletar esta resenha');
            }
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/resenhas/${editingResenha.id}`, {
                texto: editingResenha.texto,
                avaliacao: editingResenha.avaliacao,
                livroId: editingResenha.livroId,
                usuarioId: usuarioLogado.id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setEditingResenha(null);
            if (livroSelecionado) {
                carregarResenhas(livroSelecionado);
            }
        } catch (error) {
            console.error('Erro ao atualizar resenha:', error);
            alert('Erro ao atualizar resenha');
        }
    };

    const handleLivroChange = (e) => {
        const livroId = e.target.value;
        setLivroSelecionado(livroId);
        setNovaResenha({ ...novaResenha, livroId });
        if (livroId) {
            carregarResenhas(livroId);
        }
    };

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
                                    {editingResenha?.id === resenha.id ? (
                                        <Box component="form" onSubmit={handleEdit}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={editingResenha.texto}
                                                onChange={(e) => setEditingResenha({
                                                    ...editingResenha,
                                                    texto: e.target.value
                                                })}
                                                sx={{ mt: 2, mb: 2 }}
                                            />
                                            <Rating
                                                value={editingResenha.avaliacao}
                                                onChange={(_, newValue) => setEditingResenha({
                                                    ...editingResenha,
                                                    avaliacao: newValue
                                                })}
                                            />
                                            <Box sx={{ mt: 2 }}>
                                                <Button type="submit" variant="contained" sx={{ mr: 1 }}>
                                                    Salvar
                                                </Button>
                                                <Button onClick={() => setEditingResenha(null)}>
                                                    Cancelar
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <>
                                            <Typography variant="body1" sx={{ mt: 2 }}>
                                                {resenha.texto}
                                            </Typography>
                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                                <IconButton 
                                                    onClick={() => setEditingResenha(resenha)}
                                                    color="primary"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton 
                                                    onClick={() => handleDelete(resenha.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </>
                                    )}
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