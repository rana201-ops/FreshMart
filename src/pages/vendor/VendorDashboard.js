import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PRODUCTS_KEY = "freshmart_products";
const ORDERS_KEY = "freshmart_orders";

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const load = () => {
    setProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
    setOrders(JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"));
  };

  useEffect(() => {
    load();
    // optional: tab switch/refresh pe update
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // vendor ke products only
  const myProducts = useMemo(() => {
    return products.filter((p) => p.vendorEmail === user?.email);
  }, [products, user?.email]);

  const myProductIds = useMemo(() => {
    return new Set(myProducts.map((p) => p.id));
  }, [myProducts]);

  // vendor ke relevant orders only (jinme vendor ka product ho)
  const myOrders = useMemo(() => {
    return orders
      .map((o) => {
        const items = (o.items || []).filter((it) => myProductIds.has(it.id));
        if (items.length === 0) return null;

        const vendorTotal = items.reduce((t, it) => t + it.price * it.qty, 0);

        return { ...o, items, vendorTotal };
      })
      .filter(Boolean);
  }, [orders, myProductIds]);

  const pendingCount = myProducts.filter(
    (p) => (p.status || "pending") === "pending"
  ).length;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold mb-1">Vendor Dashboard 🏪</h2>
          <p className="text-muted mb-0">Logged in as: {user?.email}</p>
        </div>

        <button className="btn btn-sm btn-outline-secondary" onClick={load}>
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="row g-3 mt-2">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <small className="text-muted">Total Products</small>
            <h3 className="fw-bold mb-0">{myProducts.length}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <small className="text-muted">Pending Approval</small>
            <h3 className="fw-bold mb-0">{pendingCount}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <small className="text-muted">Orders</small>
            <h3 className="fw-bold mb-0">{myOrders.length}</h3>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <h5 className="fw-bold mt-4">Quick Actions</h5>
      <div className="row g-3">
        <div className="col-md-6">
          <Link to="/vendor/products" className="text-decoration-none text-dark">
            <div className="card p-4 shadow-sm h-100">
              <h5 className="fw-bold mb-1">Manage Products</h5>
              <small className="text-muted">Add / edit your products</small>
            </div>
          </Link>
        </div>

        <div className="col-md-6">
          <Link to="/vendor/settings" className="text-decoration-none text-dark">
            <div className="card p-4 shadow-sm h-100">
              <h5 className="fw-bold mb-1">Store Settings</h5>
              <small className="text-muted">Update store details</small>
            </div>
          </Link>
        </div>

        <div className="col-md-12">
          <Link to="/vendor/orders" className="text-decoration-none text-dark">
            <div className="card p-4 shadow-sm h-100">
              <h5 className="fw-bold mb-1">View Orders</h5>
              <small className="text-muted">
                See orders that contain your products
              </small>
            </div>
          </Link>
        </div>
      </div>

      {/* OPTIONAL: Recent Orders Preview */}
      <div className="mt-4">
        <h5 className="fw-bold">Recent Orders</h5>

        {myOrders.length === 0 ? (
          <div className="alert alert-info">
            No orders yet. Orders will appear after a user places an order from
            checkout.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Vendor Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td className="fw-semibold">{o.id}</td>
                    <td>{o.userEmail}</td>
                    <td>{o.items.length}</td>
                    <td className="fw-bold text-success">₹{o.vendorTotal}</td>
                    <td>
                      <span className="badge bg-primary">{o.status || "placed"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
