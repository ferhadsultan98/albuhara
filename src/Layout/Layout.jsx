import React, { useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import './Layout.scss';

const MainLayout = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Supported languages
    const supportedLanguages = ['az', 'en', 'ru'];
    
    // Validate language parameter
    if (!supportedLanguages.includes(lang)) {
      // Redirect to default language if invalid
      navigate('/az', { replace: true });
      return;
    }
    
    // Update i18n language if different from URL
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n, navigate]);

  return (
    <div className="mainLayout">
      <Header />
      <main className="mainContent">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
