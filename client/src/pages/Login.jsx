import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/api.js';
import config from '../config';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);
    
    const navigate = useNavigate();
    const location = useLocation();

    // Check for success message from registration
    useEffect(() => {
        if (location.state?.message) {
            // Set success message from registration
            setSubmitSuccess(location.state.message);
            
            // Clear location state after displaying message
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        // Clear field-specific error when user starts typing again
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);
        
        try {
            const { email, password } = formData;
            const response = await login({ email, password });
            
            // Call the login handler from App.js with the token
            onLogin(response.data.token);
            
            // User will be redirected automatically via the App.js routing logic
        } catch (error) {
            setSubmitError(
                error.response?.data?.error || 
                'Login failed. Please check your credentials.'
            );
            console.error('Login error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Third-party login handlers
    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);
        
        try {
            // In production, this would redirect to Google OAuth
            // For demonstration, we'll simulate a successful response
            setTimeout(() => {
                // Mock successful authentication
                const mockToken = "mock_google_auth_token";
                onLogin(mockToken);
                // User will be redirected automatically via the App.js routing logic
            }, 1000);
        } catch (error) {
            setSubmitError('Google login is currently unavailable. Please try again later.');
            setIsSubmitting(false);
        }
    };

    const handleFacebookLogin = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);
        
        try {
            // In production, this would redirect to Facebook OAuth
            // For demonstration, we'll simulate a successful response
            setTimeout(() => {
                // Mock successful authentication
                const mockToken = "mock_facebook_auth_token";
                onLogin(mockToken);
                // User will be redirected automatically via the App.js routing logic
            }, 1000);
        } catch (error) {
            setSubmitError('Facebook login is currently unavailable. Please try again later.');
            setIsSubmitting(false);
        }
    };

    const handleAppleLogin = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);
        
        try {
            // In production, this would redirect to Apple OAuth
            // For demonstration, we'll simulate a successful response
            setTimeout(() => {
                // Mock successful authentication
                const mockToken = "mock_apple_auth_token";
                onLogin(mockToken);
                // User will be redirected automatically via the App.js routing logic
            }, 1000);
        } catch (error) {
            setSubmitError('Apple login is currently unavailable. Please try again later.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 mb-6">
                    {submitError && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{submitError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {submitSuccess && (
                        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{submitSuccess}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${
                                        errors.email ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${
                                        errors.password ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                        <div>
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Sign in with Google</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={handleFacebookLogin}
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Sign in with Facebook</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={handleAppleLogin}
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Sign in with Apple</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;