import React, { useState, useEffect } from "react";
import "./DesktopMenuPage.scss";
import { LuVegan } from "react-icons/lu";
import { PiStarFourFill } from "react-icons/pi";
import { useTranslation } from "react-i18next";

const DesktopMenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleItems, setVisibleItems] = useState(8);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { t, i18n } = useTranslation();

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

  // Group items by category when "all" is selected
  const groupedItems =
    selectedCategory === "all"
      ? categories.slice(1).reduce((acc, category) => {
          const categoryItems = menuItems.filter(
            (item) => item.category === category.id
          );
          if (categoryItems.length > 0) {
            acc.push({
              category,
              items: categoryItems,
            });
          }
          return acc;
        }, [])
      : [];

  const filteredItems =
    selectedCategory === "all"
      ? []
      : menuItems.filter((item) => item.category === selectedCategory);

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 8);
  };

  return (
    <div className="DescktopMenuPageComponent">
      <h1 className="DescktopMenuHeader">{t("menu.header")}</h1>
      <div className="categoryFilter">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`filterButton ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {
              category.title[
                i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)
              ]
            }
          </button>
        ))}
      </div>

      {selectedCategory === "all" ? (
        // Show all categories vertically with titles on the left
        <div className="allCategoriesLayout">
          {groupedItems.map((group) => (
            <div key={group.category.id} className="categorySection">
              <h2 className="categorySectionTitle">
                {
                  group.category.title[
                    i18n.language.charAt(0).toUpperCase() +
                      i18n.language.slice(1)
                  ]
                }
              </h2>
              <div className="categoryContainer">
                {group.items.map((item) => (
                  <div className="categoryItem" key={item.id}>
                    <div className="imageWrapper">
                      <img
                        src={item.image || "/assets/test1.png"}
                        alt={
                          item.name[
                            i18n.language.charAt(0).toUpperCase() +
                              i18n.language.slice(1)
                          ]
                        }
                      />
                      {item.is_vegan && (
                        <span className="veganLabel">
                          <i>
                            <LuVegan />
                          </i>
                          {t("menu.vegan")}
                        </span>
                      )}
                      {item.is_new && (
                        <span className="newLabel">
                          <i>
                            <PiStarFourFill />
                          </i>
                          {t("menu.new")}
                        </span>
                      )}
                    </div>
                    <div className="productInfo">
                      <h3 className="productName">
                        {item.name[
                          i18n.language.charAt(0).toUpperCase() +
                            i18n.language.slice(1)
                        ].toUpperCase()}
                      </h3>
                      <p>
                        {
                          item.description[
                            i18n.language.charAt(0).toUpperCase() +
                              i18n.language.slice(1)
                          ]
                        }
                      </p>
                      {item.multi_size && item.variants.length > 0 ? (
                        <div className="sizesPrices">
                          {item.variants.map((variant) => (
                            <div className="sizePriceItem" key={variant.id}>
                              <span className="size">
                                {
                                  variant.size[
                                    i18n.language.charAt(0).toUpperCase() +
                                      i18n.language.slice(1)
                                  ]
                                }
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
            </div>
          ))}
        </div>
      ) : (
        // Show single category with title on left
        <>
          <div className="singleCategoryLayout">
            <h2 className="categorySectionTitle">
              {
                categories.find((cat) => cat.id === selectedCategory)?.title[
                  i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)
                ]
              }
            </h2>
            {filteredItems.length === 0 ? (
              <div className="noItemsMessage">
                <span>
                  {
                    categories.find((cat) => cat.id === selectedCategory)
                      ?.title[
                      i18n.language.charAt(0).toUpperCase() +
                        i18n.language.slice(1)
                    ]
                  }
                </span>
                {t("menu.noItems")}
              </div>
            ) : (
              <div className="categoryContainer">
                {filteredItems.slice(0, visibleItems).map((item) => (
                  <div className="categoryItem" key={item.id}>
                    <div className="imageWrapper">
                      <img
                        src={item.image || "/assets/test1.png"}
                        alt={
                          item.name[
                            i18n.language.charAt(0).toUpperCase() +
                              i18n.language.slice(1)
                          ]
                        }
                      />
                      {item.is_vegan && (
                        <span className="veganLabel">
                          <i>
                            <LuVegan />
                          </i>
                          {t("menu.vegan")}
                        </span>
                      )}
                      {item.is_new && (
                        <span className="newLabel">
                          <i>
                            <PiStarFourFill />
                          </i>
                          {t("menu.new")}
                        </span>
                      )}
                    </div>
                    <div className="productInfo">
                      <h3 className="productName">
                        {item.name[
                          i18n.language.charAt(0).toUpperCase() +
                            i18n.language.slice(1)
                        ].toUpperCase()}
                      </h3>
                      <p>
                        {
                          item.description[
                            i18n.language.charAt(0).toUpperCase() +
                              i18n.language.slice(1)
                          ]
                        }
                      </p>
                      {item.multi_size && item.variants.length > 0 ? (
                        <div className="sizesPrices">
                          {item.variants.map((variant) => (
                            <div className="sizePriceItem" key={variant.id}>
                              <span className="size">
                                {
                                  variant.size[
                                    i18n.language.charAt(0).toUpperCase() +
                                      i18n.language.slice(1)
                                  ]
                                }
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
            )}
          </div>
          {visibleItems < filteredItems.length && (
            <div className="loadMoreContainer">
              <button className="loadMoreButton" onClick={handleLoadMore}>
                {t("menu.loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DesktopMenuPage;
