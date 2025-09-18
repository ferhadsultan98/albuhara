import React, { useState, useEffect } from "react";
import axios from "axios";
import Switch from "react-switch";
import { X, Plus, Trash2 } from "lucide-react";
import "./AdminProduct.scss";
import api from "../../Api";

const AdminProductsContainer = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    name: { Az: "", En: "", Ru: "" },
    description: { Az: "", En: "", Ru: "" },
    isNew: false,
    isVegan: false,
    image: null,
    multiSize: false,
    basePrice: "",
    variants: [],
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = async (page = 1, search = "") => {
    try {
      const res = await api.get(`/api/items/?page=${page}&search=${search}`);
      setProducts(res.data.results || []);
      setTotalPages(Math.ceil(res.data.count / 10) || 1);
    } catch (error) {
      setErrorMessage("Error fetching products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories/");
      setCategories(res.data.results || []);
    } catch (error) {
      setErrorMessage("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, filter);
    fetchCategories();
  }, [currentPage, filter]);

  const handleInputChange = (e, field, lang) => {
    if (lang) {
      setFormData({
        ...formData,
        [field]: { ...formData[field], [lang]: e.target.value },
      });
    } else if (field === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleSwitchChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleVariantChange = (index, field, lang, value) => {
    const newVariants = [...formData.variants];
    if (lang) {
      newVariants[index] = {
        ...newVariants[index],
        size: { ...newVariants[index].size, [lang]: value },
      };
    } else {
      newVariants[index] = { ...newVariants[index], [field]: value };
    }
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: { Az: "", En: "", Ru: "" }, price: "" },
      ],
    });
  };

  const removeVariant = (index) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("category", formData.category);
      data.append("name", JSON.stringify(formData.name));
      data.append("description", JSON.stringify(formData.description));
      data.append("is_new", formData.isNew);
      data.append("is_vegan", formData.isVegan);
      if (formData.image) data.append("image", formData.image);
      data.append("multi_size", formData.multiSize);
      if (!formData.multiSize) data.append("base_price", formData.basePrice);
      if (formData.multiSize && formData.variants.length) {
        data.append("variants", JSON.stringify(formData.variants));
      }
      const token = localStorage.getItem("accessToken"); // 🔑 JWT token
      let response;

      if (selectedProduct) {
        const res = await api.put(`/api/items/${selectedProduct.id}/`, data);
        setProducts((prev) =>
          prev.map((p) => (p.id === selectedProduct.id ? res.data : p))
        );
      } else {
        const res = await api.post("/api/items/", data);
        setProducts((prev) => [res.data, ...prev]);
      }

      // reset form
      setFormData({
        category: "",
        name: { Az: "", En: "", Ru: "" },
        description: { Az: "", En: "", Ru: "" },
        isNew: false,
        isVegan: false,
        image: null,
        multiSize: false,
        basePrice: "",
        variants: [],
      });
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Error saving product");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // 🔑 JWT token
      await api.delete(`/api/items/${selectedProduct.id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      setErrorMessage("Error deleting product");
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      category: product.category,
      name: product.name,
      description: product.description,
      isNew: product.is_new,
      isVegan: product.is_vegan,
      image: null,
      multiSize: product.multi_size,
      basePrice: product.base_price || "",
      variants: product.variants || [],
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="admin-products-container">
      <h2 className="section-title">
        {selectedProduct ? "Edit Product" : "Add Product"}
      </h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="filter-group">
        <input
          className="filter-input"
          placeholder="Search products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <X className="clear-icon" onClick={() => setFilter("")} />
      </div>

      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-row">
            <label className="input-label">Category</label>
            <select
              className="select-field"
              value={formData.category}
              onChange={(e) => handleInputChange(e, "category")}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title.En || cat.title.Az || cat.title.Ru}
                </option>
              ))}
            </select>
          </div>

          {["Az", "En", "Ru"].map((lang) => (
            <div className="input-row" key={`name-${lang}`}>
              <label className="input-label">Name ({lang})</label>
              <input
                className="input-field"
                value={formData.name[lang]}
                onChange={(e) => handleInputChange(e, "name", lang)}
                placeholder={`Name in ${lang}`}
              />
            </div>
          ))}

          {["Az", "En", "Ru"].map((lang) => (
            <div className="input-row" key={`description-${lang}`}>
              <label className="input-label">Description ({lang})</label>
              <input
                className="input-field"
                value={formData.description[lang]}
                onChange={(e) => handleInputChange(e, "description", lang)}
                placeholder={`Description in ${lang}`}
              />
            </div>
          ))}

          <div className="input-row">
            <label className="input-label">Is New</label>
            <Switch
              checked={formData.isNew}
              onChange={(value) => handleSwitchChange("isNew", value)}
              className={`switch ${formData.isNew ? "switch-on" : ""}`}
              onColor="#86d3ff"
              offColor="#ccc"
              checkedIcon={false}
              uncheckedIcon={false}
            />
          </div>
          <div className="input-row">
            <label className="input-label">Is Vegan</label>
            <Switch
              checked={formData.isVegan}
              onChange={(value) => handleSwitchChange("isVegan", value)}
              className={`switch ${formData.isVegan ? "switch-on" : ""}`}
              onColor="#86d3ff"
              offColor="#ccc"
              checkedIcon={false}
              uncheckedIcon={false}
            />
          </div>

          <div className="input-row">
            <label className="input-label">Image</label>
            <input
              type="file"
              className="input-field"
              onChange={(e) => handleInputChange(e, "image")}
            />
          </div>

          <div className="input-row">
            <label className="input-label">Multi Size</label>
            <Switch
              checked={formData.multiSize}
              onChange={(value) => handleSwitchChange("multiSize", value)}
              className={`switch ${formData.multiSize ? "switch-on" : ""}`}
              onColor="#86d3ff"
              offColor="#ccc"
              checkedIcon={false}
              uncheckedIcon={false}
            />
          </div>

          {!formData.multiSize && (
            <div className="input-row">
              <label className="input-label">Base Price</label>
              <input
                type="number"
                step="0.01"
                className="input-field"
                value={formData.basePrice}
                onChange={(e) => handleInputChange(e, "basePrice")}
                placeholder="Base Price"
              />
            </div>
          )}

          {formData.multiSize && (
            <div className="variant-group">
              {formData.variants.map((variant, index) => (
                <div className="variant-row" key={index}>
                  {["Az", "En", "Ru"].map((lang) => (
                    <div
                      className="variant-input-wrapper"
                      key={`variant-size-${index}-${lang}`}
                    >
                      <label className="variant-label">Size ({lang})</label>
                      <input
                        className="variant-input"
                        value={variant.size[lang]}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "size",
                            lang,
                            e.target.value
                          )
                        }
                        placeholder={`Size in ${lang}`}
                      />
                    </div>
                  ))}
                  <div className="variant-input-wrapper">
                    <label className="variant-label">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="variant-input"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "price",
                          null,
                          e.target.value
                        )
                      }
                      placeholder="Price"
                    />
                  </div>
                  <button
                    type="button"
                    className="remove-variant-button"
                    onClick={() => removeVariant(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-variant-button"
                onClick={addVariant}
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>
          )}

          <button type="submit" className="add-button">
            {selectedProduct ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Name</th>
              <th>Description</th>
              <th>Is New</th>
              <th>Is Vegan</th>
              <th>Image</th>
              <th>Multi Size</th>
              <th>Base Price</th>
              <th>Variants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 &&
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {categories.find((cat) => cat.id === product.category)
                      ?.title.En || "N/A"}
                  </td>
                  <td>
                    {product.name.En || product.name.Az || product.name.Ru}
                  </td>
                  <td>
                    {product.description.En ||
                      product.description.Az ||
                      product.description.Ru}
                  </td>
                  <td>
                    <Switch
                      checked={product.is_new}
                      className={`switch switch-small ${
                        product.is_new ? "switch-on" : ""
                      }`}
                      disabled
                      onColor="#86d3ff"
                      offColor="#ccc"
                      checkedIcon={false}
                      uncheckedIcon={false}
                    />
                  </td>
                  <td>
                    <Switch
                      checked={product.is_vegan}
                      className={`switch switch-small ${
                        product.is_vegan ? "switch-on" : ""
                      }`}
                      disabled
                      onColor="#86d3ff"
                      offColor="#ccc"
                      checkedIcon={false}
                      uncheckedIcon={false}
                    />
                  </td>
                  <td>
                    {product.image && (
                      <img
                        src={product.image}
                        alt="Product"
                        className="product-image"
                      />
                    )}
                  </td>
                  <td>
                    <Switch
                      checked={product.multi_size}
                      className={`switch switch-small ${
                        product.multi_size ? "switch-on" : ""
                      }`}
                      disabled
                      onColor="#86d3ff"
                      offColor="#ccc"
                      checkedIcon={false}
                      uncheckedIcon={false}
                    />
                  </td>
                  <td>{product.base_price || "N/A"}</td>
                  <td className="product-variants">
                    {product.variants.length > 0 &&
                      product.variants.map((v) => (
                        <div key={v.id}>
                          {v.size.En || v.size.Az || v.size.Ru}: ${v.price}
                        </div>
                      ))}
                  </td>
                  <td className="product-actions">
                    <button
                      className="edit-button"
                      onClick={() => openEditModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="page-button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="page-button"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Product</h3>
              <X
                className="modal-close"
                onClick={() => setIsEditModalOpen(false)}
              />
            </div>
            <form className="edit-product-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-row">
                  <label className="input-label">Category</label>
                  <select
                    className="select-field"
                    value={formData.category}
                    onChange={(e) => handleInputChange(e, "category")}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title.En || cat.title.Az || cat.title.Ru}
                      </option>
                    ))}
                  </select>
                </div>

                {["Az", "En", "Ru"].map((lang) => (
                  <div className="input-row" key={`name-${lang}`}>
                    <label className="input-label">Name ({lang})</label>
                    <input
                      className="input-field"
                      value={formData.name[lang]}
                      onChange={(e) => handleInputChange(e, "name", lang)}
                      placeholder={`Name in ${lang}`}
                    />
                  </div>
                ))}

                {["Az", "En", "Ru"].map((lang) => (
                  <div className="input-row" key={`description-${lang}`}>
                    <label className="input-label">Description ({lang})</label>
                    <input
                      className="input-field"
                      value={formData.description[lang]}
                      onChange={(e) =>
                        handleInputChange(e, "description", lang)
                      }
                      placeholder={`Description in ${lang}`}
                    />
                  </div>
                ))}

                <div className="input-row">
                  <label className="input-label">Is New</label>
                  <Switch
                    checked={formData.isNew}
                    onChange={(value) => handleSwitchChange("isNew", value)}
                    className={`switch ${formData.isNew ? "switch-on" : ""}`}
                    onColor="#86d3ff"
                    offColor="#ccc"
                    checkedIcon={false}
                    uncheckedIcon={false}
                  />
                </div>
                <div className="input-row">
                  <label className="input-label">Is Vegan</label>
                  <Switch
                    checked={formData.isVegan}
                    onChange={(value) => handleSwitchChange("isVegan", value)}
                    className={`switch ${formData.isVegan ? "switch-on" : ""}`}
                    onColor="#86d3ff"
                    offColor="#ccc"
                    checkedIcon={false}
                    uncheckedIcon={false}
                  />
                </div>

                <div className="input-row">
                  <label className="input-label">Image</label>
                  <input
                    type="file"
                    className="input-field"
                    onChange={(e) => handleInputChange(e, "image")}
                  />
                </div>

                <div className="input-row">
                  <label className="input-label">Multi Size</label>
                  <Switch
                    checked={formData.multiSize}
                    onChange={(value) => handleSwitchChange("multiSize", value)}
                    className={`switch ${
                      formData.multiSize ? "switch-on" : ""
                    }`}
                    onColor="#86d3ff"
                    offColor="#ccc"
                    checkedIcon={false}
                    uncheckedIcon={false}
                  />
                </div>

                {!formData.multiSize && (
                  <div className="input-row">
                    <label className="input-label">Base Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input-field"
                      value={formData.basePrice}
                      onChange={(e) => handleInputChange(e, "basePrice")}
                      placeholder="Base Price"
                    />
                  </div>
                )}

                {formData.multiSize && (
                  <div className="variant-group">
                    {formData.variants.map((variant, index) => (
                      <div className="variant-row" key={index}>
                        {["Az", "En", "Ru"].map((lang) => (
                          <div
                            className="variant-input-wrapper"
                            key={`variant-size-${index}-${lang}`}
                          >
                            <label className="variant-label">
                              Size ({lang})
                            </label>
                            <input
                              className="variant-input"
                              value={variant.size[lang]}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "size",
                                  lang,
                                  e.target.value
                                )
                              }
                              placeholder={`Size in ${lang}`}
                            />
                          </div>
                        ))}
                        <div className="variant-input-wrapper">
                          <label className="variant-label">Price</label>
                          <input
                            type="number"
                            step="0.01"
                            className="variant-input"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "price",
                                null,
                                e.target.value
                              )
                            }
                            placeholder="Price"
                          />
                        </div>
                        <button
                          type="button"
                          className="remove-variant-button"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-variant-button"
                      onClick={addVariant}
                    >
                      <Plus size={16} /> Add Variant
                    </button>
                  </div>
                )}

                <div className="modal-actions">
                  <button type="submit" className="save-button">
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedProduct(null);
                      setFormData({
                        category: "",
                        name: { Az: "", En: "", Ru: "" },
                        description: { Az: "", En: "", Ru: "" },
                        isNew: false,
                        isVegan: false,
                        image: null,
                        multiSize: false,
                        basePrice: "",
                        variants: [],
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Delete Product</h3>
              <X
                className="modal-close"
                onClick={() => setIsDeleteModalOpen(false)}
              />
            </div>
            <p className="modal-text">
              Are you sure you want to delete{" "}
              {selectedProduct?.name.En ||
                selectedProduct?.name.Az ||
                selectedProduct?.name.Ru}
              ?
            </p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleDelete}>
                Delete
              </button>
              <button
                className="cancel-button"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsContainer;
