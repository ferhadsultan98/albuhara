import React from "react";
import "./AlbuharaMenuComponents.scss";
import decorSquare from "../../../public/assets/decorSquare.png";
import ZapFast from "../../../public/assets/zap-fast.png";
import MenuBoard from "../../../public/assets/menu-board.png";
import { Link } from "react-router-dom";

const AlbuharaMenuComponents = () => {
  return (
    <div className="AlbuharaMenuComponentsContainer">
      <Link to='/delivery' className="AlbuharaMenuComponentsCircleItem">
        <img src={decorSquare} alt="Circle 1" />
        <div className="AlbuharaMenuComponentsText">
          <img className="AlbuharaMenuIcon" src={ZapFast} alt="" />
          ÇATDIRILMA
        </div>
      </Link>
      <Link to='/menu' className="AlbuharaMenuComponentsCircleItem">
        <img src={decorSquare} alt="Circle 2" />
        <div className="AlbuharaMenuComponentsText">
          <img className="AlbuharaMenuIcon" src={MenuBoard} alt="" />
          MENU
        </div>
      </Link>
      <Link to='/menu' className="AlbuharaMenuComponentsCircleItem">
        <img src={decorSquare} alt="Circle 3" />
        <div className="AlbuharaMenuComponentsText">
          <img className="AlbuharaMenuIcon" src={MenuBoard} alt="" />
          MENU
        </div>
      </Link>
      <Link to='/menu' className="AlbuharaMenuComponentsCircleItem">
        <img src={decorSquare} alt="Circle 4" />
        <div className="AlbuharaMenuComponentsText">
          <img className="AlbuharaMenuIcon" src={MenuBoard} alt="" />
          MENU
        </div>
      </Link>
    </div> 
  );
};

export default AlbuharaMenuComponents;
