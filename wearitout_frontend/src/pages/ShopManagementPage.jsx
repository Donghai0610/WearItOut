import ColorInit from "../helper/ColorInit";
import Preloader from "../helper/Preloader";
import ShopManagement from "../components/ShopManagement";

import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import NewArrivalTwo from "../components/NewArrivalTwo";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ShippingTwo from "../components/ShippingTwo";
import Sidebar from "../components/SideBar";
import Layout from "../components/Layout";



const ShopManagementPage = () => {



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
      <Breadcrumb title={"Quản lý sản phẩm"} />

    

      {/* ProductDetailsTwo */}
      <Layout>
        <ShopManagement />
      </Layout>


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

export default ShopManagementPage;