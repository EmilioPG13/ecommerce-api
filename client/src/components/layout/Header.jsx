import React from 'react';
import { Link } from 'react-router-dom';
// Removed Header.css import

const Header = ({ isAuthenticated, onLogout }) => {
    return (
        <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">E-Commerce Store</Link>

                <nav>
                    <ul className="flex space-x-6">
                        <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
                        <li><Link to="/products" className="hover:text-blue-200">Products</Link></li>

                        {isAuthenticated ? (
                            <>
                                <li><Link to="/cart" className="hover:text-blue-200">Cart</Link></li>
                                <li><Link to="/orders" className="hover:text-blue-200">Orders</Link></li>
                                <li>
                                    <button 
                                        onClick={onLogout} 
                                        className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" className="hover:text-blue-200">Login</Link></li>
                                <li><Link to="/register" className="hover:text-blue-200">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;