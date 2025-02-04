import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AuthProvider } from "./helper/AuthContext";
import OrderManagementUserPage from "./pages/OrderManagementUserPage ";
import PrivateRoute from "./helper/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteScrollToTop />
        <PhosphorIconInit />

        <Routes>
          <Route exact path="/" element={<HomePageTwo />} />
          <Route exact path="/home" element={<HomePageTwo />} />
          <Route exact path="/shop" element={<ShopPage />} />
          <Route exact path="/product-details/:id" element={<ProductDetailsPageTwo />} />
          <Route exact path="/blog" element={<BlogPage />} />
          <Route exact path="/blog-details" element={<BlogDetailsPage />} />
          <Route exact path="/contact" element={<ContactPage />} />
          <Route exact path="/oauth-callback" element={<OAuthCallback />} />

          {/* Protected Routes */}
          <Route
            exact
            path="/cart"
            element={<PrivateRoute element={<CartPage />} />}
          />
          <Route
            exact
            path="/checkout"
            element={<PrivateRoute element={<CheckoutPage />} />}
          />
          <Route
            exact
            path="/account"
            element={<AccountPage />}
          />
          <Route
            exact
            path="/shop-management"
            element={<PrivateRoute element={<ShopManagementPage />} />}
          />
          <Route
            exact
            path="/order-management"
            element={<PrivateRoute element={<OrderManagementPage />} />}
          />
          <Route
            exact
            path="/order-user"
            element={<PrivateRoute element={<OrderManagementUserPage />} />}
          />
          <Route
            exact
            path="/dashboard"
            element={<PrivateRoute element={<DashBoardPage />} />}
          />
          <Route
            exact
            path="/add-product"
            element={<PrivateRoute element={<AddProductPage />} />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
