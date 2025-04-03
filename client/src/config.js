const config = {
    // API configuration
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',  // Changed from './api' to '/api'

    // Stripe configuration (for payment processing)
    stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51R1y1CGIVIUzjyIzKRfFuL0P97ORfUlCRaPXQHIrWexSiZz17NURQ7JmWO1iTpDliqtLrwGNHcl47kQFpbA4HXEI00FFuBA0Au',

    // Application settings
    pageSize: 12,

    // Default image if product image is not available
    defaultProductImage: 'https://placehold.co/300x200?text=No+Image',
};

export default config;