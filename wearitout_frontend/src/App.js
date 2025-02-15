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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated (i.e., token exists)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Sets isAuthenticated to true if token exists
  }, []);


  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <PhosphorIconInit />

      <Routes>
        <Route exact path="/" element={<HomePageTwo />} />
        <Route exact path="/home" element={<HomePageTwo />} />
        <Route exact path="/shop" element={<ShopPage />} />
        <Route exact path="/blog" element={<BlogPage />} />
        <Route exact path="/blog-details" element={<BlogDetailsPage />} />
        <Route exact path="/contact" element={<ContactPage />} />
        <Route exact path="/oauth-callback" element={<OAuthCallback />} />

        {/* Public route (Account Page) */}
        <Route
          exact
          path="/account"
          element={isAuthenticated ? <Navigate to="/home" /> : <AccountPage />}  
        />

        {/* Protected routes */}
        <Route
          exact
          path="/cart"
          element={isAuthenticated ? <CartPage /> : <Navigate to="/account" />}
        />
        <Route
          exact
          path="/product-details/:id"
          element={isAuthenticated ? <ProductDetailsPageTwo /> : <Navigate to="/account" />}
        />
        <Route
          exact
          path="/checkout"
          element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/account" />}
        />
        <Route
          exact
          path="/shop-management"
          element={isAuthenticated ? <ShopManagementPage /> : <Navigate to="/account" />}
        />
        <Route
          exact
          path="/order-management"
          element={isAuthenticated ? <OrderManagementPage /> : <Navigate to="/account" />}
        />
        <Route
          exact
          path="/order-user"
          element={isAuthenticated ? <OrderManagementUserPage /> : <Navigate to="/account" />}
        />
        <Route
          exact
          path="/dashboard"
          element={isAuthenticated ? <DashBoardPage /> : <Navigate to="/account" />}
        />
        <Route
          exact
          path="/add-product"
          element={isAuthenticated ? <AddProductPage /> : <Navigate to="/account" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
