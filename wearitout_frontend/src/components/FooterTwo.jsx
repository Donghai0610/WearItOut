import React from 'react'
import { Link } from 'react-router-dom'
import { object } from 'yup'

const FooterTwo = () => {
    return (
        <footer className="footer py-80">
            <div className="container container-lg">
                <div className="footer-item-two-wrapper d-flex align-items-start flex-wrap">
                    <div className="footer-item max-w-275">
                        <div className="footer-item__logo">
                            <Link to="/">
                                {" "}
                                <img
                                style={{
                                    objectFit: 'cover', // Đảm bảo ảnh bao phủ toàn bộ khung
                                    width: '100%',       // Đảm bảo ảnh chiếm hết chiều rộng của thẻ
                                    height: '100%'       // Đảm bảo ảnh chiếm hết chiều cao của thẻ
                                }}

                                src="assets/images/logo/bg_WIO.png" alt="" />
                            </Link>
                        </div>
                        <p className="mb-24">
                            WearItOut- nơi bạn có thể tìm thấy những sản phẩm thời trang phù hợp với túi tiền
                        </p>
                        <div className="flex-align gap-16 mb-16">
                            <span className="w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0">
                                <i className="ph-fill ph-phone-call" />
                            </span>
                            <Link
                                to="/tel:+00123456789"
                                className="text-md text-gray-900 hover-text-main-600"
                            >
                               0972456177
                            </Link>
                        </div>
                        <div className="flex-align gap-16 mb-16">
                            <span className="w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0">
                                <i className="ph-fill ph-envelope" />
                            </span>
                            <Link
                                to="/mailto:wearitout2nd@gmail.com"
                                className="text-md text-gray-900 hover-text-main-600"
                            >
                                wearitout2nd@gmail.com
                            </Link>
                        </div>
                        <div className="flex-align gap-16 mb-16">
                            <span className="w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0">
                                <i className="ph-fill ph-map-pin" />
                            </span>
                            <span className="text-md text-gray-900 ">
                            Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, H. Thạch Thất, TP. Hà Nội
                            </span>
                        </div>
                    </div>
                    <div className="footer-item">
                        <h6 className="footer-item__title">Về chúng tôi</h6>
                        <ul className="footer-menu">
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Hồ sơ công ty
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Tất cả cửa hàng bán lẻ
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Trung tâm thương mại
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Đối tác liên kết
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Liên hệ
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Phản hồi
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Cửa hàng
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Quy định & Chính sách
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h6 className="footer-item__title">Hỗ trợ khách hàng</h6>
                        <ul className="footer-menu">
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Trung tâm trợ giúp
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link
                                    to="/contact"
                                    className="text-gray-600 hover-text-main-600"
                                >
                                    Liên hệ
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Thẻ quà tặng
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Báo cáo lạm dụng
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Gửi yêu cầu tranh chấp
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Chính sách & Quy định
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Mua sắm trực tuyến
                                </Link>
                            </li>
                            <li className="">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Đổi mã quà tặng
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* Các phần khác giữ nguyên */}
                </div>
            </div>
        </footer>
    )
}

export default FooterTwo
