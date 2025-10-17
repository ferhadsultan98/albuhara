import React from "react";
import "./DeliveryPage.scss";
import BoltLogo from "../../../public/assets/delivery/bolt.png";
import YangoLogo from "../../../public/assets/delivery/yango.png";
import WoltLogo from "../../../public/assets/delivery/wolt.png";
import usePlatform from "../../Hooks/usePlatform";
import { useTranslation } from "react-i18next";

function DeliveryPage() {
  const platform = usePlatform(); // 🔹 iOS, Android və ya other
  const { t, i18n } = useTranslation();
  return (
    <div className="deliveryContainer">
      <h2 className={`title ${platform}`}>{t("delivery.title")}</h2>
      <p className="deliveryDescription">{t("delivery.description")}</p>
      <div className="deliveryOptions">
        <div className="logoCard">
          <a href="[example-url]" target="_blank" rel="noopener noreferrer">
            <img src={WoltLogo} alt="Wolt" className="logoImage" />
          </a>
        </div>
        <div className="logoCard">
          <a href="[example-url]" target="_blank" rel="noopener noreferrer">
            <img src={BoltLogo} alt="Bolt" className="logoImage" />
          </a>
        </div>
        <div className="logoCard">
          <a href="[example-url]" target="_blank" rel="noopener noreferrer">
            <img src={YangoLogo} alt="Yango" className="logoImage" />
          </a>
        </div>
      </div>
    </div>
  );
}
export default DeliveryPage;
