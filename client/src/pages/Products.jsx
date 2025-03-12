import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api.js';
import './styles/Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts();
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts(); 
    }, []);

    if (loading) return <div className='loading'>Loading products...</div>
    if (error) return <div className='error'>{error}</div>;

    return (
        <div className='products-page'>
            <div className='container'>
                <h1>Our Products</h1>

                <div className='products-grid'>
                    {products.length > 0 ? (
                        products.map(product => (
                            <div className='product-card' key={product.id}>
                                <div className='product-image'>
                                    {/* Replace with actual product images when available */}
                                    <img 
                                        src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
                                        alt={product.name}
                                    />
                                </div>
                                <div className='product-info'>
                                    <h3>{product.name}</h3>
                                    <p className='product-price'>${product.price}</p>
                                    <Link to={`/products/${product.id}`} className='btn btn-secondary'>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;