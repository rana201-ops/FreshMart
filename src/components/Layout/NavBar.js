import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const categoryList = [
  { label: "Fresh Fruits", slug: "fresh-fruits" },
  { label: "Green Vegetables", slug: "green-vegetables" },
  { label: "Organic Dairy", slug: "organic-dairy" },
  { label: "Healthy Staples", slug: "healthy-staples" },
];
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="shadow-sm bg-white">
      <div className="container d-flex justify-content-between align-items-center py-2">

        {/* LOGO */}
        <Link to="/" className="fw-bold fs-4 text-decoration-none text-dark">
          The Green <span className="text-success">Leaf</span> Grocer
        </Link>

        {/* NAV LINKS */}
        <nav className="d-flex gap-4 align-items-center">
          <Link to="/" className="text-decoration-none text-dark">Home</Link>
          <Link to="/offers" className="text-decoration-none text-dark">Offers </Link>

          {/* Categories Dropdown */}
          <div ref={dropdownRef} className="position-relative">
            <span
              style={{ cursor: "pointer" }}
              className="text-dark"
              onClick={() => setOpen(!open)}
            >
              Categories ▾
            </span>
            {open && (
              <div
                className="position-absolute bg-white shadow rounded p-2 mt-1"
                style={{ minWidth: "180px", zIndex: 1000 }}
              >
                {categoryList.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="d-block text-dark text-decoration-none p-2 rounded"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist & Cart */}
          {(!user || user.role === "user") && (
            <>
              <Link to="/wishlist" className="text-decoration-none text-dark">Wishlist</Link>
              <Link to="/cart" className="text-decoration-none text-dark">Cart</Link>
            </>
          )}
        </nav>

        {/* Auth buttons */}
        <div>
          {!user ? (
            <>
              <Link to="/login" className="me-2 text-decoration-none">Login</Link>
              <Link to="/signup" className="btn btn-success btn-sm">Signup</Link>
            </>
          ) : (
            <button onClick={logout} className="btn btn-outline-danger btn-sm">Logout</button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
