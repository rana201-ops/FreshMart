import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, updateQty, removeFromCart, cartTotal } =
    useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔐 Login check
  if (!user) {
    alert("Please login first");
    navigate("/login");
    return null;
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">Your Cart 🛒</h3>

      {cart.length === 0 ? (
        <p className="text-muted text-center">
          Your cart is empty 🛍️
        </p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="card mb-3 p-3 d-flex flex-row gap-3 align-items-center"
            >
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
                <p className="mb-2">
                  ₹{item.price} × {item.qty}
                </p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => updateQty(item.id, "dec")}
                  >
                    −
                  </button>

                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => updateQty(item.id, "inc")}
                  >
                    +
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <h5 className="mt-3">
            Total: ₹{cartTotal}
          </h5>

          {/* CHECKOUT BUTTON */}
          <button
            className="btn btn-success mt-3"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
