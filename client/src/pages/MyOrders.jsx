
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../css/MyOrders.css";
import { useLanguage } from "../context/LanguageContext";

function MyOrders() {
  const { t, language } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tracking state
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [trackingData, setTrackingData] = useState({});
  const [trackingLoading, setTrackingLoading] = useState({});
  const [trackingErrors, setTrackingErrors] = useState({});

  // ==========================
  // Get Logged-in Customer
  // ==========================

  const getCustomerId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || user?._id || null;
    } catch {
      return null;
    }
  };

  // ==========================
  // Fetch Customer Orders
  // ==========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const customerId = getCustomerId();

      if (!customerId) {
        setError(t("userInformationNotFound"));
        return;
      }

      const response = await axios.get(
        `http://farmconnect-backend-n6mx.onrender.com/api/orders/customer/${customerId}`
      );

      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("My Orders Error:", err);
      setError(t("unableToLoadOrders"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================
  // Fetch Tracking Details
  // ==========================

  const fetchTracking = async (orderId) => {
    const customerId = getCustomerId();

    if (!customerId) {
      setTrackingErrors((previous) => ({
        ...previous,
        [orderId]: "Customer information was not found. Please log in again.",
      }));
      return;
    }

    try {
      setTrackingLoading((previous) => ({
        ...previous,
        [orderId]: true,
      }));

      setTrackingErrors((previous) => ({
        ...previous,
        [orderId]: "",
      }));

      const response = await axios.get(
        `http://farmconnect-backend-n6mx.onrender.com/api/orders/customer/${customerId}/${orderId}/tracking`
      );

      setTrackingData((previous) => ({
        ...previous,
        [orderId]: response.data,
      }));
    } catch (err) {
      console.error("Order Tracking Error:", err);

      setTrackingErrors((previous) => ({
        ...previous,
        [orderId]:
          err.response?.data?.message ||
          "Unable to load tracking details. Please try again.",
      }));
    } finally {
      setTrackingLoading((previous) => ({
        ...previous,
        [orderId]: false,
      }));
    }
  };

  // ==========================
  // Toggle Tracking Panel
  // ==========================

  const handleTrackOrder = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    // Use cached data when it has already been loaded
    if (!trackingData[orderId]) {
      await fetchTracking(orderId);
    }
  };

  // ==========================
  // Status Class
  // ==========================

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "order-status pending";

      case "Accepted":
        return "order-status accepted";

      case "Rejected":
        return "order-status rejected";

      case "Ready for Delivery":
      case "Out for Delivery":
        return "order-status accepted";

      case "Delivered":
        return "order-status delivered";

      case "Cancelled":
        return "order-status rejected";

      default:
        return "order-status";
    }
  };

  // ==========================
  // Status Message
  // ==========================

  const getStatusMessage = (status) => {
    switch (status) {
      case "Pending":
        return t("waitingForFarmer");

      case "Accepted":
        return t("orderAccepted");

      case "Rejected":
        return t("orderRejected");

      case "Ready for Delivery":
        return t("readyForDelivery");

      case "Out for Delivery":
        return t("outForDelivery");

      case "Delivered":
        return t("orderDelivered");

      case "Cancelled":
        return t("orderCancelled");

      default:
        return status || t("notAvailable");
    }
  };

  // ==========================
  // Translated Status
  // ==========================

  const getTranslatedStatus = (status) => {
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
        return status || t("notAvailable");
    }
  };

  // ==========================
  // Format Date
  // ==========================

  const formatDate = (date) => {
    if (!date) {
      return t("notAvailable");
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return t("notAvailable");
    }

    const locale =
      language === "hi"
        ? "hi-IN"
        : language === "mr"
          ? "mr-IN"
          : "en-IN";

    return parsedDate.toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================
  // Render Tracking Timeline
  // ==========================

  const renderTracking = (orderId) => {
    const data = trackingData[orderId];

    if (trackingLoading[orderId]) {
      return (
        <div className="tracking-message" role="status">
          Loading tracking details...
        </div>
      );
    }

    if (trackingErrors[orderId]) {
      return (
        <div className="tracking-error" role="alert">
          <p>{trackingErrors[orderId]}</p>

          <button
            type="button"
            className="tracking-retry-btn"
            onClick={() => fetchTracking(orderId)}
          >
            Retry
          </button>
        </div>
      );
    }

    if (!data) {
      return null;
    }

    const isRejected = data.status === "Rejected";
    const isCancelled = data.status === "Cancelled";

    return (
      <div className="tracking-panel">
        <div className="tracking-panel-header">
          <div>
            <h3>Order Tracking</h3>
            <p>
              Order ID:{" "}
              <strong>{String(data.orderId).slice(-8)}</strong>
            </p>
          </div>

          <span className={getStatusClass(data.status)}>
            {getTranslatedStatus(data.status)}
          </span>
        </div>

        {(isRejected || isCancelled) && (
          <div className="tracking-terminal-message">
            <strong>
              {isRejected ? "Order Rejected" : "Order Cancelled"}
            </strong>
            <p>
              {getStatusMessage(data.status)}
            </p>
            <p>
              Delivery tracking is no longer progressing for this order.
            </p>
          </div>
        )}

        {data.isDelivered && (
          <div className="tracking-delivered-message">
            <strong>✓ Order Delivered Successfully</strong>
            <p>Your order has been marked as delivered.</p>
          </div>
        )}

        {!data.isTerminal && (
          <div className="tracking-timeline">
            {(data.stages || []).map((stage) => (
              <div
                key={stage.key}
                className={`tracking-stage ${stage.completed ? "completed" : ""
                  }`}
              >
                <div className="tracking-stage-marker">
                  {stage.completed ? "✓" : ""}
                </div>

                <div className="tracking-stage-content">
                  <h4>{stage.label}</h4>

                  <p>
                    {stage.completed
                      ? "Completed"
                      : "Not completed yet"}
                  </p>

                  {stage.date && (
                    <small>
                      {formatDate(stage.date)}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="tracking-details">
          <h4>Delivery Details</h4>

          <p>
            <strong>Address:</strong>{" "}
            {[data.deliveryAddress, data.city, data.state, data.pincode]
              .filter(Boolean)
              .join(", ") || t("notAvailable")}
          </p>

          <p>
            <strong>Estimated Delivery:</strong>{" "}
            {formatDate(data.estimatedDeliveryDate)}
          </p>

          <p>
            <strong>Delivered On:</strong>{" "}
            {formatDate(data.deliveredAt)}
          </p>

          <p>
            <strong>Payment Status:</strong>{" "}
            {data.paymentStatus || t("notAvailable")}
          </p>

          <p>
            <strong>Delivery Status:</strong>{" "}
            {data.deliveryStatus || t("notAvailable")}
          </p>
        </div>
      </div>
    );
  };

  // ==========================
  // Render
  // ==========================

  return (
    <div className="my-orders-page">
      <div className="my-orders-header">
        <div>
          <h1>📦 {t("myOrders")}</h1>
          <p>{t("myOrdersDescription")}</p>
        </div>

        <Link to="/products" className="back-products-btn">
          ← {t("backToProducts")}
        </Link>
      </div>

      {error && (
        <div className="my-orders-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="my-orders-loading">
          {t("loadingYourOrders")}
        </div>
      ) : orders.length === 0 ? (
        <div className="my-orders-empty">
          <div className="empty-icon">📦</div>

          <h2>{t("noOrdersFound")}</h2>

          <p>{t("noOrdersYet")}</p>

          <Link to="/products" className="browse-products-btn">
            🛒 {t("browseProducts")}
          </Link>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t("orderId")}</th>
                <th>{t("productId")}</th>
                <th>{t("quantity")}</th>
                <th>{t("totalPrice")}</th>
                <th>{t("status")}</th>
                <th>{t("date")}</th>
                <th>Tracking</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <>
                  <tr key={order._id}>
                    <td>{index + 1}</td>

                    <td>
                      <strong className="order-id">
                        {order._id
                          ? order._id.slice(-6)
                          : t("notAvailable")}
                      </strong>
                    </td>

                    <td>
                      <span className="product-id">
                        {order.productId
                          ? order.productId.slice(-6)
                          : t("notAvailable")}
                      </span>
                    </td>

                    <td>{order.quantity}</td>

                    <td>
                      <strong>₹{order.totalPrice}</strong>
                    </td>

                    <td>
                      <span className={getStatusClass(order.status)}>
                        {getTranslatedStatus(order.status)}
                      </span>

                      <small className="status-message">
                        {getStatusMessage(order.status)}
                      </small>
                    </td>

                    <td>{formatDate(order.createdAt)}</td>

                    <td>
                      <button
                        type="button"
                        className="track-order-btn"
                        aria-expanded={expandedOrderId === order._id}
                        onClick={() => handleTrackOrder(order._id)}
                      >
                        {expandedOrderId === order._id
                          ? "Hide Tracking"
                          : "Track Order"}
                      </button>
                    </td>
                  </tr>

                  {expandedOrderId === order._id && (
                    <tr key={`${order._id}-tracking`}>
                      <td colSpan={8}>
                        {renderTracking(order._id)}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
