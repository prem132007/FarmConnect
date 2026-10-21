import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "../css/Login.css";
import logo from "../assets/logo.png";

import { useLanguage } from "../context/LanguageContext";

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // =====================================================
  // STATES
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    // ===================================================
    // VALIDATION
    // ===================================================

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError(t("invalidEmailPassword"));
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // LOGIN API
      // =================================================

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // =================================================
      // CHECK RESPONSE
      // =================================================

      if (!response.data) {
        throw new Error(t("noResponseReceived"));
      }

      if (!response.data.user) {
        throw new Error(t("invalidLoginResponse"));
      }

      // =================================================
      // SAVE TOKEN
      // =================================================

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // =================================================
      // SAVE USER
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // =================================================
      // UPDATE NAVBAR
      // =================================================

      window.dispatchEvent(new Event("farmconnect-login"));

      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      alert(response.data.message || t("loginSuccessful"));

      // =================================================
      // REDIRECT TO HOME
      // =================================================

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);

      // =================================================
      // SERVER RESPONSE ERROR
      // =================================================

      if (error.response) {
        setError(
          error.response.data?.message ||
            t("invalidEmailPassword")
        );
      }

      // =================================================
      // SERVER NOT RUNNING
      // =================================================

      else if (error.request) {
        setError(t("serverConnectionError"));
      }

      // =================================================
      // OTHER ERROR
      // =================================================

      else {
        setError(error.message || t("loginFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="login-page">
      <div className="login-card">
        {/* =================================================
            LOGO
        ================================================= */}

        <div className="login-logo-wrapper">
          <img
            src={logo}
            alt="FarmConnect Logo"
            className="login-image"
          />
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <h2 className="login-title">
          {t("welcomeBack")}
        </h2>

        <p className="login-subtitle">
          {t("loginToContinue")}
        </p>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && <div className="login-error">{error}</div>}

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>
          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="login-form-group">
            <label htmlFor="email">
              {t("emailAddress")}
            </label>

            <input
              id="email"
              type="email"
              name="email"
              className="login-input"
              placeholder={t("enterEmail")}
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="login-form-group">
            <label htmlFor="password">
              {t("password")}
            </label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="login-input password-input"
                placeholder={t("enterPassword")}
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
                required
              />

              <button
                type="button"
                className="show-password-btn"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                disabled={loading}
              >
                {showPassword ? t("hide") : t("show")}
              </button>
            </div>
          </div>

          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? t("loggingIn") : t("login")}
          </button>
        </form>

        {/* =================================================
            REGISTER LINK
        ================================================= */}

        <div className="register-link">
          <span>{t("dontHaveAccount")}</span>

          <Link to="/register">
            {t("register")}
          </Link>
        </div>

        {/* =================================================
            BACK TO HOME
        ================================================= */}

        <div className="back-home">
          <Link to="/">
            ← {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;