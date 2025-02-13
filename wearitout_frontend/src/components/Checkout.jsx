import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cart_Services from '../services/cart';
import Account_Service from '../services/account';
import formatVND from '../helper/formatVND';
import axios from 'axios'; // Đảm bảo đã cài axios
import Select from 'react-select'; // Đảm bảo đã cài react-select
import useOrderServices from '../services/order';
import Order_Service from '../services/orderService';
import Swal from 'sweetalert2';
const Checkout = () => {
    const [selectedPayment, setSelectedPayment] = useState("COD"); // Default payment method is COD
    const [cart, setCart] = useState(null); // State để lưu thông tin giỏ hàng
    const [userId, setUserId] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [needToFillForm, setNeedToFillForm] = useState(false); // Kiểm tra nếu thiếu thông tin
    const [provinces, setProvinces] = useState([]); // Tỉnh/thành phố
    const [districts, setDistricts] = useState([]); // Quận/huyện
    const [wards, setWards] = useState([]); // Phường/xã

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [address, setAddress] = useState(''); // Địa chỉ nhà nhập tay

    const navigate = useNavigate();

    
    // Hàm xử lý thay đổi phương thức thanh toán
    const handlePaymentChange = (event) => {
        setSelectedPayment(event.target.value);  // Chỉ cần dùng value thay vì id
      };

    // Hàm gọi API lấy tỉnh/thành phố
    const fetchProvinces = async () => {
        try {
            const response = await axios.get('https://open.oapi.vn/location/provinces?size=63');
            setProvinces(response.data.data); // Lưu dữ liệu tỉnh
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    // Hàm gọi API lấy quận/huyện
    const fetchDistricts = async (provinceId) => {
        try {
            const response = await axios.get(`https://open.oapi.vn/location/districts/${provinceId}?page=0&size=30&query=`);
            setDistricts(response.data.data); // Cập nhật quận vào state
            setSelectedDistrict(null);  // Reset quận khi thay đổi tỉnh
            setWards([]);  // Reset phường/xã khi thay đổi tỉnh
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    // Hàm gọi API lấy phường/xã
    const fetchWards = async (districtId) => {
        try {
            const response = await axios.get(`https://open.oapi.vn/location/wards/${districtId}?page=0&size=30&query=`);
            setWards(response.data.data); // Cập nhật phường/xã vào state
            setSelectedWard(null); // Reset phường/xã khi thay đổi quận
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    // Sử dụng useEffect để gọi API cho tỉnh và thông tin người dùng
    useEffect(() => {
        fetchProvinces(); // Gọi API để lấy các tỉnh

        const userIdFromToken = Account_Service.getUserIdFromToken();
        if (userIdFromToken) {
            setUserId(userIdFromToken); // Lưu userId vào state
            const fetchCart = async () => {
                try {
                    const cartData = await Cart_Services.Get_Cart(userIdFromToken); // Gọi API Get_Cart
                    setCart(cartData); // Lưu giỏ hàng vào state
                } catch (error) {
                    console.error('Error fetching cart:', error);
                }
            };
            fetchCart(); // Gọi API khi có User ID

            const fetchUserDetails = async () => {
                try {
                    const result = await Account_Service.getUserDetail();
                    setUserDetails(result.userDetails);
                    setNeedToFillForm(result.needToFillForm); // Kiểm tra nếu thiếu thông tin
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            };
            fetchUserDetails(); // Gọi API để lấy thông tin người dùng
        }
    }, []); // Chạy 1 lần khi component mount

    // Cập nhật state khi chọn tỉnh
    const handleProvinceChange = (selectedOption) => {
        if (selectedOption && selectedOption.value) {
            setSelectedProvince(selectedOption);
            fetchDistricts(selectedOption.value); // Gọi API khi thay đổi tỉnh
        } else {
            console.error('Không có giá trị tỉnh được chọn!');
        }
    };

    // Cập nhật state khi chọn quận
    const handleDistrictChange = (selectedOption) => {
        setSelectedDistrict(selectedOption);
        if (selectedOption && selectedOption.value) {
            fetchWards(selectedOption.value); // Gọi API khi thay đổi quận
        }
    };

    // Cập nhật địa chỉ nhập tay
    const handleAddressChange = (e) => {
        setAddress(e.target.value); // Cập nhật địa chỉ nhà nhập tay
    };

    // Chuyển đổi dữ liệu tỉnh thành dạng phù hợp cho react-select
    const provinceOptions = provinces.map((province) => ({
        value: province.id,
        label: province.name
    }));

    const districtOptions = districts.map((district) => ({
        value: district.id,
        label: district.name
    }));

    const wardOptions = wards.map((ward) => ({
        value: ward.id,
        label: ward.name
    }));

    // Nếu chưa có giỏ hàng hoặc thông tin user, show loading
    if (!cart || !userDetails) {
        return <div>Đang tải...</div>;
    }

    const handleSubmit = async () => {
        const fullAddress = `${address ? address : ''}, ${selectedWard ? selectedWard.label : ''}, ${selectedDistrict ? selectedDistrict.label : ''}, ${selectedProvince ? selectedProvince.label : ''}`;
        console.log('Địa chỉ đầy đủ:', fullAddress);

        // Gọi API createOrder để tạo đơn hàng
        const orderData = {
            userId: userId,
            shipAddress: fullAddress,
            paymentMethod: selectedPayment // Lấy phương thức thanh toán từ state
        };

        try {
            const createdOrder = await Order_Service.createOrder(orderData); // Gọi method createOrder từ OrderServices
            console.log('Đơn hàng đã được tạo:', createdOrder);
            alert("Đơn hàng của bạn đã được tạo thành công!");
            Swal.fire({
                icon: 'success',
                title: 'Đơn hàng đã được tạo thành công!',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/order-user'); // Chuyển hướng đến trang kết quả đơn hàng

        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
        }
    };

    return (
        <section className="checkout py-80">
            <div className="container container-lg">
                <div className="border border-gray-100 rounded-8 px-30 py-20 mb-40">
                    <span className="">
                        Sử dụng mã ưu đãi?{" "}
                        <Link
                            to="/cart"
                            className="fw-semibold text-gray-900 hover-text-decoration-underline hover-text-main-600"
                        >
                            Nhấn vào đây để nhập mã ưu đãi
                        </Link>{" "}
                    </span>
                </div>
                <div className="row">
                    <div className="col-xl-9 col-lg-8">
                        <form action="#" className="pe-xl-5">
                            <div className="row gy-3">
                                {/* Hiển thị các trường thông tin cần điền */}
                                {needToFillForm && (
                                    <>
                                        <div className="col-sm-6 col-xs-6">
                                            <input
                                                type="text"
                                                className="common-input border-gray-100"
                                                placeholder="Tên"
                                                defaultValue={userDetails.username || ''}
                                            />
                                        </div>

                                        {/* Chọn tỉnh/thành phố */}
                                        <div className="col-12">
                                            <Select
                                                options={provinceOptions}
                                                value={selectedProvince}
                                                onChange={handleProvinceChange}
                                                placeholder="Chọn Thành phố"
                                            />
                                        </div>

                                        {/* Chọn quận/huyện */}
                                        <div className="col-12">
                                            <Select
                                                options={districtOptions}
                                                value={selectedDistrict}
                                                onChange={handleDistrictChange}
                                                placeholder="Chọn Quận/Huyện"
                                                isDisabled={!selectedProvince} // Disable khi chưa chọn tỉnh
                                            />
                                        </div>

                                        {/* Chọn phường/xã */}
                                        <div className="col-12">
                                            <Select
                                                options={wardOptions}
                                                value={selectedWard}
                                                onChange={(option) => setSelectedWard(option)}
                                                placeholder="Chọn Phường/Xã"
                                                isDisabled={!selectedDistrict} // Disable khi chưa chọn quận
                                            />
                                        </div>

                                        {/* Địa chỉ nhà */}
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                className="common-input border-gray-100"
                                                placeholder="Địa chỉ nhà"
                                                value={address}
                                                onChange={handleAddressChange}
                                            />
                                        </div>


                                        <div className="col-12">
                                            <input
                                                type="number"
                                                className="common-input border-gray-100"
                                                placeholder="Số điện thoại"
                                                defaultValue={userDetails.phone || ''}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <input
                                                type="email"
                                                className="common-input border-gray-100"
                                                placeholder="Địa chỉ Email"
                                                defaultValue={userDetails.email || ''}
                                                disabled
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Nếu không cần nhập thông tin, hiển thị thông tin người dùng */}
                                {!needToFillForm && (
                                    <>
                                        <div className="col-12">
                                            <p><strong>Tên:</strong> {userDetails.firstName}</p>
                                        </div>
                                        <div className="col-12">
                                            <p><strong>Họ:</strong> {userDetails.lastName}</p>
                                        </div>
                                        <div className="col-12">
                                            <p><strong>Email:</strong> {userDetails.email}</p>
                                        </div>
                                    </>
                                )}

                                <div className="col-12">
                                    <div className="my-40">
                                        <h6 className="text-lg mb-24">Thông tin thêm</h6>
                                        <input
                                            type="text"
                                            className="common-input border-gray-100"
                                            placeholder="Ghi chú về đơn hàng của bạn, ví dụ như ghi chú đặc biệt cho giao hàng."
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="checkout-sidebar">
                            <div className="bg-color-three rounded-8 p-24 text-center">
                                <span className="text-gray-900 text-xl fw-semibold">
                                    Đơn Hàng Của Bạn
                                </span>
                            </div>
                            <div className="border border-gray-100 rounded-8 px-24 py-40 mt-24">
                                <div className="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                                    <span className="text-gray-900 fw-medium text-xl font-heading-two">
                                        Tên Sản Phẩm
                                    </span>
                                    <span className="text-gray-900 fw-medium text-xl font-heading-two">
                                        Số Lượng
                                    </span>
                                    <span className="text-gray-900 fw-medium text-xl font-heading-two">
                                        Ước Tính
                                    </span>
                                </div>

                                {/* Render các sản phẩm trong giỏ hàng */}
                                {cart.products.map((product) => (
                                    <div className="flex-between gap-24 mb-32" key={product.productId}>
                                        <div className="flex-align gap-12">
                                            <span className="text-gray-900 fw-normal text-md font-heading-two w-144">
                                                {product.productName}
                                            </span>
                                            <span className="text-gray-900 fw-normal text-md font-heading-two">
                                                {/* <i className="ph-bold ph-x" /> */}
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
                            <div className="mt-32">
                                <div className="payment-item">
                                    <div className="form-check common-check common-radio py-16 mb-0">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="payment"
                                            value="COD"  // Sử dụng value thay vì id
                                            checked={selectedPayment === "COD"}
                                            onChange={handlePaymentChange}
                                        />
                                        <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment1">
                                            Thanh toán khi nhận hàng (COD)
                                        </label>
                                    </div>

                                    <div className="form-check common-check common-radio py-16 mb-0">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="payment"
                                            value="TRANSFER_TO_SHOP"  // Sử dụng value thay vì id
                                            checked={selectedPayment === "TRANSFER_TO_SHOP"}
                                            onChange={handlePaymentChange}
                                        />
                                        <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment2">
                                            Chuyển khoản thủ công
                                        </label>
                                    </div>

                                    <div className="form-check common-check common-radio py-16 mb-0">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="payment"
                                            value="TRANSFER_TO_SHOP_AUTOMATIC"  // Sử dụng value thay vì id
                                            checked={selectedPayment === "TRANSFER_TO_SHOP_AUTOMATIC"}
                                            onChange={handlePaymentChange}
                                        />
                                        <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment3">
                                            Chuyển khoản tự động
                                        </label>
                                    </div>

                                    {selectedPayment === "COD" && (
                                        <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                                            <p className="text-gray-800">
                                                Thanh toán trực tiếp cho nhân viên giao hàng khi nhận hàng.
                                            </p>
                                        </div>
                                    )}

                                    {selectedPayment === "TRANSFER_TO_SHOP" && (
                                        <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                                            <p className="text-gray-800">
                                                Thanh toán bằng cách chuyển khoản vào tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của bạn làm tham chiếu thanh toán. Đơn hàng của bạn sẽ không được vận chuyển cho đến khi tiền được xác nhận vào tài khoản.
                                            </p>
                                        </div>
                                    )}

                                    {selectedPayment === "TRANSFER_TO_SHOP_AUTOMATIC" && (
                                        <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                                            <p className="text-gray-800">
                                                Sau khi thanh toán xong, hệ thống sẽ tự động xác nhận và gửi hàng cho bạn.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-32 pt-32 border-top border-gray-100">
                                <p className="text-gray-500">
                                    Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng, hỗ trợ
                                    trải nghiệm của bạn trong suốt website này, và cho các mục đích khác
                                    được mô tả trong{" "}
                                    <Link to="#" className="text-main-600 text-decoration-underline">
                                        chính sách bảo mật
                                    </Link>{" "}
                                    .
                                </p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                className="btn btn-main mt-40 py-18 w-100 rounded-8 mt-56"
                            >
                                Đặt hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Checkout;
