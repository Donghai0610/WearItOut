import ColorInit from "../helper/ColorInit";
import Preloader from "../helper/Preloader";

import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ShippingTwo from "../components/ShippingTwo";
import Layout from "../components/Layout";
import AddProduct from "../components/AddProduct";



const AddProductPage = () => {



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
      <Breadcrumb title={"Thêm sản phẩm"} />

    

      {/* ProductDetailsTwo */}
      <Layout>
        <AddProduct />
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

export default AddProductPage;