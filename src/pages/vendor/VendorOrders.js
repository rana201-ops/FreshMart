import { useEffect, useMemo, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ORDERS_KEY = "freshmart_orders";
const PRODUCTS_KEY = "freshmart_products";

const VendorOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [vendorProducts, setVendorProducts] = useState([]);

  const load = () => {
    setOrders(JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"));
    setVendorProducts(JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"));
  };

  useEffect(() => {
    load();
  }, []);

  // vendor ke product ids
  const myProductIds = useMemo(() => {
    const mine = vendorProducts.filter((p) => p.vendorEmail === user?.email);
    return new Set(mine.map((p) => p.id));
  }, [vendorProducts, user?.email]);

  // vendor ko relevant orders only
  const myOrders = useMemo(() => {
    return orders
      .map((o) => {
        const items = (o.items || []).filter((it) => myProductIds.has(it.id));
        if (items.length === 0) return null;

        const subTotal = items.reduce((t, it) => t + it.price * it.qty, 0);

        return { ...o, items, vendorTotal: subTotal };
      })
      .filter(Boolean);
  }, [orders, myProductIds]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold mb-0">Orders</h3>
        <button className="btn btn-sm btn-outline-secondary" onClick={load}>
          Refresh
        </button>
      </div>

      {myOrders.length === 0 ? (
        <div className="alert alert-info">
          No orders found for your products yet.
        </div>
      ) : (
        myOrders.map((o) => (
          <div key={o.id} className="card p-3 shadow-sm mb-3">
            <div className="d-flex justify-content-between flex-wrap">
              <div>
                <b>Order ID:</b> {o.id}
                <div className="text-muted">
                  Customer: {o.userEmail || "N/A"}
                </div>
              </div>
              <div className="text-end">
                <span className="badge bg-primary">{o.status || "placed"}</span>
                <div className="fw-bold text-success mt-1">
                  Vendor Total: ₹{o.vendorTotal}
                </div>
              </div>
            </div>

            <hr />

            {o.items.map((it) => (
              <div key={it.id} className="d-flex justify-content-between">
                <div>
                  {it.name} <small className="text-muted">× {it.qty}</small>
                </div>
                <div className="fw-semibold">₹{it.price * it.qty}</div>
              </div>
            ))}

            <hr />
            <small className="text-muted">
              Delivery: {o.name} | {o.phone} | {o.address}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default VendorOrders;
