import { useEffect, useState } from "react";

const LS_KEY = "freshmart_products";

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);

  const load = () => {
    const products = JSON.parse(localStorage.getItem(LS_KEY) || "[]");

    // vendor emails unique
    const map = {};
    products.forEach((p) => {
      if (!p.vendorEmail) return;
      if (!map[p.vendorEmail]) {
        map[p.vendorEmail] = {
          email: p.vendorEmail,
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        };
      }
      map[p.vendorEmail].total += 1;
      const st = p.status || "pending";
      map[p.vendorEmail][st] += 1;
    });

    setVendors(Object.values(map));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold mb-0">Manage Vendors</h3>
        <button className="btn btn-sm btn-outline-secondary" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="alert alert-info">
        <b>Note:</b> Backend not added yet, so vendor list is generated from
        vendor products saved in localStorage.
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Vendor Email</th>
              <th>Total Products</th>
              <th>Pending</th>
              <th>Approved</th>
              <th>Rejected</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.email}>
                <td className="fw-semibold">{v.email}</td>
                <td>{v.total}</td>
                <td>
                  <span className="badge bg-warning text-dark">{v.pending}</span>
                </td>
                <td>
                  <span className="badge bg-success">{v.approved}</span>
                </td>
                <td>
                  <span className="badge bg-danger">{v.rejected}</span>
                </td>
              </tr>
            ))}

            {vendors.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No vendors found (Add products from vendor panel first)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageVendors;
