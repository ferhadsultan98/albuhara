import React, { useState, useEffect } from 'react';
import { Filter, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import './AdminCategories.scss';
import api from "../../Api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ En: '', Ru: '', Az: '' });
  const [editCategory, setEditCategory] = useState(null);
  const [editCategoryTitle, setEditCategoryTitle] = useState({ En: '', Ru: '', Az: '' });
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const categoriesPerPage = 10;

  // --- useEffect içində ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/categories/?page=${currentPage}&page_size=${categoriesPerPage}`);
        setCategories(res.data.results || []);
        setTotalPages(Math.ceil(res.data.count / categoriesPerPage));
      } catch (err) {
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [currentPage]);

  // --- Add Category ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/api/categories/", { title: newCategory });
      setCategories([...categories, res.data]);
      setNewCategory({ En: "", Ru: "", Az: "" });
      setTotalPages(Math.ceil((categories.length + 1) / categoriesPerPage));
    } catch (err) {
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Category ---
  const handleDeleteCategory = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/api/categories/${id}/`);
      setCategories(categories.filter((c) => c.id !== id));
      setDeleteCategoryId(null);
      setTotalPages(Math.ceil((categories.length - 1) / categoriesPerPage));
      if (categories.length % categoriesPerPage === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      setError("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  // --- Update Category ---
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put(`/api/categories/${editCategory.id}/`, { title: editCategoryTitle });
      setCategories(categories.map((c) => (c.id === res.data.id ? res.data : c)));
      setEditCategory(null);
      setEditCategoryTitle({ En: "", Ru: "", Az: "" });
    } catch (err) {
      setError("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.title.En.toLowerCase().includes(filter.toLowerCase()) ||
      category.title.Ru.toLowerCase().includes(filter.toLowerCase()) ||
      category.title.Az.toLowerCase().includes(filter.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="adminCategoriesContainer">
      <div className="page-header">
        <h2 className="sectionTitle">Category Management</h2>
        <p className="subtitle">Manage your product categories in multiple languages</p>
      </div>

      {/* Add Category Form */}
      <div className="content-card">
        <div className="card-header">
          <h3>Add New Category</h3>
        </div>
        <form onSubmit={handleAddCategory} className="addCategoryForm">
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">
                <span className="label-text">Az</span>
                <span className="label-required">*</span>
              </label>
              <input
                type="text"
                value={newCategory.Az}
                onChange={(e) => setNewCategory({ ...newCategory, Az: e.target.value })}
                placeholder="Kateqoriya adı (Azərbaycanca)"
                className="input-field"
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">
                <span className="label-text">En</span>
                <span className="label-required">*</span>
              </label>
              <input
                type="text"
                value={newCategory.En}
                onChange={(e) => setNewCategory({ ...newCategory, En: e.target.value })}
                placeholder="Category name (English)"
                className="input-field"
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">
                <span className="label-text">Ru</span>
                <span className="label-required">*</span>
              </label>
              <input
                type="text"
                value={newCategory.Ru}
                onChange={(e) => setNewCategory({ ...newCategory, Ru: e.target.value })}
                placeholder="Название категории (Русский)"
                className="input-field"
                required
                disabled={loading}
              />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            <Plus size={16} />
            <span>{loading ? 'Adding...' : 'Add Category'}</span>
          </button>
        </form>
      </div>

      {/* Filter Section */}
      <div className="content-card">
        <div className="filter-section">
          <div className="filter-group">
            <Filter size={18} className="filter-icon" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search categories..."
              className="filter-input"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="content-card">
        <div className="card-header">
          <h3>Categories ({filteredCategories.length})</h3>
        </div>
        
        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Azerbaijani</th>
                  <th>English</th>
                  <th>Russian</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => (
                    <tr key={category.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                      <td data-label="Azerbaijani">{category.title.Az}</td>
                      <td data-label="English">{category.title.En}</td>
                      <td data-label="Russian">{category.title.Ru}</td>
                      <td data-label="Actions">
                        <div className="action-buttons">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => {
                              setEditCategory(category);
                              setEditCategoryTitle(category.title);
                            }}
                            title="Edit category"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => setDeleteCategoryId(category.id)}
                            title="Delete category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      <div className="no-data-content">
                        <p>No categories found</p>
                        <span>Try adjusting your search filters</span>
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
              onClick={() => handlePageChange(currentPage - 1)}
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
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="page-btn next-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Category</h3>
            </div>
            <form onSubmit={handleUpdateCategory} className="modal-form">
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">
                    <span className="label-text">Az</span>
                    <span className="label-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={editCategoryTitle.Az}
                    onChange={(e) => setEditCategoryTitle({ ...editCategoryTitle, Az: e.target.value })}
                    placeholder="Kateqoriya adı (Azərbaycanca)"
                    className="input-field"
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    <span className="label-text">En</span>
                    <span className="label-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={editCategoryTitle.En}
                    onChange={(e) => setEditCategoryTitle({ ...editCategoryTitle, En: e.target.value })}
                    placeholder="Category name (English)"
                    className="input-field"
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    <span className="label-text">Ru</span>
                    <span className="label-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={editCategoryTitle.Ru}
                    onChange={(e) => setEditCategoryTitle({ ...editCategoryTitle, Ru: e.target.value })}
                    placeholder="Название категории (Русский)"
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditCategory(null)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteCategoryId && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h3>Delete Category</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this category? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeleteCategoryId(null)}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-btn"
                onClick={() => handleDeleteCategory(deleteCategoryId)}
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

export default AdminCategories;
