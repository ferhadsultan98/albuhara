import React, { useState, useEffect, useCallback } from "react";
import AlbuharaSlider from "./AlbuharaSlider/AlbuharaSlider";
import HomeActiveCards from "./HomeActiveCards/HomeActiveCards";
import "./HomePage.scss";
import AlbuharaTextComponents from "../../Components/AlbuharaTextComponent/AlbuharaTextComponent";
import AlbuharaMenuComponents from "../../Components/AlbuharaMenuComponents/AlbuharaMenuComponents";
import ButaComponent from "../../Components/ButaComponent/ButaComponent";

const HomePage = () => {
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [isButaVisible, setIsButaVisible] = useState(false);

  const handleResize = useCallback(() => {
    setIsTextVisible(window.innerWidth >= 744);
    setIsButaVisible(window.innerWidth < 744);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <div className="homePageContainer">
      {isTextVisible && <AlbuharaTextComponents />}
      <AlbuharaMenuComponents />
      <HomeActiveCards />
      {isButaVisible && <ButaComponent />}
      <AlbuharaSlider />
    </div>
  );
};

export default HomePage;