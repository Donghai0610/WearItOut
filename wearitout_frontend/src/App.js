import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import PhosphorIconInit from "./helper/PhosphorIconInit";
import HomePageTwo from "./pages/HomePageTwo";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPageTwo from "./pages/ProductDetailsPageTwo";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import ContactPage from "./pages/ContactPage";
import OAuthCallback from "./services/oauthCallback";
import ShopManagementPage from "./pages/ShopManagementPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import DashBoardPage from "./pages/DashBoardPage";
import AddProductPage from "./pages/AddProductPage";
import OrderManagementUserPage from "./pages/OrderManagementUserPage ";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated (i.e., token exists)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Sets isAuthenticated to true if token exists
  }, []);


  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteScrollToTop />
        <PhosphorIconInit />

        <Routes>
          <Route path="/" element={<HomePageTwo />} />
          <Route path="/home" element={<HomePageTwo />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog-details" element={<BlogDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />

          {/* Public Route */}
          <Route path="/account" element={<AccountPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product-details/:id" element={<ProductDetailsPageTwo />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/shop-management" element={<ShopManagementPage />} />
            <Route path="/order-management" element={<OrderManagementPage />} />
            <Route path="/order-user" element={<OrderManagementUserPage />} />
            <Route path="/dashboard" element={<DashBoardPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
