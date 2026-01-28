import { useEffect, useMemo, useState } from "react";
import catalog from "../../data/catalog";

const LS_KEY = "freshmart_products";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("pending"); // pending | approved | rejected
  const [q, setQ] = useState("");

  const load = () => {
    setProducts(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
  };

  useEffect(() => {
    load();
  }, []);

  const save = (next) => {
    setProducts(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const setStatus = (id, status) => {
    const next = products.map((p) => (p.id === id ? { ...p, status } : p));
    save(next);
  };

  const del = (id) => {
    if (!window.confirm("Delete this product?")) return;
    save(products.filter((p) => p.id !== id));
  };

  const titleOfCat = (slug) => catalog[slug]?.title || slug;

  // counts
  const pending = useMemo(
    () => products.filter((p) => (p.status || "pending") === "pending"),
    [products]
  );
  const approved = useMemo(
    () => products.filter((p) => p.status === "approved"),
    [products]
  );
  const rejected = useMemo(
    () => products.filter((p) => p.status === "rejected"),
    [products]
  );

  const tabData = useMemo(() => {
    if (activeTab === "approved") return approved;
    if (activeTab === "rejected") return rejected;
    return pending;
  }, [activeTab, pending, approved, rejected]);

  // search filter
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return tabData;
    return tabData.filter((p) => {
      const cat = `${titleOfCat(p.category)} ${p.subCategory || ""}`.toLowerCase();
      const vendor = (p.vendorShopName || p.vendorEmail || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      return name.includes(text) || cat.includes(text) || vendor.includes(text);
    });
  }, [q, tabData]); // titleOfCat is stable enough here since it reads catalog

  const StatusBadge = ({ status }) => {
    const s = status || "pending";
    const cls =
      s === "approved"
        ? "bg-success"
        : s === "rejected"
        ? "bg-danger"
        : "bg-warning text-dark";
    return (
      <span className={`badge ${cls} text-uppercase`} style={{ letterSpacing: 0.5 }}>
        {s}
      </span>
    );
  };

  const TabBtn = ({ id, label, count }) => (
    <button
      type="button"
      className={`nav-link ${activeTab === id ? "active" : ""}`}
      onClick={() => setActiveTab(id)}
    >
      {label} <span className="badge bg-secondary ms-2">{count}</span>
    </button>
  );

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h3 className="fw-bold mb-1">Manage Products</h3>
          <div className="text-muted small">
            Approve / Reject vendor products and keep inventory clean.
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={load}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small">Pending</div>
                  <div className="fs-3 fw-bold">{pending.length}</div>
                </div>
                <span className="badge bg-warning text-dark px-3 py-2">PENDING</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small">Approved</div>
                  <div className="fs-3 fw-bold">{approved.length}</div>
                </div>
                <span className="badge bg-success px-3 py-2">APPROVED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small">Rejected</div>
                  <div className="fs-3 fw-bold">{rejected.length}</div>
                </div>
                <span className="badge bg-danger px-3 py-2">REJECTED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <TabBtn id="pending" label="Pending" count={pending.length} />
              </li>
              <li className="nav-item">
                <TabBtn id="approved" label="Approved" count={approved.length} />
              </li>
              <li className="nav-item">
                <TabBtn id="rejected" label="Rejected" count={rejected.length} />
              </li>
            </ul>

            <div className="d-flex gap-2" style={{ minWidth: 280 }}>
              <input
                className="form-control"
                placeholder="Search product / vendor / category..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button
                className="btn btn-outline-dark"
                onClick={() => setQ("")}
                disabled={!q}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="text-muted small mt-2">
            Showing <b>{filtered.length}</b> item(s) in <b className="text-capitalize">{activeTab}</b>.
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  <th className="ps-3">Product</th>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-end pe-3" style={{ width: 220 }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="ps-3">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: 52,
                            height: 52,
                            objectFit: "cover",
                            borderRadius: 10,
                          }}
                        />
                        <div>
                          <div className="fw-semibold">{p.name}</div>
                          <div className="text-muted small">
                            ID: {p.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="fw-semibold">
                        {p.vendorShopName || "Vendor"}
                      </div>
                      <div className="text-muted small">
                        {p.vendorEmail || "-"}
                      </div>
                    </td>

                    <td>
                      <div className="text-muted small">
                        {titleOfCat(p.category)} / {p.subCategory}
                      </div>
                    </td>

                    <td className="fw-bold text-success">₹{p.price}</td>

                    <td>
                      <StatusBadge status={p.status} />
                    </td>

                    <td className="text-end pe-3">
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => setStatus(p.id, "approved")}
                          disabled={(p.status || "pending") === "approved"}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setStatus(p.id, "rejected")}
                          disabled={(p.status || "pending") === "rejected"}
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => del(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-5">
                      No products found in this tab.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-top text-muted small">
            Tip: Vendor products will appear on user side only after <b>Approved</b>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
