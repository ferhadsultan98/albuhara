import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './Languages/i18n';
import MainLayout from './Layout/Layout';
import HomePage from './Pages/HomePage/HomePage';
import ContactPage from './Pages/ContactPage/ContactPage';
import NotMean from './Components/NotMean/NotMean';
import DeliveryPage from './Pages/DeliveryPage/DeliveryPage';
import Login from './Admin/Login/Login';
import AdminLayout from './Admin/AdminLayout';
import AdminCategories from './Admin/AdminCategories/AdminCategories';
import AdminDashboard from './Admin/AdminDashboard/AdminDashboard';
import AdminProductsContainer from './Admin/AdminProduct/AdminProduct';
import MenuComponent from './Components/MenuComponent/MenuComponent';
import AboutPage from './Pages/AboutPage/AboutPage';
import AdminHome from './Admin/AdminHome/AdminHome';
import AdminAbout from './Admin/AdminAbout/AdminAbout';
import AdminContact from './Admin/AdminContact/AdminContact';
import AdminDecor from './Admin/AdminDecor/AdminDecor';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import './App.css';

// ScrollToTop component with smooth scrolling
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

// ProtectedRoute component to restrict access to admin routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Redirect root to default language (Azerbaijani) */}
          <Route path="/" element={<Navigate to="/az" replace />} />
          
          {/* Language-prefixed public routes */}
          <Route
            path="/:lang"
            element={
              <>
                <NotMean />
                <MainLayout />
              </>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="menu" element={<MenuComponent />} />
            <Route path="delivery" element={<DeliveryPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>

          {/* Login route, accessible to all (no language prefix) */}
          <Route path="/login" element={<Login />} />

          {/* Admin routes, protected by ProtectedRoute (no language prefix) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="admin-category" element={<AdminCategories />} />
            <Route path="admin-product" element={<AdminProductsContainer />} />
            <Route path="admin-home" element={<AdminHome />} />
            <Route path="admin-about" element={<AdminAbout />} />
            <Route path="admin-contact" element={<AdminContact />} />
            <Route path="admin-decor" element={<AdminDecor />} />
          </Route>

          {/* 404 Error page */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </I18nextProvider>
  );
}

export default App;
