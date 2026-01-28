import { createContext, useState } from "react";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ADD TO CART
  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // UPDATE QTY
  const updateQty = (id, type) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            qty:
              type === "inc"
                ? item.qty + 1
                : Math.max(1, item.qty - 1),
          };
        }
        return item;
      })
    );
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // CART TOTAL
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // CLEAR CART (after order placed)
  const clearCart = () => {
    setCart([]);
  };

  // WISHLIST
  const addToWishlist = (product) => {
    if (!wishlist.find((item) => item.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateQty,
        removeFromCart,
        cartTotal,
        clearCart,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
