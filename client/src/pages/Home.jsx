import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import WhyChoose from "../components/WhyChoose";
import Footer from "../components/Footer";

import "../css/Home.css";
import hero from "../assets/hero.png";

import { useLanguage } from "../context/LanguageContext";

function Home() {
  // =====================================================
  // LANGUAGE
  // =====================================================
  const { t } = useLanguage();

  // =====================================================
  // USER
  // =====================================================
  const [user, setUser] = useState(null);

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
        console.error("Error reading user:", error);
        setUser(null);
      }
    };

    loadUser();

    // Update Home when login/logout happens
    window.addEventListener("farmconnect-login", loadUser);
    window.addEventListener("farmconnect-logout", loadUser);

    return () => {
      window.removeEventListener("farmconnect-login", loadUser);
      window.removeEventListener("farmconnect-logout", loadUser);
    };
  }, []);

  const isCustomer = user?.role === "customer";

  // =====================================================
  // PRODUCTS
  // =====================================================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://farmconnect-backend-n6mx.onrender.com/api/products"
      );

      setProducts(response.data || []);
    } catch (error) {
      console.error("Product fetch error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PRODUCT IMAGE URL
  // =====================================================
  const getProductImage = (image) => {
    if (!image) {
      return null;
    }

    // Already a complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Remove starting slash
    const imagePath = image.replace(/^\/+/, "");

    // Database stores uploads/filename.jpg
    if (imagePath.startsWith("uploads/")) {
      return `https://farmconnect-backend-n6mx.onrender.com/${imagePath}`;
    }

    // Database stores only filename.jpg
    return `https://farmconnect-backend-n6mx.onrender.com/uploads/${imagePath}`;
  };

  // =====================================================
  // ADD PRODUCT TO CART
  // =====================================================
  const addToCart = (product) => {
    try {
      const existingCart =
        JSON.parse(localStorage.getItem("cart")) || [];

      const existingProductIndex = existingCart.findIndex(
        (item) => item._id === product._id
      );

      // =================================================
      // PRODUCT ALREADY IN CART
      // =================================================
      if (existingProductIndex !== -1) {
        const updatedCart = [...existingCart];

        const currentQuantity =
          updatedCart[existingProductIndex].cartQuantity || 1;

        // Don't exceed available stock
        if (
          product.quantity &&
          currentQuantity >= Number(product.quantity)
        ) {
          alert(
            `${t("outOfStock")}: ${product.productName}`
          );
          return;
        }

        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          cartQuantity: currentQuantity + 1,
        };

        localStorage.setItem(
          "cart",
          JSON.stringify(updatedCart)
        );

        alert(
          `${product.productName} ${t("quantityIncreased")}`
        );

        return;
      }

      // =================================================
      // NEW PRODUCT
      // =================================================
      const cartProduct = {
        ...product,
        cartQuantity: 1,
      };

      const updatedCart = [
        ...existingCart,
        cartProduct,
      ];

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      alert(
        `${product.productName} ${t("productAddedToCart")}`
      );
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(t("orderFailed"));
    }
  };

  // =====================================================
  // SEARCH PRODUCTS
  // =====================================================
  const filteredProducts = useMemo(() => {
    if (!search.trim()) {
      return products;
    }

    const searchText = search.toLowerCase().trim();

    return products.filter((product) => {
      const productName =
        product.productName?.toLowerCase() || "";

      const category =
        product.category?.toLowerCase() || "";

      const description =
        product.description?.toLowerCase() || "";

      return (
        productName.includes(searchText) ||
        category.includes(searchText) ||
        description.includes(searchText)
      );
    });
  }, [products, search]);

  // =====================================================
  // HOME PAGE
  //
  // Customer, Farmer and Admin all see Home.
  // Dashboard is opened separately from Navbar.
  // =====================================================
  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}
      <Navbar />

      {/* =================================================
          HERO SECTION
      ================================================= */}
      <section className="hero">
        <div className="hero-container">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}
          <div className="hero-left">

            {/* USER WELCOME */}
            {user && (
              <div className="customer-welcome">
                👋 {t("welcomeToFarmConnect")}

                {user.name && (
                  <>
                    ,{" "}
                    <strong>{user.name}</strong>
                  </>
                )}
              </div>
            )}

            {/* HERO BADGE */}
            <div className="hero-badge">
              🌱 {t("freshFarmProduce")}
            </div>

            {/* HERO TITLE */}
            <h1>
              {t("freshFarmProduce")}
              <br />

              <span>
                {t("directCommunication")}
              </span>
            </h1>

            {/* HERO DESCRIPTION */}
            <p>
              {t("talkDirectlyWithFarmers")}.{" "}
              {t("fairPrices")}.{" "}
              {t("trustedFarmers")}.
            </p>

            {/* HERO BUTTONS */}
            <div className="hero-buttons">
              <a
                href="#browse-products"
                className="hero-btn primary-btn"
              >
                🛒 {t("browseProducts")}
              </a>

              <Link
                to="/register"
                className="hero-btn secondary-btn"
              >
                👨‍🌾 {t("register")}
              </Link>
            </div>

            {/* =================================================
                FEATURES
            ================================================= */}
            <div className="features">

              {/* FRESH PRODUCE */}
              <div className="feature">
                <div className="feature-icon">
                  🌾
                </div>

                <h5>
                  {t("freshFarmProduce")}
                </h5>

                <p>
                  {t("farmToYourHome")}
                </p>
              </div>

              {/* FAIR PRICES */}
              <div className="feature">
                <div className="feature-icon">
                  💰
                </div>

                <h5>
                  {t("fairPrices")}
                </h5>

                <p>
                  {t("noMiddlemen")}
                </p>
              </div>

              {/* DELIVERY */}
              <div className="feature">
                <div className="feature-icon">
                  🚚
                </div>

                <h5>
                  {t("freshDelivery")}
                </h5>

                <p>
                  {t("farmToYourHome")}
                </p>
              </div>

              {/* TRUSTED FARMERS */}
              <div className="feature">
                <div className="feature-icon">
                  🤝
                </div>

                <h5>
                  {t("trustedFarmers")}
                </h5>

                <p>
                  {t("verifiedSellers")}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}
          <div className="hero-right">
            <div className="hero-image-wrapper">

              <img
                src={hero}
                alt={t("freshFarmProduce")}
                className="hero-image"
              />

              {/* =================================================
                  IMAGE BADGE
              ================================================= */}
              <div className="image-badge">
                <span>
                  🌿
                </span>

                <div>
                  <strong>
                    {t("freshFarmProduce")}
                  </strong>

                  <small>
                    {t("directCommunication")}
                  </small>
                </div>
              </div>

              {/* =================================================
                  HOW FARMCONNECT WORKS
              ================================================= */}
              <div className="work-card">

                <div className="work-header">
                  <span className="work-icon">
                    🚜
                  </span>

                  <div>
                    <h3>
                      {t("howFarmConnectWorks")}
                    </h3>

                    <p>
                      {t("directCommunication")}
                    </p>
                  </div>
                </div>

                {/* STEP 1 */}
                <div className="step">
                  <span>1</span>

                  <div>
                    <h5>
                      {t("farmersListProducts")}
                    </h5>

                    <p>
                      {t("addFreshProducts")}
                    </p>
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="step">
                  <span>2</span>

                  <div>
                    <h5>
                      {t("customersBrowse")}
                    </h5>

                    <p>
                      {t("searchAndCompare")}
                    </p>
                  </div>
                </div>

                {/* STEP 3 */}
                <div className="step">
                  <span>3</span>

                  <div>
                    <h5>
                      {t("placeOrders")}
                    </h5>

                    <p>
                      {t("orderDirectly")}
                    </p>
                  </div>
                </div>

                {/* STEP 4 */}
                <div className="step">
                  <span>4</span>

                  <div>
                    <h5>
                      {t("freshDelivery")}
                    </h5>

                    <p>
                      {t("deliveredFresh")}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          PRODUCT BROWSING
      ===================================================== */}
      <section
        className="browse-products-section"
        id="browse-products"
      >
        <div className="browse-products-container">

          {/* =================================================
              HEADER
          ================================================= */}
          <div className="browse-header">

            <div>
              <span className="section-badge">
                🌱 {t("freshFarmProduce")}
              </span>

              <h2>
                {t("browseProducts")}
              </h2>

              <p>
                {t("talkDirectlyWithFarmers")}
              </p>
            </div>

            {/* SEARCH */}
            <div className="home-product-search">
              <span>
                🔍
              </span>

              <input
                type="text"
                placeholder={t("searchProducts")}
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

          </div>

          {/* =================================================
              PRODUCT COUNT
          ================================================= */}
          {!loading && (
            <div className="product-result-info">
              {search
                ? `${filteredProducts.length} ${t(
                  "products"
                )}`
                : `${products.length} ${t(
                  "products"
                )}`}
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}
          {loading && (
            <div className="products-loading">
              <div
                className="spinner-border text-success"
                role="status"
              />

              <p>
                {t("loading")}
              </p>
            </div>
          )}

          {/* =================================================
              PRODUCTS
          ================================================= */}
          {!loading &&
            filteredProducts.length > 0 && (
              <div className="home-products-grid">

                {filteredProducts.map((product) => {
                  const imageUrl = getProductImage(
                    product.image
                  );

                  return (
                    <div
                      className="home-product-card"
                      key={product._id}
                    >

                      {/* =================================================
                          PRODUCT IMAGE
                      ================================================= */}
                      <div className="home-product-image">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              product.productName ||
                              t("products")
                            }
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";

                              if (
                                e.currentTarget
                                  .nextElementSibling
                              ) {
                                e.currentTarget
                                  .nextElementSibling
                                  .style.display =
                                  "flex";
                              }
                            }}
                          />
                        ) : null}

                        {/* IMAGE FALLBACK */}
                        <div
                          className="product-placeholder"
                          style={{
                            display: imageUrl
                              ? "none"
                              : "flex",
                          }}
                        >
                          🌾
                        </div>
                      </div>

                      {/* =================================================
                          PRODUCT BODY
                      ================================================= */}
                      <div className="home-product-body">

                        <span className="product-category">
                          {product.category ||
                            t("products")}
                        </span>

                        <h3>
                          {product.productName}
                        </h3>

                        <p className="product-description">
                          {product.description ||
                            t("freshFarmProduce")}
                        </p>

                        {/* =================================================
                            PRODUCT INFORMATION
                        ================================================= */}
                        <div className="product-info-row">

                          {/* PRICE */}
                          <div>
                            <span className="price-label">
                              {t("price")}
                            </span>

                            <strong className="home-product-price">
                              ₹{product.price}
                            </strong>
                          </div>

                          {/* AVAILABLE STOCK */}
                          <div className="quantity-info">
                            <span>
                              {t("stock")}
                            </span>

                            <strong>
                              {product.quantity}
                            </strong>
                          </div>

                        </div>

                        {/* =================================================
                            ACTION
                        ================================================= */}
                        <div className="product-card-actions">

                          {isCustomer ? (
                            <button
                              type="button"
                              className="home-view-product-btn"
                              onClick={() =>
                                addToCart(product)
                              }
                              disabled={
                                Number(
                                  product.quantity
                                ) <= 0
                              }
                            >
                              {Number(
                                product.quantity
                              ) <= 0
                                ? t("outOfStock")
                                : `🛒 ${t(
                                  "addToCart"
                                )}`}
                            </button>
                          ) : (
                            <Link
                              to="/login"
                              className="home-view-product-btn"
                            >
                              🛒 {t("loginToBuy")}
                            </Link>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}

          {/* =================================================
              NO PRODUCTS
          ================================================= */}
          {!loading &&
            filteredProducts.length === 0 && (
              <div className="no-products">

                <div className="no-products-icon">
                  🌾
                </div>

                <h3>
                  {t("productNotFound")}
                </h3>

                <p>
                  {search
                    ? t("tryAnotherSearch")
                    : t("noProductsYet")}
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="clear-search-btn"
                  >
                    {t("clearSearch")}
                  </button>
                )}

              </div>
            )}

        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <Categories />

      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}
      <WhyChoose />

      {/* =====================================================
          FOOTER
      ===================================================== */}

    </>
  );
}

export default Home;