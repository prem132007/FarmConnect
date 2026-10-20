import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../CSS/Profile.css";
import { useLanguage } from "../context/LanguageContext";

function Profile() {
  const { t, language } = useLanguage();

  // =====================================================
  // STATE
  // =====================================================

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    role: "",
  };

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [originalData, setOriginalData] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError(t("userInformationNotFound"));
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id || parsedUser._id;

      if (!userId) {
        setError(t("userIdNotFound"));
        setLoading(false);
        return;
      }

      setUser(parsedUser);
      fetchProfile(userId);
    } catch (err) {
      console.error("Profile User Error:", err);
      setError(t("unableToLoadProfile"));
      setLoading(false);
    }
  }, [language]);

  // =====================================================
  // FORMAT DATE FOR INPUT
  // =====================================================

  const formatDateForInput = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toISOString().split("T")[0];
  };

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/profile`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToFetchProfile")
        );
      }

      const profileUser = data.user;

      if (!profileUser) {
        throw new Error(t("profileDataNotFound"));
      }

      const profileData = {
        name: profileUser.name || "",
        email: profileUser.email || "",
        phone: profileUser.phone || "",
        gender: profileUser.gender || "",
        dateOfBirth: formatDateForInput(
          profileUser.dateOfBirth
        ),
        address: profileUser.address || "",
        city: profileUser.city || "",
        state: profileUser.state || "",
        pincode: profileUser.pincode || "",
        country: profileUser.country || "India",
        role: profileUser.role || "",
      };

      setUser(profileUser);
      setFormData(profileData);
      setOriginalData(profileData);
      setError("");
    } catch (err) {
      console.error("Fetch Profile Error:", err);

      setError(
        err.message || t("unableToLoadProfileData")
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    setFormData({ ...originalData });
    setMessage("");
    setError("");
    setIsEditing(false);
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      return t("pleaseEnterFullName");
    }

    if (!formData.phone.trim()) {
      return t("pleaseEnterPhoneNumber");
    }

    if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone.trim())) {
      return t("pleaseEnterValidPhoneNumber");
    }

    if (!formData.gender) {
      return t("pleaseSelectGender");
    }

    if (!formData.dateOfBirth) {
      return t("pleaseEnterDateOfBirth");
    }

    if (!formData.address.trim()) {
      return t("pleaseEnterAddress");
    }

    if (!formData.city.trim()) {
      return t("pleaseEnterCity");
    }

    if (!formData.state.trim()) {
      return t("pleaseEnterState");
    }

    if (!formData.pincode.trim()) {
      return t("pleaseEnterPincode");
    }

    if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      return t("pleaseEnterValidPincode");
    }

    if (!formData.country.trim()) {
      return t("pleaseEnterCountry");
    }

    return "";
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEditing) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const userId = user?.id || user?._id;

      if (!userId) {
        throw new Error(t("userIdNotFound"));
      }

      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode.trim(),
            country: formData.country.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToUpdateProfile")
        );
      }

      const updatedUserFromServer = data.user;

      if (!updatedUserFromServer) {
        throw new Error(
          t("updatedUserDataNotReturned")
        );
      }

      const updatedProfile = {
        name: updatedUserFromServer.name || "",
        email: updatedUserFromServer.email || "",
        phone: updatedUserFromServer.phone || "",
        gender: updatedUserFromServer.gender || "",
        dateOfBirth: formatDateForInput(
          updatedUserFromServer.dateOfBirth
        ),
        address: updatedUserFromServer.address || "",
        city: updatedUserFromServer.city || "",
        state: updatedUserFromServer.state || "",
        pincode: updatedUserFromServer.pincode || "",
        country: updatedUserFromServer.country || "India",
        role: updatedUserFromServer.role || "",
      };

      setFormData(updatedProfile);
      setOriginalData(updatedProfile);
      setUser(updatedUserFromServer);

      // =================================================
      // UPDATE LOCAL STORAGE
      // =================================================

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const oldUser = JSON.parse(storedUser);

        const updatedUser = {
          ...oldUser,
          ...updatedUserFromServer,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
      }

      setIsEditing(false);
      setMessage(t("profileUpdatedSuccessfully"));
    } catch (err) {
      console.error("Update Profile Error:", err);

      setError(
        err.message || t("unableToUpdateProfile")
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-loading-spinner"></div>

          <p>{t("loadingProfile")}</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PROFILE PAGE
  // =====================================================

  return (
    <div className="profile-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="profile-header">
        <div className="profile-header-content">
          <span className="profile-badge">
            {t("farmConnectAccount")}
          </span>

          <h1>👤 {t("myProfile")}</h1>

          <p>{t("profileDescription")}</p>
        </div>

        <Link
          to="/"
          className="profile-home-btn"
        >
          🏠 {t("backToHome")}
        </Link>
      </div>

      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="profile-card">
        {/* AVATAR */}

        <div className="profile-avatar">
          👤
        </div>

        {/* NAME */}

        <h2>
          {formData.name || t("user")}
        </h2>

        {/* ROLE */}

        <p className="profile-role">
          {formData.role
            ? t(formData.role)
            : t("customer")}
        </p>

        {/* MESSAGES */}

        {message && (
          <div className="profile-success">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="profile-error">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}

        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >
          {/* FULL NAME */}

          <div className="profile-field">
            <label htmlFor="name">
              {t("fullName")}
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("enterFullName")}
              disabled={!isEditing || saving}
              required
            />
          </div>

          {/* EMAIL */}

          <div className="profile-field">
            <label htmlFor="email">
              {t("emailAddress")}
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              readOnly
              disabled
            />

            <small>
              {t("emailCannotBeChanged")}
            </small>
          </div>

          {/* PHONE */}

          <div className="profile-field">
            <label htmlFor="phone">
              {t("phoneNumber")}
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("enterPhoneNumber")}
              disabled={!isEditing || saving}
              required
            />
          </div>

          {/* GENDER */}

          <div className="profile-field">
            <label htmlFor="gender">
              {t("gender")}
            </label>

            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing || saving}
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

          <div className="profile-field">
            <label htmlFor="dateOfBirth">
              {t("dateOfBirth")}
            </label>

            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={!isEditing || saving}
              required
            />
          </div>

          {/* ADDRESS */}

          <div className="profile-field">
            <label htmlFor="address">
              {t("address")}
            </label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={t("enterCompleteAddress")}
              rows="4"
              disabled={!isEditing || saving}
              required
            />
          </div>

          {/* CITY */}

          <div className="profile-field">
            <label htmlFor="city">
              {t("city")}
            </label>

            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={t("enterCity")}
              disabled={!isEditing || saving}
              required
            />
          </div>

          {/* STATE */}

          <div className="profile-field">
            <label htmlFor="state">
              {t("state")}
            </label>

            <input
              id="state"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder={t("enterState")}
              disabled={!isEditing || saving}
              required
            />
          </div>

          {/* PINCODE */}

          <div className="profile-field">
            <label htmlFor="pincode">
              {t("pincode")}
            </label>

            <input
              id="pincode"
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder={t("enter6DigitPincode")}
              maxLength="6"
              disabled={!isEditing || saving}
              required
            />
          </div>

          {/* COUNTRY */}

          <div className="profile-field">
            <label htmlFor="country">
              {t("country")}
            </label>

            <input
              id="country"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder={t("enterCountry")}
              disabled={!isEditing || saving}
              required
            />
          </div>

          {/* ACCOUNT ROLE */}

          <div className="profile-field">
            <label htmlFor="role">
              {t("accountRole")}
            </label>

            <input
              id="role"
              type="text"
              value={
                formData.role
                  ? t(formData.role)
                  : ""
              }
              readOnly
              disabled
            />

            <small>
              {t("accountRoleCannotBeChanged")}
            </small>
          </div>

          {/* BUTTONS */}

          {!isEditing ? (
            <button
              type="button"
              className="profile-edit-btn"
              onClick={handleEdit}
            >
              ✏️ {t("editProfile")}
            </button>
          ) : (
            <div className="profile-edit-actions">
              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving
                  ? `⏳ ${t("saving")}`
                  : `💾 ${t("saveChanges")}`}
              </button>

              <button
                type="button"
                className="profile-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                ✕ {t("cancel")}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;