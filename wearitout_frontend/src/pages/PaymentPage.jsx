import React from "react";
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ShippingTwo from "../components/ShippingTwo";  // Nếu cần hiển thị phần vận chuyển
import ScrollToTop from "react-scroll-to-top";
import Cart_Services from "../services/cart";  // Giả sử bạn có một service để lấy giỏ hàng
import Account_Service from "../services/account";  // Để lấy thông tin người dùng
import formatVND from "../helper/formatVND";  // Để định dạng giá trị tiền tệ
import Payment from "../components/Payment";

const PaymentPage = () => {



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

            {/* Breadcrumb */}
            <Breadcrumb title={"Thanh toán"} />

            {/* Payment */}
            <Payment/>

            {/* FooterTwo */}
            <FooterTwo />
            {/* BottomFooter */}
            <BottomFooter />

        </>
    );
};

export default PaymentPage;
