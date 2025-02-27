import React from "react";
import WearFitsViewer from "../components/WearFitsViewer";
import HeaderTwo from "../components/HeaderTwo";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import NewsletterTwo from "../components/NewsletterTwo";
import ColorInit from "../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";
import Preloader from "../helper/Preloader";
const WearFitsViewerPage = () => {
    return (
        <>
            <ColorInit color={true} />
            <ScrollToTop smooth color="#FA6400" />
            <Preloader />
            <HeaderTwo category={true} />
            <WearFitsViewer/>
            <NewsletterTwo />
            <FooterTwo />
            <BottomFooter />
        </>
    );
};
export default WearFitsViewerPage;