import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [loginAs, setLoginAs] = useState("user"); // user | admin | vendor
  const [data, setData] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const submit = (e) => {
    e.preventDefault();
    setError("");

    const email = data.email.trim();

    if (!email || !data.password) {
      setError("All fields are required");
      return;
    }

    //  ADMIN (fixed)
    if (loginAs === "admin") {
      if (email !== "admin@gmail.com" || data.password !== "admin123") {
        setError("Invalid admin credentials");
        return;
      }
      login(email, "admin");
      navigate("/admin");
      return;
    }

    // VENDOR (fixed)
    if (loginAs === "vendor") {
      if (email !== "vendor@gmail.com" || data.password !== "vendor123") {
        setError("Invalid vendor credentials");
        return;
      }
      login(email, "vendor");
      navigate("/vendor");
      return;
    }

    //  USER (must be registered)
    const users = JSON.parse(localStorage.getItem("freshmart_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === data.password);

    if (!found) {
      setError("User not registered OR wrong password");
      return;
    }

    login(found.email, "user");

    // if user came from cart/wishlist/checkout, send back there
    navigate(from);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "420px" }}>
        <h3 className="text-center mb-3">Login</h3>

        <label className="form-label">Login as</label>
        <select
          className="form-select mb-3"
          value={loginAs}
          onChange={(e) => {
            setLoginAs(e.target.value);
            setError("");
          }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
        </select>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <input
            className="form-control mb-3"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <div className="input-group mb-3">
            <input
              type={show ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShow(!show)}
            >
              👁️
            </button>
          </div>

          <button className="btn btn-success w-100">Login</button>
        </form>

        {loginAs === "user" ? (
          <p className="text-center mt-3">
            New user? <Link to="/signup">Signup</Link>
          </p>
        ) : (
          <div className="mt-3 text-muted" style={{ fontSize: "12px" }}>
            {loginAs === "admin" && <div><b>Admin:</b> admin@gmail.com / admin123</div>}
            {loginAs === "vendor" && <div><b>Vendor:</b> vendor@gmail.com / vendor123</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
