import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

import "../css/AdminDashboard.css";
import { useLanguage } from "../context/LanguageContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalAdmins: 0,
    outOfStockProducts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ADMIN DASHBOARD DATA
  // =====================================================

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/dashboard/admin"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch admin dashboard data");
      }

      const data = await response.json();

      console.log("Admin Dashboard Data:", data);

      setStats({
        totalUsers: data.totalUsers || 0,
        totalFarmers: data.totalFarmers || 0,
        totalCustomers: data.totalCustomers || 0,
        totalProducts: data.totalProducts || 0,
        totalOrders: data.totalOrders || 0,
        totalAdmins: data.totalAdmins || 0,
        outOfStockProducts: data.outOfStockProducts || 0,
      });
    } catch (error) {
      console.error("Admin Dashboard Error:", error);

      setError(t("unableToLoadAdminDashboard"));
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Notify Navbar that user logged out
    window.dispatchEvent(new Event("farmconnect-login"));

    navigate("/");
  };

  // =====================================================
  // SIDEBAR ACTIVE CLASS
  // =====================================================

  const getSidebarClass = ({ isActive }) => {
    return isActive
      ? "admin-sidebar-link active"
      : "admin-sidebar-link";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        {/* SIDEBAR BRAND */}

        <div className="admin-sidebar-brand">

          <div className="admin-logo-icon">
            🌾
          </div>

          <div>
            <h2>FarmConnect</h2>
            <p>{t("adminPanel")}</p>
          </div>

        </div>


        {/* SIDEBAR NAVIGATION */}

        <nav className="admin-sidebar-nav">

          <NavLink
            to="/admin"
            end
            className={getSidebarClass}
          >
            <span className="sidebar-icon">📊</span>
            <span>{t("dashboard")}</span>
          </NavLink>


          <NavLink
            to="/admin/users"
            className={getSidebarClass}
          >
            <span className="sidebar-icon">👥</span>
            <span>{t("userManagement")}</span>
          </NavLink>


          <NavLink
            to="/admin/products"
            className={getSidebarClass}
          >
            <span className="sidebar-icon">🥕</span>
            <span>{t("productManagement")}</span>
          </NavLink>


          <NavLink
            to="/admin/orders"
            className={getSidebarClass}
          >
            <span className="sidebar-icon">📦</span>
            <span>{t("orderManagement")}</span>
          </NavLink>


          <NavLink
            to="/profile"
            className={getSidebarClass}
          >
            <span className="sidebar-icon">👤</span>
            <span>{t("myProfile")}</span>
          </NavLink>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">

          <Link
            to="/"
            className="admin-sidebar-home"
          >
            <span className="sidebar-icon">🏠</span>
            <span>{t("backHome")}</span>
          </Link>


          <button
            type="button"
            className="admin-sidebar-logout"
            onClick={handleLogout}
          >
            <span className="sidebar-icon">🚪</span>
            <span>{t("logout")}</span>
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="admin-main">

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <header className="admin-header">

          <div className="admin-header-content">

            <span className="admin-header-icon">
              👨‍💼
            </span>

            <div>
              <h1>{t("adminDashboard")}</h1>

              <p>
                {t("adminDashboardDescription")}
              </p>
            </div>

          </div>


          {/* HEADER ACTIONS */}

          <div className="admin-header-actions">

            <Link
              to="/"
              className="admin-home-btn"
            >
              🏠 {t("home")}
            </Link>

            <button
              type="button"
              className="admin-logout-btn"
              onClick={handleLogout}
            >
              🚪 {t("logout")}
            </button>

          </div>

        </header>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="admin-dashboard-error">
            ⚠️ {error}
          </div>
        )}


        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="admin-stats">

          {/* TOTAL USERS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              👥
            </div>

            <div className="admin-stat-info">

              <h3>
                {loading ? "..." : stats.totalUsers}
              </h3>

              <p>{t("totalUsers")}</p>

            </div>

          </div>


          {/* TOTAL FARMERS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              👨‍🌾
            </div>

            <div className="admin-stat-info">

              <h3>
                {loading ? "..." : stats.totalFarmers}
              </h3>

              <p>{t("totalFarmers")}</p>

            </div>

          </div>


          {/* TOTAL CUSTOMERS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🛒
            </div>

            <div className="admin-stat-info">

              <h3>
                {loading ? "..." : stats.totalCustomers}
              </h3>

              <p>{t("totalCustomers")}</p>

            </div>

          </div>


          {/* TOTAL PRODUCTS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🥕
            </div>

            <div className="admin-stat-info">

              <h3>
                {loading ? "..." : stats.totalProducts}
              </h3>

              <p>{t("totalProducts")}</p>

            </div>

          </div>


          {/* TOTAL ADMINS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              👨‍💼
            </div>

            <div className="admin-stat-info">

              <h3>
                {loading ? "..." : stats.totalAdmins}
              </h3>

              <p>{t("totalAdmins")}</p>

            </div>

          </div>


          {/* OUT OF STOCK */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ⚠️
            </div>

            <div className="admin-stat-info">

              <h3>
                {loading ? "..." : stats.outOfStockProducts}
              </h3>

              <p>{t("outOfStock")}</p>

            </div>

          </div>

        </section>


        {/* =================================================
            MANAGEMENT
        ================================================= */}

        <section className="admin-section">

          <div className="admin-section-header">

            <div>
              <h2>{t("management")}</h2>

              <p>
                {t("adminManagementDescription")}
              </p>
            </div>

          </div>


          <div className="admin-actions">

            {/* USER MANAGEMENT */}

            <div className="admin-action-card">

              <div className="action-icon">
                👥
              </div>

              <h3>
                {t("userManagement")}
              </h3>

              <p>
                {t("userManagementDescription")}
              </p>

              <Link
                to="/admin/users"
                className="admin-action-btn"
              >
                {t("manageUsers")} →
              </Link>

            </div>


            {/* PRODUCT MANAGEMENT */}

            <div className="admin-action-card">

              <div className="action-icon">
                🥕
              </div>

              <h3>
                {t("productManagement")}
              </h3>

              <p>
                {t("productManagementDescription")}
              </p>

              <Link
                to="/admin/products"
                className="admin-action-btn"
              >
                {t("manageProducts")} →
              </Link>

            </div>


            {/* ORDER MANAGEMENT */}

            <div className="admin-action-card">

              <div className="action-icon">
                📦
              </div>

              <h3>
                {t("orderManagement")}
              </h3>

              <p>
                {t("orderManagementDescription")}
              </p>

              <Link
                to="/admin/orders"
                className="admin-action-btn"
              >
                {t("manageOrders")} →
              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;