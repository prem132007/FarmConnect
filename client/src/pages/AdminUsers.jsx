import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";
import "../css/AdminUsers.css";

function AdminUsers() {
  const { t } = useLanguage();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUser, setUpdatingUser] = useState(null);

  // ==========================
  // Get Logged-in User
  // ==========================

  const getLoggedInUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Local Storage Error:", error);
      return null;
    }
  };

  // ==========================
  // Fetch All Users
  // ==========================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://farmconnect-backend-n6mx.onrender.com/api/users"
      );

      if (!response.ok) {
        throw new Error(t("failedToFetchUsers"));
      }

      const data = await response.json();

      setUsers(data.users || []);
    } catch (error) {
      console.error("Get Users Error:", error);
      setError(t("unableToLoadUsers"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================
  // Delete User
  // ==========================

  const handleDelete = async (userId) => {
    const loggedInUser = getLoggedInUser();

    // Prevent admin from deleting themselves
    if (
      loggedInUser &&
      (
        loggedInUser.id === userId ||
        loggedInUser._id === userId
      )
    ) {
      alert(t("cannotDeleteOwnAccount"));
      return;
    }

    const confirmDelete = window.confirm(
      t("deleteUserConfirmation")
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://farmconnect-backend-n6mx.onrender.com/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToDeleteUser")
        );
      }

      // Remove deleted user from the screen
      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== userId
        )
      );

      alert(
        data.message || t("userDeletedSuccessfully")
      );
    } catch (error) {
      console.error("Delete User Error:", error);

      alert(
        error.message || t("unableToDeleteUser")
      );
    }
  };

  // ==========================
  // Update User Role
  // ==========================

  const handleRoleChange = async (userId, newRole) => {
    const loggedInUser = getLoggedInUser();

    // Prevent changing your own admin role
    if (
      loggedInUser &&
      (
        loggedInUser.id === userId ||
        loggedInUser._id === userId
      ) &&
      loggedInUser.role === "admin"
    ) {
      alert(t("cannotChangeOwnAdminRole"));
      return;
    }

    try {
      setUpdatingUser(userId);

      const response = await fetch(
        `https://farmconnect-backend-n6mx.onrender.com/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToUpdateUserRole")
        );
      }

      // Update user in the UI
      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === userId
            ? data.user
            : user
        )
      );

      alert(
        data.message ||
        t("userRoleUpdatedSuccessfully")
      );
    } catch (error) {
      console.error("Update Role Error:", error);

      alert(
        error.message ||
        t("unableToUpdateUserRole")
      );

      fetchUsers();
    } finally {
      setUpdatingUser(null);
    }
  };

  // ==========================
  // Role Class
  // ==========================

  const getRoleClass = (role) => {
    if (role === "farmer") {
      return "farmer";
    }

    if (role === "admin") {
      return "admin";
    }

    return "customer";
  };

  // ==========================
  // Format Date
  // ==========================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================
  // Render
  // ==========================

  return (
    <div className="admin-users-page">

      {/* ==========================
          HEADER
      ========================== */}

      <div className="admin-users-header">

        <div>
          <h1>
            👥 {t("userManagement")}
          </h1>

          <p>
            {t("userManagementDescription")}
          </p>
        </div>

        <Link
          to="/admin"
          className="back-admin-btn"
        >
          ← {t("backToDashboard")}
        </Link>

      </div>

      {/* ==========================
          ERROR
      ========================== */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* ==========================
          LOADING
      ========================== */}

      {loading ? (

        <div className="admin-loading">
          {t("loadingUsers")}
        </div>

      ) : users.length === 0 ? (

        <div className="admin-empty">
          {t("noUsersFound")}
        </div>

      ) : (

        <div className="admin-users-table-container">

          <table className="admin-users-table">

            <thead>
              <tr>
                <th>#</th>
                <th>{t("name")}</th>
                <th>{t("email")}</th>
                <th>{t("phone")}</th>
                <th>{t("address")}</th>
                <th>{t("role")}</th>
                <th>{t("created")}</th>
                <th>{t("action")}</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user, index) => {
                const loggedInUser = getLoggedInUser();

                const isCurrentUser =
                  loggedInUser &&
                  (
                    loggedInUser.id === user._id ||
                    loggedInUser._id === user._id
                  );

                return (
                  <tr key={user._id}>

                    {/* Number */}

                    <td>
                      {index + 1}
                    </td>

                    {/* Name */}

                    <td className="user-name">
                      <strong>
                        {user.name}
                      </strong>
                    </td>

                    {/* Email */}

                    <td>
                      {user.email}
                    </td>

                    {/* Phone */}

                    <td>
                      {user.phone ||
                        t("notProvided")}
                    </td>

                    {/* Address */}

                    <td>
                      {user.address ||
                        t("notProvided")}
                    </td>

                    {/* Role */}

                    <td>

                      <select
                        value={user.role}
                        disabled={
                          updatingUser === user._id ||
                          isCurrentUser
                        }
                        onChange={(event) =>
                          handleRoleChange(
                            user._id,
                            event.target.value
                          )
                        }
                        className={`user-role-select ${getRoleClass(
                          user.role
                        )}`}
                        title={
                          isCurrentUser
                            ? t("cannotChangeOwnAdminRole")
                            : t("changeUserRole")
                        }
                      >

                        <option value="customer">
                          {t("customer")}
                        </option>

                        <option value="farmer">
                          {t("farmer")}
                        </option>

                        <option value="admin">
                          {t("admin")}
                        </option>

                      </select>

                      {updatingUser === user._id && (
                        <span className="role-updating">
                          {t("updating")}
                        </span>
                      )}

                    </td>

                    {/* Created Date */}

                    <td>
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Delete Action */}

                    <td>

                      <button
                        type="button"
                        className="delete-user-btn"
                        disabled={isCurrentUser}
                        onClick={() =>
                          handleDelete(user._id)
                        }
                        title={
                          isCurrentUser
                            ? t("cannotDeleteOwnAccount")
                            : t("deleteUser")
                        }
                      >
                        🗑 {t("delete")}
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default AdminUsers;