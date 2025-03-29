import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable sending cookies with requests
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth endpoints
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');

// Products endpoints
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);

// Cart endpoints
export const getCart = (userId) => api.get(`/carts/${userId}`);
export const getCartByUserId = (userId) => { return axios.get(`/api/carts/user/${userId}`); };
export const createCart = (userData) => api.post('/carts', userData);
export const addToCart = (cartItemData) => api.post('/cart-items', cartItemData);
export const updateCartItem = (id, cartItemData) => api.put(`/cart-items/${id}`, cartItemData);
export const removeCartItem = (id) => api.delete(`/cart-items/${id}`);
// Orders endpoints
export const getUserOrders = (userId) => api.get(`/orders?userId=${userId}`);
export const checkout = (userId) => api.post('/checkout', { userId });
export const getCartSummary = (userId) => { return axios.get(`/api/carts/summary/${userId}`); };

export default api;