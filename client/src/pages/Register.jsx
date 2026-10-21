import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../css/Register.css";

import { useLanguage } from "../context/LanguageContext";

function Register() {
  const navigate = useNavigate();

  // =====================================================
  // LANGUAGE
  // =====================================================

  const { t } = useLanguage();

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",

    // Address Information
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",

    // Account
    role: "customer",
  });

  // =====================================================
  // STATES
  // =====================================================

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT CHANGES
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
  // SUBMIT REGISTRATION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    // ===================================================
    // PASSWORD VALIDATION
    // ===================================================

    if (formData.password.length < 6) {
      setError(t("passwordMinLength"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    // ===================================================
    // PHONE VALIDATION
    // ===================================================

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(formData.phone)) {
      setError(t("invalidPhone"));
      return;
    }

    // ===================================================
    // PINCODE VALIDATION
    // ===================================================

    const pincodeRegex = /^\d{6}$/;

    if (!pincodeRegex.test(formData.pincode)) {
      setError(t("invalidPincode"));
      return;
    }

    // ===================================================
    // DATE OF BIRTH VALIDATION
    // ===================================================

    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);

    if (!formData.dateOfBirth || birthDate >= today) {
      setError(t("invalidDateOfBirth"));
      return;
    }

    // ===================================================
    // CALCULATE AGE
    // ===================================================

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      setError(t("minimumAge"));
      return;
    }

    // ===================================================
    // REGISTRATION API
    // ===================================================

    try {
      setLoading(true);

      const response = await axios.post(
        "https://farmconnect-backend-n6mx.onrender.com/api/auth/register",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          role: formData.role,
        }
      );

      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      alert(
        response.data.message ||
        t("registrationSuccessful")
      );

      // =================================================
      // RESET FORM
      // =================================================

      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        role: "customer",
      });

      // =================================================
      // GO TO LOGIN
      // =================================================

      navigate("/login");
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      setError(
        error.response?.data?.message ||
        t("registrationFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="register-page">
      <div className="register-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="register-header">
          <h2>🌾 FarmConnect</h2>

          <p>
            {t("createFarmConnectAccount")}
          </p>
        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {/* =================================================
            REGISTRATION FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <h3 className="form-section-title">
            👤 {t("personalInformation")}
          </h3>

          {/* FULL NAME */}

          <label htmlFor="name">
            {t("fullName")} *
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder={t("enterFullName")}
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            required
          />

          {/* EMAIL */}

          <label htmlFor="email">
            {t("emailAddress")} *
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder={t("enterEmail")}
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />

          {/* PHONE */}

          <label htmlFor="phone">
            {t("phoneNumber")} *
          </label>

          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder={t("tenDigitMobile")}
            value={formData.phone}
            onChange={handleChange}
            maxLength="10"
            disabled={loading}
            required
          />

          {/* GENDER + DATE OF BIRTH */}

          <div className="form-row">

            {/* GENDER */}

            <div className="form-group">
              <label htmlFor="gender">
                {t("gender")} *
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">
                  {t("selectGender")}
                </option>

                <option value="Male">
                  {t("male")}
                </option>

                <option value="Female">
                  {t("female")}
                </option>

                <option value="Other">
                  {t("other")}
                </option>
              </select>
            </div>

            {/* DATE OF BIRTH */}

            <div className="form-group">
              <label htmlFor="dateOfBirth">
                {t("dateOfBirth")} *
              </label>

              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

          </div>

          {/* PASSWORD */}

          <label htmlFor="password">
            {t("password")} *
          </label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder={t("minimumSixCharacters")}
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            disabled={loading}
            required
          />

          {/* CONFIRM PASSWORD */}

          <label htmlFor="confirmPassword">
            {t("confirmPassword")} *
          </label>

          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder={t("reEnterPassword")}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            required
          />

          {/* =================================================
              ADDRESS INFORMATION
          ================================================= */}

          <h3 className="form-section-title">
            📍 {t("addressInformation")}
          </h3>

          {/* ADDRESS */}

          <label htmlFor="address">
            {t("addressHouseNo")} *
          </label>

          <textarea
            id="address"
            name="address"
            placeholder={t("houseStreetArea")}
            value={formData.address}
            onChange={handleChange}
            rows="3"
            disabled={loading}
            required
          />

          {/* CITY + STATE */}

          <div className="form-row">

            {/* CITY */}

            <div className="form-group">
              <label htmlFor="city">
                {t("city")} *
              </label>

              <input
                id="city"
                type="text"
                name="city"
                placeholder={t("enterCity")}
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* STATE */}

            <div className="form-group">
              <label htmlFor="state">
                {t("state")} *
              </label>

              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">
                  {t("selectState")}
                </option>

                <option value="Andhra Pradesh">
                  Andhra Pradesh
                </option>

                <option value="Arunachal Pradesh">
                  Arunachal Pradesh
                </option>

                <option value="Assam">
                  Assam
                </option>

                <option value="Bihar">
                  Bihar
                </option>

                <option value="Chhattisgarh">
                  Chhattisgarh
                </option>

                <option value="Goa">
                  Goa
                </option>

                <option value="Gujarat">
                  Gujarat
                </option>

                <option value="Haryana">
                  Haryana
                </option>

                <option value="Himachal Pradesh">
                  Himachal Pradesh
                </option>

                <option value="Jharkhand">
                  Jharkhand
                </option>

                <option value="Karnataka">
                  Karnataka
                </option>

                <option value="Kerala">
                  Kerala
                </option>

                <option value="Madhya Pradesh">
                  Madhya Pradesh
                </option>

                <option value="Maharashtra">
                  Maharashtra
                </option>

                <option value="Manipur">
                  Manipur
                </option>

                <option value="Meghalaya">
                  Meghalaya
                </option>

                <option value="Mizoram">
                  Mizoram
                </option>

                <option value="Nagaland">
                  Nagaland
                </option>

                <option value="Odisha">
                  Odisha
                </option>

                <option value="Punjab">
                  Punjab
                </option>

                <option value="Rajasthan">
                  Rajasthan
                </option>

                <option value="Sikkim">
                  Sikkim
                </option>

                <option value="Tamil Nadu">
                  Tamil Nadu
                </option>

                <option value="Telangana">
                  Telangana
                </option>

                <option value="Tripura">
                  Tripura
                </option>

                <option value="Uttar Pradesh">
                  Uttar Pradesh
                </option>

                <option value="Uttarakhand">
                  Uttarakhand
                </option>

                <option value="West Bengal">
                  West Bengal
                </option>

                <option value="Delhi">
                  Delhi
                </option>

                <option value="Jammu and Kashmir">
                  Jammu and Kashmir
                </option>

                <option value="Ladakh">
                  Ladakh
                </option>
              </select>
            </div>

          </div>

          {/* PINCODE + COUNTRY */}

          <div className="form-row">

            {/* PINCODE */}

            <div className="form-group">
              <label htmlFor="pincode">
                {t("pincode")} *
              </label>

              <input
                id="pincode"
                type="text"
                name="pincode"
                placeholder={t("sixDigitPincode")}
                value={formData.pincode}
                onChange={handleChange}
                maxLength="6"
                disabled={loading}
                required
              />
            </div>

            {/* COUNTRY */}

            <div className="form-group">
              <label htmlFor="country">
                {t("country")} *
              </label>

              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="India">
                  {t("india")}
                </option>
              </select>
            </div>

          </div>

          {/* =================================================
              ACCOUNT TYPE
          ================================================= */}

          <h3 className="form-section-title">
            👨‍🌾 {t("accountType")}
          </h3>

          <label htmlFor="role">
            {t("selectAccountType")} *
          </label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="customer">
              {t("customer")}
            </option>

            <option value="farmer">
              {t("farmer")}
            </option>
          </select>

          {/* =================================================
              REGISTER BUTTON
          ================================================= */}

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading
              ? t("creatingAccount")
              : t("createAccount")}
          </button>

        </form>

        {/* =================================================
            LOGIN LINK
        ================================================= */}

        <div className="register-footer">
          {t("alreadyHaveAccount")}{" "}

          <Link to="/login">
            {t("login")}
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;