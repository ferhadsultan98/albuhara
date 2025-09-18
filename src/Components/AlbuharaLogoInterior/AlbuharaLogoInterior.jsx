import React from 'react';
import './AlbuharaLogoInterior.scss';
import albuharaMiniLogo from '../../../public/assets/albuharaMiniLogo.png';
import { useTranslation } from 'react-i18next';

const AlbuharaLogoInterior = () => {
  const { t } = useTranslation();

  return (
    <div className="albuharaInteriorContainer">
      <div className="albuharaInteriorLogo">
        <img src={albuharaMiniLogo} alt="albuharaMiniLogo" />
      </div>
      <h2>{t("interior.title")}</h2>
      <p>{t("interior.description")}</p>
    </div>
  );
};

export default AlbuharaLogoInterior;
