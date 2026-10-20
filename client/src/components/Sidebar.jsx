
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h4 className="text-center mb-4">Farmer Panel</h4>

      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/farmer" className="nav-link text-white">
            📊 Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/add-product" className="nav-link text-white">
            ➕ Add Product
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/my-products" className="nav-link text-white">
            📦 My Products
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/orders" className="nav-link text-white">
            📋 Orders
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/farmer/messages" className="nav-link text-white">
            💬 Messages
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/profile" className="nav-link text-white">
            👤 Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
