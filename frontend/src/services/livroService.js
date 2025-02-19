import api from './api';

export const livroService = {
    getLivros: async () => {
        const response = await api.get('/livros');
        return response.data;
    },

    createLivro: async (livroData) => {
        const response = await api.post('/livros', livroData);
        return response.data;
    },

    updateLivro: async (id, livroData) => {
        const response = await api.put(`/livros/${id}`, livroData);
        return response.data;
    },

    deleteLivro: async (id) => {
        const response = await api.delete(`/livros/${id}`);
        return response.data;
    }
};