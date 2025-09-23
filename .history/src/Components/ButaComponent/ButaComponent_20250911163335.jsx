import React, { useState, useEffect } from "react";
import "./ButaComponent.scss";
import api from "../../Api"; 
import { useTranslation } from "react-i18next";

const ButaComponent = () => {
  const { t } = useTranslation();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [aboutImage, setAboutImage] = useState(null);

  useEffect(() => {
    api
      .get("/api/about-section/")
      .then((response) => {
        if (response.data.results?.length > 0) {
          setAboutImage(response.data.results[0].image);
        }
      })
      .catch((error) => console.error("Error fetching about section:", error));
  }, []);

  return (
    <>
      <div className="butaSvgFlexContainer">
        {/* Left SVG */}
        <div className="butaSvgWrapper leftSvg" key={0}>
          <svg
            width="404"
            height="570"
            viewBox="0 0 404 570"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M330.015 129.218L202.051 1.26611L74.0875 129.218C27.2916 176.026 1 239.492 1 305.688V569.168H403.103V305.688C403.103 239.504 376.811 176.026 330.015 129.23V129.218Z"
              stroke="#EECA99"
              strokeWidth="1.21327"
              strokeMiterlimit="10"
            />
          </svg>
        </div>

        {/* Center SVG with image */}
        <div className="butaSvgWrapper centerSvg" key={1}>
          <svg
            width="404"
            height="570"
            viewBox="0 0 404 570"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="shapeMask1">
                <rect width="100%" height="100%" fill="black" />
                <path
                  d="M330.015 129.218L202.051 1.26611L74.0875 129.218C27.2916 176.026 1 239.492 1 305.688V569.168H403.103V305.688C403.103 239.504 376.811 176.026 330.015 129.23V129.218Z"
                  fill="white"
                />
              </mask>
            </defs>
            <image
              href={
                aboutImage
                  ? aboutImage.startsWith("http")
                    ? aboutImage
                    : `${API_BASE_URL}${aboutImage}`
                  : "https://picsum.photos/404/570?random=1"
              }
              x="1"
              y="1"
              width="402"
              height="568"
              preserveAspectRatio="xMidYMid slice"
              mask="url(#shapeMask1)"
            />
            <path
              d="M330.015 129.218L202.051 1.26611L74.0875 129.218C27.2916 176.026 1 239.492 1 305.688V569.168H403.103V305.688C403.103 239.504 376.811 176.026 330.015 129.23V129.218Z"
              stroke="#EECA99"
              strokeWidth="1.21327"
              strokeMiterlimit="10"
            />
          </svg>
        </div>

        {/* Right SVG */}
        <div className="butaSvgWrapper rightSvg" key={2}>
          <svg
            width="404"
            height="570"
            viewBox="0 0 404 570"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M330.015 129.218L202.051 1.26611L74.0875 129.218C27.2916 176.026 1 239.492 1 305.688V569.168H403.103V305.688C403.103 239.504 376.811 176.026 330.015 129.23V129.218Z"
              stroke="#EECA99"
              strokeWidth="1.21327"
              strokeMiterlimit="10"
            />
          </svg>
        </div>
      </div>

      <div className="ButaAlbuharaTextComponentContainer">
        <h1 className="ButaAlbuharaTextComponentTitle">{t("buta.title")}</h1>
        <h1 className="ButaAlbuharaTextComponentAltTitle">{t("buta.subtitle")}</h1>
        <p className="ButaAlbuharaTextComponentSubtitle">{t("buta.tagline")}</p>
      </div>
    </>
  );
};

export default ButaComponent;
