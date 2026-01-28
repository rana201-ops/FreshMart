import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (!data.name || !data.email || !data.password || !data.confirm) {
      setError("All fields are required");
      return;
    }

    // simple email validation
    if (!data.email.includes("@") || !data.email.includes(".")) {
      setError("Enter a valid email");
      return;
    }

    if (data.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (data.password !== data.confirm) {
      setError("Passwords do not match");
      return;
    }

    // block admin/vendor signup
    if (data.email === "admin@gmail.com" || data.email === "vendor@gmail.com") {
      setError("Admin/Vendor cannot signup");
      return;
    }

    const users = JSON.parse(localStorage.getItem("freshmart_users") || "[]");

    if (users.find((u) => u.email === data.email)) {
      setError("User already registered. Please login.");
      return;
    }

    const newUser = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role: "user",
    };

    localStorage.setItem("freshmart_users", JSON.stringify([...users, newUser]));
    alert("Signup successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "450px" }}>
        <h3 className="text-center mb-3">User Signup</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <input
            className="form-control mb-3"
            placeholder="Full Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />

          <input
            className="form-control mb-3"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password (min 6 chars)"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Confirm Password"
            value={data.confirm}
            onChange={(e) => setData({ ...data, confirm: e.target.value })}
          />

          <button className="btn btn-success w-100">Register</button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
