import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdHome } from 'react-icons/md';
import './ErrorPage.scss';

const ErrorPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="errorSection">
      <div className="errorContainer">
        <div className="errorContent">
          <div className="errorNumber">404</div>
          
          <div className="errorTextContainer">
            <h1 className="errorTitle">{t('error.title')}</h1>
            <p className="errorDescription">
              {t('error.description')}
            </p>
            
            <div className="errorActions">
              <button 
                className="errorButton primary" 
                onClick={handleGoHome}
              >
                <MdHome className="buttonIcon" />
                {t('error.homeButton')}
              </button>
              
              <button 
                className="errorButton secondary"
                onClick={handleGoBack}
              >
                {t('error.backButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
