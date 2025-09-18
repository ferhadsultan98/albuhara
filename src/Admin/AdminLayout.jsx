import React, { useState } from "react";
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

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="adminLayoutContainer">
      <button
        className="sidebarToggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "Close" : "Menu"}
      </button>
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebarHeader">
          <h2 className="sidebarTitle">Albuhara ADMIN</h2>
        </div>
        <nav className="sidebarNav">
          <NavLink
            to="/admin" // Changed from "/dashboard" to match index route
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
            end // Ensures exact match for index route
          >
            {" "}
            <i className="sideBarIcon">
              <MdDashboardCustomize />
            </i>
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/admin-category"
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="sideBarIcon">
              <BiCategory />
            </i>
            Category
          </NavLink>
          {/* Add Profile route if needed, or remove if not implemented */}
          <NavLink
            to="/admin/admin-product"
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            {" "}
            <i className="sideBarIcon">
              <MdProductionQuantityLimits />
            </i>
            Product
          </NavLink>
          <NavLink
            to="/admin/admin-home"
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            {" "}
            <i className="sideBarIcon">
              <RiHome4Line />
            </i>
            Home
          </NavLink>
          <NavLink
            to="/admin/admin-about"
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            {" "}
            <i className="sideBarIcon">
              <IoMdInformationCircleOutline />
            </i>
            About
          </NavLink>
          <NavLink
            to="/admin/admin-contact"
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            {" "}
            <i className="sideBarIcon">
              <MdOutlinePermContactCalendar />
            </i>
            Contact
          </NavLink>
          <NavLink
            to="/admin/admin-decor"
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            {" "}
            <i className="sideBarIcon">
              <AiOutlineAntDesign />
            </i>
            Decor
          </NavLink>
          <button className="navItem logoutButton" onClick={handleLogout}>
            <i className="sideBarIcon">
              <CiLogout />
            </i>
            Logout
          </button>
        </nav>
      </aside>
      <main className={`contentArea ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
