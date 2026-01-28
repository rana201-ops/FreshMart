import { useEffect, useState } from "react";

const OFFERS_KEY = "freshmart_offers";

const defaultOffers = [
  { id: 1, title: "Flat 20% OFF", desc: "On fresh fruits & vegetables", active: true },
  { id: 2, title: "Buy 1 Get 1 Free", desc: "On Dairy products", active: true },
  { id: 3, title: "₹100 OFF", desc: "On orders above ₹999", active: true },
];

const ManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", desc: "", active: true });
  const [msg, setMsg] = useState("");

  const load = () => {
    const saved = JSON.parse(localStorage.getItem(OFFERS_KEY) || "null");
    if (saved && Array.isArray(saved)) setOffers(saved);
    else {
      setOffers(defaultOffers);
      localStorage.setItem(OFFERS_KEY, JSON.stringify(defaultOffers));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveAll = (next) => {
    setOffers(next);
    localStorage.setItem(OFFERS_KEY, JSON.stringify(next));
  };

  const reset = () => {
    setEditId(null);
    setForm({ title: "", desc: "", active: true });
  };

  const submit = (e) => {
    e.preventDefault();
    setMsg("");

    const title = form.title.trim();
    const desc = form.desc.trim();

    if (!title || !desc) {
      setMsg("Title and description required");
      return;
    }

    if (editId) {
      const next = offers.map((o) =>
        o.id === editId ? { ...o, title, desc, active: !!form.active } : o
      );
      saveAll(next);
      setMsg("Offer updated");
      reset();
      return;
    }

    const newOffer = {
      id: Date.now(),
      title,
      desc,
      active: !!form.active,
    };

    saveAll([newOffer, ...offers]);
    setMsg("Offer added");
    reset();
  };

  const edit = (o) => {
    setEditId(o.id);
    setForm({ title: o.title, desc: o.desc, active: o.active });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = (id) => {
    if (!window.confirm("Delete this offer?")) return;
    saveAll(offers.filter((o) => o.id !== id));
  };

  const toggle = (id) => {
    const next = offers.map((o) => (o.id === id ? { ...o, active: !o.active } : o));
    saveAll(next);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold mb-0">Manage Offers</h3>
        <button className="btn btn-sm btn-outline-secondary" onClick={load}>
          Refresh
        </button>
      </div>

      {msg && <div className="alert alert-info">{msg}</div>}

      <div className="card p-3 shadow-sm mb-4">
        <h5 className="fw-bold">{editId ? "Edit Offer" : "Add Offer"}</h5>

        <form onSubmit={submit} className="row g-3 mt-1">
          <div className="col-md-4">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Flat 20% OFF"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Description</label>
            <input
              className="form-control"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="e.g., On fruits & vegetables"
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Active</label>
            <select
              className="form-select"
              value={form.active ? "yes" : "no"}
              onChange={(e) => setForm({ ...form, active: e.target.value === "yes" })}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="col-md-4 d-flex align-items-end gap-2">
            <button className="btn btn-success w-100" type="submit">
              {editId ? "Update" : "Add"}
            </button>

            {editId && (
              <button className="btn btn-outline-secondary w-100" type="button" onClick={reset}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card p-3 shadow-sm">
        <h5 className="fw-bold">All Offers</h5>

        {offers.length === 0 ? (
          <p className="text-muted mb-0">No offers yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ width: 240 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id}>
                    <td className="fw-semibold">{o.title}</td>
                    <td>{o.desc}</td>
                    <td>
                      {o.active ? (
                        <span className="badge bg-success">active</span>
                      ) : (
                        <span className="badge bg-secondary">inactive</span>
                      )}
                    </td>
                    <td className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => edit(o)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => del(o.id)}>
                        Delete
                      </button>
                      <button className="btn btn-sm btn-outline-dark" onClick={() => toggle(o.id)}>
                        {o.active ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <small className="text-muted">
              * User side Offers page will show only <b>active</b> offers.
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOffers;
