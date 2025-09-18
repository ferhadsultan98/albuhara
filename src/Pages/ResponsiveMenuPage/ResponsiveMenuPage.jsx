import React, { useState, useEffect } from "react";
import "./ResponsiveMenuPage.scss";
import { LuVegan } from "react-icons/lu";
import { useTranslation } from "react-i18next";

const ResponsiveMenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, itemsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories/`),
          fetch(`${API_BASE_URL}/api/items/`),
        ]);
        const categoriesData = await categoriesRes.json();
        const itemsData = await itemsRes.json();

        const categoriesArray = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.results || [];

        setCategories([
          { id: "all", title: { Az: "Hamısı", En: "All", Ru: "Все" } },
          ...categoriesArray,
        ]);
        setMenuItems(
          Array.isArray(itemsData) ? itemsData : itemsData.results || []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="ResponsiveMenuPageMenuContainer">
      <div className="ResponsiveMenuPageCategoryFilter">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`ResponsiveMenuPageFilterButton ${
              selectedCategory === category.id ? "ResponsiveMenuPageActive" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.title[i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)]}
          </button>
        ))}
      </div>
      <div className="ResponsiveMenuPageMenuGrid">
        {filteredItems.map((item, index) => {
          const isSimple = !item.multi_size || !item.variants || item.variants.length === 0;
          return (
            <div key={`${item.id}-${index}`} className="ResponsiveMenuPageMenuCard">
              <div className="ResponsiveMenuPageMenuCardContent">
                <div className="ResponsiveMenuPageMenuCardText">
                  <h3 className="ResponsiveMenuPageMenuCardTitle">
                    {item.name[i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)].toUpperCase()}
                  </h3>
                  {isSimple ? (
                    <>
                      {item.description[i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)] && (
                        <p className="ResponsiveMenuPageMenuCardDescription">
                          {item.description[i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)]}
                        </p>
                      )}
                      <div className="ResponsiveMenuPageMenuCardPrice">{item.base_price}₼</div>
                    </>
                  ) : (
                    <div className="ResponsiveMenuPageMenuCardSizes">
                      {item.variants.map((variant) => (
                        <div className="ResponsiveMenuPageSizeItem" key={variant.id}>
                          <span className="ResponsiveMenuPageSizeLabel">
                            {variant.size[i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)]}
                          </span>
                          <span className="ResponsiveMenuPageSizePrice">{variant.price}₼</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ResponsiveMenuPageMenuCardImageContainer">
                  <img
                    src={item.image || "/assets/test1.png"}
                    alt={item.name[i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)]}
                    className="ResponsiveMenuPageMenuCardImage"
                  />
                  <div className="ResponsiveMenuPageMenuCardBadges">
                    {item.is_vegan && (
                      <span className="ResponsiveMenuPageBadge ResponsiveMenuPageBadgeVegan">
                        <i>
                          <LuVegan />
                        </i>{" "}
                        {i18n.t("menu.vegan")}
                      </span>
                    )}
                    {item.is_new && (
                      <span className="ResponsiveMenuPageBadge ResponsiveMenuPageBadgeNew">
                        {i18n.t("menu.new")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponsiveMenuPage;