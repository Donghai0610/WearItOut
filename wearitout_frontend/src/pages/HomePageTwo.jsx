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
import Swal from "sweetalert2";

const HomePageTwo = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Hiển thị dialog giới thiệu về dự án sau 1 giây (1000ms)
    const timer = setTimeout(() => {
      Swal.fire({
        title: "🫡 Xin chào mọi người",
        text: "Hiện tại chúng mình đang thực hiện dự án 'Wear It Out', đây là dự án nhằm cung cấp cho mọi người một nơi có thể trao đổi buôn bán quần áo cũ. Chúng mình mong muốn thông qua dự án này có thể giúp giảm thải tác động của quần áo tới môi trường và giúp đỡ mọi người trong việc tìm mua những trang phục phù hợp với giá cả và đảm bảo về chất lượng cũng như bán những bộ quần áo không còn sử dụng nữa.",
        icon: "info",
        showCancelButton: false,
        confirmButtonText: "Cảm ơn bạn đã quan tâm!",
        footer: "<b>Thông tin liên hệ:</b><br>Trưởng dự án: Nguyễn Quang Minh<br>SĐT: 0972456177<br>Địa chỉ: Đại học FPT Hà Nội."
      });
      setShowWelcome(false);  // Ẩn thông báo sau khi đã hiển thị dialog
    }, 1000); // Hiển thị dialog sau 1 giây

    return () => clearTimeout(timer);  // Dọn dẹp khi component unmount
  }, []);  // Chạy once khi component được mount

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

      
    </>
  );
};

export default HomePageTwo;
