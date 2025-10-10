import React, { useState } from "react";
import { Spin as HamburgerSpin } from "hamburger-react";
import { TbWorld } from "react-icons/tb";
import "./Header.scss";
import HorizontalLogo from "../../../public/assets/darkhorizontalalbuhara.png";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (newLang) => {
    // Get current path and replace language prefix
    const pathWithoutLang = location.pathname.replace(`/${lang}`, '');
    const newPath = `/${newLang}${pathWithoutLang}`;
    
    // Navigate to new language URL
    navigate(newPath);
    
    // Update i18n
    i18n.changeLanguage(newLang);
    
    // Close dropdowns
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleBookClick = () => {
    setIsMenuOpen(false);
    navigate(`/${lang}/delivery`);
  };

  return (
    <header className="headerContainer">
      <div className="headerWrapper">
        <div className="logoContainer">
          <Link to={`/${lang}/`} onClick={handleNavClick}>
            <img src={HorizontalLogo} alt="Logo" className="logoImage" />
          </Link>
        </div>
        <nav className={`navMenu ${isMenuOpen ? "active" : ""}`}>
          <ul className="navList">
            <li className="navItem">
              <Link to={`/${lang}/`} className="navLink" onClick={handleNavClick}>
                {i18n.t("nav.home")}
              </Link>
            </li>
            <li className="navItem">
              <Link to={`/${lang}/about`} className="navLink" onClick={handleNavClick}>
                {i18n.t("nav.about")}
              </Link>
            </li>
            <li className="navItem">
              <Link to={`/${lang}/menu`} className="navLink" onClick={handleNavClick}>
                {i18n.t("nav.menu")}
              </Link>
            </li>
            <li className="navItem">
              <Link to={`/${lang}/contact`} className="navLink" onClick={handleNavClick}>
                {i18n.t("nav.contact")}
              </Link>
            </li>
          </ul>
          <button
            className="navButton"
            onClick={handleBookClick}
            aria-label="Book a delivery"
          >
            {i18n.t("nav.book") || "Book"}
          </button>
        </nav>
        <div className="menuLanguageContainer">
          <div
            className="languageDropdown"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <TbWorld className="globeIcon" />
            <span className="selectedLanguage">
              {(lang || i18n.language).toUpperCase()}
            </span>
            <div className={`dropdownContent ${isDropdownOpen ? "open" : ""}`}>
              <button
                onClick={() => handleLanguageChange("az")}
                className="dropdownItem"
              >
                AZ
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
                className="dropdownItem"
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange("ru")}
                className="dropdownItem"
              >
                RU
              </button>
            </div>
          </div>
          <div className="hamburgerMenu">
            <HamburgerSpin
              className="hamburgerButton"
              toggled={isMenuOpen}
              toggle={toggleMenu}
              color="#35161A"
              size={20}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
