import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";


function AddProduct() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    price: "",
    quantity: "",
    unit: "kg",
    description: "",
    image: null,
  });

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

    setError("");
  };

  // =====================================================
  // HANDLE IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setFormData((previousData) => ({
      ...previousData,
      image: file || null,
    }));

    setError("");
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ===================================================
    // GET LOGGED-IN USER
    // ===================================================

    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      user = null;
    }

    if (!user || !user.id) {
      setError(t("loginAsFarmer"));
      return;
    }

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!formData.productName.trim()) {
      setError(t("productNameRequired"));
      return;
    }

    if (!formData.category) {
      setError(t("categoryRequired"));
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError(t("validPriceRequired"));
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError(t("validQuantityRequired"));
      return;
    }

    if (!formData.unit) {
      setError(t("unitRequired"));
      return;
    }

    if (!formData.description.trim()) {
      setError(t("descriptionRequired"));
      return;
    }

    if (!formData.image) {
      setError(t("imageRequired"));
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // CREATE FORM DATA
      // =================================================

      const data = new FormData();

      data.append("farmerId", user.id);
      data.append("productName", formData.productName.trim());
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("quantity", formData.quantity);
      data.append("unit", formData.unit);
      data.append("description", formData.description.trim());
      data.append("image", formData.image);

      // =================================================
      // SEND REQUEST
      // =================================================

      const response = await axios.post(
        "https://farmconnect-backend-n6mx.onrender.com/api/products/add", data
      );

      alert(
        response.data?.message ||
        t("addProductSuccessfully")
      );

      // =================================================
      // RESET FORM
      // =================================================

      setFormData({
        productName: "",
        category: "",
        price: "",
        quantity: "",
        unit: "kg",
        description: "",
        image: null,
      });

      // Reset file input
      const fileInput = document.getElementById(
        "product-image"
      );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Add Product Error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          t("failedToAddProduct")
        );
      } else if (error.request) {
        setError(t("unableToConnectServer"));
      } else {
        setError(t("failedToAddProduct"));
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CATEGORY OPTIONS
  // =====================================================

  const categories = [
    {
      value: "Vegetables",
      label: `🥕 ${t("vegetables")}`,
    },
    {
      value: "Fruits",
      label: `🍎 ${t("fruits")}`,
    },
    {
      value: "Grains",
      label: `🌾 ${t("grains")}`,
    },
    {
      value: "Pulses",
      label: `🫘 ${t("pulses")}`,
    },
    {
      value: "Dairy",
      label: `🥛 ${t("dairy")}`,
    },
    {
      value: "Spices",
      label: `🌶️ ${t("spices")}`,
    },
    {
      value: "Other",
      label: `📦 ${t("other")}`,
    },
  ];

  // =====================================================
  // UNIT OPTIONS
  // =====================================================

  const units = [
    {
      value: "kg",
      label: t("kilogram"),
    },
    {
      value: "g",
      label: t("gram"),
    },
    {
      value: "litre",
      label: t("litre"),
    },
    {
      value: "ml",
      label: t("millilitre"),
    },
    {
      value: "piece",
      label: t("piece"),
    },
    {
      value: "dozen",
      label: t("dozen"),
    },
    {
      value: "bag",
      label: t("bag"),
    },
    {
      value: "box",
      label: t("box"),
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f8f3",
        padding: "30px 15px",
        boxSizing: "border-box",
      }}
    >
      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/farmer"
          style={{
            textDecoration: "none",
            background: "#198754",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          ← {t("backToDashboard")}
        </Link>

        <Link
          to="/"
          style={{
            textDecoration: "none",
            background: "#14532d",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          🏠 {t("goToHome")}
        </Link>
      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          padding: "30px",
          background: "#fff",
          borderRadius: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "8px",
            color: "#14532d",
          }}
        >
          {t("addNewProduct")}
        </h2>

        <p
          style={{
            marginTop: 0,
            marginBottom: "25px",
            color: "#666",
          }}
        >
          {t("addFreshProductDescription")}
        </p>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 15px",
              background: "#fee2e2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            PRODUCT NAME
        ================================================= */}

        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="productName"
            style={{ fontWeight: "600" }}
          >
            {t("productName")}
          </label>

          <input
            id="productName"
            type="text"
            name="productName"
            placeholder={t("enterProductName")}
            value={formData.productName}
            onChange={handleChange}
            disabled={loading}
            required
            style={inputStyle}
          />
        </div>

        {/* =================================================
            CATEGORY
        ================================================= */}

        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="category"
            style={{ fontWeight: "600" }}
          >
            {t("category")}
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
            required
            style={inputStyle}
          >
            <option value="">
              {t("selectCategory")}
            </option>

            {categories.map((category) => (
              <option
                key={category.value}
                value={category.value}
              >
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* =================================================
            PRICE
        ================================================= */}

        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="price"
            style={{ fontWeight: "600" }}
          >
            {t("priceRupees")}
          </label>

          <input
            id="price"
            type="number"
            name="price"
            placeholder={t("enterPrice")}
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            disabled={loading}
            required
            style={inputStyle}
          />
        </div>

        {/* =================================================
            QUANTITY + UNIT
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "15px",
            marginBottom: "18px",
          }}
        >
          <div>
            <label
              htmlFor="quantity"
              style={{ fontWeight: "600" }}
            >
              {t("quantity")}
            </label>

            <input
              id="quantity"
              type="number"
              name="quantity"
              placeholder={t("enterQuantity")}
              min="0"
              step="0.01"
              value={formData.quantity}
              onChange={handleChange}
              disabled={loading}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="unit"
              style={{ fontWeight: "600" }}
            >
              {t("unit")}
            </label>

            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              disabled={loading}
              required
              style={inputStyle}
            >
              {units.map((unit) => (
                <option
                  key={unit.value}
                  value={unit.value}
                >
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="description"
            style={{ fontWeight: "600" }}
          >
            {t("description")}
          </label>

          <textarea
            id="description"
            name="description"
            placeholder={t("enterProductDescription")}
            rows="4"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            required
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />
        </div>

        {/* =================================================
            IMAGE
        ================================================= */}

        <div style={{ marginBottom: "25px" }}>
          <label
            htmlFor="product-image"
            style={{ fontWeight: "600" }}
          >
            {t("productImage")}
          </label>

          <input
            id="product-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
            required
            style={{
              ...inputStyle,
              padding: "10px",
            }}
          />

          {formData.image && (
            <small
              style={{
                display: "block",
                marginTop: "8px",
                color: "#198754",
              }}
            >
              {t("selectedImage")}:{" "}
              {formData.image.name}
            </small>
          )}
        </div>

        {/* =================================================
            ADD PRODUCT BUTTON
        ================================================= */}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: "none",
            borderRadius: "8px",
            background: loading
              ? "#94a3b8"
              : "#198754",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? `⏳ ${t("addingProduct")}`
            : `➕ ${t("addProduct")}`}
        </button>
      </form>
    </div>
  );
}

// =====================================================
// INPUT STYLE
// =====================================================

const inputStyle = {
  width: "100%",
  marginTop: "7px",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
};

export default AddProduct;