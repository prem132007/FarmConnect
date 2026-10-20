import { Link } from "react-router-dom";
import farmer from "../assets/farmer.png";
import "../css/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">

        {/* Left Side */}
        <div className="hero-left">

          <h1>
            Fresh Produce.
            <br />
            Direct from Farmers.
          </h1>

          <p>
            FarmConnect brings farmers and customers together for a
            fairer, fresher and more transparent marketplace.
            Buy directly from local farmers without middlemen.
          </p>

          <div className="hero-buttons">

            <Link
              to="/products"
              className="btn btn-success btn-lg me-3"
            >
              Browse Products
            </Link>

            <Link
              to="/register"
              className="btn btn-light btn-lg"
            >
              Join as Farmer
            </Link>

          </div>

          {/* Features */}

          <div className="hero-features">

            <div className="hero-feature">
              <div className="icon">👥</div>
              <h6>Direct Communication</h6>
              <p>Talk directly with farmers</p>
            </div>

            <div className="hero-feature">
              <div className="icon">🌿</div>
              <h6>Fair Prices</h6>
              <p>No middlemen</p>
            </div>

            <div className="hero-feature">
              <div className="icon">🛡️</div>
              <h6>Trusted Farmers</h6>
              <p>Verified sellers</p>
            </div>

            <div className="hero-feature">
              <div className="icon">🚚</div>
              <h6>Fresh Delivery</h6>
              <p>Farm to your home</p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="hero-right">

          <img
            src={farmer}
            alt="Farmer"
            className="hero-image"
          />

          {/* Floating Card */}

          <div className="hero-card">

            <h3>How FarmConnect Works</h3>

            <div className="hero-step">
              <span>1</span>

              <div>
                <h6>Farmers List Products</h6>
                <p>Add fresh products with prices and quantity.</p>
              </div>

            </div>

            <div className="hero-step">
              <span>2</span>

              <div>
                <h6>Customers Browse</h6>
                <p>Search and compare fresh products.</p>
              </div>

            </div>

            <div className="hero-step">
              <span>3</span>

              <div>
                <h6>Place Orders</h6>
                <p>Order directly from trusted farmers.</p>
              </div>

            </div>

            <div className="hero-step">
              <span>4</span>

              <div>
                <h6>Fresh Delivery</h6>
                <p>Delivered fresh to your doorstep.</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;