import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api.js';
// Removed styles/Products.css import

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

    if (loading) return <div className='flex justify-center items-center py-20 text-gray-600'>Loading products...</div>
    if (error) return <div className='text-red-500 text-center py-20'>{error}</div>;

    return (
        <div className='py-8'>
            <div className='container mx-auto px-4'>
                <h1 className='text-3xl font-bold text-center mb-8'>Our Products</h1>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {products.length > 0 ? (
                        products.map(product => (
                            <div className='bg-white rounded-lg shadow-md overflow-hidden' key={product.id}>
                                <div className='h-48 overflow-hidden'>
                                    {/* Replace with actual product images when available */}
                                    <img 
                                        src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
                                        alt={product.name}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div className='p-4'>
                                    <h3 className='text-lg font-semibold'>{product.name}</h3>
                                    <p className='text-blue-600 font-bold mt-1'>${product.price}</p>
                                    <Link to={`/products/${product.id}`} className='mt-3 block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='col-span-full text-center text-gray-500'>No products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;