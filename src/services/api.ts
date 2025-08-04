// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7236/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Busca uma lista paginada de cursos.
 * @param {number} pageNumber - O número da página a ser buscada.
 * @param {number} pageSize - O número de itens por página.
 * @returns {Promise<object>} O resultado paginado da API.
 */
export const getCoursesPaged = async (pageNumber = 1, pageSize = 10) => {
  try {
    // A opção `params` do axios cuida da formatação da query string para você.
    const response = await api.get('/course', {
      params: {
        pageNumber,
        pageSize,
      },
    });
    // --- TRANSFORMAÇÃO IMPORTANTE AQUI ---
    // Pega a resposta e renomeia a propriedade 'courses' para 'items'
    const transformedData = {
      ...response.data, // Copia todas as propriedades (totalCount, etc.)
      items: response.data.courses // Renomeia a lista
    };
    
    return transformedData;
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    // Lança o erro para que o componente que chamou possa tratá-lo.
    throw error;
  }
};

export default api;