import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/FarmerDashboard.css";
import { useLanguage } from "../context/LanguageContext";

function FarmerDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const farmer = JSON.parse(localStorage.getItem("user") || "null");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const farmerInitial =
    farmer?.name?.trim()?.charAt(0)?.toUpperCase() || "F";

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    rejectedOrders: 0,
    deliveredOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Fetch Farmer Dashboard
  // ==========================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = localStorage.getItem("user");

      // ==========================
      // CHECK USER
      // ==========================

      if (!storedUser) {
        setError(t("farmerInformationNotFound"));
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id || user._id;

      // ==========================
      // CHECK FARMER ID
      // ==========================

      if (!userId) {
        setError(t("farmerInformationNotFound"));
        setLoading(false);
        return;
      }

      // ==========================
      // FETCH DASHBOARD DATA
      // ==========================

      const response = await axios.get(
        `https://farmconnect-backend-n6mx.onrender.com/api/dashboard/farmer/${userId}`
      );

      setStats({
        totalProducts: response.data.totalProducts || 0,
        totalOrders: response.data.totalOrders || 0,
        pendingOrders: response.data.pendingOrders || 0,
        acceptedOrders: response.data.acceptedOrders || 0,
        rejectedOrders: response.data.rejectedOrders || 0,
        deliveredOrders: response.data.deliveredOrders || 0,
      });
    } catch (error) {
      console.error("Farmer Dashboard Error:", error);

      setError(
        error.response?.data?.message ||
        t("unableToLoadDashboard")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load Dashboard
  // ==========================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================
  // Logout
  // ==========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="farmer-dashboard">

      {/* ==========================
          SIDEBAR
      ========================== */}

      <aside className="farmer-sidebar">

        {/* ==========================
            BRAND
        ========================== */}

        <div className="farmer-brand">
          <h2
            style={{
              color: "#ffffff",
            }}
          >
            🌾 FarmConnect
          </h2>

          <p>
            {t("farmerPanel")}
          </p>
        </div>

        {/* ==========================
            NAVIGATION
        ========================== */}

        <nav className="farmer-navigation">

          {/* Dashboard */}

          <Link
            to="/farmer"
            className="farmer-nav-link active"
          >
            📊 {t("dashboard")}
          </Link>

          {/* Add Product */}

          <Link
            to="/add-product"
            className="farmer-nav-link"
          >
            ➕ {t("addProduct")}
          </Link>

          {/* My Products */}

          <Link
            to="/my-products"
            className="farmer-nav-link"
          >
            📦 {t("myProducts")}
          </Link>

          {/* Farmer Orders */}

          <Link
            to="/farmer-orders"
            className="farmer-nav-link"
          >
            📋 {t("farmerOrders")}
          </Link>

          {/* Messages */}

          <Link
            to="/farmer/messages"
            className="farmer-nav-link"
          >
            💬 {t("Messages")}
          </Link>

          {/* My Profile */}

          <Link
            to="/profile"
            className="farmer-nav-link"
          >
            👤 {t("myProfile")}
          </Link>

        </nav>

        {/* ==========================
            SIDEBAR BOTTOM
        ========================== */}

        <div className="farmer-sidebar-bottom">

          {/* Back Home */}

          <Link
            to="/"
            className="farmer-home-btn"
          >
            🏠 {t("backHome")}
          </Link>

          {/* Logout */}

          <button
            type="button"
            className="farmer-logout-btn"
            onClick={handleLogout}
          >
            🚪 {t("logout")}
          </button>

        </div>

      </aside>

      {/* ==========================
          MAIN CONTENT
      ========================== */}

      <main className="farmer-main">

        {/* ==========================
            HEADER
        ========================== */}

        <div className="farmer-header">

          <div>

            <h1>
              👨‍🌾 {t("farmerDashboard")}
            </h1>

            <p>
              {t("farmerDashboardDescription")}
            </p>

          </div>


          {/*Profile Button */}

          <div className="farmer-profile-menu">
            <button
              type="button"
              className="farmer-profile-avatar"
              onClick={() => setProfileMenuOpen((open) => !open)}
              aria-label="Open farmer profile menu"
              aria-expanded={profileMenuOpen}
            >
              {farmerInitial}
            </button>

            {profileMenuOpen && (
              <div className="farmer-profile-dropdown">
                <Link
                  to="/profile"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  👤 My Profile
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ==========================
            ERROR
        ========================== */}

        {error && (
          <div className="farmer-error">
            {error}
          </div>
        )}

        {/* ==========================
            STATISTICS
        ========================== */}

        <section className="farmer-stats">

          {/* ==========================
              TOTAL PRODUCTS
          ========================== */}

          <div className="farmer-stat-card">

            <div className="farmer-stat-icon products-icon">
              🥕
            </div>

            <div className="farmer-stat-info">

              <h3>
                {loading
                  ? "..."
                  : stats.totalProducts}
              </h3>

              <p>
                {t("totalProducts")}
              </p>

            </div>

          </div>

          {/* ==========================
              TOTAL ORDERS
          ========================== */}

          <div className="farmer-stat-card">

            <div className="farmer-stat-icon orders-icon">
              📦
            </div>

            <div className="farmer-stat-info">

              <h3>
                {loading
                  ? "..."
                  : stats.totalOrders}
              </h3>

              <p>
                {t("totalOrders")}
              </p>

            </div>

          </div>

          {/* ==========================
              PENDING ORDERS
          ========================== */}

          <div className="farmer-stat-card">

            <div className="farmer-stat-icon pending-icon">
              🕐
            </div>

            <div className="farmer-stat-info">

              <h3>
                {loading
                  ? "..."
                  : stats.pendingOrders}
              </h3>

              <p>
                {t("pendingOrders")}
              </p>

            </div>

          </div>

          {/* ==========================
              ACCEPTED ORDERS
          ========================== */}

          <div className="farmer-stat-card">

            <div className="farmer-stat-icon accepted-icon">
              ✅
            </div>

            <div className="farmer-stat-info">

              <h3>
                {loading
                  ? "..."
                  : stats.acceptedOrders}
              </h3>

              <p>
                {t("acceptedOrders")}
              </p>

            </div>

          </div>

          {/* ==========================
              REJECTED ORDERS
          ========================== */}

          <div className="farmer-stat-card">

            <div className="farmer-stat-icon rejected-icon">
              ❌
            </div>

            <div className="farmer-stat-info">

              <h3>
                {loading
                  ? "..."
                  : stats.rejectedOrders}
              </h3>

              <p>
                {t("rejectedOrders")}
              </p>

            </div>

          </div>

          {/* ==========================
              DELIVERED ORDERS
          ========================== */}

          <div className="farmer-stat-card">

            <div className="farmer-stat-icon delivered-icon">
              🚚
            </div>

            <div className="farmer-stat-info">

              <h3>
                {loading
                  ? "..."
                  : stats.deliveredOrders}
              </h3>

              <p>
                {t("deliveredOrders")}
              </p>

            </div>

          </div>

        </section>

        {/* ==========================
            MANAGEMENT SECTION
        ========================== */}

        <section className="farmer-management">

          <div className="farmer-section-header">

            <div>

              <h2>
                {t("management")}
              </h2>

              <p>
                {t("managementDescription")}
              </p>

            </div>

          </div>

          <div className="farmer-management-grid">

            {/* ==========================
                ADD PRODUCT
            ========================== */}

            <div className="farmer-management-card">

              <div className="management-icon">
                ➕
              </div>

              <h3>
                {t("addProduct")}
              </h3>

              <p>
                {t("addProductDashboardDescription")}
              </p>

              <Link
                to="/add-product"
                className="farmer-action-btn"
              >
                {t("addProduct")}
              </Link>

            </div>

            {/* ==========================
                MY PRODUCTS
            ========================== */}

            <div className="farmer-management-card">

              <div className="management-icon">
                🥕
              </div>

              <h3>
                {t("myProducts")}
              </h3>

              <p>
                {t("myProductsDashboardDescription")}
              </p>

              <Link
                to="/my-products"
                className="farmer-action-btn"
              >
                {t("manageProducts")}
              </Link>

            </div>

            {/* ==========================
                FARMER ORDERS
            ========================== */}

            <div className="farmer-management-card">

              <div className="management-icon">
                📋
              </div>

              <h3>
                {t("farmerOrders")}
              </h3>

              <p>
                {t("farmerOrdersDashboardDescription")}
              </p>

              <Link
                to="/farmer-orders"
                className="farmer-action-btn"
              >
                {t("viewOrders")}
              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default FarmerDashboard;