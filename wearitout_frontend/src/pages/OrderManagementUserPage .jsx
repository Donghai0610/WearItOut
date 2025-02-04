
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ShippingTwo from "../components/ShippingTwo";
import Layout from "../components/Layout";
import OrderManagementUser from "../components/OrderManagementUser";
const OrderManagementUserPage = () => {



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
            <Breadcrumb title={"Quản lý đơn mua"} />

            {/* ProductDetailsTwo */}
            {/* ProductDetailsTwo */}
            <Layout>
                <OrderManagementUser />
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

export default OrderManagementUserPage;