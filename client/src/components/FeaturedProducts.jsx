import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET ALL PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://farmconnect-backend-n6mx.onrender.com/api/products");

      console.log("Home Products:", response.data);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load products."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const getProductImage = (product) => {
    if (!product.image) {
      return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80";
    }

    // If backend already returns a complete URL
    if (
      product.image.startsWith("http://") ||
      product.image.startsWith("https://")
    ) {
      return product.image;
    }

    // Uploaded image from FarmConnect server
    return `https://farmconnect-backend-n6mx.onrender.com/uploads/${product.image}`;
  };


  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = (product) => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    // ---------------------------------------------------
    // Check Login
    // ---------------------------------------------------

    if (!user) {
      alert(
        "Please login as a customer to add products to cart."
      );

      return;
    }


    // ---------------------------------------------------
    // Check Customer Role
    // ---------------------------------------------------

    if (user.role !== "customer") {
      alert(
        "Only customers can add products to cart."
      );

      return;
    }


    // ---------------------------------------------------
    // Get Existing Cart
    // ---------------------------------------------------

    const existingCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];


    // ---------------------------------------------------
    // Check Existing Product
    // ---------------------------------------------------

    const existingProductIndex =
      existingCart.findIndex(
        (item) =>
          item.productId === product._id
      );


    // ---------------------------------------------------
    // Increase Quantity
    // ---------------------------------------------------

    if (existingProductIndex !== -1) {

      existingCart[
        existingProductIndex
      ].cartQuantity += 1;

    } else {

      // -------------------------------------------------
      // Add New Product
      // -------------------------------------------------

      existingCart.push({
        productId: product._id,

        productName:
          product.productName,

        category:
          product.category,

        price:
          Number(product.price) || 0,

        farmerId:
          product.farmerId,

        quantity:
          Number(product.quantity) || 0,

        cartQuantity: 1,

        description:
          product.description || "",

        image:
          getProductImage(product),
      });
    }


    // ---------------------------------------------------
    // Save Cart
    // ---------------------------------------------------

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );


    alert(
      `${product.productName} added to cart!`
    );
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="featured-products">

        <div className="container">

          <div className="text-center py-5">

            <div
              className="spinner-border text-success"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted mt-3">
              Loading fresh products...
            </p>

          </div>

        </div>

      </section>
    );
  }


  // =====================================================
  // MAIN
  // =====================================================

  return (
    <section className="featured-products">

      <div className="container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h2 className="mb-1">
              Fresh Products
            </h2>

            <p className="text-muted mb-0">
              Fresh products directly from farmers
            </p>

          </div>


          <Link
            to="/products"
            className="text-success fw-bold text-decoration-none"
          >
            View All →
          </Link>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="alert alert-warning">
            {error}
          </div>
        )}


        {/* =================================================
            NO PRODUCTS
        ================================================= */}

        {!error && products.length === 0 && (

          <div className="text-center py-5">

            <div
              style={{
                fontSize: "55px",
                marginBottom: "15px",
              }}
            >
              🌾
            </div>

            <h4 className="text-success">
              No products available
            </h4>

            <p className="text-muted">
              Farmers haven't added any products yet.
            </p>

          </div>
        )}


        {/* =================================================
            PRODUCTS
        ================================================= */}

        {products.length > 0 && (

          <div className="row">

            {products.slice(0, 8).map((product) => (

              <div
                className="col-xl-3 col-lg-4 col-md-6 mb-4"
                key={product._id}
              >

                <div className="product-card h-100">

                  {/* =========================================
                      IMAGE
                  ========================================= */}

                  <div className="product-image">

                    <img
                      src={getProductImage(product)}
                      alt={product.productName}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80";
                      }}
                    />

                  </div>


                  {/* =========================================
                      BODY
                  ========================================= */}

                  <div className="product-body">

                    <h5>
                      {product.productName}
                    </h5>


                    {/* CATEGORY */}

                    {product.category && (
                      <span className="badge bg-light text-success mb-2">
                        {product.category}
                      </span>
                    )}


                    {/* FARMER */}

                    <p className="text-muted mb-2">
                      👨‍🌾 Direct from farmer
                    </p>


                    {/* PRICE */}

                    <h4 className="price">
                      ₹{product.price}
                    </h4>


                    <small className="text-muted">
                      per kg
                    </small>


                    {/* QUANTITY */}

                    <p className="text-muted mt-2 mb-2">

                      Available:{" "}

                      <strong>
                        {product.quantity}
                      </strong>

                    </p>


                    {/* DESCRIPTION */}

                    {product.description && (
                      <p className="small text-muted">

                        {product.description.length > 70
                          ? `${product.description.substring(
                            0,
                            70
                          )}...`
                          : product.description}

                      </p>
                    )}


                    {/* =======================================
                        ADD TO CART
                    ======================================= */}

                    <button
                      type="button"
                      className="btn btn-success w-100 mt-2"
                      onClick={() =>
                        handleAddToCart(product)
                      }
                    >
                      🛒 Add to Cart
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </section>
  );
}

export default FeaturedProducts;