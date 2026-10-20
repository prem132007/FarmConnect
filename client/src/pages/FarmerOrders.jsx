import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../CSS/FarmerOrders.css";
import { useLanguage } from "../context/LanguageContext";

function FarmerOrders() {
  const { t, language } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET LOGGED-IN FARMER
  // =====================================================
  const getUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User data error:", error);
      return null;
    }
  };

  // =====================================================
  // FETCH FARMER ORDERS
  // =====================================================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getUser();

      if (!user?.id) {
        setError(t("farmerInformationNotFound"));
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/orders/farmer/${user.id}`
      );

      setOrders(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Farmer Orders Error:", error);

      setError(
        error.response?.data?.message ||
        t("unableToLoadFarmerOrders")
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ORDERS
  // =====================================================
  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================
  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          status,
        }
      );

      alert(
        response.data?.message ||
        t("orderStatusUpdatedSuccessfully")
      );

      await fetchOrders();
    } catch (error) {
      console.error("Update Order Error:", error);

      alert(
        error.response?.data?.message ||
        t("unableToUpdateOrder")
      );
    }
  };

  // =====================================================
  // STATUS TRANSLATION
  // =====================================================
  const getStatusLabel = (status) => {
    const statusMap = {
      Pending: "pending",
      Accepted: "accepted",
      Rejected: "rejected",
      "Ready for Delivery": "readyForDelivery",
      "Out for Delivery": "outForDelivery",
      Delivered: "delivered",
      Cancelled: "cancelled",
    };

    return t(statusMap[status] || "status");
  };

  // =====================================================
  // STATUS CSS CLASS
  // =====================================================
  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "status-accepted";

      case "Rejected":
        return "status-rejected";

      case "Ready for Delivery":
        return "status-ready";

      case "Out for Delivery":
        return "status-out-for-delivery";

      case "Delivered":
        return "status-delivered";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };

  // =====================================================
  // ACTION BUTTONS
  // =====================================================
  const renderActions = (order) => {
    switch (order.status) {
      // -------------------------------------------------
      // PENDING
      // -------------------------------------------------
      case "Pending":
        return (
          <>
            <button
              type="button"
              className="accept-order-btn"
              onClick={() =>
                updateStatus(
                  order._id,
                  "Accepted"
                )
              }
            >
              ✓ {t("accept")}
            </button>

            <button
              type="button"
              className="reject-order-btn"
              onClick={() =>
                updateStatus(
                  order._id,
                  "Rejected"
                )
              }
            >
              ✕ {t("reject")}
            </button>
          </>
        );

      // -------------------------------------------------
      // ACCEPTED
      // -------------------------------------------------
      case "Accepted":
        return (
          <button
            type="button"
            className="ready-order-btn"
            onClick={() =>
              updateStatus(
                order._id,
                "Ready for Delivery"
              )
            }
          >
            📦 {t("markReady")}
          </button>
        );

      // -------------------------------------------------
      // READY FOR DELIVERY
      // -------------------------------------------------
      case "Ready for Delivery":
        return (
          <button
            type="button"
            className="out-for-delivery-btn"
            onClick={() =>
              updateStatus(
                order._id,
                "Out for Delivery"
              )
            }
          >
            🚚 {t("outForDeliveryAction")}
          </button>
        );

      // -------------------------------------------------
      // OUT FOR DELIVERY
      // -------------------------------------------------
      case "Out for Delivery":
        return (
          <button
            type="button"
            className="deliver-order-btn"
            onClick={() =>
              updateStatus(
                order._id,
                "Delivered"
              )
            }
          >
            ✓ {t("markDelivered")}
          </button>
        );

      // -------------------------------------------------
      // REJECTED
      // -------------------------------------------------
      case "Rejected":
        return (
          <span className="action-completed rejected-action">
            ✕ {t("orderRejected")}
          </span>
        );

      // -------------------------------------------------
      // DELIVERED
      // -------------------------------------------------
      case "Delivered":
        return (
          <span className="action-completed delivered-action">
            ✓ {t("orderCompleted")}
          </span>
        );

      // -------------------------------------------------
      // CANCELLED
      // -------------------------------------------------
      case "Cancelled":
        return (
          <span className="action-completed cancelled-action">
            ✕ {t("orderCancelled")}
          </span>
        );

      // -------------------------------------------------
      // DEFAULT
      // -------------------------------------------------
      default:
        return (
          <span className="action-completed">
            {t("noActionAvailable")}
          </span>
        );
    }
  };

  // =====================================================
  // FORMAT DATE ACCORDING TO SELECTED LANGUAGE
  // =====================================================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const localeMap = {
      en: "en-IN",
      hi: "hi-IN",
      mr: "mr-IN",
    };

    return new Date(date).toLocaleDateString(
      localeMap[language] || "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // ORDER COUNTS
  // =====================================================
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending"
  ).length;

  const acceptedOrders = orders.filter(
    (order) =>
      order.status === "Accepted"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status === "Delivered"
  ).length;

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="farmer-orders-page">

      {/* =================================================
          HEADER
      ================================================= */}
      <header className="farmer-orders-header">

        <div className="farmer-orders-title-section">

          <span className="farmer-orders-badge">
            🌾 {t("farmerPanel")}
          </span>

          <h1>
            📦 {t("farmerOrders")}
          </h1>

          <p>
            {t("farmerOrdersDescription")}
          </p>

        </div>

        <Link
          to="/farmer"
          className="back-farmer-btn"
        >
          ← {t("backToDashboard")}
        </Link>

      </header>

      {/* =================================================
          ERROR
      ================================================= */}
      {error && (
        <div className="farmer-orders-error">
          <span className="error-icon">
            ⚠️
          </span>

          <span>{error}</span>
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}
      {loading ? (

        <div className="farmer-orders-loading">

          <div className="farmer-orders-spinner"></div>

          <p>
            {t("loadingYourOrders")}
          </p>

        </div>

      ) : orders.length === 0 ? (

        /* =================================================
           EMPTY ORDERS
        ================================================= */
        <div className="farmer-orders-empty">

          <div className="empty-icon">
            📦
          </div>

          <h3>
            {t("noFarmerOrdersFound")}
          </h3>

          <p>
            {t("noFarmerOrdersYet")}
          </p>

          <Link
            to="/farmer"
            className="empty-dashboard-btn"
          >
            📊 {t("backToDashboard")}
          </Link>

        </div>

      ) : (

        <div className="farmer-orders-content">

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}
          <div className="farmer-orders-summary">

            {/* TOTAL */}
            <div className="summary-card total-card">

              <div className="summary-icon total-icon">
                📦
              </div>

              <div className="summary-info">

                <span className="summary-label">
                  {t("totalOrders")}
                </span>

                <strong>
                  {totalOrders}
                </strong>

              </div>

            </div>

            {/* PENDING */}
            <div className="summary-card pending-card">

              <div className="summary-icon pending-icon">
                ⏳
              </div>

              <div className="summary-info">

                <span className="summary-label">
                  {t("pendingOrders")}
                </span>

                <strong>
                  {pendingOrders}
                </strong>

              </div>

            </div>

            {/* ACCEPTED */}
            <div className="summary-card accepted-card">

              <div className="summary-icon accepted-icon">
                ✓
              </div>

              <div className="summary-info">

                <span className="summary-label">
                  {t("acceptedOrders")}
                </span>

                <strong>
                  {acceptedOrders}
                </strong>

              </div>

            </div>

            {/* DELIVERED */}
            <div className="summary-card delivered-card">

              <div className="summary-icon delivered-icon">
                🚚
              </div>

              <div className="summary-info">

                <span className="summary-label">
                  {t("deliveredOrders")}
                </span>

                <strong>
                  {deliveredOrders}
                </strong>

              </div>

            </div>

          </div>

          {/* =================================================
              TABLE CARD
          ================================================= */}
          <section className="farmer-orders-table-card">

            <div className="farmer-orders-table-header">

              <div>

                <h2>
                  📋 {t("orders")}
                </h2>

                <p>
                  {t("farmerOrdersTableDescription")}
                </p>

              </div>

            </div>

            {/* =================================================
                TABLE
            ================================================= */}
            <div className="farmer-orders-table-container">

              <table className="farmer-orders-table">

                <thead>
                  <tr>

                    <th>#</th>

                    <th>
                      {t("orderId")}
                    </th>

                    <th>
                      {t("customerId")}
                    </th>

                    <th>
                      {t("quantity")}
                    </th>

                    <th>
                      {t("totalPrice")}
                    </th>

                    <th>
                      {t("status")}
                    </th>

                    <th>
                      {t("action")}
                    </th>

                    <th>
                      {t("date")}
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {orders.map(
                    (order, index) => (

                      <tr
                        key={order._id}
                      >

                        {/* NUMBER */}
                        <td>
                          <span className="order-number">
                            {index + 1}
                          </span>
                        </td>

                        {/* ORDER ID */}
                        <td>
                          <strong className="order-id">
                            #
                            {order._id?.slice(
                              -6
                            )}
                          </strong>
                        </td>

                        {/* CUSTOMER ID */}
                        <td>
                          <span className="customer-id">
                            {order.customerId ||
                              "-"}
                          </span>
                        </td>

                        {/* QUANTITY */}
                        <td>
                          <strong className="order-quantity">
                            {order.quantity ??
                              0}
                          </strong>
                        </td>

                        {/* TOTAL PRICE */}
                        <td>
                          <strong className="order-price">
                            ₹
                            {Number(
                              order.totalPrice ||
                              0
                            ).toFixed(2)}
                          </strong>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`order-status ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(
                              order.status
                            )}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td>
                          <div className="farmer-order-actions">
                            {renderActions(
                              order
                            )}
                          </div>
                        </td>

                        {/* DATE */}
                        <td>
                          <span className="order-date">
                            {formatDate(
                              order.createdAt
                            )}
                          </span>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

        </div>
      )}

    </div>
  );
}

export default FarmerOrders;