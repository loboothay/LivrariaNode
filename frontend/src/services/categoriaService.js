import api from './api';

export const categoriaService = {
    getCategorias: async () => {
        const response = await api.get('/categorias');
        return response.data;
    },

    createCategoria: async (categoriaData) => {
        const response = await api.post('/categorias', categoriaData);
        return response.data;
    },

    updateCategoria: async (id, categoriaData) => {
        const response = await api.put(`/categorias/${id}`, categoriaData);
        return response.data;
    },

    deleteCategoria: async (id) => {
        const response = await api.delete(`/categorias/${id}`);
        return response.data;
    }
};