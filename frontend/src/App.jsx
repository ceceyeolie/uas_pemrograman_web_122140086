// 1. Update src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/auth/AdminDashboard';
import AdminArticleListPage from './pages/auth/ArticleListPage'; // New
import AdminCategoryListPage from './pages/auth/CategoryListPage'; // New
import ArticleFormPage from './pages/auth/ArticleFormPage';
import CategoryFormPage from './pages/auth/CategoryFormPage';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify'; // New
import 'react-toastify/dist/ReactToastify.css'; // New

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="artikel/:id" element={<ArticleDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            {/* Admin Routes */}
            <Route path="admin" element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="admin/artikel/" element={
              <PrivateRoute>
                <AdminArticleListPage /> {/* Changed */}
              </PrivateRoute>
            } />
            <Route path="admin/artikel/create" element={
              <PrivateRoute>
                <ArticleFormPage />
              </PrivateRoute>
            } />
            <Route path="admin/artikel/:id/edit" element={
              <PrivateRoute>
                <ArticleFormPage />
              </PrivateRoute>
            } />
            <Route path="admin/kategori/" element={
              <PrivateRoute>
                <AdminCategoryListPage /> {/* Changed */}
              </PrivateRoute>
            } />
            <Route path="admin/kategori/create" element={
              <PrivateRoute>
                <CategoryFormPage />
              </PrivateRoute>
            } />
            <Route path="admin/kategori/:id/edit" element={
              <PrivateRoute>
                <CategoryFormPage />
              </PrivateRoute>
            } />
            {/* Catch-all route */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Route>
        </Routes>
        <ToastContainer /> {/* New */}
      </Router>
    </Provider>
  );
}

export default App;