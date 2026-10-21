import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/AdminOrders.css";

import { useLanguage } from "../context/LanguageContext";

function AdminOrders() {
  const { t, language } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // ==========================
  // Fetch All Orders
  // ==========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://farmconnect-backend-n6mx.onrender.com/api/orders/admin"
      );

      if (!response.ok) {
        throw new Error(t("failedToFetchOrders"));
      }

      const data = await response.json();

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Admin Orders Error:", error);

      setError(t("unableToLoadOrders"));
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load Orders
  // ==========================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================
  // Update Order Status
  // ==========================

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);

      const response = await fetch(
        `https://farmconnect-backend-n6mx.onrender.com/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToUpdateOrderStatus")
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );

      alert(
        data.message || t("orderStatusUpdatedSuccessfully")
      );
    } catch (error) {
      console.error(
        "Update Order Status Error:",
        error
      );

      alert(
        error.message || t("unableToUpdateOrderStatus")
      );

      fetchOrders();
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ==========================
  // Status Class
  // ==========================

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";

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
        return "";
    }
  };

  // ==========================
  // Translate Status
  // ==========================

  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending":
        return t("pending");

      case "Accepted":
        return t("accepted");

      case "Rejected":
        return t("rejected");

      case "Ready for Delivery":
        return t("readyForDelivery");

      case "Out for Delivery":
        return t("outForDelivery");

      case "Delivered":
        return t("delivered");

      case "Cancelled":
        return t("cancelled");

      default:
        return status;
    }
  };

  // ==========================
  // Format Date
  // ==========================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const locale =
      language === "hi"
        ? "hi-IN"
        : language === "mr"
          ? "mr-IN"
          : "en-IN";

    return new Date(date).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================
  // Format Order ID
  // ==========================

  const formatId = (id) => {
    if (!id) {
      return t("notAvailable");
    }

    return id.toString().slice(-8);
  };

  // ==========================
  // Render
  // ==========================

  return (
    <div className="admin-orders-page">

      {/* ==========================
          Header
      ========================== */}

      <div className="admin-orders-header">

        <div>
          <h1>
            📦 {t("orderManagement")}
          </h1>

          <p>
            {t("orderManagementDescription")}
          </p>
        </div>

        <div className="admin-orders-header-actions">

          <button
            type="button"
            className="refresh-orders-btn"
            onClick={fetchOrders}
            disabled={loading}
          >
            🔄 {t("refresh")}
          </button>

          <Link
            to="/admin"
            className="back-admin-btn"
          >
            ← {t("backToDashboard")}
          </Link>

        </div>

      </div>

      {/* ==========================
          Error
      ========================== */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* ==========================
          Loading
      ========================== */}

      {loading ? (

        <div className="admin-loading">
          {t("loadingOrders")}
        </div>

      ) : orders.length === 0 ? (

        <div className="admin-empty">

          <div className="empty-icon">
            📦
          </div>

          <h3>
            {t("noOrdersFound")}
          </h3>

          <p>
            {t("noCustomerOrders")}
          </p>

        </div>

      ) : (

        <div className="admin-orders-table-container">

          <table className="admin-orders-table">

            <thead>
              <tr>
                <th>#</th>
                <th>{t("orderId")}</th>
                <th>{t("customerId")}</th>
                <th>{t("farmerId")}</th>
                <th>{t("productId")}</th>
                <th>{t("quantity")}</th>
                <th>{t("totalPrice")}</th>
                <th>{t("status")}</th>
                <th>{t("date")}</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order, index) => (

                <tr key={order._id}>

                  {/* Number */}

                  <td>
                    {index + 1}
                  </td>

                  {/* Order ID */}

                  <td>
                    <strong className="order-id">
                      #{formatId(order._id)}
                    </strong>
                  </td>

                  {/* Customer ID */}

                  <td>
                    <span className="order-id-text">
                      {formatId(order.customerId)}
                    </span>
                  </td>

                  {/* Farmer ID */}

                  <td>
                    <span className="order-id-text">
                      {formatId(order.farmerId)}
                    </span>
                  </td>

                  {/* Product ID */}

                  <td>
                    <span className="order-id-text">
                      {formatId(order.productId)}
                    </span>
                  </td>

                  {/* Quantity */}

                  <td>
                    <span className="quantity-value">
                      {order.quantity}
                    </span>
                  </td>

                  {/* Total Price */}

                  <td>
                    <strong className="order-price">
                      ₹
                      {Number(
                        order.totalPrice || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </td>

                  {/* Status */}

                  <td>

                    <select
                      className={`order-status-select ${getStatusClass(
                        order.status
                      )}`}
                      value={order.status}
                      disabled={
                        updatingOrder === order._id
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        {t("pending")}
                      </option>

                      <option value="Accepted">
                        {t("accepted")}
                      </option>

                      <option value="Rejected">
                        {t("rejected")}
                      </option>

                      <option value="Ready for Delivery">
                        {t("readyForDelivery")}
                      </option>

                      <option value="Out for Delivery">
                        {t("outForDelivery")}
                      </option>

                      <option value="Delivered">
                        {t("delivered")}
                      </option>

                      <option value="Cancelled">
                        {t("cancelled")}
                      </option>

                    </select>

                  </td>

                  {/* Date */}

                  <td>
                    {formatDate(order.createdAt)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default AdminOrders;