import api from './api';

export const sendChatMessage = async (message) => {
  const response = await api.post('/ai/chat', { message });
  return response.data;
};

export const analyzeWardrobe = async () => {
  const response = await api.get('/ai/analyze');
  return response.data;
};

export const getStyleAdvice = async (query) => {
  const response = await api.get('/ai/advice', { params: { query } });
  return response.data;
};