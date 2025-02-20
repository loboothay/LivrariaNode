import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
    Tabs,
    Tab,
    Box
} from '@mui/material';
import axios from 'axios';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function Relatorios() {
    const [tabValue, setTabValue] = useState(0);
    const [livrosEmprestados, setLivrosEmprestados] = useState([]);
    const [livrosFavoritados, setLivrosFavoritados] = useState([]);
    const [usuariosAtivos, setUsuariosAtivos] = useState([]);

    useEffect(() => {
        carregarRelatorios();
    }, []);

    const carregarRelatorios = async () => {
        try {
            const [emprestados, favoritados, ativos] = await Promise.all([
                axios.get('http://localhost:3001/api/relatorios/livros-mais-emprestados'),
                axios.get('http://localhost:3001/api/relatorios/livros-mais-favoritados'),
                axios.get('http://localhost:3001/api/relatorios/usuarios-mais-ativos')
            ]);

            setLivrosEmprestados(emprestados.data);
            setLivrosFavoritados(favoritados.data);
            setUsuariosAtivos(ativos.data);
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Relatórios
            </Typography>

            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label="Livros Mais Emprestados" />
                <Tab label="Livros Mais Favoritados" />
                <Tab label="Usuários Mais Ativos" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <Card>
                    <CardContent>
                        <List>
                            {livrosEmprestados.map((item, index) => (
                                <ListItem key={item.id}>
                                    <ListItemText
                                        primary={`${index + 1}. ${item.titulo}`}
                                        secondary={`Total de empréstimos: ${item.totalEmprestimos}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Card>
                    <CardContent>
                        <List>
                            {livrosFavoritados.map((item, index) => (
                                <ListItem key={item.id}>
                                    <ListItemText
                                        primary={`${index + 1}. ${item.titulo}`}
                                        secondary={`Total de favoritos: ${item.totalFavoritos}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Card>
                    <CardContent>
                        <List>
                            {usuariosAtivos.map((usuario, index) => (
                                <ListItem key={usuario.id}>
                                    <ListItemText
                                        primary={`${index + 1}. ${usuario.nome}`}
                                        secondary={`Empréstimos: ${usuario.totalEmprestimos} | Resenhas: ${usuario.totalResenhas}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </TabPanel>
        </Container>
    );
}

export default Relatorios;