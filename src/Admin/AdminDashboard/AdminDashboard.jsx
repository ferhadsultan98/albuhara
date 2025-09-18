import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.scss';
import api from "../../Api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [categoryCount, setCategoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [error, setError] = useState('');

 useEffect(() => {
  const fetchCounts = async () => {
    try {
      // ✅ Category count
      const categoryRes = await api.get('/api/categories/');
      setCategoryCount(categoryRes.data.count || categoryRes.data.results.length || 0);

      // ✅ Product count
      const productRes = await api.get('/api/items/');
      setProductCount(productRes.data.count || productRes.data.results.length || 0);

    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  fetchCounts();
}, []);


  return (
    <div className="adminDashboardContainer">
      <h2 className="sectionTitle">Admin Dashboard</h2>
      {error && <p className="errorMessage">{error}</p>}
      <div className="dashboardStats">
        <div className="statCard">
          <h3>Total Categories</h3>
          <p className="statNumber">{categoryCount}</p>
          <Link to="/admin/admin-category" className="manageLink">
            Manage Categories
          </Link>
        </div>
        <div className="statCard">
          <h3>Total Products</h3>
          <p className="statNumber">{productCount}</p>
          <Link to="/admin/admin-products" className="manageLink">
            Manage Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;