import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api.js';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const navigate = useNavigate();

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
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
        
        try {
            const { name, email, password } = formData;
            await register({ name, email, password });
            
            navigate('/login', { 
                state: { message: 'Registration successful! Please log in.' }
            });
        } catch (error) {
            setSubmitError(
                error.response?.data?.error || 
                'Registration failed. Please try again.'
            );
            console.error('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Third-party registration handlers
    const handleGoogleSignup = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        
        try {
            // This would connect to your backend's Google OAuth endpoint
            // For now we'll simulate a response
            setTimeout(() => {
                setSubmitError("Google registration is currently under maintenance. Please use email registration.");
                setIsSubmitting(false);
            }, 1000);
            
            // In a real implementation:
            // const response = await registerWithGoogle();
            // navigate('/login', { state: { message: 'Google registration successful! Please log in.' }});
        } catch (error) {
            setSubmitError('Failed to register with Google. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleFacebookSignup = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        
        try {
            // This would connect to your backend's Facebook OAuth endpoint
            setTimeout(() => {
                setSubmitError("Facebook registration is currently under maintenance. Please use email registration.");
                setIsSubmitting(false);
            }, 1000);
        } catch (error) {
            setSubmitError('Failed to register with Facebook. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h1>
                    
                    {submitError && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                            <p className="font-medium">Registration Error</p>
                            <p>{submitError}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>
                        
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
                        
                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md 
                                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or register with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                onClick={handleGoogleSignup}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"></path>
                                </svg>
                                Google
                            </button>
                            <button
                                onClick={handleFacebookSignup}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2 c-0.55,0-1,0.45-1,1v2h3v3h-3v6.95C18.05,21.45,22,17.19,22,12z"></path>
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline font-medium">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;