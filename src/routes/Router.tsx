import React from 'react';
import { useAuth } from '../features/auth/AuthContext';
import Layout from '../layout/Layout';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PetsPage from '../pages/PetsPage';
import CategoriesPage from '../pages/CategoriesPage';
import BreedsPage from '../pages/BreedsPage';
import AdoptionsPage from '../pages/AdoptionsPage';
import SheltersPage from '../pages/ShelterPage';
import VeterinariansPage from '../pages/VeterinariansPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from '../components/ProtectedRoute';

// Simple hash-based router
const Router: React.FC = () => {
  const [currentPath, setCurrentPath] = React.useState(window.location.hash.slice(1) || '/');
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Helper function to navigate
  React.useEffect(() => {
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