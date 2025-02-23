import React from "react";
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
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
