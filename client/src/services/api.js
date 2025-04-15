import axios from 'axios';
import config from '../config'

const API_URL = config.apiUrl;

console.log("API Service using Base URL:", API_URL); 

// Create axios instance
const api = axios.create({
    baseURL: API_URL,  // Use absolute URL instead of relative
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
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
export const getCartByUserId = (userId) => api.get(`/carts/user/${userId}`);
export const createCart = (userData) => api.post('/carts', userData);
export const addToCart = (cartItemData) => api.post('/cart-items', cartItemData);
export const updateCartItem = (id, cartItemData) => api.put(`/cart-items/${id}`, cartItemData);
export const removeCartItem = (id) => api.delete(`/cart-items/${id}`);

// Orders endpoints
export const getUserOrders = (userId) => api.get(`/orders?userId=${userId}`);
export const checkout = (userId) => api.post('/checkout', { userId });
// FIX: Don't use axios directly, use your configured api instance
export const getCartSummary = (userId) => api.get(`/carts/summary/${userId}`);

export default api;