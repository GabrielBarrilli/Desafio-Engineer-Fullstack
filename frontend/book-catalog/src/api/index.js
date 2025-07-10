import axios from 'axios';

/**
 * Base = http://localhost:8080/api/livros
 * (altere VITE_API_URL se o host/porta forem diferentes)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/livros',
});

/* ---------- Endpoints ---------- */

// GET /api/livros?titulo=&autor=&page=&size=
export const getBooks = (params) => api.get('', { params });

// GET /api/livros/buscar-por-id/{id}
export const getBookById = (id) => api.get(`/buscar-por-id/${id}`);

// POST /api/livros
export const createBook = (payload) => api.post('', payload);

// PUT /api/livros/atualizar/{id}
export const updateBook = (id, payload) => api.put(`/atualizar/${id}`, payload);

// DELETE /api/livros/deletar/{id}
export const deleteBook = (id) => api.delete(`/deletar/${id}`);

export default api;
