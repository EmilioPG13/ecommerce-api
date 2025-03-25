import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated, onLogout, user, cartItemCount = 0 }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        onLogout();
    };

    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold tracking-tight flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                        E-Commerce
                    </Link>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white p-2 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-8 items-center">
                            <li><Link to="/" className="font-medium hover:text-blue-100 transition-colors">Home</Link></li>
                            <li><Link to="/products" className="font-medium hover:text-blue-100 transition-colors">Products</Link></li>

                            {isAuthenticated ? (
                                <>
                                    <li>
                                        <Link to="/cart" className="font-medium hover:text-blue-100 transition-colors relative">
                                            Cart
                                            {cartItemCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {cartItemCount}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                    <li><Link to="/orders" className="font-medium hover:text-blue-100 transition-colors">Orders</Link></li>
                                    <li className="text-blue-100">
                                        {user ? `Hello, ${user.name}` : ''}
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-white text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login" className="font-medium hover:text-blue-100 transition-colors">Login</Link></li>
                                    <li>
                                        <Link
                                            to="/register"
                                            className="bg-white text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>

                {/* Mobile navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pt-4 border-t border-blue-500">
                        <ul className="flex flex-col space-y-4">
                            <li><Link to="/" className="block font-medium hover:text-blue-200">Home</Link></li>
                            <li><Link to="/products" className="block font-medium hover:text-blue-200">Products</Link></li>

                            {isAuthenticated ? (
                                <>
                                    <li>
                                        <Link to="/cart" className="block font-medium hover:text-blue-200 relative inline-block">
                                            Cart
                                            {cartItemCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {cartItemCount}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                    <li><Link to="/orders" className="block font-medium hover:text-blue-200">Orders</Link></li>
                                    <li className="text-blue-100 font-medium">
                                        {user ? `Hello, ${user.name}` : ''}
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left bg-blue-700 px-3 py-2 rounded font-medium hover:bg-blue-800"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login" className="block font-medium hover:text-blue-200">Login</Link></li>
                                    <li><Link to="/register" className="block font-medium hover:text-blue-200">Register</Link></li>
                                </>
                            )}
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;