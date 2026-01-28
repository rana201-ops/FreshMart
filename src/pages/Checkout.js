import { useContext, useEffect, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ORDERS_KEY = "freshmart_orders";
const OFFERS_KEY = "freshmart_offers";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  // ✅ Offers + coupon
  const [offers, setOffers] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null); // { title, type, value, min, code }
  const [msg, setMsg] = useState("");

  // ✅ Payment
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" | "online"
  const [isPaying, setIsPaying] = useState(false);

  // ✅ Load active offers
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(OFFERS_KEY) || "[]");
    const active = saved.filter((o) => o.active !== false);
    setOffers(active);
  }, []);

  // ✅ Coupon rules (Demo)
  const couponRules = useMemo(
    () => ({
      FRESH20: { type: "PERCENT", value: 20, title: "Flat 20% OFF", min: 0 },
      SAVE100: { type: "AMOUNT", value: 100, title: "₹100 OFF", min: 999 },
      BOGO: { type: "BOGO", value: 0, title: "Buy 1 Get 1 Free", min: 0 },
    }),
    []
  );

  // ✅ Discount calculation
  const discount = useMemo(() => {
    if (!applied) return 0;
    if (cartTotal < (applied.min || 0)) return 0;

    if (applied.type === "PERCENT") {
      return Math.round((cartTotal * applied.value) / 100);
    }
    if (applied.type === "AMOUNT") {
      return Math.min(applied.value, cartTotal);
    }
    // BOGO demo (no calculation)
    return 0;
  }, [applied, cartTotal]);

  const finalTotal = Math.max(0, cartTotal - discount);

  const applyCoupon = () => {
    setMsg("");
    const code = coupon.trim().toUpperCase();
    if (!code) return setMsg("Enter coupon code");

    const rule = couponRules[code];
    if (!rule) return setMsg("Invalid coupon code");

    if (cartTotal < (rule.min || 0)) {
      return setMsg(`Minimum order ₹${rule.min} required for this coupon`);
    }

    setApplied({ ...rule, code });
    setMsg(`Coupon applied: ${code}`);
  };

  const removeCoupon = () => {
    setApplied(null);
    setCoupon("");
    setMsg("Coupon removed");
  };

  // ✅ Save order (used by COD + Online demo)
  const placeOrder = (paidStatus = "pending") => {
    if (!user) return alert("Please login first");
    if (!form.name || !form.phone || !form.address)
      return alert("Please fill all details");
    if (cart.length === 0) return alert("Cart is empty");

    const prev = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");

    const newOrder = {
      id: Date.now(),
      userEmail: user.email,

      items: cart.map((i) => ({
        ...i,
        soldBy: i.vendorShopName || i.vendorEmail || "FreshMart",
      })),

      total: cartTotal,
      discount,
      finalTotal,

      coupon: applied
        ? { code: applied.code, type: applied.type, value: applied.value }
        : null,

      payment: {
        method: paymentMethod, // cod/online
        status: paidStatus, // pending/paid
      },

      address: form.address,
      phone: form.phone,
      name: form.name,
      status: "placed",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...prev]));
    clearCart();
    navigate("/order-success");
  };

  // ✅ Payment flow
  const payNow = () => {
    if (paymentMethod === "cod") {
      placeOrder("pending");
      return;
    }

    // online demo
    setIsPaying(true);
    setMsg("");
    setTimeout(() => {
      setIsPaying(false);
      alert("✅ Payment Successful (Demo)");
      placeOrder("paid");
    }, 1200);
  };

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <h3 className="fw-bold mb-3">Checkout</h3>

      {/* ✅ Order Summary */}
      <div className="card p-3 shadow-sm mb-3">
        <h6 className="fw-bold">Order Summary</h6>

        {cart.length === 0 ? (
          <p className="text-muted mb-0">Your cart is empty.</p>
        ) : (
          <>
            {cart.map((i) => (
              <div key={i.id} className="d-flex justify-content-between">
                <small>
                  {i.name} × {i.qty}
                </small>
                <small className="fw-semibold">₹{i.price * i.qty}</small>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between">
              <span className="text-muted">Subtotal</span>
              <b>₹{cartTotal}</b>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-muted">Discount</span>
              <b className="text-success">- ₹{discount}</b>
            </div>

            <div className="d-flex justify-content-between mt-1">
              <span className="text-muted">Final Total</span>
              <b>₹{finalTotal}</b>
            </div>

            {applied?.type === "BOGO" && (
              <div className="alert alert-warning py-2 mt-2 mb-0">
                BOGO is a demo offer (discount not calculated). It can be handled
                with backend rules later.
              </div>
            )}
          </>
        )}
      </div>

      {/* ✅ Available Offers */}
      <div className="card p-3 shadow-sm mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0">Available Offers</h6>
          <small className="text-muted">Active offers</small>
        </div>

        {offers.length === 0 ? (
          <p className="text-muted mt-2 mb-0">No offers available.</p>
        ) : (
          <div className="row g-2 mt-2">
            {offers.map((o) => (
              <div className="col-md-6" key={o.id}>
                <div className="border rounded p-2 h-100">
                  <div className="fw-semibold text-success">{o.title}</div>
                  <small className="text-muted">{o.desc}</small>
                </div>
              </div>
            ))}
          </div>
        )}

        <small className="text-muted d-block mt-2">
          Try coupons: <b>FRESH20</b>, <b>SAVE100</b> (min ₹999), <b>BOGO</b>
        </small>
      </div>

      {/* ✅ Coupon Apply */}
      <div className="card p-3 shadow-sm mb-3">
        <h6 className="fw-bold">Apply Coupon</h6>

        {msg && <div className="alert alert-info py-2">{msg}</div>}

        <div className="d-flex gap-2 flex-wrap">
          <input
            className="form-control"
            placeholder="Enter coupon code (e.g., FRESH20)"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />

          {!applied ? (
            <button className="btn btn-success" onClick={applyCoupon}>
              Apply
            </button>
          ) : (
            <button className="btn btn-outline-danger" onClick={removeCoupon}>
              Remove
            </button>
          )}
        </div>

        {applied && (
          <small className="text-muted d-block mt-2">
            Applied: <b>{applied.code}</b> ({applied.title})
          </small>
        )}
      </div>

      {/* ✅ Delivery Details */}
      <div className="card p-3 shadow-sm mb-3">
        <h6 className="fw-bold">Delivery Details</h6>

        <input
          className="form-control mb-2"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Mobile Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Delivery Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>

      {/* ✅ Payment Method */}
      <div className="card p-3 shadow-sm">
        <h6 className="fw-bold">Payment Method</h6>

        <div className="d-flex gap-4 flex-wrap mt-2">
          <label className="d-flex align-items-center gap-2">
            <input
              type="radio"
              name="pm"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>

          <label className="d-flex align-items-center gap-2">
            <input
              type="radio"
              name="pm"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            UPI / Card (Demo)
          </label>
        </div>

        <small className="text-muted d-block mt-2">
          * Online payment is simulated for frontend demo. Razorpay integration
          will be added in backend.
        </small>

        <button
          className="btn btn-success w-100 mt-3"
          onClick={payNow}
          disabled={isPaying || cart.length === 0}
        >
          {paymentMethod === "cod"
            ? `Place Order (COD) ₹${finalTotal}`
            : isPaying
            ? "Processing Payment..."
            : `Pay Now ₹${finalTotal}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
