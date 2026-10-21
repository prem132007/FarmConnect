import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

function Checkout() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // LOAD USER + CART
  // ==========================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      const storedCart =
        JSON.parse(localStorage.getItem("cart")) || [];

      // ==========================
      // CHECK LOGIN
      // ==========================

      if (!storedUser) {
        alert(t("loginBeforeCheckout"));
        navigate("/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      // ==========================
      // CHECK CUSTOMER ROLE
      // ==========================

      if (parsedUser.role !== "customer") {
        alert(t("customerOnlyCheckout"));
        navigate("/");
        return;
      }

      // ==========================
      // CHECK CART
      // ==========================

      if (!Array.isArray(storedCart) || storedCart.length === 0) {
        alert(t("cartEmptyCheckout"));
        navigate("/cart");
        return;
      }

      setUser(parsedUser);
      setCart(storedCart);
    } catch (error) {
      console.error("Checkout Load Error:", error);

      alert(t("unableToLoadCheckout"));
      navigate("/cart");
    }
  }, [navigate, t]);

  // ==========================
  // TOTAL AMOUNT
  // ==========================

  const totalAmount = cart.reduce(
    (total, item) => {
      const price = Number(item.price) || 0;

      const quantity =
        Number(item.cartQuantity) || 1;

      return total + price * quantity;
    },
    0
  );

  // ==========================
  // GET PRODUCT IMAGE
  // ==========================

  const getProductImage = (image) => {
    if (!image) {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("uploads/")) {
      return `https://farmconnect-backend-n6mx.onrender.com/${image}`;
    }

    return `https://farmconnect-backend-n6mx.onrender.com/uploads/${image}`;
  };

  // ==========================
  // PLACE ORDERS
  // ==========================

  const handlePlaceOrder = async () => {
    try {
      setError("");

      // ==========================
      // CHECK USER
      // ==========================

      if (!user || !user.id) {
        setError(
          t("customerInformationNotFound")
        );

        return;
      }

      // ==========================
      // CHECK CART
      // ==========================

      if (!Array.isArray(cart) || cart.length === 0) {
        setError(t("cartEmptyCheckout"));
        return;
      }

      // ==========================
      // CHECK DELIVERY DETAILS
      // ==========================

      if (
        !user.address ||
        !user.city ||
        !user.state ||
        !user.pincode
      ) {
        setError(
          t("completeDeliveryAddress")
        );

        return;
      }

      // ==========================
      // VALIDATE ALL CART ITEMS
      // BEFORE CREATING ORDERS
      // ==========================

      for (const item of cart) {
        // Check product ID

        if (!item._id) {
          throw new Error(
            t("invalidProductId")
          );
        }

        // Check farmer ID

        if (!item.farmerId) {
          throw new Error(
            `${item.productName || t("farmProductFallback")} ${t(
              "farmerInformationMissing"
            )}`
          );
        }

        // Check quantity

        const quantity =
          Number(item.cartQuantity) || 1;

        if (quantity < 1) {
          throw new Error(
            `${t("invalidQuantity")} ${item.productName || t("farmProductFallback")
            }.`
          );
        }

        // Check price

        const price =
          Number(item.price);

        if (isNaN(price) || price < 0) {
          throw new Error(
            `${t("invalidPrice")} ${item.productName || t("farmProductFallback")
            }.`
          );
        }

        // Check available stock

        const availableQuantity =
          Number(item.quantity);

        if (
          !isNaN(availableQuantity) &&
          quantity > availableQuantity
        ) {
          throw new Error(
            `${t("onlyQuantityAvailable")} ${availableQuantity} ${item.productName || t("farmProductFallback")
            } ${t("availableProduct")}`
          );
        }
      }

      // ==========================
      // CONFIRM ORDER
      // ==========================

      const confirmOrder = window.confirm(
        `${t("placeOrderConfirmation")} ₹${totalAmount.toFixed(
          2
        )} ${t("usingCashOnDelivery")}`
      );

      if (!confirmOrder) {
        return;
      }

      setLoading(true);

      // ==========================
      // PLACE EACH CART ITEM
      // ==========================

      for (const item of cart) {
        const quantity =
          Number(item.cartQuantity) || 1;

        const price =
          Number(item.price) || 0;

        const totalPrice =
          price * quantity;

        // ==========================
        // ORDER DATA
        // ==========================

        const orderData = {
          customerId: user.id,

          farmerId: item.farmerId,

          productId: item._id,

          quantity: quantity,

          totalPrice: totalPrice,

          // ==========================
          // DELIVERY INFORMATION
          // ==========================

          deliveryAddress: user.address,

          city: user.city,

          state: user.state,

          pincode: user.pincode,

          // ==========================
          // PAYMENT INFORMATION
          // ==========================

          paymentMethod: "Cash on Delivery",

          paymentStatus: "Pending",

          paymentId: "",
        };

        console.log(
          "Placing Order:",
          orderData
        );

        // ==========================
        // SEND ORDER TO BACKEND
        // ==========================

        await axios.post(
          "https://farmconnect-backend-n6mx.onrender.com/api/orders",
          orderData
        );
      }

      // ==========================
      // CLEAR CART
      // ==========================

      localStorage.removeItem("cart");

      setCart([]);

      // ==========================
      // SUCCESS
      // ==========================

      alert(
        t("orderPlacedSuccessfully")
      );

      // ==========================
      // GO TO MY ORDERS
      // ==========================

      navigate("/my-orders");
    } catch (error) {
      console.error(
        "Checkout Error:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        t("unableToPlaceOrder")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOADING
  // ==========================

  if (!user || cart.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7faf7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>{t("checkoutLoading")}</h3>
      </div>
    );
  }

  // ==========================
  // CHECKOUT PAGE
  // ==========================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7faf7",
        padding: "40px 20px 60px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* ==========================
            HEADER
        ========================== */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h1>
            🛒 {t("checkoutTitle")}
          </h1>

          <p
            style={{
              color: "#666",
            }}
          >
            {t("reviewOrder")}
          </p>
        </div>

        {/* ==========================
            ERROR
        ========================== */}

        {error && (
          <div
            style={{
              background: "#f8d7da",
              color: "#842029",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 2fr) minmax(280px, 1fr)",
            gap: "25px",
          }}
        >
          {/* ==========================
              LEFT SECTION
          ========================== */}

          <div>
            {/* ==========================
                ORDER ITEMS
            ========================== */}

            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.07)",
              }}
            >
              <h3
                style={{
                  marginBottom: "20px",
                }}
              >
                📦 {t("yourProducts")}
              </h3>

              {cart.map((item) => {
                const quantity =
                  Number(item.cartQuantity) || 1;

                const price =
                  Number(item.price) || 0;

                const itemTotal =
                  price * quantity;

                const imageUrl =
                  getProductImage(item.image);

                return (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      padding: "15px 0",
                      borderBottom:
                        "1px solid #eee",
                    }}
                  >
                    {/* IMAGE */}

                    <div
                      style={{
                        width: "80px",
                        height: "80px",
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
                            t("farmProductImageAlt")
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: "30px",
                          }}
                        >
                          🌾
                        </span>
                      )}
                    </div>

                    {/* DETAILS */}

                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 5px",
                        }}
                      >
                        {item.productName}
                      </h4>

                      <p
                        style={{
                          margin: 0,
                          color: "#666",
                        }}
                      >
                        ₹{price} × {quantity}
                      </p>
                    </div>

                    {/* TOTAL */}

                    <strong>
                      ₹{itemTotal.toFixed(2)}
                    </strong>
                  </div>
                );
              })}
            </div>

            {/* ==========================
                CUSTOMER INFORMATION
            ========================== */}

            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "12px",
                marginTop: "20px",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.07)",
              }}
            >
              <h3>
                👤 {t("customerInformation")}
              </h3>

              <div
                style={{
                  marginTop: "15px",
                }}
              >
                <p>
                  <strong>{t("name")}:</strong>{" "}
                  {user.name || t("customerFallback")}
                </p>

                <p>
                  <strong>{t("email")}:</strong>{" "}
                  {user.email ||
                    t("notAvailable")}
                </p>

                {user.phone && (
                  <p>
                    <strong>{t("phone")}:</strong>{" "}
                    {user.phone}
                  </p>
                )}

                {user.address && (
                  <p>
                    <strong>{t("address")}:</strong>{" "}
                    {user.address}
                  </p>
                )}

                {user.city && (
                  <p>
                    <strong>{t("city")}:</strong>{" "}
                    {user.city}
                  </p>
                )}

                {user.state && (
                  <p>
                    <strong>{t("state")}:</strong>{" "}
                    {user.state}
                  </p>
                )}

                {user.pincode && (
                  <p>
                    <strong>{t("pincode")}:</strong>{" "}
                    {user.pincode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ==========================
              RIGHT SECTION
          ========================== */}

          <div>
            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.07)",
                position: "sticky",
                top: "20px",
              }}
            >
              <h3>
                🧾 {t("orderSummary")}
              </h3>

              {/* PRODUCTS */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: "25px",
                  paddingBottom: "15px",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                <span>{t("productsLabel")}</span>

                <span>
                  {cart.length}
                </span>
              </div>

              {/* SUBTOTAL */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  padding: "15px 0",
                }}
              >
                <span>{t("subtotal")}</span>

                <strong>
                  ₹{totalAmount.toFixed(2)}
                </strong>
              </div>

              {/* DELIVERY */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  paddingBottom: "15px",
                }}
              >
                <span>{t("delivery")}</span>

                <strong>{t("free")}</strong>
              </div>

              {/* TOTAL */}

              <div
                style={{
                  borderTop:
                    "2px solid #198754",
                  paddingTop: "15px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <strong>{t("total")}</strong>

                <strong
                  style={{
                    color: "#198754",
                    fontSize: "22px",
                  }}
                >
                  ₹{totalAmount.toFixed(2)}
                </strong>
              </div>

              {/* ==========================
                  PAYMENT METHOD
              ========================== */}

              <div
                style={{
                  marginTop: "25px",
                  padding: "15px",
                  background: "#f7faf7",
                  borderRadius: "8px",
                }}
              >
                <strong>
                  💵 {t("paymentMethod")}
                </strong>

                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#666",
                  }}
                >
                  {t("cashOnDelivery")}
                </p>
              </div>

              {/* ==========================
                  PLACE ORDER
              ========================== */}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "14px",
                  background: loading
                    ? "#999"
                    : "#198754",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "17px",
                  fontWeight: "600",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {loading
                  ? t("placingOrder")
                  : `✅ ${t("placeOrder")}`}
              </button>

              {/* ==========================
                  BACK TO CART
              ========================== */}

              <button
                type="button"
                onClick={() =>
                  navigate("/cart")
                }
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "12px",
                  background: "#fff",
                  color: "#198754",
                  border:
                    "1px solid #198754",
                  borderRadius: "8px",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                ← {t("backToCart")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;