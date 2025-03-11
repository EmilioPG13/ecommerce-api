import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isAuthenticated, onLogout }) => {
    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo">E-Commerce Store</Link>

                <nav className="nav">
                    <ul className="nav-list">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>

                        {isAuthenticated ? (
                            <>
                                <li><Link to="/cart">Cart</Link></li>
                                <li><Link to="/orders">Orders</Link></li>
                                <li>
                                    <button onClick={onLogout} className="logout-button">
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;