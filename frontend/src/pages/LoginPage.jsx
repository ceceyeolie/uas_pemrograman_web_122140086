// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginRequest, loginSuccess, loginFailure } from '../store/authSlice';
import { authApi } from '../api/authApi';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { loading, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to admin dashboard
  const from = location.state?.from?.pathname || '/admin';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(loginRequest());
      
      // Use real API call
      const response = await authApi.login(formData);
      
      // Dispatch success with the response data
      dispatch(loginSuccess(response));
      
      // Redirect to protected page
      navigate(from, { replace: true });
      
    } catch (err) {
      // Dispatch failure with error message
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <div className="max-w-md mx-auto my-18 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm text-gray-600">
      </div>
    </div>
  );
}