import React from 'react';
import { Link } from 'react-router-dom';
// Removed styles/Home.css import

const Home = () => {
    return (
        <div>
            <div className="bg-blue-500 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to my E-Commerce Store</h1>
                    <p className="text-xl mb-6">Discover amazing products at great prices.</p>
                    <Link to='/products' className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition">Shop Now!</Link>
                </div>
            </div>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
                    <div className="text-center">
                        {/* Featured products will be loaded here */}
                        <p className="text-gray-500">Loading featured products...</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;