import React from "react";
import WearFitsViewer from "../components/WearFitsViewer";
import HeaderTwo from "../components/HeaderTwo";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
const WearFitsViewerPage = () => {
    return (
        <>
            <HeaderTwo category={true} />
            <WearFitsViewer/>
            <FooterTwo />
            <BottomFooter />
        </>
    );
};
export default WearFitsViewerPage;