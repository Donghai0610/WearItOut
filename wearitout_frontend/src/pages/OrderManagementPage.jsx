import OrderManagement from "../components/OrderManagement";

import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ShippingTwo from "../components/ShippingTwo";
import Layout from "../components/Layout";
const OrderManagementPage = () => {



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
            <Breadcrumb title={"Quản lý đơn bán"} />

            {/* ProductDetailsTwo */}
            {/* ProductDetailsTwo */}
            <Layout>
                <OrderManagement />
            </Layout>
            {/* NewArrivalTwo */}
            {/* <NewArrivalTwo /> */}

            {/* ShippingOne */}
            <ShippingTwo />

            {/* NewsletterOne */}
            {/* <NewsletterOne /> */}

            {/* FooterTwo */}
            <FooterTwo />

            {/* BottomFooter */}
            <BottomFooter />




        </>
    );
};

export default OrderManagementPage;