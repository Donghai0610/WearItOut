import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import NewArrivalTwo from "../components/NewArrivalTwo";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ShippingTwo from "../components/ShippingTwo";
import Sidebar from "../components/SideBar";
import Dashboard from "../components/DashBoard";
import Layout from "../components/Layout";

const DashBoardPage = () =>{
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
            <Breadcrumb title={"Quản lý đơn hàng"} />

            {/* ProductDetailsTwo */}
            {/* ProductDetailsTwo */}
            <Layout>
                <Dashboard />
            </Layout>

            {/* NewArrivalTwo */}

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
}




export default DashBoardPage;