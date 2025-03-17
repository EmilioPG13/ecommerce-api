import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/api.js';

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
            setSubmitSuccess(location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        
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
            onLogin(response.data.token);
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
            // This would connect to your backend's Google OAuth endpoint
            setTimeout(() => {
                setSubmitError("Google login is currently under maintenance. Please use email login.");
                setIsSubmitting(false);
            }, 1000);
            
            // In a real implementation:
            // const response = await loginWithGoogle();
            // onLogin(response.data.token);
        } catch (error) {
            setSubmitError('Failed to login with Google. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleFacebookLogin = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);
        
        try {
            // This would connect to your backend's Facebook OAuth endpoint
            setTimeout(() => {
                setSubmitError("Facebook login is currently under maintenance. Please use email login.");
                setIsSubmitting(false);
            }, 1000);
        } catch (error) {
            setSubmitError('Failed to login with Facebook. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleAppleLogin = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);
        
        try {
            // This would connect to your backend's Apple OAuth endpoint
            setTimeout(() => {
                setSubmitError("Apple login is currently under maintenance. Please use email login.");
                setIsSubmitting(false);
            }, 1000);
            
            // In a real implementation:
            // const response = await loginWithApple();
            // onLogin(response.data.token);
        } catch (error) {
            setSubmitError('Failed to login with Apple. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Log In</h1>
                    
                    {submitSuccess && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                            <p>{submitSuccess}</p>
                        </div>
                    )}
                    
                    {submitError && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                            <p className="font-medium">Login Error</p>
                            <p>{submitError}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <div>
                                <a href="#" className="text-sm text-blue-600 hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md 
                                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Logging In...' : 'Log In'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or login with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"></path>
                                </svg>
                            </button>
                            <button
                                onClick={handleFacebookLogin}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2 c-0.55,0-1,0.45-1,1v2h3v3h-3v6.95C18.05,21.45,22,17.19,22,12z"></path>
                                </svg>
                            </button>
                            <button
                                onClick={handleAppleLogin}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.17,4.17,0,0,0,12,6.61,3.69,3.69,0,0,0,14.94,5.19Zm2.52,7.44a4.51,4.51,0,0,1,2.16-3.81,4.66,4.66,0,0,0-3.66-2c-1.56-.16-3,.91-3.83.91s-2-.89-3.3-.87A4.92,4.92,0,0,0,4.69,9.39C2.93,12.45,4.24,17,6,19.47,6.8,20.68,7.8,22.05,9.12,22s1.75-.82,3.28-.82,2,.82,3.3.79,2.22-1.23,3.06-2.45a11,11,0,0,0,1.38-2.85A4.41,4.41,0,0,1,17.46,12.63Z"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-3 gap-3">
                            <div className="text-center text-xs text-gray-500">Google</div>
                            <div className="text-center text-xs text-gray-500">Facebook</div>
                            <div className="text-center text-xs text-gray-500">Apple</div>
                        </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 hover:underline font-medium">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;