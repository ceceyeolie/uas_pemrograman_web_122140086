// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  return (
    <header className="bg-black shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">Portal Berita</Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden py-5 md:block">
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-white hover:text-blue-600 font-medium">
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="text-white hover:text-blue-600 font-medium">
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-6">
                    <span className="text-white">
                      Hello, {user?.username || 'Admin'}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="mt-4 pt-4 border-t border-gray-200 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-blue-600 py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      Hello, {user?.username || 'Admin'}
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}