
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/CustomerNotifications.css";

const API_URL = "http://farmconnect-backend-n6mx.onrender.com/api";

function getCustomerId() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
}

function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingReadIds, setMarkingReadIds] = useState([]);

  const fetchNotifications = useCallback(async () => {
    const customerId = getCustomerId();

    if (!customerId) {
      setError("Customer information not found. Please log in again.");
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/notifications/customer/${customerId}`
      );

      const items = response.data?.notifications || [];

      setNotifications(items);
      setUnreadCount(
        typeof response.data?.unreadCount === "number"
          ? response.data.unreadCount
          : items.filter((item) => !item.isRead).length
      );
    } catch (err) {
      console.error("Fetch notifications error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notification) => {
    if (notification.isRead || markingReadIds.includes(notification._id)) {
      return;
    }

    const customerId = getCustomerId();

    if (!customerId) {
      setError("Please log in again to update your notifications.");
      return;
    }

    setMarkingReadIds((ids) => [...ids, notification._id]);
    setError("");

    try {
      await axios.patch(
        `${API_URL}/notifications/${notification._id}/read`,
        { customerId }
      );

      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item
        )
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      console.error("Mark as read error:", err);
      setError(
        err.response?.data?.message ||
        "Could not mark the notification as read. Please try again."
      );
    } finally {
      setMarkingReadIds((ids) =>
        ids.filter((id) => id !== notification._id)
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="notifications-page">
      <header className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated on your FarmConnect orders.</p>
        </div>

        <div className="unread-count" aria-live="polite">
          {unreadCount} unread
        </div>
      </header>

      {error && (
        <p className="notification-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="notification-state" role="status">
          Loading notifications...
        </p>
      ) : notifications.length === 0 ? (
        <section className="notification-empty">
          <h2>No notifications yet</h2>
          <p>
            Updates about your orders will appear here when their status
            changes.
          </p>
          <Link to="/my-orders" className="notification-link">
            View My Orders
          </Link>
        </section>
      ) : (
        <section className="notification-list" aria-label="Your notifications">
          {notifications.map((notification) => {
            const isMarkingRead = markingReadIds.includes(notification._id);

            return (
              <article
                key={notification._id}
                className={`notification-card ${notification.isRead ? "read" : "unread"
                  }`}
              >
                <div className="notification-icon" aria-hidden="true">
                  {notification.isRead ? "✓" : "●"}
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h2>{notification.title}</h2>

                    {!notification.isRead && (
                      <span className="new-label">NEW</span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <span className="notification-date">
                    {formatDate(notification.createdAt)}
                  </span>

                  <div className="notification-actions">
                    <Link
                      to="/my-orders"
                      className="notification-link"
                      onClick={() => markAsRead(notification)}
                    >
                      View My Orders
                    </Link>

                    {!notification.isRead && (
                      <button
                        type="button"
                        className="mark-read-button"
                        disabled={isMarkingRead}
                        onClick={() => markAsRead(notification)}
                      >
                        {isMarkingRead ? "Updating..." : "Mark as read"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <button
        type="button"
        className="refresh-notifications"
        onClick={fetchNotifications}
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh notifications"}
      </button>
    </main>
  );
}

export default CustomerNotifications;
