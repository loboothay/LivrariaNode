import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box
} from '@mui/material';
import {
    Menu as MenuIcon,
    ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Livraria
                </Typography>
                <Box>
                    <Button color="inherit" onClick={() => navigate('/dashboard')}>
                        Dashboard
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1 }} />
                        Sair
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;