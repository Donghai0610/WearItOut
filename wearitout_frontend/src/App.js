import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth, login, logout } from "./store/authSlice";
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
import PaymentPage from "./pages/PaymentPage";
import ChatBoxPage from "./pages/ChatBoxPage";
import WearFitsViewerPage from "./pages/WearFitsViewerPage";
import TryOnPage from "./pages/TryOnPage";
import SearchImagePage from "./pages/SearchImagePage";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated === undefined) {
    return null;
  }

  return (
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
        <Route
          path="/account"
          element={!isAuthenticated ? <AccountPage /> : <Navigate to="/" />}
        />

          {/*Thinh add*/}

          {/* <Route
            exact
            path="/payment"
            element={<PrivateRoute element={<PaymentPage />} />}
          /> */}
          <Route
            exact
            path="/chatbox"
            element= {<ChatBoxPage />}
          />
          <Route
            exact
            path="/tryon"
            element= {<TryOnPage />}
          />
          <Route
            exact
            path="/searchimage"
            element= {<SearchImagePage />}
          />
          <Route
            exact
            path="/wearfitview"
            element= {<WearFitsViewerPage />}
          />
        {/* Protected Routes */}
        <Route
          path="/cart"
          element={isAuthenticated ? <CartPage /> : <Navigate to="/account" />}
        />
        <Route
          path="/product-details/:id"
          element={
            isAuthenticated ? (
              <ProductDetailsPageTwo />
            ) : (
              <Navigate to="/account" />
            )
          }
        />
        <Route
          path="/checkout"
          element={
            isAuthenticated ? <CheckoutPage /> : <Navigate to="/account" />
          }
        />
        <Route
          path="/shop-management"
          element={
            isAuthenticated ? (
              <ShopManagementPage />
            ) : (
              <Navigate to="/account" />
            )
          }
        />
        <Route
          path="/order-management"
          element={
            isAuthenticated ? (
              <OrderManagementPage />
            ) : (
              <Navigate to="/account" />
            )
          }
        />
        <Route
          path="/order-user"
          element={
            isAuthenticated ? (
              <OrderManagementUserPage />
            ) : (
              <Navigate to="/account" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashBoardPage /> : <Navigate to="/account" />
          }
        />
        <Route
          path="/add-product"
          element={
            isAuthenticated ? <AddProductPage /> : <Navigate to="/account" />
          }
        />

        {/* Redirect to login if not authenticated */}
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Navigate to="/account" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
