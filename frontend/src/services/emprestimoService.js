import api from './api';

export const emprestimoService = {
    getEmprestimos: async () => {
        const response = await api.get('/emprestimos/ativos');
        return response.data;
    },

    createEmprestimo: async (emprestimoData) => {
        const response = await api.post('/emprestimos', emprestimoData);
        return response.data;
    },

    registrarDevolucao: async (id) => {
        const response = await api.put(`/emprestimos/${id}/devolucao`);
        return response.data;
    },

    getHistoricoUsuario: async (usuarioId) => {
        const response = await api.get(`/emprestimos/usuario/${usuarioId}`);
        return response.data;
    }
};