import { Link } from "react-router-dom";
import { useState } from "react";

const categories = [
  { name: "Fresh Fruits", slug: "fresh-fruits", icon: "🍎" },
  { name: "Green Vegetables", slug: "green-vegetables", icon: "🥬" },
  { name: "Organic Dairy", slug: "organic-dairy", icon: "🥛" },
  { name: "Healthy Staples", slug: "healthy-staples", icon: "🌾" },
];

const Home = () => {
  const [email, setEmail] = useState("");

  const subscribe = () => {
    if (!email) return alert("Enter email");
    alert("Subscribed successfully 🌿");
    setEmail("");
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-success text-white py-5">
        <div className="container text-center">
          <h1 className="fw-bold display-6">The Green Leaf Grocer</h1>
          <p className="opacity-75 mb-3">Fresh • Organic • Farm to Home</p>

          {/* ✅ Offers pe nahi, category pe jayega */}
          <Link to="/category/fresh-fruits" className="btn btn-light px-4">
            Explore Organic Products
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-5">
        <h4 className="fw-bold text-center mb-4">Shop Organic Categories</h4>

        <div className="row g-4">
          {categories.map((c) => (
            <div className="col-md-3 col-sm-6" key={c.slug}>
              <Link
                to={`/category/${c.slug}`}
                className="text-decoration-none text-dark"
              >
                <div className="card text-center p-4 shadow-sm border-0 h-100">
                  <div style={{ fontSize: "36px" }}>{c.icon}</div>
                  <h6 className="mt-3 fw-semibold">{c.name}</h6>
                  <small className="text-muted">Explore →</small>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ FEATURE STRIP (Replaces old box/pills + why choose us) */}
      <section className="py-5" style={{ background: "#f6faf6" }}>
        <div className="container">
          <div className="row align-items-center g-4">
            {/* Left content */}
            <div className="col-lg-4">
              <h4 className="fw-bold mb-2">Why Green Leaf Grocer?</h4>
              <p className="text-muted mb-3">
                Fresh organic groceries, sourced from trusted farmers and
                delivered fast.
              </p>
              <Link to="/category/fresh-fruits" className="btn btn-success px-4">
                Start Shopping
              </Link>
            </div>

            {/* Right features */}
            <div className="col-lg-8">
              <div className="row g-3">
                {[
                  {
                    icon: "🌿",
                    title: "100% Organic",
                    desc: "No chemicals, no preservatives",
                  },
                  {
                    icon: "🚜",
                    title: "Farm Fresh",
                    desc: "Direct from farmers",
                  },
                  {
                    icon: "🚚",
                    title: "Fast Delivery",
                    desc: "Same day in city",
                  },
                  {
                    icon: "💳",
                    title: "Secure Payments",
                    desc: "Safe checkout",
                  },
                ].map((f) => (
                  <div className="col-md-6" key={f.title}>
                    <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center"
                          style={{ width: 44, height: 44, fontSize: 20 }}
                        >
                          {f.icon}
                        </div>
                        <div>
                          <div className="fw-semibold">{f.title}</div>
                          <small className="text-muted">{f.desc}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VENDOR HIGHLIGHT */}
      <section className="bg-light py-5 text-center">
        <h5 className="fw-bold">Our Trusted Farmers 🧑‍🌾</h5>
        <p className="text-muted mb-2">
          Certified organic vendors across regions
        </p>
        <span className="badge bg-success">✔ Certified Organic Sellers</span>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="container py-5 text-center">
        <h5 className="fw-bold mb-3">What Customers Say ⭐</h5>
        <p className="fst-italic text-muted mb-1">
          “Fresh vegetables straight from the farm. Truly organic!”
        </p>
        <strong>★★★★☆</strong>
      </section>

      {/* SUBSCRIBE (Same as you wanted) */}
      <section className="bg-dark text-white py-4">
        <div className="container text-center">
          <h6 className="fw-semibold mb-3">Get organic offers & updates 📩</h6>

          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <input
              className="form-control w-50"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-success" onClick={subscribe}>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
