import { useEffect, useState } from "react";

const ORDERS_KEY = "freshmart_orders";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  const load = () => {
    setOrders(JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"));
  };

  useEffect(() => {
    load();
  }, []);

  const clearAll = () => {
    if (!window.confirm("Are you sure you want to clear all orders?")) return;
    localStorage.removeItem(ORDERS_KEY);
    setOrders([]);
  };

  const formatDate = (order) => {
    const d = order.createdAt
      ? new Date(order.createdAt)
      : new Date(Number(order.id));
    return d.toLocaleString();
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Manage Orders</h3>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={load}>
            🔄 Refresh
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={clearAll}
          >
            🗑 Clear All
          </button>
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="alert alert-info text-center">
          No orders available.
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="card shadow-sm mb-4">
            {/* Header */}
            <div className="card-header bg-light d-flex justify-content-between">
              <div>
                <div className="fw-semibold">Order ID: {o.id}</div>
                <small className="text-muted">User: {o.userEmail}</small>
              </div>
              <div className="text-end">
                <div className="fw-bold text-success fs-5">₹{o.total}</div>
                <span className="badge bg-primary">
                  {formatDate(o)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="card-body">
              <table className="table table-sm mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.name}</td>
                      <td className="text-center">{it.qty}</td>
                      <td className="text-end fw-semibold">
                        ₹{it.price * it.qty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Address */}
            <div className="card-footer">
              <small className="text-muted">
                📍 {o.name}, {o.phone}, {o.address}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageOrders;
