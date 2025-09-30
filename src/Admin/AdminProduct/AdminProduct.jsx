import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Upload, Eye, ChevronLeft, ChevronRight, Filter } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
      setLoading(true);
      const res = await api.get(`/api/items/?page=${page}&search=${search}`);
      setProducts(res.data.results || []);
      setTotalPages(Math.ceil(res.data.count / 10) || 1);
    } catch (error) {
      setErrorMessage("Error fetching products");
    } finally {
      setLoading(false);
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
      setLoading(true);
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

      if (selectedProduct) {
        const res = await api.put(`/api/items/${selectedProduct.id}/`, data);
        setProducts((prev) =>
          prev.map((p) => (p.id === selectedProduct.id ? res.data : p))
        );
      } else {
        const res = await api.post("/api/items/", data);
        setProducts((prev) => [res.data, ...prev]);
      }

      // Reset form
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
      setShowForm(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/api/items/${selectedProduct.id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      setErrorMessage("Error deleting product");
    } finally {
      setLoading(false);
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

  const CustomSwitch = ({ checked, onChange, disabled = false }) => (
    <div 
      className={`custom-switch ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? null : () => onChange(!checked)}
    >
      <div className="switch-slider"></div>
    </div>
  );

  return (
    <div className="admin-products-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h2 className="section-title">Product Management</h2>
          <p className="subtitle">Manage your products, categories, and inventory</p>
        </div>
        <div className="header-actions">
          <button 
            className="add-product-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={16} />
            <span>{showForm ? 'Hide Form' : 'Add Product'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Add Product Form */}
      {showForm && (
        <div className="content-card form-card">
          <div className="card-header">
            <h3>{selectedProduct ? "Edit Product" : "Add New Product"}</h3>
          </div>
          <form className="product-form" onSubmit={handleSubmit}>
            {/* Category Selection */}
            <div className="form-section">
              <h4>Basic Information</h4>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">
                    <span>Category</span>
                    <span className="required">*</span>
                  </label>
                  <select
                    className="select-field"
                    value={formData.category}
                    onChange={(e) => handleInputChange(e, "category")}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title.En || cat.title.Az || cat.title.Ru}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Product Names */}
            <div className="form-section">
              <h4>Product Names</h4>
              <div className="form-grid">
                {["Az", "En", "Ru"].map((lang) => (
                  <div className="input-group" key={`name-${lang}`}>
                    <label className="input-label">
                      <span>Name ({lang})</span>
                      <span className="required">*</span>
                    </label>
                    <input
                      className="input-field"
                      value={formData.name[lang]}
                      onChange={(e) => handleInputChange(e, "name", lang)}
                      placeholder={`Product name in ${lang}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Descriptions */}
            <div className="form-section">
              <h4>Product Descriptions</h4>
              <div className="form-grid">
                {["Az", "En", "Ru"].map((lang) => (
                  <div className="input-group" key={`description-${lang}`}>
                    <label className="input-label">
                      <span>Description ({lang})</span>
                    </label>
                    <textarea
                      className="textarea-field"
                      rows="3"
                      value={formData.description[lang]}
                      onChange={(e) => handleInputChange(e, "description", lang)}
                      placeholder={`Product description in ${lang}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Properties */}
            <div className="form-section">
              <h4>Product Properties</h4>
              <div className="form-grid switch-grid">
                <div className="switch-group">
                  <label className="switch-label">Is New Product</label>
                  <CustomSwitch
                    checked={formData.isNew}
                    onChange={(value) => handleSwitchChange("isNew", value)}
                  />
                </div>
                <div className="switch-group">
                  <label className="switch-label">Is Vegan</label>
                  <CustomSwitch
                    checked={formData.isVegan}
                    onChange={(value) => handleSwitchChange("isVegan", value)}
                  />
                </div>
                <div className="switch-group">
                  <label className="switch-label">Multiple Sizes</label>
                  <CustomSwitch
                    checked={formData.multiSize}
                    onChange={(value) => handleSwitchChange("multiSize", value)}
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="form-section">
              <h4>Product Image</h4>
              <div className="file-upload-group">
                <label className="file-upload-label">
                  <Upload size={20} />
                  <span>Choose product image</span>
                  <input
                    type="file"
                    className="file-input"
                    onChange={(e) => handleInputChange(e, "image")}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Pricing */}
            <div className="form-section">
              <h4>Pricing</h4>
              {!formData.multiSize ? (
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">
                      <span>Base Price</span>
                      <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="input-field"
                      value={formData.basePrice}
                      onChange={(e) => handleInputChange(e, "basePrice")}
                      placeholder="0.00"
                      required={!formData.multiSize}
                    />
                  </div>
                </div>
              ) : (
                <div className="variants-section">
                  {formData.variants.map((variant, index) => (
                    <div className="variant-card" key={index}>
                      <div className="variant-header">
                        <h5>Variant {index + 1}</h5>
                        <button
                          type="button"
                          className="remove-variant-btn"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="variant-grid">
                        {["Az", "En", "Ru"].map((lang) => (
                          <div className="input-group" key={`variant-size-${index}-${lang}`}>
                            <label className="input-label">Size ({lang})</label>
                            <input
                              className="input-field"
                              value={variant.size[lang]}
                              onChange={(e) =>
                                handleVariantChange(index, "size", lang, e.target.value)
                              }
                              placeholder={`Size in ${lang}`}
                            />
                          </div>
                        ))}
                        <div className="input-group">
                          <label className="input-label">Price</label>
                          <input
                            type="number"
                            step="0.01"
                            className="input-field"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(index, "price", null, e.target.value)
                            }
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-variant-btn"
                    onClick={addVariant}
                  >
                    <Plus size={16} />
                    <span>Add Variant</span>
                  </button>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
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
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Saving...' : (selectedProduct ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search */}
      <div className="content-card">
        <div className="filter-section">
          <div className="search-group">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filter && (
              <button
                className="clear-search"
                onClick={() => setFilter("")}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="content-card">
        <div className="card-header">
          <h3>Products ({products.length})</h3>
        </div>
        
        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Properties</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                      <td data-label="Image">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt="Product"
                            className="product-image"
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </td>
                      <td data-label="Name">
                        <div className="product-name">
                          <strong>
                            {product.name.En || product.name.Az || product.name.Ru}
                          </strong>
                          <p className="product-description">
                            {product.description.En || product.description.Az || product.description.Ru}
                          </p>
                        </div>
                      </td>
                      <td data-label="Category">
                        {categories.find((cat) => cat.id === product.category)?.title.En || "N/A"}
                      </td>
                      <td data-label="Price">
                        {product.multi_size ? (
                          <div className="variants-info">
                            {product.variants?.map((v, i) => (
                              <div key={i} className="variant-price">
                                {v.size.En || v.size.Az || v.size.Ru}: ${v.price}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="base-price">${product.base_price || "N/A"}</span>
                        )}
                      </td>
                      <td data-label="Properties">
                        <div className="product-properties">
                          {product.is_new && <span className="property-tag new">New</span>}
                          {product.is_vegan && <span className="property-tag vegan">Vegan</span>}
                          {product.multi_size && <span className="property-tag multi">Multi-Size</span>}
                        </div>
                      </td>
                      <td data-label="Actions">
                        <div className="action-buttons">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => openEditModal(product)}
                            title="Edit product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsDeleteModalOpen(true);
                            }}
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      <div className="no-data-content">
                        <p>No products found</p>
                        <span>Try adjusting your search or add a new product</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn prev-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="page-btn next-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button
                className="modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              {/* Same form content as above but in modal */}
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedProduct(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h3>Delete Product</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {selectedProduct?.name.En ||
                    selectedProduct?.name.Az ||
                    selectedProduct?.name.Ru}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsContainer;
