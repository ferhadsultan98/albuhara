import React, { useState, useEffect } from "react";
import "./MenuComponent.scss";
import DesktopMenuPage from "../../Pages/DesktopMenuPage/DesktopMenuPage";
import ResponsiveMenuPage from "../../Pages/ResponsiveMenuPage/ResponsiveMenuPage";

const MenuComponent = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {windowWidth > 744 ? <DesktopMenuPage /> : <ResponsiveMenuPage />}
    </div>
  );
};

export default MenuComponent;