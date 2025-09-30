import React, { useState, useEffect, useCallback } from "react";
import { FiMapPin, FiMail } from "react-icons/fi";
import { PiClockClockwiseBold } from "react-icons/pi";
import { FiPhoneCall } from "react-icons/fi";
import "./ContactPage.scss";
import ButaComponent from "../../Components/ButaComponent/ButaComponent";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const handleResize = useCallback(() => {
    setIsVisible(window.innerWidth < 744);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <>
      <section className="contactSection">
        <div className="contactContainer">
          <div className="contactContent">
            <div className="contactInfo">
              <div className="contactHeader">
                <h2 className="contactTitle">{t("contact.title")}</h2>
                <p className="contactSubtitle">{t("contact.subtitle")}</p>
              </div>
              <div className="contactDetails">
                <div className="contactItem">
                  <div className="contactIcon">
                    <FiPhoneCall />
                  </div>
                  <div className="contactText">
                    <p>+994 55 555 55 55</p>
                  </div>
                </div>

                <div className="contactItem">
                  <div className="contactIcon">
                    <FiMail />
                  </div>
                  <div className="contactText">
                    <p>info@albuhara.az</p>
                  </div>
                </div>

                <div className="contactItem">
                  <div className="contactIcon">
                    <PiClockClockwiseBold />
                  </div>
                  <div className="contactText">
                    <p>{t("contact.hours")}</p>
                  </div>
                </div>
                <div className="contactItem">
                  <div className="contactIcon">
                    <FiMapPin />
                  </div>
                  <div className="contactText">
                    <p>{t("contact.address")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mapContainer">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2749.2406036946204!2d49.85719757548259!3d40.40863455613291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d571a08d273%3A0xa667c99d58b02bbf!2zNDRiIEHFn8SxcSBNb2xsYSBDw7xtyZksIEJha8Sx!5e1!3m2!1sen!2saz!4v1759233376011!5m2!1sen!2saz%22%20width=%22600%22%20height=%22450%22%20style=%22border:0;%22%20allowfullscreen=%22%22%20loading=%22lazy%22%20referrerpolicy=%22no-referrer-when-downgrade%22%3E%3C/iframe%3E"
                className="mapIframe"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Albuhara Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      {isVisible && <ButaComponent />}
    </>
  );
};

export default ContactPage;
