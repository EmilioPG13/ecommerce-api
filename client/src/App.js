import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import { jwtDecode } from 'jwt-decode';
// Removed App.css import

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in on app load
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp > currentTime) {
                    setIsAuthenticated(true);
                    setUser({ id: decodedToken.userId });
                } else {
                    // Token expired
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        setUser({ id: decodedToken.userId });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route
                            path="/login"
                            element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
                        />
                        <Route
                            path="/register"
                            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
                        />
                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Cart userId={user?.id} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Checkout userId={user?.id} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <OrderHistory userId={user?.id} />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;