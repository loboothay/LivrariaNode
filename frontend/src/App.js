import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Dashboard from './components/Dashboard'; // Changed from pages to components
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Usuarios from './pages/Usuarios'; // Added Usuarios import
import Livros from './pages/Livros';
import Categorias from './pages/Categorias';
import Emprestimos from './pages/Emprestimos';
import Resenhas from './pages/Resenhas';
import Favoritos from './pages/Favoritos';
import Relatorios from './pages/Relatorios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? (
        <>
            <Navbar />
            {children}
        </>
    ) : (
        <Navigate to="/login" />
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/livros"
                        element={
                            <PrivateRoute>
                                <Livros />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/usuarios"
                        element={
                            <PrivateRoute>
                                <Usuarios />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/categorias"
                        element={
                            <PrivateRoute>
                                <Categorias />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/emprestimos"
                        element={
                            <PrivateRoute>
                                <Emprestimos />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/resenhas"
                        element={
                            <PrivateRoute>
                                <Resenhas />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/favoritos"
                        element={
                            <PrivateRoute>
                                <Favoritos />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/relatorios"
                        element={
                            <PrivateRoute>
                                <Relatorios />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
