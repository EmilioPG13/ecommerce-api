import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartByUserId, getCartSummary, updateCartItem, removeCartItem } from '../services/api';

const Cart = ({ userId }) => {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [summary, setSummary] = useState({ itemCount: 0, subtotal: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingItem, setUpdatingItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            if (!userId) {
                setLoading(false);
                setError('Please log in to view your cart');
                return;
            }

            try {
                setLoading(true);
                
                // Use the new cart summary endpoint to get pre-calculated totals
                const summaryResponse = await getCartSummary(userId);
                
                if (summaryResponse.data) {
                    const { cart_id, user_id, item_count, subtotal, items } = summaryResponse.data;
                    
                    setCart({ id: cart_id, user_id });
                    setCartItems(items || []);
                    setSummary({ 
                        itemCount: item_count || 0, 
                        subtotal: subtotal || 0 
                    });
                }
            } catch (err) {
                console.error('Error fetching cart:', err);
                
                // Fallback to regular cart endpoint if summary fails
                try {
                    const cartResponse = await getCartByUserId(userId);
                    if (cartResponse.data) {
                        setCart(cartResponse.data);
                        setCartItems(cartResponse.data.CartItems || []);
                        
                        // Calculate totals manually
                        const itemCount = (cartResponse.data.CartItems || [])
                            .reduce((total, item) => total + item.quantity, 0);
                            
                        const subtotal = (cartResponse.data.CartItems || [])
                            .reduce((total, item) => {
                                const price = item.Product?.price || 0;
                                return total + (price * item.quantity);
                            }, 0);
                            
                        setSummary({ itemCount, subtotal });
                    }
                } catch (fallbackErr) {
                    setError('Failed to load your cart. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [userId]);

    const handleQuantityChange = async (itemId, newQuantity, productId, currentStock) => {
        try {
            // Input validation
            if (newQuantity < 1) newQuantity = 1;
            if (currentStock && newQuantity > currentStock) {
                newQuantity = currentStock;
            }

            setUpdatingItem(itemId);
            await updateCartItem(itemId, { quantity: newQuantity });
            
            // Update local state
            const updatedItems = cartItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            
            setCartItems(updatedItems);
            
            // Recalculate totals
            const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
            const subtotal = updatedItems.reduce((total, item) => {
                const price = item.Product?.price || 0;
                return total + (price * item.quantity);
            }, 0);
            
            setSummary({ itemCount, subtotal });
        } catch (err) {
            console.error('Error updating cart item:', err);
            setError('Failed to update item quantity.');
        } finally {
            setUpdatingItem(null);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            setUpdatingItem(itemId);
            await removeCartItem(itemId);
            
            // Update local state
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedItems);
            
            // Recalculate totals
            const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
            const subtotal = updatedItems.reduce((total, item) => {
                const price = item.Product?.price || 0;
                return total + (price * item.quantity);
            }, 0);
            
            setSummary({ itemCount, subtotal });
        } catch (err) {
            console.error('Error removing cart item:', err);
            setError('Failed to remove item from cart.');
        } finally {
            setUpdatingItem(null);
        }
    };

    // Show a loading skeleton while cart loads
    if (loading) return (
        <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 w-1/3 mx-auto mb-8 rounded"></div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="h-64 bg-gray-100 p-6">
                        <div className="h-6 bg-gray-200 w-full mb-4 rounded"></div>
                        <div className="h-6 bg-gray-200 w-full mb-4 rounded"></div>
                        <div className="h-6 bg-gray-200 w-full mb-4 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Error handling
    if (error) return (
        <div className="container mx-auto px-4 py-12">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                {error}
            </div>
            <div className="text-center">
                <Link to="/products" className="text-blue-600 hover:underline">
                    Continue shopping
                </Link>
            </div>
        </div>
    );

    // Empty cart
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="p-6 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3">Product</th>
                                <th className="text-center py-3">Price</th>
                                <th className="text-center py-3">Quantity</th>
                                <th className="text-right py-3">Subtotal</th>
                                <th className="py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => {
                                const product = item.Product;
                                return product ? (
                                    <tr key={item.id} className="border-b">
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <div className="h-16 w-16 mr-4 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.image || `https://placehold.co/300x200?text=${encodeURIComponent(product.name)}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                </div>
                                                <div>
                                                    <Link to={`/products/${product.id}`} className="text-blue-600 hover:underline font-medium">
                                                        {product.name}
                                                    </Link>
                                                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">{product.description}</p>
                                                    {product.stock_quantity < 10 && (
                                                        <p className="text-orange-500 text-xs mt-1">
                                                            Only {product.stock_quantity} left in stock
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">${parseFloat(product.price).toFixed(2)}</td>
                                        <td className="py-4">
                                            <div className="flex justify-center items-center">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, product.id, product.stock_quantity)}
                                                    className="px-2 py-1 border rounded-l-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                    disabled={updatingItem === item.id || item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(
                                                        item.id, 
                                                        parseInt(e.target.value) || 1, 
                                                        product.id,
                                                        product.stock_quantity
                                                    )}
                                                    className="w-14 text-center border-t border-b"
                                                    min="1"
                                                    max={product.stock_quantity}
                                                    disabled={updatingItem === item.id}
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(
                                                        item.id, 
                                                        item.quantity + 1, 
                                                        product.id,
                                                        product.stock_quantity
                                                    )}
                                                    className="px-2 py-1 border rounded-r-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                    disabled={updatingItem === item.id || item.quantity >= product.stock_quantity}
                                                >
                                                    +
                                                </button>
                                                {updatingItem === item.id && (
                                                    <span className="ml-2 text-xs text-blue-600">Updating...</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 text-right font-medium">
                                            ${(parseFloat(product.price) * item.quantity).toFixed(2)}
                                        </td>
                                        <td className="py-4 text-right">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                                disabled={updatingItem === item.id}
                                            >
                                                {updatingItem === item.id ? 'Removing...' : 'Remove'}
                                            </button>
                                        </td>
                                    </tr>
                                ) : null;
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-between">
                <div className="md:w-1/2">
                    <Link to="/products" className="text-blue-600 hover:underline flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Continue Shopping
                    </Link>
                </div>

                <div className="md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-md">
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Items ({summary.itemCount}):</span>
                        <span className="font-medium">${summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="flex justify-between mb-6">
                        <span className="text-lg font-bold">Estimated Total:</span>
                        <span className="text-lg font-bold">${summary.subtotal.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        disabled={cartItems.length === 0}
                    >
                        Proceed to Checkout
                    </button>

                    <div className="mt-4 text-center text-gray-500 text-sm">
                        <p>Secure checkout powered by Stripe</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;