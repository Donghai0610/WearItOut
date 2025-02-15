import React, { useEffect, useState } from "react";
import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import BannerTwo from "../components/BannerTwo";
import PromotionalTwo from "../components/PromotionalTwo";
import DealsOne from "../components/DealsOne";
import TopSellingOne from "../components/TopSellingOne";
import TrendingOne from "../components/TrendingOne";
import DiscountOne from "../components/DiscountOne";
import FeaturedOne from "../components/FeaturedOne";
import BigDealOne from "../components/BigDealOne";
import TopSellingTwo from "../components/TopSellingTwo";
import PopularProductsOne from "../components/PopularProductsOne";
import TopVendorsTwo from "../components/TopVendorsTwo";
import DaySaleOne from "../components/DaySaleOne";
import RecentlyViewedOne from "../components/RecentlyViewedOne";
import BrandTwo from "../components/BrandTwo";
import ShippingTwo from "../components/ShippingTwo";
import NewsletterTwo from "../components/NewsletterTwo";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ColorInit from "../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";

const HomePageTwo = () => {

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Ẩn thông báo sau 5 giây (5000ms)
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    // Clean up khi component bị unmount hoặc hết thời gian
    return () => clearTimeout(timer);
  }, []); // Chạy once khi component được mount

  return (

    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#FA6400" />

      {/* Preloader */}
      <Preloader />

      {/* HeaderTwo */}
      <HeaderTwo category={true} />

      {/* BannerTwo */}
      <BannerTwo />

      {/* PromotionalTwo */}
      <PromotionalTwo />

      {/* TopSellingOne */}
      <TopSellingOne />

      {/* TrendingOne */}
      <TrendingOne />

      {/* DiscountOne */}
      <DiscountOne />

      {/* BrandTwo */}
      <BrandTwo />

      {/* ShippingTwo */}
      <ShippingTwo />

      {/* NewsletterTwo */}
      <NewsletterTwo />

      {/* FooterTwo */}
      <FooterTwo />

      {/* BottomFooter */}
      <BottomFooter />

      {/* Hiển thị thông báo chào mừng nếu showWelcome là true */}
      {showWelcome && (
        <div style={styles.welcomeMessage}>
          <h2>Chào mừng đến với website của chúng tôi!</h2>
        </div>
      )}
    </>
  );
};
const styles = {
  welcomeMessage: {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    zIndex: 1000,
    fontSize: "18px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    animation: "moveMessage 5s linear infinite" // Áp dụng animation
  },
  "@keyframes moveMessage": {
    "0%": {
      transform: "translateX(-100%)" // Bắt đầu từ bên trái ngoài màn hình
    },
    "50%": {
      transform: "translateX(0)" // Đi vào giữa màn hình
    },
    "100%": {
      transform: "translateX(100%)" // Đi ra ngoài bên phải màn hình
    }
  }
};
export default HomePageTwo;
