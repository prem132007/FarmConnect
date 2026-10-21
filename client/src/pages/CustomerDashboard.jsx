import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import "../css/CustomerDashboard.css"


function CustomerDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();



  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    rejectedOrders: 0,
    deliveredOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const customer = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const customerInitial =
    customer?.name?.trim()?.charAt(0)?.toUpperCase() || "C";

  // ==========================
  // Fetch Customer Dashboard Data
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
        setError(t("customerInformationNotFound"));
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id || user._id;

      // ==========================
      // CHECK CUSTOMER ID
      // ==========================

      if (!userId) {
        setError(t("customerInformationNotFound"));
        setLoading(false);
        return;
      }

      // ==========================
      // FETCH DASHBOARD DATA
      // ==========================

      const response = await axios.get(
        `http://localhost:5000/api/orders/customer-dashboard/${userId}`
      );

      setStats({
        totalOrders: response.data.totalOrders || 0,
        pendingOrders: response.data.pendingOrders || 0,
        acceptedOrders: response.data.acceptedOrders || 0,
        rejectedOrders: response.data.rejectedOrders || 0,
        deliveredOrders: response.data.deliveredOrders || 0,
      });
    } catch (error) {
      console.error("Customer Dashboard Error:", error);

      setError(
        error.response?.data?.message ||
        t("unableToLoadCheckout")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // FETCH CUSTOMER ORDERS
  // ==========================

  const fetchMyOrders = async () => {
    try {
      setOrdersLoading(true);

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setMyOrders([]);
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id || user._id;

      if (!userId) {
        setMyOrders([]);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/orders/customer/${userId}`
      );

      setMyOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Dashboard My Orders Error:", err);
      setMyOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // ==========================
  // LOAD DASHBOARD
  // ==========================

  useEffect(() => {
    fetchDashboard();
    fetchMyOrders();
  }, []);

  // ==========================
  // LOGOUT
  // ==========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="customer-dashboard">

      {/* ==========================
        SIDEBAR
    ========================== */}
      <aside className="customer-sidebar">

        <div className="customer-brand">
          <h2>🛒 FarmConnect</h2>
          <p>Customer Portal</p>
        </div>

        <nav className="customer-navigation">
          <Link to="/customer" className="customer-nav-link active">
            <span>🏠</span>
            {t("dashboard")}
          </Link>

          <Link to="/products" className="customer-nav-link">
            <span>🛍️</span>
            {t("browseProducts")}
          </Link>

          <Link to="/my-orders" className="customer-nav-link">
            <span>📦</span>
            {t("myOrders")}
          </Link>

          <Link to="/customer/messages" className="customer-nav-link">
            <span>💬</span>
            {t("messages")}
          </Link>

          <Link to="/profile" className="customer-nav-link">
            <span>👤</span>
            {t("myProfile")}
          </Link>
        </nav>

        <div className="customer-sidebar-bottom">
          <Link to="/" className="customer-home-link">
            <span>🏠</span>
            {t("backHome")}
          </Link>

          <button
            type="button"
            className="customer-logout-btn"
            onClick={handleLogout}
          >
            <span>🚪</span>
            {t("logout")}
          </button>
        </div>

      </aside>

      {/* ==========================
    MAIN CONTENT
========================== */}
      <main className="customer-main-area">
        <div className="customer-content">

          {/* Dashboard header: title left, profile right */}
          <div className="customer-dashboard-header">

            {/* Dashboard title */}
            <header className="customer-page-heading">
              <div>
                <h1>{t("customerDashboard")}</h1>
                <p>{t("dashboardDescription")}</p>
              </div>
            </header>

            {/* Profile avatar and dropdown */}
            <div className="customer-topbar">
              <div className="customer-profile">
                <button
                  type="button"
                  className="customer-avatar"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  aria-label="Open customer profile menu"
                  aria-expanded={profileMenuOpen}
                >
                  {customerInitial}
                </button>

                {profileMenuOpen && (
                  <div className="customer-profile-dropdown">
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      👤 {t("myProfile")}
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      🚪 {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Keep your existing error message, statistics,
        orders panel, and quick actions below this point. */}


          {/* ==========================
            ORDER STATISTICS
          ========================== */}
          <section className="customer-stats-grid">

            <div className="customer-stat-card">
              <div className="customer-stat-icon purple">📦</div>
              <div className="customer-stat-info">
                <h2>{loading ? "..." : stats.totalOrders}</h2>
                <p>{t("totalOrders")}</p>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-icon orange">🕐</div>
              <div className="customer-stat-info">
                <h2>{loading ? "..." : stats.pendingOrders}</h2>
                <p>{t("pendingOrders")}</p>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-icon green">✅</div>
              <div className="customer-stat-info">
                <h2>{loading ? "..." : stats.acceptedOrders}</h2>
                <p>{t("acceptedOrders")}</p>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-icon red">❌</div>
              <div className="customer-stat-info">
                <h2>{loading ? "..." : stats.rejectedOrders}</h2>
                <p>{t("rejectedOrders")}</p>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-icon blue">🚚</div>
              <div className="customer-stat-info">
                <h2>{loading ? "..." : stats.deliveredOrders}</h2>
                <p>{t("deliveredOrders")}</p>
              </div>
            </div>

          </section>

          {/* ==========================
            MY ORDERS
          ========================== */}
          <section className="customer-orders-panel">

            <div className="customer-panel-heading">
              <div>
                <h2>My Orders</h2>
                <p>View your latest purchases and their status.</p>
              </div>

              <Link to="/my-orders" className="customer-view-all">
                View All Orders →
              </Link>
            </div>

            {ordersLoading ? (
              <div className="customer-orders-message">
                <p>Loading your orders...</p>
              </div>
            ) : myOrders.length === 0 ? (
              <div className="customer-orders-message">
                <span>📦</span>
                <h3>No orders found</h3>
                <p>
                  Your orders will appear here after you place an order.
                </p>
                <Link to="/products" className="customer-shop-btn">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="customer-orders-table-wrap">
                <table className="customer-orders-table">
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>PRODUCT ID</th>
                      <th>QUANTITY</th>
                      <th>TOTAL PRICE</th>
                      <th>STATUS</th>
                      <th>DATE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {myOrders.slice(0, 5).map((order) => (
                      <tr key={order._id}>
                        <td>
                          <strong>
                            {order._id ? order._id.slice(-6) : "N/A"}
                          </strong>
                        </td>

                        <td>
                          {order.productId
                            ? String(
                              typeof order.productId === "object"
                                ? order.productId._id
                                : order.productId
                            ).slice(-6)
                            : "N/A"}
                        </td>

                        <td>{order.quantity ?? "N/A"}</td>

                        <td>
                          ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                        </td>

                        <td>
                          <span
                            className={`customer-order-status-badge ${String(
                              order.status || "Pending"
                            )
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>

                        <td>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </section>

          {/* ==========================
            QUICK ACTIONS
        ========================== */}
          <section className="customer-quick-actions">
            <h2>{t("quickActions")}</h2>

            <div className="customer-actions-grid">

              <Link to="/products" className="customer-action-card">
                <span>🛍️</span>
                <div>
                  <h3>{t("browseProducts")}</h3>
                  <p>Explore fresh products from farmers.</p>
                </div>
                <span className="customer-action-arrow">→</span>
              </Link>

              <Link to="/my-orders" className="customer-action-card">
                <span>📦</span>
                <div>
                  <h3>{t("viewMyOrders")}</h3>
                  <p>Check your order details and status.</p>
                </div>
                <span className="customer-action-arrow">→</span>
              </Link>

              <Link to="/profile" className="customer-action-card">
                <span>👤</span>
                <div>
                  <h3>{t("myProfile")}</h3>
                  <p>View or update your profile.</p>
                </div>
                <span className="customer-action-arrow">→</span>
              </Link>

            </div>
          </section>

        </div>
      </main>

    </div>
  );

}

export default CustomerDashboard;