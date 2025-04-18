import React from 'react'
import { Link } from 'react-router-dom'

const DiscountOne = () => {
    return (
        <section className="discount py-80">
        <div className="container container-lg">
            <div className="row gy-4">
                <div className="col-xl-6">
                    <div className="discount-item rounded-16 overflow-hidden position-relative z-1 h-100 d-flex flex-column align-items-start justify-content-center">
                        <img
                            src="assets/images/bg/discount-bg1.jpg"
                            alt="Giảm giá sản phẩm"
                            className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1"
                        />
                        <div className="w-100 flex-between gap-20">
                            <div className="discount-item__content">
                                <span className="fw-semibold text-tertiary-600 mb-20">
                                    GIẢM GIÁ LÊN ĐẾN 30%
                                </span>
                                <h6 className="mb-20">
                                    Áo Khoác Jean Second-Hand - Phong Cách Cá Tính
                                </h6>
                                <Link
                                    to="/shop"
                                    className="btn btn-outline-black rounded-pill gap-8"
                                    tabIndex={0}
                                >
                                    Mua Ngay
                                </Link>
                            </div>
                            <img
                                src="assets/images/thumbs/discount-img1.png"
                                alt="Áo khoác jean"
                                className="d-sm-block d-none"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="discount-item rounded-16 overflow-hidden position-relative z-1 h-100 d-flex flex-column align-items-center justify-content-center">
                        <img
                            src="assets/images/bg/discount-bg2.jpg"
                            alt="Giảm giá sản phẩm"
                            className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1"
                        />
                        <div className="w-100 flex-between gap-20">
                            <div className="discount-item__content">
                                <span className="fw-semibold text-tertiary-600 mb-20">
                                    GIẢM GIÁ LÊN ĐẾN 30%
                                </span>
                                <h6 className="mb-20">
                                    Váy Vintage Second-Hand - Đẳng Cấp Thời Trang
                                </h6>
                                <Link
                                    to="/shop"
                                    className="btn btn-outline-black rounded-pill gap-8"
                                    tabIndex={0}
                                >
                                    Mua Ngay
                                </Link>
                            </div>
                            <img
                                src="assets/images/thumbs/discount-img2.png"
                                alt="Váy vintage"
                                className="d-sm-block d-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    )
}

export default DiscountOne