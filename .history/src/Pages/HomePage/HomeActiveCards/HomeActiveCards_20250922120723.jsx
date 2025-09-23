import React, { useState, useEffect } from "react";
import "./HomeActiveCards.scss";
import { LuVegan } from "react-icons/lu";
import { PiStarFourFill } from "react-icons/pi";
import { useTranslation } from "react-i18next";

const HomeActiveCards = () => {
  const [menuItems, setMenuItems] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await fetch(`${API_BASE_URL}/api/items/`);
        const itemsData = await itemsRes.json();
        const itemsArray = Array.isArray(itemsData) ? itemsData : itemsData.results || [];
        setMenuItems(itemsArray.slice(0, 8));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="activeCardsContainer">
      {menuItems.map((item) => (
        <div className="activeCardItem" key={item.id}>
          <div className="imageWrapper">
            <img
              src={item.image || "/assets/test1.png"}
              alt={item.name[i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)]}
            />
            {item.is_vegan && (
              <span className="veganLabel">
                <i>
                  <LuVegan />
                </i>
                {i18n.t("menu.vegan")}
              </span>
            )}
            {item.is_new && (
              <span className="newLabel">
                <i>
                  <PiStarFourFill />
                </i>
                {i18n.t("menu.new")}
              </span>
            )}
          </div>
          <div className="productInfo">
            <h3 className="homeActiveCardsName">
              {item.name[i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)].toUpperCase()}
            </h3>
            <p>
              {item.description[i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)]}
            </p>
            {item.multi_size && item.variants.length > 0 ? (
              <div className="sizesPrices">
                {item.variants.map((variant) => (
                  <div className="sizePriceItem" key={variant.id}>
                    <span className="size">
                      {variant.size[i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)]}
                    </span>
                    <span className="price">{variant.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sizesPrices">
                <div className="sizePriceItem">
                  <span className="price">{item.base_price}AZN</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeActiveCards;