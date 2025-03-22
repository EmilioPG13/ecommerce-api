import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem } from '../services/api';

const Cart = ({ userId }) => {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                const response = await getCart(userId);
                setCart(response.data);

                // Fetch cart items with product details
                if (response.data && response.data.CartItems) {
                    setCartItems(response.data.CartItems);

                    // Create a map of product details
                    const productMap = {};
                    for (const item of response.data.CartItems) {
                        productMap[item.product_id] = item.Product;
                    }
                    setProducts(productMap);
                }
            } catch (err) {
                console.error('Error fetching cart:', err);
                setError('Failed to load your cart. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchCart();
        } else {
            setLoading(false);
            setError('Please log in to view your cart');
        }
    }, [userId]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = products[item.product_id];
            return total + (product ? parseFloat(product.price) * item.quantity : 0);
        }, 0).toFixed(2);
    };

    const handleQuantityChange = async (itemId, newQuantity, productId) => {
        try {
            if (newQuantity < 1) newQuantity = 1;
            const product = products[productId];
            if (product && newQuantity > product.stock_quantity) {
                newQuantity = product.stock_quantity;
            }

            await updateCartItem(itemId, { quantity: newQuantity });
            
            setCartItems(cartItems.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ));
        } catch (err) {
            console.error('Error updating cart item:', err);
            setError('Failed to update item quantity. Please try again.');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await removeCartItem(itemId);
            setCartItems(cartItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error removing cart item:', err);
            setError('Failed to remove item from cart. Please try again.');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) return <div className="flex justify-center items-center py-20 text-gray-600">Loading your cart...</div>;
    
    if (error) return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-red-500 text-center py-8">{error}</div>
            <div className="text-center">
                <Link to="/products" className="text-blue-600 hover:underline">
                    Continue shopping
                </Link>
            </div>
        </div>
    );

    if (!cartItems.length) return (
        <div className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
                <Link 
                    to="/products" 
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Browse Products
                </Link>
            </div>
        </div>
    );

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold text-center mb-8'>Your Shopping Cart</h1>

            <div className='bg-white rounded-lg shadow-lg overflow-hidden mb-8'>
                <div className='p-6'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b'>
                                <th className='text-left py-3'>Product</th>
                                <th className='text-center py-3'>Price</th>
                                <th className='text-center py-3'>Quantity</th>
                                <th className='text-right py-3'>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => {
                                const product = products[item.product_id];
                                return product ? (
                                    <tr key={item.id} className='border-b'>
                                        <td className='py-4'>
                                            <div className='flex item-center'>
                                                <div className='h-16 w-16 mr-4 bg-gray-200 rounded overflow-hidden'>
                                                    <img 
                                                        src={`https://via.placeholder.com/100?text=${encodeURIComponent(product.name.substring(0, 10))}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                                <div>
                                                    <Link to={`/product/${product.id}`} className='text-blue-600 hover:underline'>
                                                        {product.name}
                                                    </Link>
                                                    <p className='text-gray-500 text-sm mt-1 line-clamp-1'>{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-4 text-center'>${parseFloat(product.price).toFixed(2)}</td>
                                        <td className='py-4'>
                                            <div className='flex justify-center'>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.product_id)}
                                                >
                                                    -
                                                </button>
                                                <input 
                                                    type='number'
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1, item.product_id)}
                                                    className='w-12 text-center border-t border-b'
                                                    min="1"
                                                    max={product.stock_quantity}
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.product_id)}
                                                    className='px-2 py-1 border rounder-r-md bg-gray-100 hover:bg-gray-200'
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            ${(parseFloat(product.price) * item.quantity).toFixed(2)}
                                        </td>
                                        <td className='p-4 text-right'>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className='text-red-500 hover:text-red-700'
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ) : null;
                            })}
                        </tbody>
                    </table>
                </div>

                <div className='flex flex-col md:flex-row gap-6 justify-between'>
                    <div className='md:w-1/2'>
                        <Link to='/products' className='text-blue-600 hover:underline flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Continue Shopping
                        </Link>
                    </div>

                    <div className='md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-md'>
                        <div className='flex justify-between mb-4'>
                            <span className='text-gray-600'>Subtotal:</span>
                            <span>${calculateTotal()}</span>
                        </div>
                        <div className='flex justify-between mb-4'>
                            <span className='text-gray-600'>Shipping:</span>
                            <span className='font-medium'>Calculated at checkout</span>
                        </div>
                        <div className='border-t border-gray-200 my-4'></div>
                        <div className='flex justify-between mb-6'>
                            <span className='text-lg font-bold'>Estimated Total:</span>
                            <span className='text-lg font-bold'>${calculateTotal()}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className='w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-slate-700 transition-colors'
                        >
                            Proceed to Checkout
                        </button>

                        <div className='mt-4 text-center text-gray-500 text-sm'>
                            <p>Secure chckout powered by Stripe</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};