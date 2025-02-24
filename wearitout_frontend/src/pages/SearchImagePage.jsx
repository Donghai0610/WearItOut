import React from "react";
import SearchImage from "../components/SearchByImages/SearchImage";
import HeaderTwo from "../components/HeaderTwo";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
const SearchImagePage = () => {
    return (
        <>
            {/* HeaderTwo */}
            <HeaderTwo category={true} />
            <SearchImage/>
            {/* FooterTwo */}
            <FooterTwo />
            {/* BottomFooter */}
            <BottomFooter />
        </>
    );
};
export default SearchImagePage;