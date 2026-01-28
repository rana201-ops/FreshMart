import { Routes, Route } from "react-router-dom";

import UserLayout from "./components/Layout/UserLayout";
import AdminLayout from "./components/adminLayout/AdminLayout";
import VendorLayout from "./components/vendorLayout/VendorLayout";

import ProtectedRoute from "./components/Layout/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Category from "./pages/Category";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Offers from "./pages/Offers";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageVendors from "./pages/admin/ManageVendors";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageOffers from "./pages/admin/ManageOffers"; // ✅ ADD THIS

import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorSettings from "./pages/vendor/VendorSettings";

function App() {
  return (
    <Routes>
      {/* USER AREA */}
      <Route element={<UserLayout />}>
        <Route index element={<Home />} />

        <Route path="offers" element={<Offers />} />
        <Route path="category/:name" element={<Category />} />
        <Route path="category/:name/:subCategory" element={<Products />} />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        <Route
          path="cart"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "vendor"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="wishlist"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "vendor"]}>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "vendor"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="order-success" element={<OrderSuccess />} />
      </Route>

      {/* ADMIN AREA */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="vendors" element={<ManageVendors />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="offers" element={<ManageOffers />} /> {/* ✅ ADD THIS */}
      </Route>

      {/* VENDOR AREA */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute allowedRoles={["vendor"]}>
            <VendorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<VendorDashboard />} />
        <Route path="products" element={<VendorProducts />} />
        <Route path="orders" element={<VendorOrders />} />
        <Route path="settings" element={<VendorSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
