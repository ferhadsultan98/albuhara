import React, { useState, useEffect } from "react";
import "./ResponsiveMenuPage.scss";
import { LuVegan } from "react-icons/lu";
import { PiStarFourFill } from "react-icons/pi";
import { Search, ChefHat } from "lucide-react";
import { useTranslation } from "react-i18next";

const ResponsiveMenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { i18n, t } = useTranslation();

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

  // Group items by category when "all" is selected
  const groupedItems =
    selectedCategory === "all"
      ? categories
          .filter((cat) => cat.id !== "all")
          .map((category) => ({
            category,
            items: menuItems.filter((item) => item.category === category.id),
          }))
          .filter((group) => group.items.length > 0)
      : [{ category: null, items: filteredItems }];

  // Get current category name for empty state
  const getCurrentCategoryName = () => {
    if (selectedCategory === "all") return null;
    const category = categories.find((cat) => cat.id === selectedCategory);
    return category
      ? category.title[
          i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)
        ]
      : "";
  };

  // Empty State Component
  const EmptyState = ({ categoryName, isAllCategories = false }) => (
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
  );

  const renderMenuItem = (item, index) => {
    const isSimple =
      !item.multi_size || !item.variants || item.variants.length === 0;
    return (
      <div key={`${item.id}-${index}`} className="ResponsiveMenuPageMenuCard">
        <div className="ResponsiveMenuPageMenuCardContent">
          <div className="ResponsiveMenuPageMenuCardText">
            <h3 className="ResponsiveMenuPageMenuCardTitle">
              {item.name[
                i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)
              ].toUpperCase()}
            </h3>
            {isSimple ? (
              <>
                {item.description[
                  i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)
                ] && (
                  <p className="ResponsiveMenuPageMenuCardDescription">
                    {
                      item.description[
                        i18n.language.charAt(0).toUpperCase() +
                          i18n.language.slice(1)
                      ]
                    }
                  </p>
                )}
                <div className="ResponsiveMenuPageMenuCardPrice">
                  {item.base_price}₼
                </div>
              </>
            ) : (
              <div className="ResponsiveMenuPageMenuCardSizes">
                {item.variants.map((variant) => (
                  <div className="ResponsiveMenuPageSizeItem" key={variant.id}>
                    <span className="ResponsiveMenuPageSizeLabel">
                      {
                        variant.size[
                          i18n.language.charAt(0).toUpperCase() +
                            i18n.language.slice(1)
                        ]
                      }
                    </span>
                    <span className="ResponsiveMenuPageSizePrice">
                      {variant.price}₼
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="ResponsiveMenuPageMenuCardImageContainer">
            <img
              src={item.image || "/assets/test1.png"}
              alt={
                item.name[
                  i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)
                ]
              }
              className="ResponsiveMenuPageMenuCardImage"
            />
            <div className="ResponsiveMenuPageMenuCardBadges">
              {item.is_vegan && (
                <span className="ResponsiveMenuPageBadge ResponsiveMenuPageBadgeVegan">
                  <i>
                    <LuVegan />
                  </i>
                  {i18n.t("menu.vegan")}
                </span>
              )}
              {item.is_new && (
                <span className="ResponsiveMenuPageBadge ResponsiveMenuPageBadgeNew">
                  <i>
                    <PiStarFourFill />
                  </i>
                  {i18n.t("menu.new")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ResponsiveMenuPageMenuContainer">
      {/* Menu Title */}
      <div className="ResponsiveMenuPageHeader">
        <h1 className="ResponsiveMenuPageTitle">
          {i18n.language === "az"
            ? "MENYU"
            : i18n.language === "en"
            ? "MENU"
            : "МЕНЮ"}
        </h1>
      </div>

      <div className="ResponsiveMenuPageCategoryFilter">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`ResponsiveMenuPageFilterButton ${
              selectedCategory === category.id ? "ResponsiveMenuPageActive" : ""
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

      {/* Render grouped items or empty state */}
      {groupedItems.length === 0 && selectedCategory === "all" ? (
        // No items in any category
        <EmptyState isAllCategories={true} />
      ) : selectedCategory !== "all" && filteredItems.length === 0 ? (
        // No items in selected category
        <EmptyState categoryName={getCurrentCategoryName()} />
      ) : (
        // Render items
        groupedItems.map((group, groupIndex) => (
          <div key={groupIndex} className="ResponsiveMenuPageCategorySection">
            {group.category && (
              <h2 className="ResponsiveMenuPageCategoryTitle">
                {
                  group.category.title[
                    i18n.language.charAt(0).toUpperCase() +
                      i18n.language.slice(1)
                  ]
                }
              </h2>
            )}
            <div className="ResponsiveMenuPageMenuGrid">
              {group.items.map((item, index) => renderMenuItem(item, index))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResponsiveMenuPage;
