import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../services/api';

const OrderHistory = ({ userId }) => {
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await getUserOrders(userId);
                setOrders(response.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load your order history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchOrders();
        } else {
            setLoading(false);
            setError('Please log in to view your order history')
        }
    }, [userId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefinded, options);
    };

    if (loading) return <div className="flex justify-center items-center py-20 text-gray-600">Loading your orders...</div>

    if (error) return (
        <div className="containter mx-auto px-4 py-12">
            <div className="text-red-500 text-center py-8">{error}</div>
            <div className="text-center">
                <Link to="/products" className="text-blue-600 hover:underline">
                    Continue shopping
                </Link>
            </div>
        </div>
    );

    if (!orders.length) return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">You don't have any orders yet</h2>
            <p>Once you make a purchase, your orders will appear here.</p>
            <Link
                to="/products"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
                Browse Products
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Your Order History</h1>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className='overflow-x-auto'>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{parseFloat(order.total_price).toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${order.status === 'Delivered'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'Shipped'
                                                ? 'bg-blue-100 text-blue-800'
                                                : order.status === 'Processing'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;