import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api.js';
import config from '../config.js';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        search: ''
    });
    const sortOption, setSortOption = useState('name-asc');

    // Items per page from congfig
    const itemsPerPage = config.pageSize;

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

    // Handle search and filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Handle sort change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Apply filters to products
    const filteredProducts = products.filgter(product => {
        // Filter by price range
        if (filters.minPrice && parseFloat(product.price) < parseFloat(filters.minPrice)) {
            return false;
        }
        if (filters.maxPrice && parseFloat(product.price) > parseFloat(filters.maxPrice)) {
            return false;
        }

        // Filter by search term (name or description)
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
            case 'price-asc':
                return parseFloat(a.price) - parseFloat(b.price);
            case 'price-desc':
                return parseFloat(b.price) - parseFloat(a.price);
            case 'name-desc':
                return b.name.localeCompare(a.name);
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

    // Pagination controls
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    if (loading) {
        return (
            <div className='containter mx-auto px-4 py-20'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className='bg-white rounded-lg shadow-md overflow-hidden animate-pulse'>
                            <div className='h-48 bg-gray-200'></div>
                            <div>
                                <div className='h-5 bg-gray-200 rounded mb-2'></div>
                                <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
                                <div className='h-8 bg-gray-200 rounded mt-3'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (error) return <div className='text-red-500 text-center py-20'>{error}</div>;

    return (
        <div className='py-8'>
            <div className='container mx-auto px-4'>
                <h1 className='text-3xl font-bold text-center mb-8'>Our Products</h1>

                {/* Filters and Sort section */}
                <div className='bg-white p-4 rounded-lg shadow-md mb-8'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <div>
                            <label htmlFor="search" className='block text-sm font-medium text-gray-700 mb-1'>
                                Search
                            </label>
                            <input 
                                type='text'
                                id='search'
                                name='search'
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder='Search products...'
                                className='w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="minPrice" className='block text-sm font-medium text-gray-700 mb-1'>
                                Min Price
                            </label>
                            <input 
                                type='number'
                                id='minPrice'
                                name='minPrice'
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                placeholder='Min $'
                                className='w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>

                        <div>
                            <label htmlFor="maxPrice" className='block text-sm font-medium text-gray-700 mb-1'>
                                Max Price
                            </label>
                            <input 
                                type='number'
                                id='maxPrice'
                                name='maxPrice'
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder='Max $'
                                className='w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>

                        <div>
                            <label htmlFor="sort" className='block text-sm font-medium text-gray-700 mb-1'>
                                Sort By
                            </label>
                            <select 
                                id="sort"
                                value={sortOption}
                                onChange={handleSortChange}
                                className='w-full p-2 border border-gray-300 rounded-md'
                            >
                                <option value='name-asc'>Name (A-Z)</option>
                                <option value='name-desc'>Name (Z-A)</option>
                                <option value='price-asc'>Price (Low to High)</option>
                                <option value='price-desc'>Name (High to Low)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results summary */}
                <div className='mb-4 text-gray-600'>
                    {filteredProducts.length === 0 ? (
                        <p>No products match your criteria.</p>
                    ) : (
                        <p>Showing {Math.min(startIndex + 1, filteredProducts.length)} - {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products</p>
                    )}
                </div>

                {/* Product grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {paginatedProducts.length > 0 ? (
                        paginatedProducts.map(product => (
                            <div className='bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-x-1' key={product.id}>
                                <div className='h-48 overflow-hidden'>
                                    <img 
                                        src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
                                        alt={product.name}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div className='p-4'>
                                    <h3 className='text-lg font-semibold'>{product.name}</h3>
                                    <p className='text-blue-600 font-bold mt-1'>{product.price}</p>
                                    <p className='text-gray-500 text-sm mt-1 line-clamp-2'>{product.description}</p>
                                    <Link to={`/products/${product.id}`} className='mt-3 block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='col-span-full text-center text-gray-500'>No products found matching your criteria.</p>
                    )}
                </div>

                {/* Pagination control */}
                {totalPages > 1 && (
                    <div className='flex justify-center mt-8'>
                        <nav className='flex items-center'>
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage -1))}
                                disabled={currentPage === 1}
                                className={`mx-1 px-3 py-1 rounded-md ${
                                    currentPage === 1
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleFilterChange(index + 1)}
                                    className={`mx-1 px-3 py-1 rounded-md ${
                                        currentPage === index + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`mx-1 px-3 py-1 rounded-md ${
                                    currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;