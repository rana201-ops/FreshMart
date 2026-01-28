import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const VendorSettings = () => {
  const { user } = useContext(AuthContext);

  // ✅ email-wise key (each vendor has own settings)
  const SETTINGS_KEY = `freshmart_vendor_settings_${user?.email || "guest"}`;

  const [shop, setShop] = useState({
    shopName: "",
    phone: "",
    address: "",
  });

  // ✅ Load saved settings for this vendor
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) setShop(JSON.parse(saved));
  }, [SETTINGS_KEY]);

  const save = () => {
    if (!shop.shopName.trim()) return alert("Please enter Shop Name");
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(shop));
    alert("Settings saved ✅");
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold">Store Settings</h3>
      <p className="text-muted">Vendor: {user?.email}</p>

      <div className="card p-3 shadow-sm" style={{ maxWidth: 650 }}>
        <label className="form-label">Shop Name</label>
        <input
          className="form-control mb-3"
          value={shop.shopName}
          onChange={(e) => setShop({ ...shop, shopName: e.target.value })}
          placeholder="e.g., Green Leaf Grocer"
        />

        <label className="form-label">Phone</label>
        <input
          className="form-control mb-3"
          value={shop.phone}
          onChange={(e) => setShop({ ...shop, phone: e.target.value })}
          placeholder="e.g., 9876543210"
        />

        <label className="form-label">Address</label>
        <textarea
          className="form-control mb-3"
          value={shop.address}
          onChange={(e) => setShop({ ...shop, address: e.target.value })}
          placeholder="Enter store address"
        />

        <button className="btn btn-success" onClick={save}>
          Save
        </button>
      </div>
    </div>
  );
};

export default VendorSettings;
