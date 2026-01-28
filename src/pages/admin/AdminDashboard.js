import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container py-4">
      <h2 className="fw-bold">Admin Dashboard</h2>
      <p className="text-muted">Manage products, vendors, orders and offers</p>

      <div className="row g-3 mt-3">
        <div className="col-md-3">
          <Link to="/admin/products" className="text-decoration-none text-dark">
            <div className="card p-4 shadow-sm h-100">
              <h5 className="fw-bold">Manage Products</h5>
              <small className="text-muted">Approve / reject vendor products</small>
            </div>
          </Link>
        </div>

        <div className="col-md-3">
          <Link to="/admin/vendors" className="text-decoration-none text-dark">
            <div className="card p-4 shadow-sm h-100">
              <h5 className="fw-bold">Manage Vendors</h5>
              <small className="text-muted">View vendor activity</small>
            </div>
          </Link>
        </div>

        <div className="col-md-3">
          <Link to="/admin/orders" className="text-decoration-none text-dark">
            <div className="card p-4 shadow-sm h-100">
              <h5 className="fw-bold">Manage Orders</h5>
              <small className="text-muted">View all customer orders</small>
            </div>
          </Link>
        </div>

        <div className="col-md-3">
          <Link to="/admin/offers" className="text-decoration-none text-dark">
            <div className="card p-4 shadow-sm h-100">
              <h5 className="fw-bold">Manage Offers</h5>
              <small className="text-muted">Add / edit offers shown to users</small>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
