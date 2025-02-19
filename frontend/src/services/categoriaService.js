import api from './api';

export const categoriaService = {
    getCategorias: async () => {
        const response = await api.get('/categorias');
        return response.data;
    }
};