import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const location = useLocation();

  // =====================================================
  // GET LOGIN INFORMATION
  // =====================================================

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let user = null;

  // =====================================================
  // SAFELY READ USER
  // =====================================================

  try {
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("ProtectedRoute User Error:", error);

    // Remove invalid user data
    localStorage.removeItem("user");
  }

  // =====================================================
  // USER IS NOT LOGGED IN
  // =====================================================

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // =====================================================
  // ROLE PROTECTION
  // =====================================================

  if (role && user.role !== role) {
    // User is logged in but doesn't have permission
    return <Navigate to="/" replace />;
  }

  // =====================================================
  // AUTHENTICATED + AUTHORIZED
  // =====================================================

  return children;
}

export default ProtectedRoute;