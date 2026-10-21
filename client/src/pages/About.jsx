import React from "react";
import { Link } from "react-router-dom";
import "../css/About.css";

function About() {
    return (
        <div className="about-page">

            {/* =====================================================
                HERO SECTION
            ===================================================== */}

            <section className="about-hero">

                <div className="about-hero-content">

                    <span className="about-label">
                        ABOUT FARMCONNECT
                    </span>

                    <h1>
                        Connecting Farmers
                        <span> Directly With Customers</span>
                    </h1>

                    <p>
                        FarmConnect is a direct agricultural e-commerce
                        platform that helps farmers sell their products
                        directly to customers without unnecessary
                        middlemen.
                    </p>

                </div>

            </section>


            {/* =====================================================
                ABOUT FARMCONNECT
            ===================================================== */}

            <section className="about-section">

                <div className="about-section-content">

                    <div className="about-section-text">

                        <span className="about-small-title">
                            WHO WE ARE
                        </span>

                        <h2>
                            About FarmConnect
                        </h2>

                        <p>
                            FarmConnect is designed to create a simple,
                            transparent, and reliable connection between
                            farmers and customers.
                        </p>

                        <p>
                            Farmers can showcase their agricultural
                            products, manage their products and orders,
                            and communicate directly with customers.
                            Customers can discover products, place
                            orders, and communicate with farmers.
                        </p>

                    </div>

                    <div className="about-info-card">

                        <div className="about-card-icon">
                            🌱
                        </div>

                        <h3>
                            Direct Connection
                        </h3>

                        <p>
                            Bringing farmers and customers together
                            through one convenient platform.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                OUR MISSION
            ===================================================== */}

            <section className="about-mission">

                <div className="about-centered-content">

                    <span className="about-small-title">
                        OUR MISSION
                    </span>

                    <h2>
                        Making Agricultural Commerce Simpler
                    </h2>

                    <p>
                        Our mission is to provide farmers with a digital
                        marketplace where they can reach customers
                        directly while giving customers an easy way to
                        discover and purchase agricultural products.
                    </p>

                </div>

            </section>


            {/* =====================================================
                HOW FARMCONNECT WORKS
            ===================================================== */}

            <section className="about-section">

                <div className="about-centered-content">

                    <span className="about-small-title">
                        HOW IT WORKS
                    </span>

                    <h2>
                        How FarmConnect Works
                    </h2>

                    <div className="about-work-grid">

                        <div className="about-work-card">

                            <div className="about-work-number">
                                01
                            </div>

                            <div className="about-work-icon">
                                👨‍🌾
                            </div>

                            <h3>
                                Farmers Register
                            </h3>

                            <p>
                                Farmers create an account and add
                                their agricultural products to the
                                platform.
                            </p>

                        </div>


                        <div className="about-work-card">

                            <div className="about-work-number">
                                02
                            </div>

                            <div className="about-work-icon">
                                🛒
                            </div>

                            <h3>
                                Customers Explore
                            </h3>

                            <p>
                                Customers browse available products
                                and choose the products they want
                                to purchase.
                            </p>

                        </div>


                        <div className="about-work-card">

                            <div className="about-work-number">
                                03
                            </div>

                            <div className="about-work-icon">
                                💬
                            </div>

                            <h3>
                                Direct Communication
                            </h3>

                            <p>
                                Customers and farmers can communicate
                                directly through the messaging system.
                            </p>

                        </div>


                        <div className="about-work-card">

                            <div className="about-work-number">
                                04
                            </div>

                            <div className="about-work-icon">
                                📦
                            </div>

                            <h3>
                                Orders
                            </h3>

                            <p>
                                Customers place orders and farmers
                                can manage and process those orders.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FOR FARMERS & CUSTOMERS
            ===================================================== */}

            <section className="about-benefits">

                <div className="about-centered-content">

                    <span className="about-small-title">
                        FARMCONNECT COMMUNITY
                    </span>

                    <h2>
                        Built For Farmers And Customers
                    </h2>

                    <div className="about-benefits-grid">

                        <div className="about-benefit-card farmer-card">

                            <div className="about-benefit-icon">
                                👨‍🌾
                            </div>

                            <h3>
                                For Farmers
                            </h3>

                            <p>
                                Farmers can showcase their products,
                                manage product listings, receive
                                customer orders, and communicate
                                directly with customers.
                            </p>

                            <ul>
                                <li>Manage agricultural products</li>
                                <li>Manage customer orders</li>
                                <li>Connect directly with customers</li>
                                <li>Build a digital presence</li>
                            </ul>

                        </div>


                        <div className="about-benefit-card customer-card">

                            <div className="about-benefit-icon">
                                🛍️
                            </div>

                            <h3>
                                For Customers
                            </h3>

                            <p>
                                Customers can discover agricultural
                                products, add products to their cart,
                                place orders, and communicate directly
                                with farmers.
                            </p>

                            <ul>
                                <li>Browse agricultural products</li>
                                <li>Search for products</li>
                                <li>Place and track orders</li>
                                <li>Chat directly with farmers</li>
                            </ul>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                WHY FARMCONNECT
            ===================================================== */}

            <section className="about-section">

                <div className="about-centered-content">

                    <span className="about-small-title">
                        WHY FARMCONNECT
                    </span>

                    <h2>
                        Why Choose FarmConnect?
                    </h2>

                    <div className="about-features-grid">

                        <div className="about-feature">

                            <div className="about-feature-icon">
                                🤝
                            </div>

                            <h3>
                                Direct Connection
                            </h3>

                            <p>
                                Farmers and customers can connect
                                directly through the platform.
                            </p>

                        </div>


                        <div className="about-feature">

                            <div className="about-feature-icon">
                                🌾
                            </div>

                            <h3>
                                Agricultural Products
                            </h3>

                            <p>
                                Discover a variety of agricultural
                                products from registered farmers.
                            </p>

                        </div>


                        <div className="about-feature">

                            <div className="about-feature-icon">
                                💬
                            </div>

                            <h3>
                                Direct Chat
                            </h3>

                            <p>
                                Customers and farmers can communicate
                                through the integrated messaging system.
                            </p>

                        </div>


                        <div className="about-feature">

                            <div className="about-feature-icon">
                                🔒
                            </div>

                            <h3>
                                Simple &amp; Reliable
                            </h3>

                            <p>
                                A straightforward platform designed
                                to make agricultural commerce easier.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                VISION
            ===================================================== */}

            <section className="about-vision">

                <div className="about-centered-content">

                    <span className="about-small-title">
                        OUR VISION
                    </span>

                    <h2>
                        A Better Digital Connection
                        <br />
                        Between Farms And Homes
                    </h2>

                    <p>
                        FarmConnect aims to make digital agricultural
                        commerce accessible, transparent, and convenient
                        for both farmers and customers.
                    </p>

                </div>

            </section>


            {/* =====================================================
                CTA
            ===================================================== */}

            <section className="about-cta">

                <div className="about-centered-content">

                    <h2>
                        Ready to Explore FarmConnect?
                    </h2>

                    <p>
                        Discover agricultural products and connect
                        directly with farmers.
                    </p>

                    <Link
                        to="/products"
                        className="about-cta-button"
                    >
                        Explore Products
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default About;