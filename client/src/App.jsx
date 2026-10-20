import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// LANGUAGE CONTEXT
// =====================================================

import { LanguageProvider } from "./context/LanguageContext";

// =====================================================
// SHARED COMPONENTS
// =====================================================

import Footer from "./components/Footer";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";

// =====================================================
// FARMER PAGES
// =====================================================

import FarmerDashboard from "./pages/FarmerDashboard";
import AddProduct from "./pages/AddProduct";
import MyProducts from "./pages/MyProducts";
import FarmerOrders from "./pages/FarmerOrders";

// =====================================================
// CUSTOMER PAGES
// =====================================================

import CustomerDashboard from "./pages/CustomerDashboard";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import CustomerNotifications from "./pages/CustomerNotifications";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";

// =====================================================
// PROTECTED ROUTE
// =====================================================

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
    return (
        <LanguageProvider>

            <BrowserRouter>

                {/* =================================================
                    MAIN APPLICATION
                ================================================= */}

                <div className="app">

                    {/* =================================================
                        ALL ROUTES
                    ================================================= */}

                    <Routes>

                        {/* =================================================
                            PUBLIC ROUTES
                        ================================================= */}

                        <Route
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />


                        {/* =================================================
                            COMMON PROTECTED ROUTES
                        ================================================= */}

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/messages"
                            element={
                                <ProtectedRoute>
                                    <Messages />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/customer/messages"
                            element={
                                <ProtectedRoute>
                                    <Messages />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/farmer/messages"
                            element={
                                <ProtectedRoute role="farmer">
                                    <Messages />
                                </ProtectedRoute>
                            }
                        />



                        {/* =================================================
                            FARMER ROUTES
                        ================================================= */}

                        <Route
                            path="/farmer"
                            element={
                                <ProtectedRoute role="farmer">
                                    <FarmerDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/add-product"
                            element={
                                <ProtectedRoute role="farmer">
                                    <AddProduct />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/my-products"
                            element={
                                <ProtectedRoute role="farmer">
                                    <MyProducts />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/farmer-orders"
                            element={
                                <ProtectedRoute role="farmer">
                                    <FarmerOrders />
                                </ProtectedRoute>
                            }
                        />


                        {/* =================================================
                            CUSTOMER ROUTES
                        ================================================= */}

                        <Route
                            path="/customer"
                            element={
                                <ProtectedRoute role="customer">
                                    <CustomerDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/products"
                            element={
                                <ProtectedRoute role="customer">
                                    <Products />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute role="customer">
                                    <Cart />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute role="customer">
                                    <Checkout />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/my-orders"
                            element={
                                <ProtectedRoute role="customer">
                                    <MyOrders />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/notifications"
                            element={<CustomerNotifications />}
                        />


                        {/* =================================================
                            ADMIN ROUTES
                        ================================================= */}

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminUsers />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/products"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminProducts />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/orders"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminOrders />
                                </ProtectedRoute>
                            }
                        />


                        {/* =================================================
                            FALLBACK ROUTE
                        ================================================= */}

                        <Route
                            path="*"
                            element={<Home />}
                        />

                    </Routes>


                    {/* =================================================
                        SHARED FOOTER
                        
                        This appears on ALL pages.
                    ================================================= */}

                    <Footer />

                </div>

            </BrowserRouter>

        </LanguageProvider>
    );
}

export default App;