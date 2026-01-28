import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, addToCart, removeFromWishlist } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    alert("Please login first");
    navigate("/login");
    return null;
  }

  return (
    <div className="container py-4">
      <h3>My Wishlist ❤️</h3>

      {wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        wishlist.map((item) => (
          <div key={item.id} className="card mb-3 p-3 d-flex flex-row gap-3 align-items-center">
            
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            {/* DETAILS */}
            <div className="flex-grow-1">
              <h6 className="mb-1">{item.name}</h6>
              <p className="mb-2 fw-bold text-success">₹{item.price}</p>

              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => {
                  addToCart(item);
                  removeFromWishlist(item.id);
                  alert("Moved to cart");
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
