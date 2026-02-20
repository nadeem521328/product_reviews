import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Adjust this to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const analyzeProduct = async (productId) => {
  try {
    const response = await api.post('/analyze-product', { product_id: productId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const analyzeReview = async (reviewText) => {
  try {
    const response = await api.post('/analyze-review', { review_text: reviewText });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
