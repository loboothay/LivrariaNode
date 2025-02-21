import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/usuarios', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Usuários:', response.data);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/api/usuarios/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                carregarUsuarios();
            } catch (error) {
                console.error('Erro ao deletar usuário:', error);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Usuários
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.nome}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>{usuario.tipo || 'Usuário'}</TableCell>
                                <TableCell>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => handleDelete(usuario.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {usuarios.length === 0 && (
                <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
                    Nenhum usuário encontrado
                </Typography>
            )}
        </Container>
    );
}

export default Usuarios;