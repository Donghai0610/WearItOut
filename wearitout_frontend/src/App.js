import React, { useEffect } from "react";
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
import ChatBoxPage from "./pages/ChatBoxPage";
import WearFitsViewerPage from "./pages/WearFitsViewerPage";
import TryOnPage from "./pages/TryOnPage";
import SearchImagePage from "./pages/SearchImagePage";
import {FaFacebookMessenger, FaRobot, FaRuler, FaTape, FaTshirt, FaViber,} from "react-icons/fa"; // Thêm thư viện icon cho các biểu tượng
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const ChatButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChatButton = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  span {
    margin-top: 5px;
    font-size: 12px;
    color: #333;
  }
`;

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

<ChatButtonContainer>
        <ChatButton>
          <a href="https://www.facebook.com/profile.php?id=61572960855976" target="_blank" rel="noopener noreferrer">
            <FaFacebookMessenger size={40} color="#0084FF" />
            <span>Chat Facebook</span>
          </a>
        </ChatButton>
        <ChatButton>
          <a href="/chatbox" >
            <FaRobot size={40} color="#25D366" />
            <span>Chat AI</span>
          </a>
        </ChatButton>
        <ChatButton>
          <a href="/tryon">
            <FaTshirt   size={40} color="#FF4B4B" />
            <span>Phòng Thay Đồ Ảo</span>
          </a>
        </ChatButton>
        <ChatButton>
          <a href="/wearfitview">
            <FaTape   size={40} color="#FF4B4B" />
            <span>Phòng Custom Size</span>
          </a>
        </ChatButton>
      </ChatButtonContainer>

    </BrowserRouter>
  );
}

export default App;
