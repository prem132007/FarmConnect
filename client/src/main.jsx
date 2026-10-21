import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Global CSS
import "./index.css";

// Navbar CSSgit status
import "./css/Navbar.css";

// App
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);