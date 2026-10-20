import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../CSS/AdminProducts.css";
import { useLanguage } from "../context/LanguageContext";

function AdminProducts() {
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);

  // ==========================
  // Fetch All Products
  // ==========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      if (!response.ok) {
        throw new Error(t("failedToFetchProducts"));
      }

      const data = await response.json();

      setProducts(data.products || data || []);
    } catch (error) {
      console.error("Admin Products Error:", error);
      setError(t("unableToLoadProducts"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================
  // Delete Product
  // ==========================

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      t("confirmDeleteProduct")
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToDeleteProduct")
        );
      }

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== productId
        )
      );

      alert(
        data.message || t("productDeletedSuccessfully")
      );
    } catch (error) {
      console.error("Delete Product Error:", error);

      alert(
        error.message || t("unableToDeleteProduct")
      );
    }
  };

  // ==========================
  // Start Editing
  // ==========================

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
    });
  };

  // ==========================
  // Handle Edit Input
  // ==========================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  };

  // ==========================
  // Update Product
  // ==========================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingProduct) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: editingProduct.productName,
            category: editingProduct.category,
            price: Number(editingProduct.price),
            quantity: Number(editingProduct.quantity),
            description: editingProduct.description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToUpdateProduct")
        );
      }

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product._id === editingProduct._id
            ? data.product
            : product
        )
      );

      setEditingProduct(null);

      alert(
        data.message || t("productUpdatedSuccessfully")
      );
    } catch (error) {
      console.error("Update Product Error:", error);

      alert(
        error.message || t("unableToUpdateProduct")
      );
    }
  };

  // ==========================
  // Cancel Edit
  // ==========================

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // ==========================
  // Translate Category
  // ==========================

  const getCategoryLabel = (category) => {
    const normalizedCategory = String(category || "")
      .trim()
      .toLowerCase();

    if (
      normalizedCategory === "vegetable" ||
      normalizedCategory === "vegetables"
    ) {
      return t("vegetables");
    }

    if (
      normalizedCategory === "fruit" ||
      normalizedCategory === "fruits"
    ) {
      return t("fruits");
    }

    if (normalizedCategory === "grain" || normalizedCategory === "grains") {
      return t("grains");
    }

    if (normalizedCategory === "pulse" || normalizedCategory === "pulses") {
      return t("pulses");
    }

    if (normalizedCategory === "dairy") {
      return t("dairy");
    }

    if (normalizedCategory === "spice" || normalizedCategory === "spices") {
      return t("spices");
    }

    if (normalizedCategory === "other") {
      return t("other");
    }

    return category || t("notAvailable");
  };

  return (
    <div className="admin-products-page">
      {/* ==========================
          Header
      ========================== */}

      <div className="admin-products-header">
        <div>
          <h1>
            🥕 {t("productManagement")}
          </h1>

          <p>
            {t("productManagementDescription")}
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
          Error
      ========================== */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* ==========================
          Edit Product
      ========================== */}

      {editingProduct && (
        <div className="admin-edit-product">
          <h2>
            ✏️ {t("editProduct")}
          </h2>

          <form
            className="admin-edit-form"
            onSubmit={handleUpdate}
          >
            {/* Product Name */}

            <div className="admin-form-group">
              <label htmlFor="productName">
                {t("productName")}
              </label>

              <input
                id="productName"
                type="text"
                name="productName"
                value={editingProduct.productName || ""}
                onChange={handleEditChange}
                required
              />
            </div>

            {/* Category */}

            <div className="admin-form-group">
              <label htmlFor="category">
                {t("category")}
              </label>

              <input
                id="category"
                type="text"
                name="category"
                value={editingProduct.category || ""}
                onChange={handleEditChange}
                required
              />
            </div>

            {/* Price */}

            <div className="admin-form-group">
              <label htmlFor="price">
                {t("priceRupees")}
              </label>

              <input
                id="price"
                type="number"
                name="price"
                value={editingProduct.price}
                onChange={handleEditChange}
                min="0"
                required
              />
            </div>

            {/* Quantity */}

            <div className="admin-form-group">
              <label htmlFor="quantity">
                {t("quantity")}
              </label>

              <input
                id="quantity"
                type="number"
                name="quantity"
                value={editingProduct.quantity}
                onChange={handleEditChange}
                min="0"
                required
              />
            </div>

            {/* Description */}

            <div className="admin-form-group full-width">
              <label htmlFor="description">
                {t("description")}
              </label>

              <textarea
                id="description"
                name="description"
                value={editingProduct.description || ""}
                onChange={handleEditChange}
                placeholder={t("enterProductDescription")}
              />
            </div>

            {/* Buttons */}

            <div className="admin-edit-actions">
              <button
                type="submit"
                className="admin-save-btn"
              >
                💾 {t("saveChanges")}
              </button>

              <button
                type="button"
                className="admin-cancel-btn"
                onClick={handleCancelEdit}
              >
                ✕ {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================
          Products Table
      ========================== */}

      {loading ? (
        <div className="admin-loading">
          {t("loadingProducts")}
        </div>
      ) : products.length === 0 ? (
        <div className="admin-empty">
          {t("noProductsFound")}
        </div>
      ) : (
        <div className="admin-products-table-container">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t("image")}</th>
                <th>{t("product")}</th>
                <th>{t("category")}</th>
                <th>{t("farmerId")}</th>
                <th>{t("price")}</th>
                <th>{t("quantity")}</th>
                <th>{t("description")}</th>
                <th>{t("action")}</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  {/* Number */}

                  <td>
                    {index + 1}
                  </td>

                  {/* Image */}

                  <td className="product-image-cell">
                    <div className="admin-product-image-box">
                      {product.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${product.image}`}
                          alt={
                            product.productName ||
                            t("product")
                          }
                          className="admin-product-image"
                        />
                      ) : (
                        <div className="admin-no-image">
                          🥕
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Product */}

                  <td className="admin-product-name">
                    <strong>
                      {product.productName}
                    </strong>
                  </td>

                  {/* Category */}

                  <td>
                    {getCategoryLabel(product.category)}
                  </td>

                  {/* Farmer ID */}

                  <td className="farmer-id-cell">
                    <strong>
                      {product.farmerId?._id ||
                        product.farmerId ||
                        t("notAvailable")}
                    </strong>
                  </td>

                  {/* Price */}

                  <td>
                    ₹{product.price}
                  </td>

                  {/* Quantity */}

                  <td>
                    <span
                      className={
                        product.quantity <= 0
                          ? "stock-out"
                          : "stock-available"
                      }
                    >
                      {product.quantity}
                    </span>
                  </td>

                  {/* Description */}

                  <td className="description-cell">
                    {product.description ||
                      t("noDescription")}
                  </td>

                  {/* Actions */}

                  <td>
                    <div className="product-action-buttons">
                      <button
                        type="button"
                        className="admin-edit-btn"
                        onClick={() =>
                          handleEdit(product)
                        }
                      >
                        ✏️ {t("edit")}
                      </button>

                      <button
                        type="button"
                        className="admin-delete-btn"
                        onClick={() =>
                          handleDelete(product._id)
                        }
                      >
                        🗑️ {t("delete")}
                      </button>
                    </div>
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

export default AdminProducts;