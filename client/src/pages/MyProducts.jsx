import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../css/MyProducts.css";
import { useLanguage } from "../context/LanguageContext";

function MyProducts() {
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // =====================================================
  // CATEGORY OPTIONS
  // Backend values remain in English
  // =====================================================

  const categories = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Pulses",
    "Dairy",
    "Spices",
    "Other",
  ];

  // =====================================================
  // UNIT OPTIONS
  // Backend values remain unchanged
  // =====================================================

  const units = [
    "kg",
    "g",
    "litre",
    "ml",
    "piece",
    "dozen",
    "pack",
  ];

  // =====================================================
  // CATEGORY TRANSLATION
  // Handles both "Vegetables" and old "Vegetable" values
  // =====================================================

  const getCategoryLabel = (category) => {
    if (!category) {
      return t("other");
    }

    const normalizedCategory = String(category)
      .trim()
      .toLowerCase();

    const categoryMap = {
      vegetables: "vegetables",
      vegetable: "vegetables",

      fruits: "fruits",
      fruit: "fruits",

      grains: "grains",
      grain: "grains",

      pulses: "pulses",
      pulse: "pulses",

      dairy: "dairy",

      spices: "spices",
      spice: "spices",

      other: "other",
    };

    return t(
      categoryMap[normalizedCategory] || "other"
    );
  };

  // =====================================================
  // CONVERT CATEGORY TO CANONICAL BACKEND VALUE
  // =====================================================

  const normalizeCategory = (category) => {
    if (!category) {
      return "";
    }

    const normalizedCategory = String(category)
      .trim()
      .toLowerCase();

    const categoryMap = {
      vegetables: "Vegetables",
      vegetable: "Vegetables",

      fruits: "Fruits",
      fruit: "Fruits",

      grains: "Grains",
      grain: "Grains",

      pulses: "Pulses",
      pulse: "Pulses",

      dairy: "Dairy",

      spices: "Spices",
      spice: "Spices",

      other: "Other",
    };

    return (
      categoryMap[normalizedCategory] || category
    );
  };

  // =====================================================
  // UNIT TRANSLATION
  // =====================================================

  const getUnitLabel = (unit) => {
    const normalizedUnit = String(unit || "")
      .trim()
      .toLowerCase();

    const unitMap = {
      kg: "kilogram",
      g: "gram",
      litre: "litre",
      ml: "millilitre",
      piece: "piece",
      dozen: "dozen",
    };

    return t(unitMap[normalizedUnit] || normalizedUnit);
  };

  // =====================================================
  // GET USER
  // =====================================================

  const getUser = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

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
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const user = getUser();

      if (!user?.id) {
        alert(t("userInformationNotFound"));
        return;
      }

      const response = await axios.get(
        `http://farmconnect-backend-n6mx.onrender.com/api/products/my-products/${user.id}`
      );

      setProducts(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Fetch Products Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        t("unableToLoadProducts")
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (productId) => {
    const product = products.find(
      (item) => item._id === productId
    );

    const productName =
      product?.productName || t("farmProduct");

    const confirmDelete = window.confirm(
      `${t("delete")} "${productName}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://farmconnect-backend-n6mx.onrender.com/api/products/${productId}`
      );

      alert(
        response.data?.message ||
        t("productDeletedSuccessfully")
      );

      setProducts((previousProducts) =>
        previousProducts.filter(
          (item) => item._id !== productId
        )
      );
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        t("unableToLoadProducts")
      );
    }
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const editProduct = (product) => {
    setEditingProduct({
      ...product,

      productName:
        product.productName || "",

      category:
        normalizeCategory(product.category),

      price:
        product.price ?? "",

      quantity:
        product.quantity ?? "",

      unit:
        product.unit || "kg",

      description:
        product.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingProduct(
      (previousProduct) => ({
        ...previousProduct,
        [name]: value,
      })
    );
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const updateProduct = async () => {
    if (!editingProduct) {
      return;
    }

    const productName =
      editingProduct.productName?.trim();

    const category = normalizeCategory(
      editingProduct.category?.trim()
    );

    const price = Number(
      editingProduct.price
    );

    const quantity = Number(
      editingProduct.quantity
    );

    const unit =
      editingProduct.unit?.trim() || "kg";

    const description =
      editingProduct.description?.trim() || "";

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!productName) {
      alert(t("productNameRequired"));
      return;
    }

    if (!category) {
      alert(t("categoryRequired"));
      return;
    }

    if (!price || price <= 0) {
      alert(t("validPriceRequired"));
      return;
    }

    if (!quantity || quantity <= 0) {
      alert(t("validQuantityRequired"));
      return;
    }

    try {
      setUpdating(true);

      const response = await axios.put(
        `http://farmconnect-backend-n6mx.onrender.com/api/products/${editingProduct._id}`,
        {
          productName,
          category,
          price,
          quantity,
          unit,
          description,
        }
      );

      alert(
        response.data?.message ||
        t("productUpdatedSuccessfully")
      );

      setEditingProduct(null);

      await fetchProducts();
    } catch (error) {
      console.error(
        "Update Product Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        t("unableToLoadProducts")
      );
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    const imageValue = String(image).trim();

    if (
      imageValue.startsWith("http://") ||
      imageValue.startsWith("https://")
    ) {
      return imageValue;
    }

    const imagePath = imageValue.replace(
      /^\/+/,
      ""
    );

    if (imagePath.startsWith("uploads/")) {
      return `http://farmconnect-backend-n6mx.onrender.com/${imagePath}`;
    }

    return `http://farmconnect-backend-n6mx.onrender.com/uploads/${imagePath}`;
  };

  // =====================================================
  // DISPLAY QUANTITY
  // =====================================================

  const displayQuantity = (product) => {
    const quantity = product.quantity ?? 0;
    const unit = product.unit || "kg";

    return `${quantity} ${getUnitLabel(unit)}`;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="my-products-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="my-products-header">

        <div className="my-products-title-section">

          <span className="my-products-badge">
            🌾 {t("farmerPanel")}
          </span>

          <h1>
            📦 {t("myProducts")}
          </h1>

          <p>
            {t(
              "myProductsDashboardDescription"
            )}
          </p>

        </div>

        <div className="my-products-navigation">

          <Link
            to="/farmer"
            className="my-products-nav-btn dashboard-btn"
          >
            📊 {t("dashboard")}
          </Link>

          <Link
            to="/"
            className="my-products-nav-btn home-btn"
          >
            🏠 {t("home")}
          </Link>

        </div>

      </header>

      {/* =================================================
          EDIT PRODUCT
      ================================================= */}

      {editingProduct && (
        <section className="edit-product-card">

          <div className="edit-product-header">

            <div>
              <span className="edit-section-badge">
                ✏️ {t("update")}
              </span>

              <h2>
                {t("productName")}
              </h2>

              <p>
                {t(
                  "addFreshProductDescription"
                )}
              </p>
            </div>

            <button
              type="button"
              className="edit-close-btn"
              onClick={cancelEdit}
              disabled={updating}
              aria-label={t("close")}
            >
              ×
            </button>

          </div>

          <div className="edit-form-grid">

            {/* Product Name */}

            <div className="edit-form-group full-width">

              <label>
                {t("productName")}
              </label>

              <input
                type="text"
                name="productName"
                className="edit-input"
                placeholder={t(
                  "enterProductName"
                )}
                value={
                  editingProduct.productName
                }
                onChange={handleEditChange}
                disabled={updating}
              />

            </div>

            {/* Category */}

            <div className="edit-form-group">

              <label>
                {t("category")}
              </label>

              <select
                name="category"
                className="edit-input"
                value={
                  editingProduct.category
                }
                onChange={handleEditChange}
                disabled={updating}
              >
                <option value="">
                  {t("selectCategory")}
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {getCategoryLabel(
                      category
                    )}
                  </option>
                ))}
              </select>

            </div>

            {/* Price */}

            <div className="edit-form-group">

              <label>
                {t("price")}
              </label>

              <div className="price-input-wrapper">

                <span>₹</span>

                <input
                  type="number"
                  name="price"
                  min="0.01"
                  step="0.01"
                  className="edit-input price-input"
                  placeholder={t(
                    "enterPrice"
                  )}
                  value={
                    editingProduct.price
                  }
                  onChange={handleEditChange}
                  disabled={updating}
                />

              </div>

            </div>

            {/* Quantity */}

            <div className="edit-form-group">

              <label>
                {t("quantity")}
              </label>

              <input
                type="number"
                name="quantity"
                min="0.01"
                step="0.01"
                className="edit-input"
                placeholder={t(
                  "enterQuantity"
                )}
                value={
                  editingProduct.quantity
                }
                onChange={handleEditChange}
                disabled={updating}
              />

            </div>

            {/* Unit */}

            <div className="edit-form-group">

              <label>
                {t("unit")}
              </label>

              <select
                name="unit"
                className="edit-input"
                value={
                  editingProduct.unit
                }
                onChange={handleEditChange}
                disabled={updating}
              >
                {units.map((unit) => (
                  <option
                    key={unit}
                    value={unit}
                  >
                    {getUnitLabel(unit)}
                  </option>
                ))}
              </select>

            </div>

            {/* Description */}

            <div className="edit-form-group full-width">

              <label>
                {t("description")}
              </label>

              <textarea
                name="description"
                rows="4"
                className="edit-input edit-textarea"
                placeholder={t(
                  "enterProductDescription"
                )}
                value={
                  editingProduct.description
                }
                onChange={handleEditChange}
                disabled={updating}
              />

            </div>

          </div>

          {/* Edit Actions */}

          <div className="edit-product-actions">

            <button
              type="button"
              className="update-product-btn"
              onClick={updateProduct}
              disabled={updating}
            >
              {updating
                ? t("loading")
                : `✓ ${t("update")}`}
            </button>

            <button
              type="button"
              className="cancel-product-btn"
              onClick={cancelEdit}
              disabled={updating}
            >
              {t("cancel")}
            </button>

          </div>

        </section>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="products-loading-box">

          <div className="products-spinner"></div>

          <p>
            {t("loadingFreshProducts")}
          </p>

        </div>
      )}

      {/* =================================================
          EMPTY PRODUCTS
      ================================================= */}

      {!loading &&
        products.length === 0 && (
          <div className="no-products-box">

            <div className="no-products-icon">
              📦
            </div>

            <h2>
              {t("noProductsYet")}
            </h2>

            <p>
              {t(
                "farmersNoProducts"
              )}
            </p>

            <div className="empty-navigation">

              <Link
                to="/farmer"
                className="empty-dashboard-btn"
              >
                📊 {t("backToDashboard")}
              </Link>

              <Link
                to="/"
                className="empty-home-btn"
              >
                🏠 {t("goToHome")}
              </Link>

            </div>

          </div>
        )}

      {/* =================================================
          PRODUCT COUNT
      ================================================= */}

      {!loading &&
        products.length > 0 && (
          <div className="product-count">

            <strong>
              {products.length}
            </strong>

            <span>
              {" "}
              {t("productCountFound")}
            </span>

          </div>
        )}

      {/* =================================================
          PRODUCTS GRID
      ================================================= */}

      {!loading &&
        products.length > 0 && (
          <div className="my-products-grid">

            {products.map((product) => {

              const imageUrl =
                getImageUrl(
                  product.image
                );

              return (
                <article
                  className="my-product-card"
                  key={product._id}
                >

                  {/* IMAGE */}

                  <div className="my-product-image">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          product.productName ||
                          t("farmProduct")
                        }
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          const fallback =
                            e.currentTarget
                              .nextElementSibling;

                          if (fallback) {
                            fallback.style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="my-product-image-fallback"
                      style={{
                        display: imageUrl
                          ? "none"
                          : "flex",
                      }}
                    >
                      🌾
                    </div>

                  </div>

                  {/* PRODUCT BODY */}

                  <div className="my-product-body">

                    <div className="product-top-row">

                      <span className="my-product-category">
                        {getCategoryLabel(
                          product.category
                        )}
                      </span>

                    </div>

                    <h2>
                      {product.productName ||
                        t("farmProduct")}
                    </h2>

                    <p className="my-product-description">
                      {product.description ||
                        t(
                          "freshQualityProduct"
                        )}
                    </p>

                    {/* DETAILS */}

                    <div className="my-product-details">

                      <div className="product-detail-item">

                        <span>
                          {t("price")}
                        </span>

                        <strong>
                          ₹{product.price}
                        </strong>

                      </div>

                      <div className="product-detail-item">

                        <span>
                          {t("available")}
                        </span>

                        <strong>
                          {displayQuantity(
                            product
                          )}
                        </strong>

                      </div>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="my-product-actions">

                      <button
                        type="button"
                        className="edit-product-btn"
                        onClick={() =>
                          editProduct(product)
                        }
                      >
                        ✏️ {t("update")}
                      </button>

                      <button
                        type="button"
                        className="delete-product-btn"
                        onClick={() =>
                          deleteProduct(
                            product._id
                          )
                        }
                      >
                        🗑️ {t("delete")}
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

    </div>
  );
}

export default MyProducts;