import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import catalog from "../data/catalog";
import { ShopContext } from "../context/ShopContext";

const LS_KEY = "freshmart_products";

const Products = () => {
  const { name, subCategory } = useParams();
  const { addToCart, addToWishlist } = useContext(ShopContext);

  const category = catalog[name];
  const subCategories = category ? Object.keys(category.subCategories) : [];

  const [activeSub, setActiveSub] = useState(subCategory || subCategories[0]);
  const [message, setMessage] = useState("");
  const [vendorApproved, setVendorApproved] = useState([]);

  // sync subcategory from URL
  useEffect(() => {
    if (subCategory) setActiveSub(subCategory);
  }, [subCategory]);

  // load approved vendor products
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    const approved = all.filter(
      (p) => p.status === "approved" && p.category === name
    );
    setVendorApproved(approved);
  }, [name]);

  if (!category) {
    return <h3 className="text-center mt-5">Category not found</h3>;
  }

  // static + vendor products
  const staticProducts = category.subCategories[activeSub] || [];
  const vendorProducts = vendorApproved.filter(
    (p) => p.subCategory === activeSub
  );

  const products = [...vendorProducts, ...staticProducts];

  return (
    <div className="container py-4">
      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}

      <div className="row">
        {/* SIDEBAR */}
        <div className="col-md-3">
          <h5 className="fw-bold mb-3">{category.title}</h5>

          <ul className="list-group">
            {subCategories.map((sub) => (
              <li
                key={sub}
                className={`list-group-item ${
                  activeSub === sub ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveSub(sub)}
              >
                {sub.replace("-", " ")}
              </li>
            ))}
          </ul>

          <small className="text-muted d-block mt-3">
            * Vendor products appear after admin approval
          </small>
        </div>

        {/* PRODUCTS */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-capitalize">
              {activeSub.replace("-", " ")}
            </h4>
            <small className="text-muted">
              Showing {products.length} items
            </small>
          </div>

          {products.length === 0 ? (
            <p className="text-muted">No products available.</p>
          ) : (
            <div className="row g-4">
              {products.map((p) => (
                <div className="col-6 col-md-4" key={`${p.id}-${p.name}`}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="card-img-top"
                      style={{ height: "160px", objectFit: "cover" }}
                    />

                    <div className="card-body text-center">
                      <h6 className="mb-1">{p.name}</h6>

                      {p.vendorShopName && (
  <small className="text-muted d-block mb-1">
    Sold by: <b>{p.vendorShopName}</b>
  </small>
)}


                      <p className="fw-bold text-success mb-2">₹{p.price}</p>

                      <button
                        className="btn btn-outline-danger btn-sm w-100 mb-2"
                        onClick={() => {
                          addToWishlist(p);
                          setMessage("❤️ Product added to Wishlist");
                          setTimeout(() => setMessage(""), 1200);
                        }}
                      >
                        ❤️ Add to Wishlist
                      </button>

                      <button
                        className="btn btn-success btn-sm w-100"
                        onClick={() => {
                          addToCart(p);
                          setMessage("🛒 Product added to Cart");
                          setTimeout(() => setMessage(""), 1200);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
