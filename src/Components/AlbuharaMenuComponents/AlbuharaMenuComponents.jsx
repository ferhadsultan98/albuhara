import React from "react";
import "./AlbuharaMenuComponents.scss";
import decorSquare from "../../../public/assets/decorSquare.png";
import ZapFast from "../../../public/assets/zap-fast.png";
import MenuBoard from "../../../public/assets/menu-board.png";
import { FiMap } from "react-icons/fi";
import { Link } from "react-router-dom";
import { LuPhoneCall } from "react-icons/lu";
import { useTranslation } from "react-i18next";

const AlbuharaMenuComponents = () => {
  const { t } = useTranslation();

  return (
    <div className="AlbuharaMenuComponentsContainer">
      <Link to="/delivery" className="AlbuharaMenuComponentsCircleItem">
        <img src={decorSquare} alt="Circle 1" />
        <div className="AlbuharaMenuComponentsText">
          <img className="AlbuharaMenuIcon" src={ZapFast} alt="" />
          {t("albuhara.delivery")}
        </div>
      </Link>

      <Link to="/menu" className="AlbuharaMenuComponentsCircleItem">
        <img src={decorSquare} alt="Circle 2" />
        <div className="AlbuharaMenuComponentsText">
          <img className="AlbuharaMenuIcon" src={MenuBoard} alt="" />
          {t("albuhara.menu")}
        </div>
      </Link>

      <Link
        to="https://maps.app.goo.gl/WyWKNxzp2JydWckt8"
        className="AlbuharaMenuComponentsCircleItem"
        target="_blank"
      >
        <img src={decorSquare} alt="Circle 3" />
        <div className="AlbuharaMenuComponentsText">
          <i>
            <FiMap />
          </i>
          {t("albuhara.address")}
        </div>
      </Link>

      <Link
        to="tel:+994555254193"
        className="AlbuharaMenuComponentsCircleItem"
        target="_blank"
      >
        <img src={decorSquare} alt="Circle 4" />
        <div className="AlbuharaMenuComponentsText">
          <i>
            <LuPhoneCall />
          </i>
          {t("albuhara.contact")}
        </div>
      </Link>
    </div>
  );
};

export default AlbuharaMenuComponents;
