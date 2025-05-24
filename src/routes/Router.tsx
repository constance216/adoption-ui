import React, { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import Layout from '../layout/Layout';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PetsPage from '../pages/PetsPage';
import CategoriesPage from '../pages/CategoriesPage';
import BreedsPage from '../pages/BreedsPage';
import AdoptionsPage from '../pages/AdoptionsPage';
import SheltersPage from '../pages/SheltersPage';
import VeterinariansPage from '../pages/VeterinariansPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from '../components/ProtectedRoute';
import PasswordReset from '../pages/PasswordReset';
import { Navigate } from 'react-router-dom';

// Simple hash-based router
const Router: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('');
  const [queryParams, setQueryParams] = useState(new URLSearchParams());
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # symbol
      const [path, query] = hash.split('?');
      setCurrentPath(path || '/');
      setQueryParams(new URLSearchParams(query || ''));
    };

    // Check if we have a direct URL with query params (for password reset)
    const path = window.location.pathname;
    const search = window.location.search;
    if (path === '/reset-password' && search) {
      // Convert to hash-based URL
      window.location.href = `/#/reset-password${search}`;
      return;
    }

    window.addEventListener('hashchange', handleHashChange);
    // Initial call to set the initial route
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Helper function to navigate
  useEffect(() => {
    // Override the href clicks to use hash routing
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.hash = href;
        });
      }
    });
  });

  const renderPage = () => {
    // Redirect root to appropriate page
    if (currentPath === '/') {
      return <HomePage />;
    }

    switch (currentPath) {
      case '/login':
        return <Login />;
      case '/register':
        return <Register />;
      case '/forgot-password':
        return <PasswordReset />;
      case '/reset-password':
        const token = queryParams.get('token');
        if (!token) {
          window.location.hash = '/login';
          return null;
        }
        return <PasswordReset token={token} />;
      case '/dashboard':
        return (
          <ProtectedRoute roles={['ADMIN']}>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        );
      case '/pets':
        return (
          <ProtectedRoute>
            <Layout>
              <PetsPage />
            </Layout>
          </ProtectedRoute>
        );
      case '/categories':
        return (
          <ProtectedRoute roles={['ADMIN']}>
            <Layout>
              <CategoriesPage />
            </Layout>
          </ProtectedRoute>
        );
      case '/breeds':
        return (
          <ProtectedRoute roles={['ADMIN']}>
            <Layout>
              <BreedsPage />
            </Layout>
          </ProtectedRoute>
        );
      case '/adoptions':
        return (
          <ProtectedRoute roles={['USER', 'ADMIN', 'SHELTER']}>
            <Layout>
              <AdoptionsPage />
            </Layout>
          </ProtectedRoute>
        );
      case '/shelters':
        return (
          <ProtectedRoute roles={['ADMIN', 'SHELTER']}>
            <Layout>
              <SheltersPage />
            </Layout>
          </ProtectedRoute>
        );
      case '/veterinarians':
        return (
          <ProtectedRoute roles={['ADMIN', 'VETERINARIAN']}>
            <Layout>
              <VeterinariansPage />
            </Layout>
          </ProtectedRoute>
        );
      default:
        return (
          <Layout>
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-gray-900">404 - Page Not Found</h1>
              <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
              <a
                href="/pets"
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Go to Pets
              </a>
            </div>
          </Layout>
        );
    }
  };

  return <>{renderPage()}</>;
};

export default Router;