import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import "./AdminLayout.scss";
import { CiLogout } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";
import { MdDashboardCustomize } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { RiHome4Line } from "react-icons/ri";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { AiOutlineAntDesign } from "react-icons/ai";
import { MdOutlinePermContactCalendar } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.querySelector('.sidebarToggle');
        
        if (sidebar && !sidebar.contains(event.target) && !toggle.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      to: "/admin",
      icon: <MdDashboardCustomize />,
      label: "Dashboard",
      end: true
    },
    {
      to: "/admin/admin-category",
      icon: <BiCategory />,
      label: "Category"
    },
    {
      to: "/admin/admin-product",
      icon: <MdProductionQuantityLimits />,
      label: "Product"
    },
    {
      to: "/admin/admin-home",
      icon: <RiHome4Line />,
      label: "Home"
    },
    {
      to: "/admin/admin-about",
      icon: <IoMdInformationCircleOutline />,
      label: "About"
    },
    {
      to: "/admin/admin-contact",
      icon: <MdOutlinePermContactCalendar />,
      label: "Contact"
    },
    {
      to: "/admin/admin-decor",
      icon: <AiOutlineAntDesign />,
      label: "Decor"
    }
  ];

  return (
    <div className="adminLayoutContainer">
      {/* Mobile overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
      
      {/* Mobile toggle button */}
      <button
        className="sidebarToggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle navigation"
      >
        {isSidebarOpen ? <IoClose /> : <HiMenuAlt3 />}
        <span className="toggle-text">{isSidebarOpen ? "Close" : "Menu"}</span>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebarHeader">
          <div className="logo-container">
            <div className="logo-icon">A</div>
            <h2 className={`sidebarTitle ${isCollapsed ? "hidden" : ""}`}>
              Albuhara ADMIN
            </h2>
          </div>
          
          {/* Desktop collapse button */}
          <button 
            className="collapse-btn desktop-only"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Collapse sidebar"
          >
            <HiMenuAlt3 className={`collapse-icon ${isCollapsed ? "rotated" : ""}`} />
          </button>
        </div>

        <nav className="sidebarNav">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
              onClick={() => setIsSidebarOpen(false)}
              end={item.end}
              title={isCollapsed ? item.label : ""}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className={`nav-label ${isCollapsed ? "hidden" : ""}`}>
                {item.label}
              </span>
              <span className="nav-indicator"></span>
            </NavLink>
          ))}
          
          <div className="nav-divider"></div>
          
          <button 
            className="navItem logoutButton" 
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ""}
          >
            <span className="nav-icon">
              <CiLogout />
            </span>
            <span className={`nav-label ${isCollapsed ? "hidden" : ""}`}>
              Logout
            </span>
          </button>
        </nav>

        {/* User info section */}
        <div className={`user-info ${isCollapsed ? "collapsed" : ""}`}>
          <div className="user-avatar">
            <span>A</span>
          </div>
          <div className={`user-details ${isCollapsed ? "hidden" : ""}`}>
            <p className="user-name">Admin</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`contentArea ${isSidebarOpen ? "sidebar-open" : ""} ${isCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
