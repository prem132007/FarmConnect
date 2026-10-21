import React from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";

function Footer() {
  // =========================================
  // EMAIL SUBMIT
  // =========================================

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    alert(`Email submitted: ${email}`);

    e.target.reset();
  };

  // =========================================
  // MOBILE NUMBER SUBMIT
  // =========================================

  const handleMobileSubmit = (e) => {
    e.preventDefault();

    const mobile = e.target.mobile.value.trim();

    if (!mobile) {
      alert("Please enter your mobile number.");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    alert(`Mobile number submitted: +91 ${mobile}`);

    e.target.reset();
  };

  return (
    <footer className="farm-footer">

      {/* =====================================================
          FOOTER MAIN
      ===================================================== */}

      <div className="footer-container">

        {/* =====================================================
            BRAND
        ===================================================== */}

        <div className="footer-column footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            <span className="footer-logo-icon">
              🌱
            </span>

            <span>
              FarmConnect
            </span>
          </Link>

          <p className="footer-description">
            Direct agricultural e-commerce platform
            connecting conscientious consumers
            with passionate local organic farmers.
          </p>

          <div className="footer-badges">

            <span className="footer-badge organic">
              Organic Verified
            </span>

            <span className="footer-badge fair">
              Fair Trade
            </span>

          </div>

        </div>


        {/* =====================================================
            EXPLORE PRODUCE
        ===================================================== */}

        <div className="footer-column">

          <h3 className="footer-heading">
            EXPLORE PRODUCE
          </h3>

          <ul className="footer-links">

            <li>
              <Link to="/products">
                Organic Vegetables
              </Link>
            </li>

            <li>
              <Link to="/products">
                Seasonal Orchard Fruits
              </Link>
            </li>

            <li>
              <Link to="/products">
                A2 Desi Dairy &amp; Eggs
              </Link>
            </li>

            <li>
              <Link to="/products">
                Wild Himalayan Honey
              </Link>
            </li>

            <li>
              <Link to="/products">
                Stone-Ground Grains
              </Link>
            </li>

          </ul>

        </div>


        {/* =====================================================
            FOR FARMERS
        ===================================================== */}

        <div className="footer-column">

          <h3 className="footer-heading">
            FOR FARMERS
          </h3>

          <ul className="footer-links">

            <li>
              <Link to="/register">
                Register as a Farmer
              </Link>
            </li>

            <li>
              <Link to="/farmer">
                Farmer Management Console
              </Link>
            </li>

            <li>
              <Link to="/products">
                Harvest Pricing Index
              </Link>
            </li>

            <li>
              <Link to="/messages">
                Direct Customer Chat
              </Link>
            </li>

          </ul>

        </div>


        {/* =====================================================
            STAY UPDATED
        ===================================================== */}

        <div className="footer-column footer-updated">

          <h3 className="footer-heading">
            STAY UPDATED
          </h3>

          <p className="footer-newsletter-text">
            Subscribe to get notified whenever
            seasonal crops are harvested.
          </p>


          {/* =================================================
              EMAIL FORM
          ================================================= */}

          <form
            className="footer-newsletter"
            onSubmit={handleEmailSubmit}
          >

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              aria-label="Email address"
              required
            />

            <button type="submit">
              Join
            </button>

          </form>


          {/* =================================================
              MOBILE NUMBER FORM
          ================================================= */}

          <form
            className="footer-mobile-form"
            onSubmit={handleMobileSubmit}
          >

            <input
              type="tel"
              name="mobile"
              placeholder="Enter your mobile number"
              aria-label="Mobile number"
              maxLength="10"
              inputMode="numeric"
              pattern="[0-9]{10}"
              required
            />

            <button type="submit">
              Submit
            </button>

          </form>

        </div>

      </div>


      {/* =====================================================
          FOOTER BOTTOM
      ===================================================== */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          {/* COPYRIGHT */}

          <p className="footer-copyright">
            © 2026 FarmConnect. Built with React.js,
            Node.js, Express, MongoDB &amp; Socket.IO.
          </p>


          {/* BOTTOM LINKS */}

          <div className="footer-bottom-links">

            <Link to="/privacy">
              Privacy Policy
            </Link>

            <Link to="/terms">
              Terms of Service
            </Link>

            <span>
              Farmer Support: help@farmconnect.org
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;