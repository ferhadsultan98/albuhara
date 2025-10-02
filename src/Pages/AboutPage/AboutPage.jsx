import React from "react";
import "./AboutPage.scss";
import { CiMap } from "react-icons/ci";
import ButaComponent from "../../Components/ButaComponent/ButaComponent";
import AlbuharaLogoInterior from "../../Components/AlbuharaLogoInterior/AlbuharaLogoInterior";
import EgyptDecor from "../../Components/EgyptDecor/EgyptDecor";
import { useTranslation } from "react-i18next";
import usePlatform from "../../Hooks/usePlatform";

const AboutPage = () => {
  const { t } = useTranslation();
  const platform = usePlatform(); // 🔹 iOS, Android və ya other

  return (
    <div className="aboutContainer">
      <div className="aboutInfoContainer">
        <h1 className="aboutUs">{t("about.title")}</h1>
        <h2 className={`welcomeTitle ${platform}`}>{t("about.welcome")}</h2>
        <p className="aboutText">{t("about.description")}</p>
        <div className="location">
          <span className="locationIcon">
            <CiMap />
          </span>
          <p className={`address ${platform}`}>{t("about.address")}</p>
        </div>
      </div>

      <ButaComponent />
      <AlbuharaLogoInterior />
      <EgyptDecor />
    </div>
  );
};

export default AboutPage;
