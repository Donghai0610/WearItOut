import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuantityControl from '../helper/QuantityControl';
import Cart_Services from '../services/cart';
import Swal from 'sweetalert2';
import Account_Service from '../services/account';

const CartSection = () => {
    const [cart, setCart] = useState(null); // State lưu trữ giỏ hàng
    const [error, setError] = useState('');


    const fetchCart = async () => {
        try {
            const userId = Account_Service.getUserIdFromToken();
            if (!userId) {
                setError('User not authenticated');
                return;
            }

            const response = await Cart_Services.Get_Cart(userId); // Gọi API lấy giỏ hàng
            setCart(response); // Lưu giỏ hàng vào state
        } catch (err) {
            console.error(err);
           Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể lấy thông tin giỏ hàng.',
            });
            
        }
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        try {
            const userId = Account_Service.getUserIdFromToken();

            if (!userId) return;

            const payload = {
                productId: productId,
                quantity: newQuantity,
            };

            await Cart_Services.Update_Product_In_Cart(userId, payload); // Gọi API cập nhật số lượng sản phẩm
            fetchCart(); // Refresh giỏ hàng
        } catch (err) {
            if (err.response && err.response.data.message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: err.response.data.message,
                });
                window.location.reload();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể cập nhật số lượng sản phẩm.',
                });
            }
        }
    };

    const handleRemoveProduct = async (productId) => {
        const userId = Account_Service.getUserIdFromToken();

        if (!userId) return;

        // Hiển thị hộp thoại xác nhận
        Swal.fire({
            title: "Ban có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Cart_Services.Remove_Product_From_Cart(userId, productId); // Gọi API xóa sản phẩm
                    fetchCart(); // Refresh giỏ hàng

                    // Hiển thị thông báo thành công
                    Swal.fire({
                        title: "Xóa sản phẩm thành công!",
                        text: "Sản phẩm đã được xóa khỏi giỏ hàng.",
                        icon: "success"
                    });
                } catch (err) {
                    console.error(err);
                    Swal.fire({
                        title: "Lỗi",
                        text: "Không thể xóa sản phẩm khỏi giỏ hàng.",
                        icon: "error"
                    });
                }
            }
        });
    };

    useEffect(() => {
        fetchCart(); // Gọi API lấy giỏ hàng khi component mount
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!cart) {
        return <p>Loading cart...</p>;
    }

    const formatVND = (price) => {
        return price.toLocaleString('vi-VN') + ' VNĐ'; // Định dạng số kiểu Việt Nam
    };

    return (
        <section className="cart py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    {/* Cart Table */}
                    <div className="col-xl-9 col-lg-8">
                        <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
                            <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                                <table className="table style-three">
                                    <thead>
                                        <tr>
                                            <th className="h6 mb-0 text-lg fw-bold">Xóa</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Sản Phẩm</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Của Hàng</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Giá</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Số Lượng</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Ươc Tính</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.products.map((item) => (
                                            <tr key={item.productId}>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                                                        onClick={() => handleRemoveProduct(item.productId)}
                                                    >
                                                        <i className="ph ph-x-circle text-2xl d-flex" />
                                                        Xóa
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className="table-product d-flex align-items-center gap-24">
                                                        <Link
                                                            to="/product-details-two"
                                                            className="table-product__thumb border border-gray-100 rounded-8 flex-center "
                                                        >
                                                            <img
                                                                src={item.imageUrls[0]}
                                                                alt={item.productName}
                                                            />
                                                        </Link>
                                                        <div className="table-product__content text-start">
                                                            <h6 className="title text-lg fw-semibold mb-8">
                                                                <Link
                                                                    to="/product-details"
                                                                    className="link text-line-2"
                                                                    tabIndex={0}
                                                                >
                                                                    {item.productName}
                                                                </Link>
                                                            </h6>
                                                            <div className="flex-align gap-16 mb-16">
                                                                <div className="flex-align gap-6">
                                                                    <span className="text-md fw-medium text-warning-600 d-flex">
                                                                        <i className="ph-fill ph-star" />
                                                                    </span>
                                                                    <span className="text-md fw-semibold text-gray-900">
                                                                        {item.rating}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-lg h6 mb-0 fw-semibold">
                                                        {item.shopName}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="text-lg h6 mb-0 fw-semibold">
                                                        {formatVND(item.price)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <QuantityControl
                                                        initialQuantity={item.quantity}
                                                        onUpdate={(newQuantity) =>
                                                            handleUpdateQuantity(item.productId, newQuantity)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <span className="text-lg h6 mb-0 fw-semibold">
                                                        {formatVND(item.totalPrice)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Cart Sidebar */}
                    <div className="col-xl-3 col-lg-4">
                        <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
                            <h6 className="text-xl mb-32">Tổng tiền trong giỏ hàng</h6>
                            <div className="bg-color-three rounded-8 p-24">
                                <div className="mb-32 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">Tổng Tiền</span>
                                    <span className="text-gray-900 fw-semibold">
                                        {formatVND(cart.totalPrice)}
                                    </span>
                                </div>
                                <div className="mb-32 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">
                                        Phí Giao Hàng
                                    </span>
                                    <span className="text-gray-900 fw-semibold">Free</span>
                                </div>
                                <div className="mb-0 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">
                                        
                                    </span>
                                    <span className="text-gray-900 fw-semibold">0 VND</span>
                                </div>
                            </div>
                            <div className="bg-color-three rounded-8 p-24 mt-24">
                                <div className="flex-between gap-8">
                                    <span className="text-gray-900 text-xl fw-semibold">Tổng Tiền</span>
                                    <span className="text-gray-900 text-xl fw-semibold">
                                        {formatVND(cart.totalPrice)}
                                    </span>
                                </div>
                            </div>
                            <Link
                                to="/checkout"
                                className="btn btn-main mt-40 py-18 w-100 rounded-8"
                            >
                                Tiến Hành Thanh Toán
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartSection;
