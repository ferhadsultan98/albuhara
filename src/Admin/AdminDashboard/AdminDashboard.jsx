import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.scss';
import api from "../../Api";
import { BiCategory, BiPackage } from "react-icons/bi";
import { FolderOpen, Package } from "lucide-react";

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
      <div className="dashboard-header">
        <h2 className="sectionTitle">Admin Dashboard</h2>
        <div className="header-decoration"></div>
      </div>
      
      {error && (
        <div className="errorMessage">
          <div className="error-icon">⚠️</div>
          <span>{error}</span>
        </div>
      )}
      
      <div className="dashboardStats">
        <div className="statCard categories-card">
          <div className="card-background"></div>
          <div className="card-content">
            <div className="stat-icon">
              <FolderOpen size={32} />
            </div>
            <div className="stat-info">
              <h3>Total Categories</h3>
              <p className="statNumber">{categoryCount}</p>
              <div className="stat-trend">
                <span className="trend-indicator">↗</span>
                <span>Active</span>
              </div>
            </div>
          </div>
          <Link to="/admin/admin-category" className="manageLink">
            <span>Manage Categories</span>
            <BiCategory size={20} />
          </Link>
        </div>
        
        <div className="statCard products-card">
          <div className="card-background"></div>
          <div className="card-content">
            <div className="stat-icon">
              <Package size={32} />
            </div>
            <div className="stat-info">
              <h3>Total Products</h3>
              <p className="statNumber">{productCount}</p>
              <div className="stat-trend">
                <span className="trend-indicator">↗</span>
                <span>Available</span>
              </div>
            </div>
          </div>
          <Link to="/admin/admin-product" className="manageLink">
            <span>Manage Products</span>
            <BiPackage size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
