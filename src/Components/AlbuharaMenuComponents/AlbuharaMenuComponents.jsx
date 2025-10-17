import React from "react";
import "./AlbuharaMenuComponents.scss";
import decorSquare from "../../../public/assets/decorSquare.png";
import ZapFast from "../../../public/assets/zap-fast.png";
import MenuBoard from "../../../public/assets/menu-board.png";
import { FiMap } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { LuPhoneCall } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { Truck, Utensils } from "lucide-react";

const AlbuharaMenuComponents = () => {
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <div className="AlbuharaMenuComponentsContainer">
      <Link
        to={`/${lang}/delivery`}
        className="AlbuharaMenuComponentsCircleItem"
      >
        <img src={decorSquare} alt="Circle 1" />
        <div className="AlbuharaMenuComponentsText">
          <i>
            <Truck />
          </i>
          <span>{t("albuhara.delivery")}</span>
        </div>
      </Link>

      <Link to={`/${lang}/menu`} className="AlbuharaMenuComponentsCircleItem">
        <img src={decorSquare} alt="Circle 2" />
        <div className="AlbuharaMenuComponentsText">
          <i>
            <Utensils />
          </i>
          <span>{t("albuhara.menu")}</span>
        </div>
      </Link>

      <Link
        to="https://maps.app.goo.gl/WyWKNxzp2JydWckt8"
        className="AlbuharaMenuComponentsCircleItem"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={decorSquare} alt="Circle 3" />
        <div className="AlbuharaMenuComponentsText">
          <i>
            <FiMap />
          </i>
          <span>{t("albuhara.address")}</span>
        </div>
      </Link>

      <Link to="tel:+994506501010" className="AlbuharaMenuComponentsCircleItem">
        <img src={decorSquare} alt="Circle 4" />
        <div className="AlbuharaMenuComponentsText">
          <i>
            <LuPhoneCall />
          </i>
          <span>{t("albuhara.contact")}</span>
        </div>
      </Link>
    </div>
  );
};

export default AlbuharaMenuComponents;
