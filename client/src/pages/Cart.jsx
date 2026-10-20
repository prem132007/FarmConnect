import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

function Cart() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // Load User
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    }
  }, []);

  // Load Cart
  const loadCart = () => {
    try {
      const storedCart = localStorage.getItem("cart");

      if (!storedCart) {
        setCart([]);
        return;
      }

      const parsedCart = JSON.parse(storedCart);

      if (Array.isArray(parsedCart)) {
        setCart(parsedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Remove Product
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(
      (item) => item._id !== productId
    );

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);
  };

  // Increase Quantity
  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item._id !== productId) {
        return item;
      }

      const currentQuantity =
        Number(item.cartQuantity) || 1;

      const availableQuantity =
        Number(item.quantity) || 0;

      if (availableQuantity <= 0) {
        alert(t("outOfStock"));
        return item;
      }

      if (currentQuantity >= availableQuantity) {
        alert(t("onlyAvailable"));
        return item;
      }

      return {
        ...item,
        cartQuantity: currentQuantity + 1,
      };
    });

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);
  };

  // Decrease Quantity
  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item._id !== productId) {
        return item;
      }

      const currentQuantity =
        Number(item.cartQuantity) || 1;

      if (currentQuantity <= 1) {
        return item;
      }

      return {
        ...item,
        cartQuantity: currentQuantity - 1,
      };
    });

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);
  };

  // Product Image
  const getProductImage = (image) => {
    if (!image) {
      return null;
    }

    // Already complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Remove starting slash
    const cleanImage = image.replace(/^\/+/, "");

    // If database stores uploads/filename.jpg
    if (cleanImage.startsWith("uploads/")) {
      return `http://localhost:5000/${cleanImage}`;
    }

    // If database stores only filename.jpg
    return `http://localhost:5000/uploads/${cleanImage}`;
  };

  // Total Amount
  const totalAmount = cart.reduce(
    (total, item) => {
      const price = Number(item.price) || 0;

      const quantity =
        Number(item.cartQuantity) || 1;

      return total + price * quantity;
    },
    0
  );

  // Checkout
  const handleCheckout = () => {
    // Check Login
    if (!user) {
      alert(t("loginToBuy"));
      navigate("/login");
      return;
    }

    // Check Customer Role
    if (user.role !== "customer") {
      alert(t("loginToBuy"));
      return;
    }

    // Check Cart
    if (cart.length === 0) {
      alert(t("yourCartIsEmpty"));
      return;
    }

    // Check Cart Quantities
    const invalidProduct = cart.find((item) => {
      const quantity =
        Number(item.cartQuantity) || 0;

      const availableQuantity =
        Number(item.quantity) || 0;

      return (
        quantity <= 0 ||
        availableQuantity <= 0 ||
        quantity > availableQuantity
      );
    });

    if (invalidProduct) {
      alert(t("onlyAvailable"));
      return;
    }

    navigate("/checkout");
  };

  // Empty Cart
  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <div
          style={{
            minHeight: "calc(100vh - 80px)",
            background: "#f7faf7",
            padding: "60px 20px",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
              background: "#ffffff",
              padding: "50px",
              borderRadius: "15px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "70px",
                marginBottom: "20px",
              }}
            >
              🛒
            </div>

            <h2>
              {t("yourCartIsEmpty")}
            </h2>

            <p
              style={{
                color: "#666",
                marginBottom: "30px",
              }}
            >
              {t("continueShopping")}
            </p>

            <Link
              to="/products"
              style={{
                display: "inline-block",
                padding: "12px 25px",
                background: "#198754",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "8px",
              }}
            >
              🌾 {t("browseProducts")}
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Cart Page
  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 80px)",
          background: "#f7faf7",
          padding: "30px 20px 60px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <div>
              <h1>🛒 {t("myCart")}</h1>

              <p style={{ color: "#666" }}>
                {t("cartTitle")}
              </p>
            </div>

            <Link
              to="/products"
              style={{
                padding: "10px 18px",
                border: "1px solid #198754",
                color: "#198754",
                textDecoration: "none",
                borderRadius: "8px",
              }}
            >
              ← {t("continueShopping")}
            </Link>
          </div>

          {/* Cart Products */}
          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            {cart.map((item) => {
              const imageUrl = getProductImage(
                item.image
              );

              const itemQuantity =
                Number(item.cartQuantity) || 1;

              const itemTotal =
                (Number(item.price) || 0) *
                itemQuantity;

              const availableQuantity =
                Number(item.quantity) || 0;

              return (
                <div
                  key={item._id}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    boxShadow:
                      "0 4px 15px rgba(0,0,0,0.07)",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: "110px",
                      height: "110px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "#eef5ee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          item.productName ||
                          t("farmProduct")
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          const fallback =
                            e.currentTarget.parentElement.querySelector(
                              ".cart-image-fallback"
                            );

                          if (fallback) {
                            fallback.style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="cart-image-fallback"
                      style={{
                        display: imageUrl
                          ? "none"
                          : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "40px",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      🌾
                    </div>
                  </div>

                  {/* Product Details */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: "200px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#198754",
                        fontWeight: "600",
                      }}
                    >
                      {item.category ||
                        t("farmProduct")}
                    </span>

                    <h3
                      style={{
                        margin: "5px 0",
                      }}
                    >
                      {item.productName}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color: "#666",
                      }}
                    >
                      ₹{item.price} / {item.unit || "kg"}
                    </p>

                    {item.farmerId && (
                      <small
                        style={{
                          color: "#888",
                        }}
                      >
                        {t("farmProduct")}
                      </small>
                    )}
                  </div>

                  {/* Quantity */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item._id)
                      }
                      style={{
                        width: "35px",
                        height: "35px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                    >
                      −
                    </button>

                    <strong>
                      {itemQuantity}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(item._id)
                      }
                      disabled={
                        availableQuantity > 0 &&
                        itemQuantity >=
                        availableQuantity
                      }
                      style={{
                        width: "35px",
                        height: "35px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        background: "#fff",
                        cursor:
                          availableQuantity > 0 &&
                            itemQuantity >=
                            availableQuantity
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "18px",
                        opacity:
                          availableQuantity > 0 &&
                            itemQuantity >=
                            availableQuantity
                            ? 0.5
                            : 1,
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <strong
                    style={{
                      minWidth: "90px",
                      textAlign: "right",
                      fontSize: "18px",
                    }}
                  >
                    ₹{itemTotal.toFixed(2)}
                  </strong>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item._id)
                    }
                    style={{
                      border: "none",
                      background: "#dc3545",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ {t("remove")}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div
            style={{
              marginTop: "30px",
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.07)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <span
                style={{
                  color: "#666",
                }}
              >
                {t("totalAmount")}
              </span>

              <h2
                style={{
                  margin: "5px 0 0",
                  color: "#198754",
                }}
              >
                ₹{totalAmount.toFixed(2)}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              style={{
                padding: "13px 30px",
                background: "#198754",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {t("checkout")} →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;