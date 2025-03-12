const config = {
    // API configuration
    apiUrl: process.env.REACT_APP_API_URL || './api',

    // Stripe configuration (for payment processing)
    stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || '',

    // Application settings
    pageSize: 12,

    // Default image if product image is not available
    defaultProductImage: 'https://via.placeholder.com/300x200?text=No+Image+Available',
};

export default config;
