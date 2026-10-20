import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/Products.css";
import { useLanguage } from "../context/LanguageContext";

function Products() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data);
      setError("");
    } catch (error) {
      console.error("Products Error:", error);
      setError(t("unableToLoadProducts"));
    } finally {
      setLoading(false);
    }
  };

  // Quantity Change
  const changeQuantity = (productId, value, maxQuantity) => {
    let newQuantity = Number(value);

    if (newQuantity < 1 || isNaN(newQuantity)) {
      newQuantity = 1;
    }

    if (newQuantity > maxQuantity) {
      newQuantity = maxQuantity;
    }

    setQuantities((previous) => ({
      ...previous,
      [productId]: newQuantity,
    }));
  };

  // Add Product To Cart
  const addToCart = (product) => {
    try {
      // Check Login
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert(t("loginToBuy"));
        navigate("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user || !user.id) {
        alert(t("loginToBuy"));
        navigate("/login");
        return;
      }

      // Check Customer Role
      if (user.role !== "customer") {
        alert(t("onlyCustomersCanAddProducts"));
        return;
      }

      // Get Selected Quantity
      const quantity =
        Number(quantities[product._id]) || 1;

      // Check Stock
      const availableQuantity =
        Number(product.quantity) || 0;

      if (availableQuantity <= 0) {
        alert(t("outOfStock"));
        return;
      }

      if (quantity > availableQuantity) {
        alert(t("onlyAvailable"));
        return;
      }

      // Load Existing Cart
      let cart = [];

      try {
        cart =
          JSON.parse(
            localStorage.getItem("cart")
          ) || [];
      } catch (error) {
        console.error("Cart Load Error:", error);
        cart = [];
      }

      // Check If Product Already Exists
      const existingProductIndex =
        cart.findIndex(
          (item) => item._id === product._id
        );

      if (existingProductIndex !== -1) {
        const existingProduct =
          cart[existingProductIndex];

        const existingQuantity =
          Number(existingProduct.cartQuantity) || 1;

        const newTotalQuantity =
          existingQuantity + quantity;

        // Check Available Stock
        if (newTotalQuantity > availableQuantity) {
          alert(t("onlyAvailable"));
          return;
        }

        // Update Existing Product Quantity
        cart[existingProductIndex] = {
          ...existingProduct,
          cartQuantity: newTotalQuantity,
        };
      } else {
        // Add New Product
        cart.push({
          ...product,
          cartQuantity: quantity,
        });
      }

      // Save Cart
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      // Reset Quantity
      setQuantities((previous) => ({
        ...previous,
        [product._id]: 1,
      }));

      // Success Message
      alert(
        `${product.productName} - ${t("productAddedToCart")}`
      );

      // Go To Cart
      navigate("/cart");
    } catch (error) {
      console.error("Add To Cart Error:", error);

      alert(t("unableToLoadProducts"));
    }
  };

  // Filter Products
  const filteredProducts = products
    .filter((product) =>
      product.productName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((product) =>
      category === "All"
        ? true
        : product.category === category
    );

  return (
    <div className="products-page">

      {/* Header */}
      <div className="products-header">
        <div>
          <h1>
            🛒 {t("browseAllProducts")}
          </h1>

          <p>
            {t("freshFarmProducts")}
          </p>
        </div>

        <Link
          to="/customer"
          className="back-customer-btn"
        >
          ← {t("dashboard")}
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="products-filters">

        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder={t("searchProducts")}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="All">
            {t("all")} {t("category")}
          </option>

          <option value="Vegetables">
            {t("vegetables")}
          </option>

          <option value="Fruits">
            {t("fruits")}
          </option>

          <option value="Grains">
            {t("grains")}
          </option>

          <option value="Dairy">
            {t("dairy")}
          </option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="products-loading">
          {t("loadingFreshProducts")}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="products-empty">

          <div className="empty-icon">
            🥕
          </div>

          <h3>
            {t("productNotFound")}
          </h3>

          <p>
            {t("trySearchingAnother")}
          </p>

        </div>
      ) : (
        /* Products Grid */
        <div className="products-grid">

          {filteredProducts.map((product) => {
            const selectedQuantity =
              quantities[product._id] || 1;

            const isOutOfStock =
              product.quantity <= 0;

            return (
              <div
                className="product-card"
                key={product._id}
              >

                {/* Product Image */}
                <div className="product-image-container">

                  {product.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.productName}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-product-image">
                      🥕
                    </div>
                  )}

                  {isOutOfStock && (
                    <span className="out-of-stock">
                      {t("outOfStock")}
                    </span>
                  )}

                </div>

                {/* Product Details */}
                <div className="product-details">

                  <span className="product-category">
                    {product.category}
                  </span>

                  <h2>
                    {product.productName}
                  </h2>

                  <p className="product-description">
                    {product.description ||
                      t("freshQualityProduct")}
                  </p>

                  {/* Price */}
                  <div className="product-price">
                    ₹{product.price}
                  </div>

                  {/* Stock */}
                  <div className="product-stock">
                    {t("stock")}:{" "}
                    <strong>
                      {product.quantity}
                    </strong>
                  </div>

                  {/* Quantity */}
                  {!isOutOfStock && (
                    <div className="quantity-section">

                      <label>
                        {t("quantity")}
                      </label>

                      <input
                        type="number"
                        min="1"
                        max={product.quantity}
                        value={selectedQuantity}
                        onChange={(e) =>
                          changeQuantity(
                            product._id,
                            e.target.value,
                            product.quantity
                          )
                        }
                      />

                    </div>
                  )}

                  {/* Total Price */}
                  {!isOutOfStock && (
                    <div className="product-total">

                      {t("total")}:{" "}

                      <strong>
                        ₹
                        {product.price *
                          selectedQuantity}
                      </strong>

                    </div>
                  )}

                  {/* Add To Cart */}
                  <button
                    className="buy-product-btn"
                    disabled={isOutOfStock}
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    {isOutOfStock
                      ? t("outOfStock")
                      : `🛒 ${t("addToCart")}`}
                  </button>

                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Products;