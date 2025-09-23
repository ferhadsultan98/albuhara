import React from "react";
import "./Footer.scss";
import HorizontalLogo from "../../../public/assets/darkhorizontalalbuhara.png";
import { FaTiktok, FaInstagram, FaFacebook} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footerTop">
        <div className="footerLogo">
          <img src={HorizontalLogo} alt="AlBuhara Logo" />
        </div>

        <div className="socialNav">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i><FaInstagram strokeWidth={"15px"}/></i>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i><FaFacebook strokeWidth={"15px"}/>
</i>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <i><FaTiktok strokeWidth={"20px"}/></i>
          </a>
        </div>

        <div className="footerNav">
          <a href="/about">{t("footer.about")}</a>
          <a href="/">{t("footer.home")}</a>
          <a href="/menu">{t("footer.menu")}</a>
          <a href="/contact">{t("footer.contact")}</a>
        </div>
      </div>

      <div className="footerBottom">
        <span>{t("footer.copyright")}</span>
        <div className="footerLinks">
          <a href="#">{t("footer.terms")}</a>
          <a href="#">{t("footer.privacy")}</a>
          <a href="#">{t("footer.cookies")}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
