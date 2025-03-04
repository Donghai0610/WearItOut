import React from 'react';
import { Link } from 'react-router-dom';

const PromotionalTwo = () => {
    return (
        <section className="promotional-banner mt-32">
            <div className="container container-lg">
                <div className="row gy-4">
                    <div className="col-lg-4 col-sm-6">
                        <div className="position-relative rounded-16 overflow-hidden z-1 p-32">
                            <img
                                src="assets/images/bg/promo-bg-img1.png"
                                alt=""
                                className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"
                            />
                            <div className="flex-between flex-wrap gap-16">
                                <div className="">
                                    <span className="text-heading text-sm mb-8">Bảo Vệ Môi Trường</span>
                                    <h6 className="mb-0">Quần Áo Thời Trang Secondhand</h6>
                                    <p className="mb-8">Mua sắm sản phẩm secondhand là cách tuyệt vời để bảo vệ hành tinh, giảm thiểu rác thải và bảo tồn tài nguyên!</p>
                                    <Link
                                        to="/shop"
                                        className="d-inline-flex align-items-center gap-8 mt-16 text-heading text-md fw-medium border border-top-0 border-end-0 border-start-0 border-gray-900 hover-text-main-two-600 hover-border-main-two-600"
                                    >
                                        Mua Ngay
                                        <span className="icon text-md d-flex">
                                            <i className="ph ph-plus" />
                                        </span>
                                    </Link>
                                </div>
                                <div className="pe-xxl-4">
                                    {/* <img src="assets/images/thumbs/promo-img1.png" alt="" /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="position-relative rounded-16 overflow-hidden z-1 p-32">
                            <img
                                src="assets/images/bg/promo-bg-img2.png"
                                alt=""
                                className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"
                            />
                            <div className="flex-between flex-wrap gap-16">
                                <div className="">
                                    <span className="text-heading text-sm mb-8">Giảm Thiểu Lãng Phí</span>
                                    <h6 className="mb-0">Quần Áo Cũ Thời Thượng</h6>
                                    <p className="mb-8">Mua quần áo secondhand giúp giảm sự tiêu thụ tài nguyên và tiết kiệm chi phí cho người tiêu dùng!</p>
                                    <Link
                                        to="/shop"
                                        className="d-inline-flex align-items-center gap-8 mt-16 text-heading text-md fw-medium border border-top-0 border-end-0 border-start-0 border-gray-900 hover-text-main-two-600 hover-border-main-two-600"
                                    >
                                        Mua Ngay
                                        <span className="icon text-md d-flex">
                                            <i className="ph ph-plus" />
                                        </span>
                                    </Link>
                                </div>
                                <div className="pe-xxl-4">
                                    {/* <img src="assets/images/thumbs/promo-img2.png" alt="" /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="position-relative rounded-16 overflow-hidden z-1 p-32">
                            <img
                                src="assets/images/bg/promo-bg-img3.png"
                                alt=""
                                className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"
                            />
                            <div className="flex-between flex-wrap gap-16">
                                <div className="">
                                    <span className="text-heading text-sm mb-8">Chỉ Từ 10,000 VND</span>
                                    <h6 className="mb-0">Quần Áo Thân Thiện Với Môi Trường</h6>
                                    <p className="mb-8">Mua sắm quần áo đã qua sử dụng không chỉ tốt cho túi tiền mà còn giúp bảo vệ hành tinh của chúng ta!</p>
                                    <Link
                                        to="/shop"
                                        className="d-inline-flex align-items-center gap-8 mt-16 text-heading text-md fw-medium border border-top-0 border-end-0 border-start-0 border-gray-900 hover-text-main-two-600 hover-border-main-two-600"
                                    >
                                        Mua Ngay
                                        <span className="icon text-md d-flex">
                                            <i className="ph ph-plus" />
                                        </span>
                                    </Link>
                                </div>
                                <div className="pe-xxl-4">
                                    {/* <img src="assets/images/thumbs/promo-img3.png" alt="" /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionalTwo;
