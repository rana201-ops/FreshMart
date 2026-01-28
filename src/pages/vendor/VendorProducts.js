import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import catalog from "../../data/catalog";

const LS_KEY = "freshmart_products";

const firstCategory = Object.keys(catalog)[0];
const firstSub = Object.keys(catalog[firstCategory].subCategories)[0];

const VendorProducts = () => {
  const { user } = useContext(AuthContext);

  const [all, setAll] = useState([]);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: firstCategory,
    subCategory: firstSub,
  });

  // load
  useEffect(() => {
    setAll(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
  }, []);

  const mine = useMemo(
    () => all.filter((p) => p.vendorEmail === user?.email),
    [all, user?.email]
  );

  const subOptions = useMemo(() => {
    const cat = catalog[form.category];
    return cat ? Object.keys(cat.subCategories) : [];
  }, [form.category]);

  // If category changes -> auto set first subCategory
  useEffect(() => {
    if (!subOptions.includes(form.subCategory)) {
      setForm((prev) => ({ ...prev, subCategory: subOptions[0] || "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.category]);

  const save = (next) => {
    setAll(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const reset = () => {
    setEditId(null);
    setForm({
      name: "",
      price: "",
      image: "",
      category: firstCategory,
      subCategory: Object.keys(catalog[firstCategory].subCategories)[0],
    });
  };

  const submit = (e) => {
    e.preventDefault();
    setMsg("");

    const name = form.name.trim();
    const image = form.image.trim();
    const price = Number(form.price);

    if (!name || !image || !form.price) return setMsg("Name, Price, Image required");
    if (!price || price <= 0) return setMsg("Enter valid price");

    // ✅ Edit
    if (editId) {
      const next = all.map((p) =>
        p.id === editId
          ? { ...p, name, image, price, category: form.category, subCategory: form.subCategory, status: "pending" }
          : p
      );
      save(next);
      setMsg("Updated (pending approval)");
      return reset();
    }

    // ✅ Add
    const newP = {
      id: Date.now(),
      name,
      price,
      image,
      category: form.category,
      subCategory: form.subCategory,
      vendorEmail: user?.email,
      status: "pending",
    };

    save([newP, ...all]);
    setMsg("Added (pending approval)");
    reset();
  };

  const edit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      subCategory: p.subCategory,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = (id) => {
    if (!window.confirm("Delete product?")) return;
    save(all.filter((p) => p.id !== id));
    setMsg("Deleted");
  };

  const getCatTitle = (slug) => catalog[slug]?.title || slug;

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">Products</h3>
      {msg && <div className="alert alert-info">{msg}</div>}

      {/* Add/Edit Form */}
      <div className="card p-3 shadow-sm mb-4">
        <h5 className="fw-bold">{editId ? "Edit Product" : "Add Product"}</h5>

        <form onSubmit={submit} className="row g-3 mt-1">
          <div className="col-md-4">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Mango"
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Price (₹)</label>
            <input
              className="form-control"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g., 120"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Image URL</label>
            <input
              className="form-control"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {Object.keys(catalog).map((slug) => (
                <option value={slug} key={slug}>
                  {catalog[slug].title}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Sub Category</label>
            <select
              className="form-select"
              value={form.subCategory}
              onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
            >
              {subOptions.map((sub) => (
                <option value={sub} key={sub}>
                  {sub}
                </option>
              ))}
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

      {/* List */}
      <div className="card p-3 shadow-sm">
        <h5 className="fw-bold">My Products</h5>

        {mine.length === 0 ? (
          <p className="text-muted mb-0">No products yet.</p>
        ) : (
          <div className="table-responsive mt-2">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {mine.map((p) => (
                  <tr key={p.id}>
                    <td className="d-flex align-items-center gap-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }}
                      />
                      <div>
                        <div className="fw-semibold">{p.name}</div>
                        <small className="text-muted">{p.vendorEmail}</small>
                      </div>
                    </td>

                    <td>
                      <small className="text-muted">
                        {getCatTitle(p.category)} / {p.subCategory}
                      </small>
                    </td>

                    <td className="fw-bold text-success">₹{p.price}</td>

                    <td>
                      <span className="badge bg-warning text-dark">
                        {p.status || "pending"}
                      </span>
                    </td>

                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(p)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => del(p.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <small className="text-muted">
              New/edited products go to <b>pending</b> until admin approves.
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProducts;
