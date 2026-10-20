import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import "../CSS/Navbar.css";

import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { language, changeLanguage, t } = useLanguage();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // =====================================================
  // LOAD LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Navbar User Error:", error);
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("farmconnect-login", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("farmconnect-login", loadUser);
    };
  }, [location.pathname]);

  // =====================================================
  // CLOSE PROFILE WHEN PAGE CHANGES
  // =====================================================

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  // =====================================================
  // CLOSE PROFILE WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [profileOpen]);

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  // =====================================================
  // TOGGLE MOBILE MENU
  // =====================================================

  const toggleMobileMenu = () => {
    setMenuOpen((previous) => !previous);
    setProfileOpen(false);
  };

  // =====================================================
  // TOGGLE PROFILE DROPDOWN
  // =====================================================

  const toggleProfile = () => {
    setProfileOpen((previous) => !previous);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);
    setProfileOpen(false);

    window.dispatchEvent(new Event("farmconnect-logout"));

    navigate("/");
  };

  // =====================================================
  // USER NAME
  // =====================================================

  const getUserName = () => {
    if (!user) {
      return "";
    }

    if (user.name) {
      return user.name;
    }

    if (user.email) {
      return user.email.split("@")[0];
    }

    return t("user");
  };

  // =====================================================
  // ROLE NAME
  // =====================================================

  const getRoleName = () => {
    if (!user?.role) {
      return t("user");
    }

    if (user.role === "farmer") {
      return t("farmer");
    }

    if (user.role === "customer") {
      return t("customer");
    }

    if (user.role === "admin") {
      return t("admin");
    }

    return t("user");
  };

  // =====================================================
  // DASHBOARD PATH
  // =====================================================

  const getDashboardPath = () => {
    if (!user) {
      return "/";
    }

    if (user.role === "farmer") {
      return "/farmer";
    }

    if (user.role === "customer") {
      return "/customer";
    }

    if (user.role === "admin") {
      return "/admin";
    }

    return "/";
  };

  // =====================================================
  // DASHBOARD TEXT
  // =====================================================

  const getDashboardText = () => {
    if (user?.role === "farmer") {
      return `🌾 ${t("dashboard")}`;
    }

    if (user?.role === "customer") {
      return `🛒 ${t("dashboard")}`;
    }

    if (user?.role === "admin") {
      return `🛡️ ${t("dashboard")}`;
    }

    return t("dashboard");
  };

  // =====================================================
  // LANGUAGE CHANGE
  // =====================================================

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
    closeMenu();
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <nav className="farm-navbar">
      <div className="navbar-container">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="navbar-brand-custom"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="FarmConnect - Connect Grow Thrive"
            className="logo-banner"
          />
        </Link>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* =================================================
            NAVIGATION MENU
        ================================================= */}

        <div
          className={
            menuOpen
              ? "navbar-menu show"
              : "navbar-menu"
          }
        >

          {/* =================================================
              MAIN NAVIGATION
          ================================================= */}

          <ul className="navbar-nav-custom">

            {/* HOME */}

            <li>
              <Link
                to="/"
                className="nav-link-custom"
                onClick={closeMenu}
              >
                {t("home")}
              </Link>
            </li>

            {/* =================================================
                DASHBOARD
                KEEP THIS SEPARATE FROM PROFILE
            ================================================= */}

            {user && (
              <li>
                <Link
                  to={getDashboardPath()}
                  className="nav-link-custom dashboard-nav-link"
                  onClick={closeMenu}
                >
                  {getDashboardText()}
                </Link>
              </li>
            )}

            {/* =================================================
                CUSTOMER LINKS
            ================================================= */}

            {user?.role === "customer" && (
              <>
                <li>
                  <Link
                    to="/products"
                    className="nav-link-custom"
                    onClick={closeMenu}
                  >
                    {t("browseProducts")}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/my-orders"
                    className="nav-link-custom"
                    onClick={closeMenu}
                  >
                    {t("myOrders")}
                  </Link>
                </li>
              </>
            )}

            {/* =================================================
                FARMER LINKS
            ================================================= */}

            {user?.role === "farmer" && (
              <>
                <li>
                  <Link
                    to="/my-products"
                    className="nav-link-custom"
                    onClick={closeMenu}
                  >
                    {t("myProducts")}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/add-product"
                    className="nav-link-custom"
                    onClick={closeMenu}
                  >
                    {t("addProduct")}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/farmer-orders"
                    className="nav-link-custom"
                    onClick={closeMenu}
                  >
                    {t("orders")}
                  </Link>
                </li>
              </>
            )}

            {/* =================================================
                ADMIN LINKS
            ================================================= */}

            {user?.role === "admin" && (
              <>
                <li>
                  <Link
                    to="/admin/users"
                    className="nav-link-custom"
                    onClick={closeMenu}
                  >
                    {t("users")}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/admin/products"
                    className="nav-link-custom"
                    onClick={closeMenu}
                  >
                    {t("products")}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/admin/orders"
                    className="nav-link-custom"
                    onClick={closeMenu}
                  >
                    {t("orders")}
                  </Link>
                </li>
              </>
            )}

            {/* =================================================
                COMMON LINKS
            ================================================= */}

            <li>
              <Link
                to="/about"
                className="nav-link-custom"
                onClick={closeMenu}
              >
                {t("aboutUs")}
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="nav-link-custom"
                onClick={closeMenu}
              >
                {t("contactUs")}
              </Link>
            </li>

          </ul>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="navbar-right">

            {/* =================================================
                LANGUAGE
            ================================================= */}

            <div className="language-selector">

              <label
                htmlFor="language-select"
                className="language-label"
              >
                🌐
              </label>

              <select
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
                className="language-select"
                aria-label={t("language")}
              >
                <option value="en">
                  English
                </option>

                <option value="hi">
                  हिन्दी
                </option>

                <option value="mr">
                  मराठी
                </option>
              </select>

            </div>

            {/* =================================================
                LOGGED-IN USER
            ================================================= */}

            {user ? (

              <div className="navbar-user-section">

                {/* =================================================
                    CART
                ================================================= */}

                {user.role === "customer" && (
                  <Link
                    to="/cart"
                    className="navbar-cart-btn"
                    onClick={closeMenu}
                  >
                    🛒 {t("cart")}
                  </Link>
                )}

                {/* =================================================
                    PROFILE DROPDOWN
                    THIS REMAINS A PROFILE BUTTON
                    NOT A DASHBOARD BUTTON
                ================================================= */}

                <div
                  className="profile-dropdown-wrapper"
                  ref={profileRef}
                >

                  {/* PROFILE BUTTON */}

                  <button
                    type="button"
                    className="navbar-user-info"
                    onClick={toggleProfile}
                    aria-haspopup="true"
                    aria-expanded={profileOpen}
                  >

                    <span className="user-icon">
                      👤
                    </span>

                    <div className="user-details">

                      <strong>
                        {getUserName()}
                      </strong>

                      <small>
                        {getRoleName()}
                      </small>

                    </div>

                    <span className="profile-arrow">
                      {profileOpen ? "▲" : "▼"}
                    </span>

                  </button>

                  {/* =================================================
                      PROFILE DROPDOWN
                  ================================================= */}

                  {profileOpen && (

                    <div
                      className="profile-dropdown"
                      role="menu"
                    >

                      {/* =================================================
                          USER INFORMATION
                      ================================================= */}

                      <div className="profile-dropdown-info">

                        <h3>
                          {getUserName()}
                        </h3>

                        <p>
                          {user.email}
                        </p>

                        <span className="profile-role-badge">
                          {getRoleName()}
                        </span>

                      </div>

                      {/* MENU */}

                      <div className="profile-dropdown-menu">

                        {/* PROFILE */}

                        <button
                          type="button"
                          className="profile-dropdown-item"
                          onClick={() => {
                            setProfileOpen(false);
                            navigate("/profile");
                          }}
                        >
                          <span className="profile-dropdown-icon">
                            👤
                          </span>

                          <span>
                            {t("profile")}
                          </span>
                        </button>

                        {/* DASHBOARD */}

                        <button
                          type="button"
                          className="profile-dropdown-item"
                          onClick={() => {
                            setProfileOpen(false);
                            navigate(getDashboardPath());
                          }}
                        >
                          <span className="profile-dropdown-icon">
                            📊
                          </span>

                          <span>
                            {t("dashboard")}
                          </span>
                        </button>

                        {/* MESSAGES */}

                        <button
                          type="button"
                          className="profile-dropdown-item"
                          onClick={() => {
                            setProfileOpen(false);
                            navigate("/messages");
                          }}
                        >
                          <span className="profile-dropdown-icon">
                            💬
                          </span>

                          <span>
                            {t("messages")}
                          </span>
                        </button>

                      </div>

                      {/* =================================================
                          LOGOUT
                      ================================================= */}

                      <div className="profile-dropdown-logout">

                        <button
                          type="button"
                          className="profile-logout-button"
                          onClick={handleLogout}
                        >

                          <span className="profile-dropdown-icon">
                            ↪
                          </span>

                          <span>
                            {t("logout")}
                          </span>

                        </button>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            ) : (

              /* =================================================
                 NOT LOGGED IN
              ================================================= */

              <div className="navbar-actions">

                <Link
                  to="/login"
                  className="navbar-login-btn"
                  onClick={closeMenu}
                >
                  {t("login")}
                </Link>

                <Link
                  to="/register"
                  className="navbar-register-btn"
                  onClick={closeMenu}
                >
                  {t("register")}
                </Link>

              </div>

            )}

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;