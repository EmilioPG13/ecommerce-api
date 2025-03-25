import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart, getCart, createCart } from '../services/api';

const ProductDetail = ({ updateCartCount }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addToCartSuccess, setAddToCartSuccess] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await getProductById(id);
                setProduct(response.data);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to load product details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= product.stock_quantity) {
            setQuantity(value);
        }
    };

    const handleAddToCart = async () => {
        // Get token to check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { from: `/products/${id}` } });
            return;
        }

        try {
            setAddingToCart(true);

            // Get user info from local storage
            const user = JSON.parse(localStorage.getItem('user'));

            // First, ensure user has a cart
            let cartResponse;
            try {
                cartResponse = await getCart(user.id);
            } catch (error) {
                // If no cart exists, create one
                cartResponse = await createCart(user.id);
            }

            const cartId = cartResponse.data.id;

            // Add item to cart
            await addToCart({
                cart_id: cartId,
                product_id: product.id,
                quantity: quantity
            });

            setAddToCartSuccess(true);

            // Call updateCartCount to refresh the cart indicator
            if (updateCartCount) {
                updateCartCount();
            }

            setTimeout(() => setAddToCartSuccess(false), 3000);
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError('Failed to add item to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center py-20 text-gray-600">Loading product details...</div>;
    if (error) return <div className="text-red-500 text-center py-20">{error}</div>;
    if (!product) return <div className="text-red-500 text-center py-20">Product not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        {/* Replace with actual product image */}
                        <img
                            src={`https://via.placeholder.com/600x400?text=${encodeURIComponent(product.name)}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="md:w-1/2 p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                        <p className="text-2xl text-blue-600 font-bold mb-6">${product.price}</p>

                        <div className="bg-gray-100 p-4 rounded-lg mb-6">
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-2">
                                Availability:
                                <span className={product.stock_quantity > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                    {product.stock_quantity > 0 ? ' In Stock' : ' Out of Stock'}
                                </span>
                            </p>
                            {product.stock_quantity > 0 && (
                                <p className="text-sm text-gray-500">{product.stock_quantity} items left</p>
                            )}
                        </div>

                        {product.stock_quantity > 0 && (
                            <div className="flex items-center mb-8">
                                <label htmlFor="quantity" className="text-gray-700 mr-4">Quantity:</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    max={product.stock_quantity}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-20 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        {addToCartSuccess && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                                <p>Product added to cart successfully!</p>
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity <= 0 || addingToCart}
                            className={`w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium 
                                ${(product.stock_quantity <= 0 || addingToCart) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        >
                            {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;