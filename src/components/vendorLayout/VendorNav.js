import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const VendorNav = () => {
  const { user, logout } = useContext(AuthContext);

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#198754" : "#212529",
    fontWeight: isActive ? "600" : "400",
  });

  return (
    <header className="shadow-sm bg-white">
      <div className="container d-flex justify-content-between align-items-center py-2">
        {/* Logo -> user home */}
        <Link to="/" className="fw-bold fs-4 text-decoration-none text-dark">
          Green Leaf <span className="text-success">Grocer</span>{" "}
          <span className="fs-6">(Vendor Panel)</span>
        </Link>

        <nav className="d-flex gap-4 align-items-center">
          <NavLink to="/vendor" end style={linkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/vendor/products" style={linkStyle}>
            Products
          </NavLink>
          <NavLink to="/vendor/orders" style={linkStyle}>
            Orders
          </NavLink>
          <NavLink to="/vendor/settings" style={linkStyle}>
            Settings
          </NavLink>
        </nav>

        <div className="d-flex align-items-center gap-3">
          <small className="text-muted">{user?.email}</small>
          <button onClick={logout} className="btn btn-sm btn-outline-danger">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default VendorNav;
