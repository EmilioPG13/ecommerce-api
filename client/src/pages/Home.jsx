import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css'

const Home = () => {
    return (
        <div className='home-page'>
            <div className='hero'>
                <div className='container'>
                    <h1>Welcome to my E-Commerce Store</h1>
                    <p>Discover amazing products at great prices.</p>
                    <Link to='/products' className='btn btn-primary'>Shop Now!</Link>
                </div>
            </div>

            <section className='featured-products'>
                <div className='container'>
                    <h2>Featured Products</h2>
                    <div>
                        {/* Featured products will be loaded here */}
                        <p>Loading featured products...</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;