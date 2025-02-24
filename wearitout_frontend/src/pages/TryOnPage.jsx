import TryOn from "../components/TryOn"
import React from "react";
import HeaderTwo from "../components/HeaderTwo";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
const TryOnPage = () => {
    return (
        <>
            {/* HeaderTwo */}
            <HeaderTwo category={true} />
            <TryOn/>
            {/* FooterTwo */}
            <FooterTwo />
            {/* BottomFooter */}
            <BottomFooter />

        </>
    );
};
export default TryOnPage;