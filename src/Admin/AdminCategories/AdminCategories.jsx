import React, { useState, useEffect } from 'react';
import { Filter, Plus, Edit, Trash2 } from 'lucide-react';
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
  const categoriesPerPage = 10;

// --- useEffect içində ---
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await api.get(`/api/categories/?page=${currentPage}&page_size=${categoriesPerPage}`);
      setCategories(res.data.results || []);
      setTotalPages(Math.ceil(res.data.count / categoriesPerPage));
    } catch (err) {
      setError("Failed to fetch categories");
    }
  };
  fetchCategories();
}, [currentPage]);

// --- Add Category ---
const handleAddCategory = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/api/categories/", { title: newCategory });
    setCategories([...categories, res.data]);
    setNewCategory({ En: "", Ru: "", Az: "" });
    setTotalPages(Math.ceil((categories.length + 1) / categoriesPerPage));
  } catch (err) {
    setError("Failed to add category");
  }
};

// --- Delete Category ---
const handleDeleteCategory = async (id) => {
  try {
    await api.delete(`/api/categories/${id}/`);
    setCategories(categories.filter((c) => c.id !== id));
    setDeleteCategoryId(null);
    setTotalPages(Math.ceil((categories.length - 1) / categoriesPerPage));
    if (categories.length % categoriesPerPage === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  } catch (err) {
    setError("Failed to delete category");
  }
};

// --- Update Category ---
const handleUpdateCategory = async (e) => {
  e.preventDefault();
  try {
    const res = await api.put(`/api/categories/${editCategory.id}/`, { title: editCategoryTitle });
    setCategories(categories.map((c) => (c.id === res.data.id ? res.data : c)));
    setEditCategory(null);
    setEditCategoryTitle({ En: "", Ru: "", Az: "" });
  } catch (err) {
    setError("Failed to update category");
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
      <h2 className="sectionTitle">Manage Categories</h2>
      <form onSubmit={handleAddCategory} className="addCategoryForm">
        <div className="inputGroup">
          <div className="inputRow">
              <div className="inputWrapper">
              <span className="inputLabel">Az</span>
              <input
                type="text"
                value={newCategory.Az}
                onChange={(e) => setNewCategory({ ...newCategory, Az: e.target.value })}
                placeholder="Enter category title (Azerbaijani)"
                className="inputField"
                required
              />
            </div>
            <div className="inputWrapper">
              <span className="inputLabel">En</span>
              <input
                type="text"
                value={newCategory.En}
                onChange={(e) => setNewCategory({ ...newCategory, En: e.target.value })}
                placeholder="Enter category title (English)"
                className="inputField"
                required
              />
            </div>
            <div className="inputWrapper">
              <span className="inputLabel">Ru</span>
              <input
                type="text"
                value={newCategory.Ru}
                onChange={(e) => setNewCategory({ ...newCategory, Ru: e.target.value })}
                placeholder="Enter category title (Russian)"
                className="inputField"
                required
              />
            </div>
          
          </div>
          <button type="submit" className="addButton">
            <Plus size={16} /> Add Category
          </button>
        </div>
      </form>
      <div className="filterGroup">
        <Filter size={16} />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter categories..."
          className="filterInput"
        />
      </div>
      {error && <p className="errorMessage">{error}</p>}
      <div className="categoryTableContainer">
        <table className="categoryTable">
          <thead>
            <tr>
              <th>English</th>
              <th>Russian</th>
              <th>Azerbaijani</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>{category.title.En}</td>
                  <td>{category.title.Ru}</td>
                  <td>{category.title.Az}</td>
                  <td>
                    <div className="categoryActions">
                      <button
                        className="editButton"
                        onClick={() => {
                          setEditCategory(category);
                          setEditCategoryTitle(category.title);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="deleteButton"
                        onClick={() => setDeleteCategoryId(category.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No categories available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          className="pageButton"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pageInfo">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pageButton"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {editCategory && (
        <div className="editModal">
          <div className="editModalContent">
            <h3 className="modalTitle">Edit Category</h3>
            <form onSubmit={handleUpdateCategory} className="editCategoryForm">
              <div className="inputGroup">
                <div className="inputRow">
                  <div className="inputWrapper">
                    <span className="inputLabel">En</span>
                    <input
                      type="text"
                      value={editCategoryTitle.En}
                      onChange={(e) =>
                        setEditCategoryTitle({ ...editCategoryTitle, En: e.target.value })
                      }
                      placeholder="Enter category title (English)"
                      className="inputField"
                      required
                    />
                  </div>
                </div>
                <div className="inputRow">
                  <div className="inputWrapper">
                    <span className="inputLabel">Ru</span>
                    <input
                      type="text"
                      value={editCategoryTitle.Ru}
                      onChange={(e) =>
                        setEditCategoryTitle({ ...editCategoryTitle, Ru: e.target.value })
                      }
                      placeholder="Enter category title (Russian)"
                      className="inputField"
                      required
                    />
                  </div>
                </div>
                <div className="inputRow">
                  <div className="inputWrapper">
                    <span className="inputLabel">Az</span>
                    <input
                      type="text"
                      value={editCategoryTitle.Az}
                      onChange={(e) =>
                        setEditCategoryTitle({ ...editCategoryTitle, Az: e.target.value })
                      }
                      placeholder="Enter category title (Azerbaijani)"
                      className="inputField"
                      required
                    />
                  </div>
                </div>
                <div className="modalActions">
                  <button type="submit" className="saveButton">
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancelButton"
                    onClick={() => setEditCategory(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteCategoryId && (
        <div className="deleteModal">
          <div className="deleteModalContent">
            <h3 className="modalTitle">Confirm Deletion</h3>
            <p className="deleteModalText">Are you sure you want to delete this category?</p>
            <div className="modalActions">
              <button
                className="confirmButton"
                onClick={() => handleDeleteCategory(deleteCategoryId)}
              >
                Yes
              </button>
              <button
                className="cancelDeleteButton"
                onClick={() => setDeleteCategoryId(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;