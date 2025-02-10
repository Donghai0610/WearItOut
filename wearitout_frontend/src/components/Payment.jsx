import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cart_Services from '../services/cart';
import Account_Service from '../services/account';
import formatVND from '../helper/formatVND';
import Payment_Services from '../services/payment'; // Import dịch vụ thanh toán
import axios from 'axios'; // Đảm bảo đã cài axios
import Select from 'react-select'; // Đảm bảo đã cài react-select

const Payment = () => {
    const [selectedPayment, setSelectedPayment] = useState("payment1");
    const [cart, setCart] = useState(null); // State để lưu thông tin giỏ hàng
    const [userId, setUserId] = useState(null);
    const [userDetails, setUserDetails] = useState(null); // State để lưu thông tin người dùng

    // Hàm xử lý thay đổi phương thức thanh toán
    const handlePaymentChange = (event) => {
        setSelectedPayment(event.target.id);
    };
    const [qrCode, setQrCode] = useState(null); // State lưu mã QR



    // Sử dụng useEffect để gọi API cho thông tin giỏ hàng và người dùng
    useEffect(() => {
        const userIdFromToken = Account_Service.getUserIdFromToken();
        if (userIdFromToken) {
            setUserId(userIdFromToken); // Lưu userId vào state

            // Lấy thông tin giỏ hàng

                const fetchCart = async () => {
                    try {
                        const cartData = await Cart_Services.Get_Cart(userIdFromToken);
                        if (cartData) {
                            setCart(cartData);
                        } else {
                            console.error("Giỏ hàng trống hoặc không hợp lệ.");
                            setCart({ products: [] }); // Lưu giỏ hàng vào state
                        }
                    } catch (error) {
                        console.error("Lỗi khi lấy giỏ hàng:", error);
                        setCart({ products: [] }); // Xử lý lỗi bằng cách đặt giá trị mặc định
                    }
                };

            // Lấy thông tin người dùng
            const fetchUserDetails = async () => {
                try {
                    const userDetailsData = await Account_Service.getUserDetail();
                    setUserDetails(userDetailsData); // Lưu thông tin người dùng
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            };

            fetchCart(); // Gọi API khi có User ID
            fetchUserDetails();
        }
    }, []); // Chạy 1 lần khi component mount




    // Nếu chưa có giỏ hàng hoặc thông tin người dùng, show loading
    const handleSubmit = async () => {
        if (!cart || !userDetails) {
            return <div>Đang tải...</div>;
        }

        const orderId = `ORDER_${new Date().getTime()}`; // Tạo mã đơn hàng (hoặc lấy từ backend)
        const amount = cart.totalPrice || 0; // Tổng số tiền cần thanh toán

        try {
            if (selectedPayment === 'payment1') {
                // Thanh toán chuyển khoản ngân hàng (hiện thông báo, không cần API)
                alert("Vui lòng chuyển khoản theo hướng dẫn.");
                const response = await Payment_Services.payWithQR(amount, orderId);
                if (response.success) {
                    setQrCode(response.qrCode); // Lưu mã QR vào state
                } else {
                    alert("Không thể tạo mã QR, vui lòng thử lại.");
                }
            } else if (selectedPayment === 'payment2') {
                // Thanh toán qua VNPay
                await Payment_Services.payWithVNPay(amount, orderId);
            } else if (selectedPayment === 'payment3') {
                // Thanh toán khi nhận hàng (COD)
                await Payment_Services.payWithCOD(orderId, userId);
                alert("Đơn hàng của bạn đã được xác nhận, thanh toán khi nhận hàng.");
            }
        }
         catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            alert("Có lỗi xảy ra khi xử lý thanh toán.");
        }
    };

    return (
        <section className="payment-page py-80">
            <div className="container container-lg">
                <div className="row">
                    {/* Phần bên trái: thông tin người nhận và phương thức thanh toán */}
                    <div className="col-xl-9 col-lg-8">
                        <form action="#" className="pe-xl-5">
                            <div className="row gy-3">
                                <div className="col-12">
                                    <h6 className="text-lg mb-24">Thông tin đơn hàng</h6>
                                    <div className="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                                        <span className="text-gray-900 fw-medium text-xl font-heading-two">Tên Sản Phẩm</span>
                                        <span className="text-gray-900 fw-medium text-xl font-heading-two">Số Lượng</span>
                                        <span className="text-gray-900 fw-medium text-xl font-heading-two">Ước Tính</span>
                                    </div>

                                    {/* Render các sản phẩm trong giỏ hàng */}
                                    {cart.products.map((product) => (
                                        <div className="flex-between gap-24 mb-32" key={product.productId}>
                                            <div className="flex-align gap-12">
                                                <span className="text-gray-900 fw-normal text-md font-heading-two w-144">
                                                    {product.productName}
                                                </span>
                                                <span className="text-gray-900 fw-semibold text-md font-heading-two">
                                                    {product.quantity}
                                                </span>
                                            </div>
                                            <span className="text-gray-900 fw-bold text-md font-heading-two">
                                                {formatVND(product.totalPrice)} {/* Hiển thị tổng giá trị cho sản phẩm */}
                                            </span>
                                        </div>
                                    ))}

                                    <div className="border-top border-gray-100 pt-30 mt-30">
                                        <div className="mb-32 flex-between gap-8">
                                            <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                                                Tổng phụ
                                            </span>
                                            <span className="text-gray-900 font-heading-two text-md fw-bold">
                                                {formatVND(cart.totalPrice)} {/* Hiển thị tổng giỏ hàng */}
                                            </span>
                                        </div>
                                        <div className="mb-0 flex-between gap-8">
                                            <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                                                Tổng
                                            </span>
                                            <span className="text-gray-900 font-heading-two text-md fw-bold">
                                                {formatVND(cart.totalPrice)} {/* Hiển thị tổng tiền thanh toán */}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chọn phương thức thanh toán */}
                                <div className="col-12">
                                    <div className="payment-item">
                                        <div className="form-check common-check common-radio py-16 mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="payment"
                                                id="payment1"
                                                checked={selectedPayment === 'payment1'}
                                                onChange={handlePaymentChange}
                                            />
                                            <label
                                                className="form-check-label fw-semibold text-neutral-600"
                                                htmlFor="payment1"
                                            >
                                                Chuyển khoản ngân hàng trực tiếp
                                            </label>
                                        </div>
                                        {selectedPayment === 'payment1' && (
                                            <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                                                <p className="text-gray-800">
                                                    Thanh toán trực tiếp vào tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của bạn làm tham chiếu thanh toán. Đơn hàng của bạn sẽ không được vận chuyển cho đến khi tiền được xác nhận vào tài khoản.
                                                </p>
                                            </div>

                                        )}
                                        {qrCode && selectedPayment === 'payment1' && (
                                            <div className="qr-code-container text-center mt-4">
                                                <h4>Quét mã QR để thanh toán</h4>
                                                <img src={qrCode} alt="Mã QR thanh toán" className="qr-code-image" />
                                            </div>
                                        )}

                                        {/* VNPay payment option */}
                                        <div className="form-check common-check common-radio py-16 mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="payment"
                                                id="payment2"
                                                checked={selectedPayment === 'payment1'}
                                                onChange={handlePaymentChange}
                                            />
                                            <label
                                                className="form-check-label fw-semibold text-neutral-600"
                                                htmlFor="payment2"
                                            >
                                                Thanh toán qua VNPay
                                            </label>
                                        </div>
                                        {selectedPayment === 'payment2' && (
                                            <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                                                <p className="text-gray-800">
                                                    Thanh toán qua VNPay nhanh chóng và an toàn. Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch.
                                                </p>
                                            </div>
                                        )}

                                        {/* Thanh toán cho Shipper option */}
                                        <div className="form-check common-check common-radio py-16 mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="payment"
                                                id="payment3"
                                                checked={selectedPayment === 'payment3'}
                                                onChange={handlePaymentChange}
                                            />
                                            <label
                                                className="form-check-label fw-semibold text-neutral-600"
                                                htmlFor="payment3"
                                            >
                                                Thanh toán thông qua cho Shipper
                                            </label>
                                        </div>
                                        {selectedPayment === 'payment3' && (
                                            <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                                                <p className="text-gray-800">
                                                    Bạn có thể thanh toán cho shipper khi nhận hàng. Vui lòng chuẩn bị tiền mặt cho shipper khi đơn hàng được giao đến.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar với thông tin thanh toán */}
                    <div className="col-xl-3 col-lg-4">
                        <div className="payment-sidebar">
                            <div className="bg-color-three rounded-8 p-24 text-center">
                                <span className="text-gray-900 text-xl fw-semibold">Đơn Hàng Của Bạn</span>
                            </div>
                            <div className="border border-gray-100 rounded-8 px-24 py-40 mt-24">
                                <Link
                                    to="#"
                                    className="btn btn-main mt-40 py-18 w-100 rounded-8 mt-56"
                                    onClick={handleSubmit}
                                >
                                    Đặt hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Payment;
