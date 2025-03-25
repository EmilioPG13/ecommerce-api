import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, checkout } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import config from '../config';

// Initialize Stripe with your public key from config
const stripePromise = loadStripe(config.stripePublicKey);

// Checkout Form Component
const CheckoutForm = ({ cart, cartItems, products, userId, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // In a real app, you would create a payment intent on your server
            // and pass the client_secret to this function

            // This is a simulated payment flow for demo purposes
            // In a real implementation, you would call the Stripe API
            /*
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
                billing_details: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    address: {
                        line1: formData.address,
                        city: formData.city,
                        state: formData.state,
                        postal_code: formData.postalCode,
                        country: formData.country
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }
            */

            // Call your backend to process the order
            await checkout(userId);

            setSuccess(true);
            onSuccess();

            // Redirect to order confirmation after a short delay
            setTimeout(() => {
                navigate('/orders');
            }, 2000);

        } catch (err) {
            console.error('Payment processing error:', err);
            setError(err.message || 'An error occurred during checkout. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const product = products[item.product_id];
            return total + (product ? parseFloat(product.price) * item.quantity : 0);
        }, 0).toFixed(2);
    };

    const calculateTax = () => {
        const subtotal = parseFloat(calculateSubtotal());
        return (subtotal * 0.08).toFixed(2); // Assuming 8% tax rate
    };

    const calculateShipping = () => {
        return "5.99"; // Flat shipping rate for demo
    };

    const calculateTotal = () => {
        return (
            parseFloat(calculateSubtotal()) +
            parseFloat(calculateTax()) +
            parseFloat(calculateShipping())
        ).toFixed(2);
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    if (success) {
        return (
            <div className="bg-green-50 p-6 rounded-lg text-center">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Successful!</h2>
                <p className="text-gray-600 mb-4">Thank you for your purchase. We're processing your order now.</p>
                <p className="text-gray-600">You will be redirected to your orders page shortly...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="MX">Mexico</option>
                            <option value="UK">United Kingdom</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                <div className="p-4 border border-gray-300 rounded-md">
                    <CardElement options={cardElementOptions} />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    Test Mode: Use card 4242 4242 4242 4242, any future date, any 3 digits for CVC, and any 5 digits for postal code.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between">
                <Link to="/cart" className="text-blue-600 hover:text-blue-800">
                    Back to Cart
                </Link>
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className={`bg-blue-600 text-white px-6 py-3 rounded-md font-medium ${(!stripe || processing) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                    {processing ? 'Processing...' : `Pay $${calculateTotal()}`}
                </button>
            </div>
        </form>
    );
};

// Main Checkout Component
const Checkout = ({ userId }) => {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderComplete, setOrderComplete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                const response = await getCart(userId);
                setCart(response.data);

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
            setError('Please log in to proceed with checkout');
        }
    }, [userId]);

    const handleCheckoutSuccess = () => {
        setOrderComplete(true);
    };

    if (loading) return <div className="flex justify-center items-center py-20 text-gray-600">Loading checkout information...</div>;

    if (error) return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-red-500 text-center py-8">{error}</div>
            <div className="text-center">
                <Link to="/cart" className="text-blue-600 hover:underline">
                    Return to Cart
                </Link>
            </div>
        </div>
    );

    if (!cartItems.length) return (
        <div className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">You need to add items to your cart before checking out.</p>
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
            <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm
                            cart={cart}
                            cartItems={cartItems}
                            products={products}
                            userId={userId}
                            onSuccess={handleCheckoutSuccess}
                        />
                    </Elements>
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>

                        <div className="space-y-4 mb-6">
                            {cartItems.map(item => {
                                const product = products[item.product_id];
                                return product ? (
                                    <div key={item.id} className="flex justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 mr-3 bg-gray-200 rounded overflow-hidden">
                                                <img
                                                    src={product.image || `https://placehold.co/300x200?text=${encodeURIComponent(product.name)}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{product.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">
                                            ${(parseFloat(product.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ) : null;
                            })}
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between my-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">
                                    ${cartItems.reduce((total, item) => {
                                        const product = products[item.product_id];
                                        return total + (product ? parseFloat(product.price) * item.quantity : 0);
                                    }, 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between my-2">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">$5.99</span>
                            </div>
                            <div className="flex justify-between my-2">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium">
                                    ${(cartItems.reduce((total, item) => {
                                        const product = products[item.product_id];
                                        return total + (product ? parseFloat(product.price) * item.quantity : 0);
                                    }, 0) * 0.08).toFixed(2)}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-lg font-bold">
                                    ${(
                                        cartItems.reduce((total, item) => {
                                            const product = products[item.product_id];
                                            return total + (product ? parseFloat(product.price) * item.quantity : 0);
                                        }, 0) * 1.08 + 5.99
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;