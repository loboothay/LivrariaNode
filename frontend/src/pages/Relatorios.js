import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import axios from 'axios';

function Relatorios() {
    const [totalLivros, setTotalLivros] = useState(0);
    const [livrosMaisEmprestados, setLivrosMaisEmprestados] = useState([]);
    const [livrosMaisFavoritados, setLivrosMaisFavoritados] = useState([]);
    // Add new state
    const [usuariosMaisAtivos, setUsuariosMaisAtivos] = useState([]);
    // Add to useEffect
    useEffect(() => {
        carregarTotalLivros();
        carregarLivrosMaisEmprestados();
        carregarLivrosMaisFavoritados();
        carregarUsuariosMaisAtivos();
    }, []);
    // Add new function
    const carregarUsuariosMaisAtivos = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Buscando usuários mais ativos...');
            const response = await axios.get('http://localhost:3000/api/relatorios/usuarios-mais-ativos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Resposta dos usuários:', response.data);
            const usuarios = response.data.usuarios || [];
            console.log('Usuários para tabela:', usuarios);
            setUsuariosMaisAtivos(usuarios);
        } catch (error) {
            console.error('Erro ao carregar usuários mais ativos:', error);
            setUsuariosMaisAtivos([]);
        }
    };
    // Add new component in the return, after the last Grid item
    <Grid item xs={12}>
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Usuários Mais Ativos
        </Typography>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell align="right">Empréstimos</TableCell>
                        <TableCell align="right">Favoritos</TableCell>
                        <TableCell align="right">Resenhas</TableCell>
                        <TableCell align="right">Pontuação Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(usuariosMaisAtivos) && usuariosMaisAtivos.map((usuario) => (
                        <TableRow key={usuario.usuarioId}>
                            <TableCell>{usuario.nome || 'Sem nome'}</TableCell>
                            <TableCell align="right">{usuario.emprestimos || 0}</TableCell>
                            <TableCell align="right">{usuario.favoritos || 0}</TableCell>
                            <TableCell align="right">{usuario.resenhas || 0}</TableCell>
                            <TableCell align="right">{usuario.pontuacaoTotal || 0}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Grid>
    const carregarTotalLivros = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Buscando livros da API...');
            const response = await axios.get('http://localhost:3000/api/livros', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Livros recebidos:', response.data);
            const total = response.data.length;
            console.log('Total calculado:', total);
            setTotalLivros(total);
        } catch (error) {
            console.error('Erro ao carregar livros:', error);
        }
    };

    const carregarLivrosMaisEmprestados = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Buscando livros mais emprestados...');
            const response = await axios.get('http://localhost:3000/api/relatorios/livros-mais-emprestados', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Resposta completa:', response.data);
            const livros = response.data.livros || [];
            console.log('Livros para tabela:', livros);
            setLivrosMaisEmprestados(livros);
        } catch (error) {
            console.error('Erro ao carregar livros mais emprestados:', error);
            setLivrosMaisEmprestados([]);
        }
    };

    const carregarLivrosMaisFavoritados = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Buscando livros mais favoritados...');
            const response = await axios.get('http://localhost:3000/api/relatorios/livros-mais-favoritados', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Resposta dos favoritos:', response.data);
            const livros = response.data.livros || [];
            console.log('Livros favoritos para tabela:', livros);
            setLivrosMaisFavoritados(livros);
        } catch (error) {
            console.error('Erro ao carregar livros mais favoritados:', error);
            setLivrosMaisFavoritados([]);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Relatórios
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total de Livros</Typography>
                            <Typography variant="h3">{totalLivros}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        Livros Mais Emprestados
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Título</TableCell>
                                    <TableCell align="right">Quantidade de Empréstimos</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(livrosMaisEmprestados) && livrosMaisEmprestados.map((livro) => (
                                    <TableRow key={livro.livroId}>
                                        <TableCell>{livro.titulo || 'Sem título'}</TableCell>
                                        <TableCell align="right">{livro.quantidade || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        Livros Mais Favoritados
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Título</TableCell>
                                    <TableCell align="right">Quantidade de Favoritos</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(livrosMaisFavoritados) && livrosMaisFavoritados.map((livro) => (
                                    <TableRow key={livro.livroId}>
                                        <TableCell>{livro.titulo || 'Sem título'}</TableCell>
                                        <TableCell align="right">{livro.quantidade || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        Usuários Mais Ativos
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell align="right">Empréstimos</TableCell>
                                    <TableCell align="right">Favoritos</TableCell>
                                    <TableCell align="right">Resenhas</TableCell>
                                    <TableCell align="right">Pontuação Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(usuariosMaisAtivos) && usuariosMaisAtivos.map((usuario) => (
                                    <TableRow key={usuario.usuarioId}>
                                        <TableCell>{usuario.nome || 'Sem nome'}</TableCell>
                                        <TableCell align="right">{usuario.emprestimos || 0}</TableCell>
                                        <TableCell align="right">{usuario.favoritos || 0}</TableCell>
                                        <TableCell align="right">{usuario.resenhas || 0}</TableCell>
                                        <TableCell align="right">{usuario.pontuacaoTotal || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Relatorios;