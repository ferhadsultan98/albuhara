import React from "react";
import "./Footer.scss";
import HorizontalLogo from "../../../public/assets/albuharalogo.svg";
import { FaTiktok, FaInstagram, FaFacebook } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaSnapchat } from "react-icons/fa";
import { FaTripadvisor } from "react-icons/fa";

const Footer = () => {
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <footer className="footer">
      <div className="footerTop">
        <div className="footerLogo">
          <img src={HorizontalLogo} alt="AlBuhara Logo" />
        </div>

        <div className="socialNav">
          <a
            href="https://www.instagram.com/albuhara.baku"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i>
              <FaInstagram strokeWidth={"15px"} />
            </i>
          </a>
          <a
            href="https://www.facebook.com/people/Albuhara-Baku/61577641959990"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i>
              <FaFacebook strokeWidth={"15px"} />
            </i>
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i>
              <FaTiktok strokeWidth={"15px"} />
            </i>
          </a>
          <a
            href="https://tripadvisor.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i>
              <FaTripadvisor strokeWidth={"15px"} />
            </i>
          </a>
          <a
            href="https://snapchat.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i>
              <FaSnapchat strokeWidth={"15px"} />
            </i>
          </a>
        </div>

        <div className="footerNav">
          <Link to={`/${lang}/`}>{t("footer.home")}</Link>
          <Link to={`/${lang}/about`}>{t("footer.about")}</Link>
          <Link to={`/${lang}/menu`}>{t("footer.menu")}</Link>
          <Link to={`/${lang}/contact`}>{t("footer.contact")}</Link>
        </div>
      </div>

      <div className="footerBottom">
        <span>{t("footer.copyright")}</span>
        <div className="footerLinks">
          <a>{t("footer.terms")}</a>
          <a>{t("footer.privacy")}</a>
          <a>{t("footer.cookies")}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
