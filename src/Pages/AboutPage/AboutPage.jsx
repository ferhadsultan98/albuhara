import React from "react";
import "./AboutPage.scss";
import { CiMap } from "react-icons/ci";
import ButaComponent from "../../Components/ButaComponent/ButaComponent";
import AlbuharaLogoInterior from "../../Components/AlbuharaLogoInterior/AlbuharaLogoInterior";
import EgyptDecor from "../../Components/EgyptDecor/EgyptDecor";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="aboutContainer">
      <div className="aboutInfoContainer">
        <h1 className="aboutUs">{t("about.title")}</h1>
        <h2 className="welcomeTitle">{t("about.welcome")}</h2>
        <p className="aboutText">{t("about.description")}</p>
        <div className="location">
          <span className="locationIcon">
            <CiMap />
          </span>
          <p className="address">{t("about.address")}</p>
        </div>
      </div>

      <ButaComponent />
      <AlbuharaLogoInterior />
      <EgyptDecor />
    </div>
  );
};

export default AboutPage;
