import React, { useEffect, useState } from 'react';
import query from 'jquery';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Product_Services from '../services/product';
import { jwtDecode } from 'jwt-decode';
import Cart_Items_Services from '../services/cart_item';
import Account_Service from '../services/account';
import Swal from 'sweetalert2';

const Header = ({ category }) => {
    const [categories, setCategories] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [totalItems, setTotalItems] = useState(0); // Store total items in the cart
    const [loading, setLoading] = useState(true); // To show loading state
    const [error, setError] = useState(null); // To store any error messages
    const userId = Account_Service.getUserIdFromToken();
    const navigate = useNavigate();
    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Giải mã token để lấy thông tin username
                const decodedToken = jwtDecode(token);
                if (decodedToken.sub) {
                    setIsLoggedIn(true);
                    setUsername(decodedToken.sub); // Lấy username từ token
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token'); // Xóa token nếu không hợp lệ
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchTotalItems = async () => {
                setLoading(true);
                try {
                    const items = await Cart_Items_Services.getTotalItemsInCart(userId); // Pass user ID to get the total items in the cart
                    setTotalItems(items);
                } catch (err) {
                    setError('Could not fetch total items.');
                } finally {
                    setLoading(false);
                }
            };

            // Fetch initially when component mounts
            fetchTotalItems();

            // Set up interval to fetch the total items every 10 seconds
            const intervalId = setInterval(() => {
                fetchTotalItems();
            }, 10000); // 10 seconds

            // Clean up the interval when the component unmounts
            return () => clearInterval(intervalId);
        }
    }, [userId]); // Dependency on userId to refetch when userId changes

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUsername('');
        window.location.reload();
        navigate('/account');
        Swal.fire({
            icon: 'success',
            title: 'Đăng Xuất Thành Công',
            showConfirmButton: false,
            timer: 1500,
        });

    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await Product_Services.Product_Category(6); // Gọi API để lấy danh sách danh mục
                setCategories(data); // Lưu danh sách vào state
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        window.onscroll = () => {
            if (window.pageYOffset < 150) {
                setScroll(false);
            } else if (window.pageYOffset > 150) {
                setScroll(true);
            }
            return () => (window.onscroll = null);
        };
        const selectElement = query('.js-example-basic-single');
        selectElement.select2();

        return () => {
            if (selectElement.data('select2')) {
                selectElement.select2('destroy');
            }
        };
    }, []);

    return (
        <>
            <header className={`header-middle style-two bg-color-neutral`}>
                <div className="container container-lg">
                    <nav className="header-inner flex-between">
                        {/* Logo */}
                        <div className="logo">
                            <Link to="/" className="link">
                                <img src="assets/images/logo/logo.png" alt="Logo" />
                            </Link>
                        </div>
                        {/* Category Search */}
                        <div className="flex-align gap-16">
                            <form
                                action="#"
                                className="flex-align flex-wrap form-location-wrapper"
                            >
                                <div className="search-category style-two d-flex h-48 search-form d-sm-flex d-none">
                                    <select
                                        defaultValue=""
                                        className="js-example-basic-single border border-gray-200 border-end-0 rounded-0 border-0"
                                        name="state"
                                    >
                                        <option value="">Danh Mục</option>
                                        {categories.map((category) => (
                                            <option key={category.settingId} value={category.settingId}>
                                                {category.settingName}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="search-form__wrapper position-relative">
                                        <input
                                            type="text"
                                            className="search-form__input common-input py-13 ps-16 pe-18 rounded-0 border-0"
                                            placeholder="Tìm Kiếm Sản Phẩm Hoặc Thương Hiệu"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-main-two-600 flex-center text-xl text-white flex-shrink-0 w-48 hover-bg-main-two-700 d-lg-flex d-none"
                                    >
                                        <i className="ph ph-magnifying-glass" />
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* User Menu */}
                        <div className="header-right flex-align d-lg-block d-none">
                            <div className="header-two-activities flex-align flex-wrap gap-32">
                                {isLoggedIn ? (
                                    <>
                                        <Link
                                            to="/"
                                            className="flex-align flex-column gap-8 item-hover-two"
                                        >
                                            <span className="text-2xl text-white d-flex position-relative item-hover__text">
                                                <i className="ph ph-user" />
                                            </span>
                                            <span className="text-md text-white item-hover__text d-none d-lg-flex">
                                                Xin chào, {username}
                                            </span>
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className="flex-align flex-column gap-8 item-hover-two"
                                        >
                                            <span className="text-2xl text-white d-flex position-relative item-hover__text">
                                                <i className="ph ph-airplay" />
                                            </span>
                                            <span className="text-md text-white item-hover__text d-none d-lg-flex">
                                                Quản lý
                                            </span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="text-2xl text-white bg-transparent border-0 cursor-pointer"
                                            title="Đăng Xuất"
                                        >
                                            <i className="ph ph-sign-out" />
                                            <span className="text-md text-white item-hover__text d-none d-lg-flex">
                                                Đăng Xuất
                                            </span>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/account"
                                        className="flex-align flex-column gap-8 item-hover-two"
                                    >
                                        <span className="text-2xl text-white d-flex position-relative item-hover__text">
                                            <i className="ph ph-user" />
                                        </span>
                                        <span className="text-md text-white item-hover__text d-none d-lg-flex">
                                            Đăng Nhập
                                        </span>
                                    </Link>
                                )}
                                <Link
                                    to="/cart"
                                    className="flex-align flex-column gap-8 item-hover-two"
                                >
                                    <span className="text-2xl text-white d-flex position-relative me-6 mt-6 item-hover__text">
                                        <i className="ph ph-shopping-cart-simple" />
                                        {/* Display the total items count dynamically */}
                                        <span className="w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4">
                                            {loading ? (
                                                <span className="loader"></span> // You can add a loader here
                                            ) : error ? (
                                                <span>{error}</span>
                                            ) : (
                                                totalItems // Show the total number of items in the cart
                                            )}
                                        </span>
                                    </span>
                                    <span className="text-md text-white item-hover__text d-none d-lg-flex">
                                        Giỏ Hàng
                                    </span>

                                </Link>
                                <Link
                                    to="/shop"
                                    className="flex-align flex-column gap-8 item-hover-two"
                                >
                                    <span className="text-2xl text-white d-flex position-relative item-hover__text">
                                        <i className="ph  ph-shopping-bag" />
                                    </span>
                                    <span className="text-md text-white item-hover__text d-none d-lg-flex">
                                        Cửa Hàng
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;
