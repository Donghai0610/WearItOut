import React from "react";
import ChatBox from "../components/ChatBox";
import ColorInit from "../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";
import Preloader from "../helper/Preloader";
import BottomFooter from "../components/BottomFooter";
import FooterTwo from "../components/FooterTwo";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import NewsletterTwo from "../components/NewsletterTwo";
const ChatBoxPage = () => {
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
            <Breadcrumb title={"Nhắn Tin"} />
            {/* Checkout */}
            <ChatBox />
            {/* ShippingOne */}
            <NewsletterTwo />
            {/* FooterTwo */}
            <FooterTwo />

            {/* BottomFooter */}
            <BottomFooter />


        </>
    );
};
export default ChatBoxPage;
