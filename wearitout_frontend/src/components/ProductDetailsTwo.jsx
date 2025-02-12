import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { getCountdown } from '../helper/Countdown';
import Product_Services from '../services/product';
import Cart_Services from '../services/cart';
import Account_Service from '../services/account';
import Swal from 'sweetalert2';

const ProductDetailsTwo = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [product, setProduct] = useState(null); // Dữ liệu sản phẩm từ API
    const [timeLeft, setTimeLeft] = useState(getCountdown());
    const [mainImage, setMainImage] = useState(''); // Ảnh chính
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
    const [deliveryAddress, setDeliveryAddress] = useState('Loading...');
    const [error, setError] = useState(''); // State for error messages

    useEffect(() => {
        if (product) {
            window.wearfits.current_garment_name = product.id.toString(); // Gán ID sản phẩm
            window.wearfits.loadDefaultOrCreateIt(); // Khởi tạo WEARFITS
        }
    }, [product]);  // Chạy lại khi dữ liệu product thay đổi
    // Tăng/giảm số lượng
    const incrementQuantity = () => {
        if (quantity < product.stockQuantity) {
            setQuantity(quantity + 1);
        } else {
            alert(`Số lượng không được vượt quá ${product.stockQuantity}`);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else {
            alert('Số lượng không được nhỏ hơn 1');
        }
    };

    // Lấy giỏ hàng và thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async () => {
        const userId = Account_Service.getUserIdFromToken(); // Hàm lấy userId từ token (giả sử bạn đã có hàm này)

        if (!userId) {
            setError("User not authenticated");
            return;
        }

        try {
            const payload = {
                productId: product.id,
                quantity: quantity
            };

            await Cart_Services.Add_Product_To_Cart(userId, payload); // Gọi API thêm sản phẩm vào giỏ
            Swal.fire({
                icon: 'success',
                title: 'Đã thêm sản phẩm vào giỏ hàng',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error('Error adding product to cart:', err);
            setError('Không thể thêm sản phẩm vào giỏ hàng');
            Swal.fire({
                icon: 'error',
                title: 'Không thể thêm sản phẩm vào giỏ hàng',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getCountdown());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const parsedId = parseInt(id, 10); // Chuyển id từ URL sang số nguyên
                if (!parsedId) {
                    throw new Error("Invalid Product ID");
                }

                const response = await Product_Services.Product_Details(parsedId); // Gọi API qua Product_Services
                const productData = response.data;
                setProduct(productData);
                setMainImage(productData.imageUrls[0]); // Đặt ảnh đầu tiên làm ảnh chính
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        const fetchDeliveryAddress = async () => {
            try {
                const response = await fetch('https://api.ipify.org/?format=json');
                const data = await response.json();
                const ip = data.ip;

                const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
                const locationData = await locationResponse.json();

                setDeliveryAddress(`${locationData.city}, ${locationData.region}, ${locationData.country_name}`);
            } catch (error) {
                console.error('Error fetching delivery address:', error);
                setDeliveryAddress('Unable to retrieve location');
            }
        };

        fetchProductDetails();
        fetchDeliveryAddress();
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(
                    <span className="text-15 fw-medium text-warning-600 d-flex" key={i}>
                        <i className="ph-fill ph-star" />
                    </span>
                );
            } else {
                stars.push(
                    <span className="text-15 fw-medium text-gray-400 d-flex" key={i}>
                        <i className="ph-fill ph-star" />
                    </span>
                );
            }
        }
        return stars;
    };

    //Price
    const calculateOriginalPrice = (price) => {
        return (price * 1.15).toFixed(2);
    };

    const formatVND = (price) => {
        return price.toLocaleString('vi-VN') + ' VNĐ'; // Định dạng số kiểu Việt Nam
    };

    const settingsThumbs = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
    };
   
    

    return (
        <section className="product-details py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    <div className="col-xl-9">
                        <div className="row gy-4">
                            <div className="col-xl-6">
                                <div className="product-details__left">
                                    <div className="product-details__thumb-slider border border-gray-100 rounded-16">
                                        <div className="">
                                            <div className="product-details__thumb flex-center h-100">
                                                <img src={mainImage} alt="Main Product" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-24">
                                        <div className="product-details__images-slider">
                                            <Slider {...settingsThumbs}>
                                                {product.imageUrls.map((image, index) => (
                                                    <div
                                                        className="center max-w-120 max-h-120 h-100 flex-center border border-gray-100 rounded-16 p-8"
                                                        key={index}
                                                        onClick={() => setMainImage(image)}
                                                    >
                                                        <img className="thum" src={image} alt={`Thumbnail ${index}`} />
                                                    </div>
                                                ))}
                                            </Slider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="product-details__content">
                                    <h5 className="mb-12">
                                        {product.productName}
                                    </h5>
                                    <div className="flex-align flex-wrap gap-12">
                                        <div className="flex-align gap-12 flex-wrap">
                                            <div className="flex-align gap-8">
                                                {renderStars(product.rating)} {/* Gọi hàm render ngôi sao */}
                                            </div>
                                            <span className="text-sm fw-medium text-neutral-600">
                                                Đánh giá {product.rating} sao
                                            </span>
                                            <span className="text-sm fw-medium text-gray-500">(21,671)</span>
                                        </div>
                                    </div>

                                    <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                                    <p className="text-gray-700">
                                        {product.description}
                                    </p>
                                    <div className="my-32 flex-align gap-16 flex-wrap">
                                        <div className="flex-align gap-8">
                                            <div className="flex-align gap-8 text-main-two-600">
                                                <i className="ph-fill ph-seal-percent text-xl" />
                                                -15%
                                            </div>
                                            <h6 className="mb-0">{formatVND(product.price)}</h6>
                                        </div>
                                    </div>

                                    <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                                    <Link
                                        to="https://www.facebook.com/nwm1693"
                                        className="btn btn-black flex-center gap-8 rounded-8 py-16"
                                    >
                                        <i className="ph ph-whatsapp-logo text-lg" />
                                        Yêu cầu thêm thông tin
                                    </Link>
                                    <div className="mt-32">
                                        <span className="fw-medium text-gray-900">
                                            Đảm bảo thanh toán an toàn 100%
                                        </span>
                                        <div className="mt-10">
                                            <img src="https://news.khangz.com/wp-content/uploads/2023/05/MOMO-LA-GI-1.jpg" alt="Hình ảnh cổng thanh toán" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3">
                        <div className="product-details__sidebar py-40 px-32 border border-gray-100 rounded-16">
                            {/* Delivery Address */}
                            <div className="mb-32">
                                <label htmlFor="delivery" className="h6 activePage mb-8 text-heading fw-semibold d-block">
                                    Vận chuyển
                                </label>
                                <div className="flex-align border border-gray-100 rounded-4 px-16">
                                    <span className="text-xl d-flex text-main-600">
                                        <i className="ph ph-map-pin" />
                                    </span>
                                    <input
                                        type="text"
                                        className="common-input border-0 px-8 rounded-4"
                                        value={deliveryAddress}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Stock Quantity */}
                            <div className="mb-32">
                                <label htmlFor="stock" className="text-lg mb-8 text-heading fw-semibold d-block">
                                    Tổng số sản phẩm còn lại: {product.stockQuantity}
                                </label>
                                <div className="d-flex rounded-4 overflow-hidden">
                                    <button
                                        onClick={decrementQuantity}
                                        type="button"
                                        className="quantity__minus flex-shrink-0 h-48 w-48 text-neutral-600 bg-gray-50 flex-center hover-bg-main-600 hover-text-white"
                                    >
                                        <i className="ph ph-minus" />
                                    </button>
                                    <input
                                        type="number"
                                        className="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-16"
                                        value={quantity}
                                        readOnly
                                    />
                                    <button
                                        onClick={incrementQuantity}
                                        type="button"
                                        className="quantity__plus flex-shrink-0 h-48 w-48 text-neutral-600 bg-gray-50 flex-center hover-bg-main-600 hover-text-white"
                                    >
                                        <i className="ph ph-plus" />
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-32">
                                <div className="flex-between flex-wrap gap-8 border-bottom border-gray-100 pb-16 mb-16">
                                    <span className="text-gray-500">Giá</span>
                                    <h6 className="text-lg mb-0">{formatVND(product.price)}</h6>
                                </div>
                                <div className="flex-between flex-wrap gap-8">
                                    <span className="text-gray-500">Phí Ship</span>
                                    <h6 className="text-lg mb-0">From 50,000 VNĐ</h6>
                                </div>
                            </div>

                            {/* Add to Cart and Buy Now */}
                            <div className="my-32 flex-align gap-16">
                                <button
                                    className="btn btn-danger w-100"
                                    onClick={handleAddToCart}
                                >
                                    <i className="ph ph-shopping-cart-simple text-lg" />
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                            {/* <button
                                className="btn btn-outline-main rounded-8 py-16 fw-normal mt-16 w-100 "
                            >
                                Mua ngay
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductDetailsTwo;
